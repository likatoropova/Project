# 🏋️‍♂️ Fitness Project "moveUP" - Справочник по командам

## 🧱 Общая информация

- **Backend:** Laravel 12 + MySQL (в Docker)
- **Frontend:** React (локально)
- **Flutter:** подключается к API (отдельно)
- **Инфраструктура:** Docker Compose, Git
- **Документация находится:** `http://localhost:8000/api/documentation`
---

## 🧰 Общие команды

### Git

| Команда | Описание |
|--------|---------|
| `git clone <url>` | Клонировать репозиторий |
| `git pull origin <branch>` | Обновить локальную ветку |
| `git add .` | Добавить все изменения в индекс |
| `git commit -m "message"` | Создать коммит |
| `git push origin <branch>` | Отправить изменения в репозиторий |
| `git status` | Проверить статус изменений |
| `git log --oneline` | Посмотреть историю коммитов |
| `git checkout <branch>` | Переключиться на ветку |
| `git checkout -b <new-branch>` | Создать и переключиться на новую ветку |
| `git branch -D <branch>` | Удалить локальную ветку |
| `git stash` | Временно сохранить изменения |
| `git stash pop` | Применить последние сохранённые изменения |

---

## 🐳 Docker

### Основные команды

| Команда | Описание |
|--------|---------|
| `docker-compose up` | Запустить контейнеры |
| `docker-compose up --build` | Пересобрать и запустить |
| `docker-compose down` | Остановить контейнеры |
| `docker-compose down -v` | Остановить и удалить тома |
| `docker exec -it <container> bash` | Войти в контейнер |
| `docker logs <container>` | Посмотреть логи контейнера |
| `docker ps` | Посмотреть запущенные контейнеры |

---

## 🧾 Чек-листы для запуска

### ✅ Первый запуск проекта

- [ ] Клонировать репозиторий
- [ ] Убедиться, что `docker-compose.yml` и `server/.env.example` существуют
- [ ] Создать `.env` из `.env.example`:
  ```bash
  cd server
  cp .env.example .env
  ```
- [ ] Запустить:
  ```bash
  docker-compose up --build
  ```
- [ ] После запуска выполнить (**_ВАЖНО: но лучше это делать каждый раз когда вы делаете любые изменения / выключение / перезапуск_**):
  ```bash
  docker exec laravel-api php artisan key:generate
  docker exec laravel-api php artisan migrate
  ```

### ✅ Добавил новые миграции?

- [ ] `docker exec laravel-api php artisan migrate`

### ✅ Просто перезапустил контейнеры?

- [ ] Ничего не делать — всё работает!

---

## 🧑‍💻 Для Backend-разработчика (Laravel)

| Действие | Команда |
|----------|---------|
| Зайти в контейнер Laravel | `docker exec -it laravel-api bash` |
| Запустить artisan команду | `docker exec laravel-api php artisan ...` |
| Сгенерировать ключ | `docker exec laravel-api php artisan key:generate` |
| Выполнить миграции | `docker exec laravel-api php artisan migrate` |
| Запустить Tinker | `docker exec laravel-api php artisan tinker` |
| Очистить кэш | `docker exec laravel-api php artisan cache:clear` |

---

## 👨‍💻 Для Frontend-разработчика (React)

> ⚠️ **React НЕ запускается в Docker!**  
> Он работает **локально** через `npm run dev`.

### Установка и настройка

1. **Установить Node.js и npm** (если ещё не установлены)
2. Перейти в папку `client`:
   ```bash
   cd client
   ```
3. Установить зависимости:
   ```bash
   npm install
   ```
4. Для работы Vite:
   ```bash
   npm install @vitejs/plugin-react --save-dev
   ```
5. Для работы с API(axios):
   ```bash
   npm install axios
   ```
6. Для работы с роутом(чтоб добавлять маршруты страниц и чтобы они вообще работали):
   ```bash
   npm install react-router-dom
   ```
7. Запустить dev-сервер:
   ```bash
   npm run dev
   ```
   → Приложение будет доступно на: `http://localhost:3000`
8. Для доступа в документацию API(там нужен JWT токен):
   если запускал проект и находишься в папке client
   ```bash
   cd ..
   docker exec laravel-api php artisan jwt:secret
   ```
   если просто открыл проект(запусти docker по интсрукции) и потом выполни команду
   ```bash
   docker exec laravel-api php artisan jwt:secret
   ```

### Настройка прокси к API

В `client/vite.config.js` уже настроена прокси:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // ← API в Docker
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

> ✅ Все запросы к `/api/*` будут автоматически перенаправлены в Laravel на `http://localhost:8000`.

---

## 🧑‍💻 Для Flutter-разработчика

| Действие | Описание |
|----------|----------|
| Базовый URL API | `http://<IP_вашего_компьютера>:8000` |
| Пример: | `GET http://192.168.1.100:8000/api/users` |

---

## 🧼 Очистка и сброс

| Команда | Описание |
|--------|---------|
| `docker-compose down -v --remove-orphans` | Полная остановка и удаление томов |
| `docker image prune -a` | Удалить все неиспользуемые образы |
| `docker builder prune` | Очистить билд-кэш |
| Удалить `vendor` в `server/` | `rm -rf server/vendor` |
| Удалить `node_modules` в `client/` | `rm -rf client/node_modules` |

---

## 🚀 Примеры сценариев

### 🔄 Обновление с GitHub

