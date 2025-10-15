<<<<<<< HEAD
# Campus Lost/Found MTUCI

Веб-приложение для поиска потерянных и найденных вещей в кампусе МТУСИ.

## Описание проекта

Приложение состоит из:
- **Frontend**: React с TypeScript, React Router, Bootstrap
- **Backend**: Flask с REST API
- **Карты**: React Leaflet для отображения местоположения вещей

## Функциональность

- Просмотр объявлений о потерянных/найденных вещах
- Поиск по описанию
- Интерактивная карта кампуса МТУСИ
- Чат для связи между пользователями
- Добавление новых объявлений

## Запуск проекта

### Frontend (React)
```bash
npm install
npm start
```
Приложение запустится на http://localhost:3000

### Backend (Flask)
```bash
python ../server.py
```
Сервер запустится на http://127.0.0.1:5000

## API эндпоинты

- `GET /health` - Проверка состояния сервера
- `GET /api/announcements` - Получить все объявления
- `GET /api/announcements/<id>` - Получить объявление по ID
- `POST /api/announcements` - Создать новое объявление
- `GET /api/search?q=<query>` - Поиск объявлений

## Лабораторные работы

Проект разработан в рамках лабораторных работ по веб-разработке:

1. **ЛР №1**: Проектирование UI/UX; формирование пользовательских сценариев; подготовка каркасного прототипа (wireframes) ключевых экранов
2. **ЛР №2**: Развёртывание сервера; базовая маршрутизация; наличие health-check
3. **ЛР №3**: Вёрстка основных компонентов интерфейса; настройка клиентской маршрутизации (React Router)

## Технологии

- React 18
- TypeScript
- Flask
- React Router
- React Leaflet
- Bootstrap
- CORS

## Скрипты

### `npm start`

Запускает приложение в режиме разработки.\
Откройте [http://localhost:3000](http://localhost:3000) для просмотра в браузере.

Страница перезагрузится при внесении изменений.\
Также в консоли могут отображаться ошибки линтера.

### `npm run build`

Собирает приложение для продакшена в папку `build`.\
Корректно объединяет React в продакшен режиме и оптимизирует сборку для лучшей производительности.

Сборка минифицирована, имена файлов включают хэши.\
Приложение готово к развёртыванию!

### `npm test`

Запускает тестовый раннер в интерактивном режиме наблюдения.\
Подробнее о запуске тестов: [running tests](https://facebook.github.io/create-react-app/docs/running-tests)

### `npm run eject`

**Примечание: это односторонняя операция. После eject нельзя вернуться обратно!**

Если вас не устраивают инструменты сборки и конфигурация, вы можете выполнить eject в любое время. Эта команда удалит единственную зависимость сборки из проекта.

Вместо этого она скопирует все файлы конфигурации и транзитивные зависимости (webpack, Babel, ESLint и т.д.) прямо в ваш проект, чтобы у вас был полный контроль над ними. Все команды, кроме eject, будут работать, но они будут указывать на скопированные скрипты, так что вы сможете их настроить. На этом этапе вы действуете самостоятельно.

Вам не обязательно когда-либо использовать eject. Подобранный набор функций подходит для небольших и средних развёртываний, и вы не должны чувствовать себя обязанным использовать эту функцию. Однако мы понимаем, что этот инструмент не был бы полезен, если бы вы не могли его настроить, когда будете готовы.

## Узнать больше

Вы можете узнать больше в [документации Create React App](https://facebook.github.io/create-react-app/docs/getting-started).

Чтобы изучить React, ознакомьтесь с [документацией React](https://reactjs.org/).
=======
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> 0ba90f3 (new React add)
