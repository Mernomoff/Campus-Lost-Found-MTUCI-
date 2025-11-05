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

### Backend (Flask)
```bash
python server.py
```
Сервер запустится на http://127.0.0.1:5000

Checkpoint

Task Completed
01:01 AM
Готово! Теперь проект Campus Lost/Found MTUCI опубликован на GitHub в ветке main с правильными коммитами для лабораторных работ. Все файлы на месте.


https://github.com/Mernomoff/Campus-Lost-Found-MTUCI-/tree/main 

а почему я не могу открыть reat-app





Checkpoint
(Current)

Task Completed
01:02 AM
Потому что react-app добавлена как git submodule (вложенный репозиторий). На GitHub она показывается как ссылка, но содержимое не отображается. Чтобы исправить:


### Frontend (React)
```bash
cd react-app
npm install
npm start
```
Приложение запустится на http://localhost:3000

## API эндпоинты

- `GET /health` - Проверка состояния сервера
- `GET /api/announcements` - Получить все объявления
- `GET /api/announcements/<id>` - Получить объявление по ID
- `POST /api/announcements` - Создать новое объявление
- `GET /api/search?q=<query>` - Поиск объявлений

## Лабораторные работы

Проект разработан в рамках лабораторных работ по веб-разработке:

1. **ЛР №2**: Развёртывание сервера с базовой маршрутизацией и health-check
2. **ЛР №3**: Вёрстка компонентов интерфейса и настройка React Router

## Технологии

- React 18
- TypeScript
- Flask
- React Router
- React Leaflet
- Bootstrap
