import sys
from dotenv import load_dotenv, set_key, unset_key
from src import path_to_env
load_dotenv(path_to_env())


def main_menu():
    while True:
        print('=============================================================')
        print(' Меню для работы с HireSnap:\n')
        print(' 1. Запуск train')
        print(' 2. Запуск uvicorn')
        print(' 3. Запуск pytest')
        print(' 4. Выход из меню')
        print('=============================================================')

        choice = input('\nСделайте выбор: ')
        print('')

        if choice in ['1', '2', '3']:
            set_key(path_to_env(), 'CHOICE', str(choice))  # Устанавливаем значение переменной окружения
            break
        elif choice == '4':
            sys.exit()
        else:
            print('Выберите между 1-4')


if __name__ == '__main__':
    try:
        main_menu()
    except Exception as ex:
        print(ex)