1. `git pull origin main`
2. `docker-compose down`
3. `docker-compose up --build`

### 🧪 Сброс БД

1. `docker-compose down -v`
2. `docker-compose up --build`
3. `docker exec laravel-api php artisan key:generate`
4. `docker exec laravel-api php artisan migrate`

---

## 📝 Примечания

- `.env` в `server/` сохраняет `APP_KEY` между запусками.
- `mysql_data` том сохраняет данные БД.
- `vite.config.js` в `client/` настраивает прокси к `http://localhost:8000`.

---
## 🛠️ Настройка файла .env

### Для корректной работы Laravel с MySQL, обязательно укажите в server/.env следующие параметры:
```bash
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```
```bash
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel_app
DB_USERNAME=laravel
DB_PASSWORD=laravel_password
```
## Redis - доработки, нужно поменять эти параметры  
```
QUEUE_CONNECTION=redis
CACHE_STORE=redis
REDIS_HOST=redis
```
>💡 Убедитесь, что DB_CONNECTION=mysql, иначе Laravel будет использовать SQLite по умолчанию.

---

# 🚨 Решение ошибки отсутствия папки `vendor`
## ❌ Проблема
При первом запуске проекта вы можете увидеть следующую ошибку:
```bash
PHP Warning:  require(/var/www/html/vendor/autoload.php): Failed to open stream: No such file or directory in /var/www/html/artisan on line 10
PHP Fatal error:  Uncaught Error: Failed opening required '/var/www/html/vendor/autoload.php' (include_path='.:/usr/local/lib/php') in /var/www/html/artisan:10
```
**Причина:** Папка `vendor` отсутствует на локальном компьютере, и при монтировании `./server:/var/www/html` она перезаписывается содержимым хоста.
---
## 📋 Полный список команд (для быстрого копирования)

```bash
# 1. Остановка контейнеров
docker-compose down

# 2. Пересборка образа
docker-compose build --no-cache server

# 3. Запуск без монтирования
docker-compose up -d

# 4. Ожидание запуска (10 секунд)
# Подождите 10 секунд...

# 5. Проверка создания vendor
docker-compose ps
docker-compose exec server ls -la vendor

# 6. Копирование vendor на хост
docker cp laravel-api:/var/www/html/vendor ./server/vendor
docker cp laravel-api:/var/www/html/.env ./server/.env

# 7. Перезапуск с монтированием
docker-compose restart server

# 8. Финальная проверка
docker-compose ps
docker-compose logs server

# 9. Генерация ключа и миграции
docker exec laravel-api php artisan key:generate
docker exec laravel-api php artisan migrate
```
---
## ✅ Решение (пошаговая инструкция)
### ⚙️ Подготовка
Откройте терминал в корневой папке проекта (где находится `docker-compose.yml`).

---
### 📝 Шаг 1: Временное отключение монтирования
Откройте файл `docker-compose.yml` и **закомментируйте** строки с монтированием:
```yaml
services:
  server:
    build:
      context: ./server
    container_name: laravel-api
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=local
      - DB_HOST=mysql
    # volumes:
    #   - ./server:/var/www/html  ← ЗАКОММЕНТИРУЙТЕ ЭТУ СТРОКУ
    depends_on:
      - mysql
    networks:
      - app-network
```
---
### 🛑 Шаг 2: Остановка контейнеров
```bash
docker-compose down
```
---
### 🔄 Шаг 3: Пересборка образа
```bash
docker-compose build --no-cache server
```
---
### ▶️ Шаг 4: Запуск контейнера без монтирования
```bash
docker-compose up -d
```
_Дождитесь запуска контейнеров!_

---
### ✅ Шаг 5: Проверка создания папки `vendor`
```bash
# Проверьте статус контейнеров
docker-compose ps

# Проверьте наличие папки vendor внутри контейнера
docker-compose exec server ls -la vendor
```
**Ожидаемый результат:** Вы должны увидеть список файлов и папок внутри `vendor`.
---
### 💾 Шаг 6: Копирование `vendor` на локальный компьютер
```bash
# Скопируйте vendor из контейнера на хост
docker cp laravel-api:/var/www/html/vendor ./server/vendor

# Скопируйте .env файл (если его нет)
docker cp laravel-api:/var/www/html/.env ./server/.env
```
---
### 🔧 Шаг 7: Возврат монтирования
Откройте `docker-compose.yml` и **раскомментируйте** монтирование:
```yaml
services:
  server:
    build:
      context: ./server
    container_name: laravel-api
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=local
      - DB_HOST=mysql
    volumes:
      - ./server:/var/www/html  ← РАСКОММЕНТИРУЙТЕ ЭТУ СТРОКУ
    depends_on:
      - mysql
    networks:
      - app-network
```
---
### 🔄 Шаг 8: Перезапуск контейнера
```bash
docker-compose restart server
```
---
### 🎯 Шаг 9: Финальная проверка
```bash
# Проверьте статус контейнера
docker-compose ps

# Проверьте логи (должны быть чистые, без ошибок)
docker-compose logs server

# Проверьте, что приложение доступно
# Откройте в браузере: http://localhost:8000
```
---
### 🔑 Шаг 10: Настройка окружения (если нужно)
```bash
# Сгенерируйте ключ приложения
docker exec laravel-api php artisan key:generate

# Выполните миграции
docker exec laravel-api php artisan migrate

# Проверьте подключение к базе данных
docker exec laravel-api php artisan migrate:status
```
---