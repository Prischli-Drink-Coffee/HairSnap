import sys


def main_menu():
    while True:
        print('=============================================================')
        print(' Меню для работы с NaRuTagAi:\n')
        print(' 1. Запуск train')
        print(' 2. Запуск uvicorn')
        print(' 3. Запуск pytest')
        print(' 4. Выход из меню')
        print('=============================================================')

        choice = input('\nСделайте выбор: ')
        print('')

        if choice == '1':
            # Файл data_downloader.py
            with open('temp.txt', 'w') as temp_file:
                temp_file.write('1')
            break
        elif choice == '2':
            # Файл train.py
            with open('temp.txt', 'w') as temp_file:
                temp_file.write('2')
            break
        elif choice == '3':
            # Файл uvicorn.py
            with open('temp.txt', 'w') as temp_file:
                temp_file.write('3')
            break
        elif choice == '4':
            with open('temp.txt', 'w') as temp_file:
                temp_file.write('')
            sys.exit()
        else:
            print('Выберите между 1-4')


if __name__ == '__main__':
    main_menu()
