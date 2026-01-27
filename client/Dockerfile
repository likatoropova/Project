# client/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Сборка приложения
RUN npm run build

# Экспорт порта
EXPOSE 3000

# Запуск в режиме разработки
CMD ["npm", "run", "dev"]