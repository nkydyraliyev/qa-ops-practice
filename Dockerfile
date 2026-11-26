# Образ учебного приложения.
# Собрать:    docker build -t qa-practice:1.0 .
# Запустить:  docker run -d --name qa-app -p 3000:3000 qa-practice:1.0

# Базовый образ: Linux (Alpine) + Node.js 22
FROM node:22-alpine

# Версию можно передать при сборке: --build-arg APP_VERSION=1.0.1
ARG APP_VERSION=dev

# Рабочая папка внутри контейнера
WORKDIR /app

# Копируем файлы проекта с хоста в образ
COPY package.json ./
COPY src ./src
COPY scripts ./scripts
COPY tests ./tests

# Переменные окружения по умолчанию (переопределяются через docker run -e)
ENV PORT=3000 \
    APP_ENV=docker \
    APP_VERSION=${APP_VERSION}

# Документирует порт приложения (сам по себе порт НЕ публикует — для этого -p)
EXPOSE 3000

# Команда по умолчанию при старте контейнера (можно заменить в docker run)
CMD ["node", "src/server.js"]
