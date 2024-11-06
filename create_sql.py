import os
import pymysql
from src.utils.custom_logging import setup_logging
from env import Env
from pandas import read_csv

env = Env()
log = setup_logging()


class CreateSQL:

    def __init__(self):
        # Определение пути к SQL-файлу
        self.path = os.path.dirname(__file__)
        self.path_to_sql = os.path.join(self.path, f"{env.__getattr__('DB')}.sql")
        self.path_to_data = os.path.join(env.__getattr__('DATA_PATH'), 'tables')

        # Установка соединения с базой данных
        self.connection = pymysql.connect(
            host=env.__getattr__("DB_HOST"),
            port=int(env.__getattr__("DB_PORT")),
            user=env.__getattr__("DB_USER"),
            password=env.__getattr__("DB_PASSWORD"),
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )

    def read_sql(self):
        try:

            tables = {}
            # Проверяем наличие таблицы mbti, taro
            for file in os.listdir(self.path_to_data):
                if file.endswith('.csv'):
                    table_name = file.split('.')[0]
                    if table_name not in ['mbti', 'taro']:
                        log.warning(f"Не найдена таблица {table_name}")
                        continue
                    else:
                        # Открываем и записываем таблицы в переменные
                        table = read_csv(os.path.join(self.path_to_data, file))
                        tables[table_name] = table
                        log.info(f"Найдена таблица {table_name}")

            with self.connection.cursor() as cursor:
                # Создание базы данных, если она не существует
                cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{env.__getattr__('DB')}`")
                cursor.execute(f"USE `{env.__getattr__('DB')}`")

                # Открываем и выполняем SQL-скрипт
                with open(self.path_to_sql, "r", encoding="utf-8") as f:
                    sql_script = f.read()

                    # Разделение SQL-скрипта на отдельные запросы
                    statements = [stmt.strip() for stmt in sql_script.split(';') if stmt.strip()]

                    # Выполнение всех запросов в файле
                    for statement in statements:
                        try:
                            cursor.execute(statement)
                            log.info("Executed SQL statement: %s", statement)
                        except pymysql.MySQLError as e:
                            log.warning("SQL Warning: %s", exc_info=e)
                            # Логирование неудачных запросов может помочь в отладке

                # Записываем таблицы в базу данных
                for table_name, table in tables.items():
                    # Преобразование DataFrame в кортежи для вставки
                    data = [tuple(row) for row in table.values]

                    if table_name == 'mbti':
                        cursor.executemany(
                            "INSERT INTO `personalities` (`name`, `description`) VALUES (%s, %s)",
                            data
                        )
                        log.info(f"Inserted data into personalities table from {table_name}.csv")
                    elif table_name == 'taro':
                        cursor.executemany(
                            "INSERT INTO `magics` (`name`, `candidate_explanation`, `vacancy_explanation`,"
                            " `candidate_answer`, `vacancy_answer`) VALUES (%s, %s, %s, %s, %s)",
                            data
                        )
                        log.info(f"Inserted data into magics table from {table_name}.csv")
                    else:
                        log.warning(f"Не найдена таблица {table_name}")
                        continue

                self.connection.commit()
                log.info("Database was created and SQL script executed successfully")
        except Exception as ex:
            log.warning("Error during SQL script execution", exc_info=ex)
        finally:
            self.connection.close()


if __name__ == "__main__":
    create_sql = CreateSQL()
    create_sql.read_sql()
