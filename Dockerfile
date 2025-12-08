FROM node:20-alpine

RUN npm install -g hexo-cli

WORKDIR /app

EXPOSE 4000

CMD ["hexo", "server"]
