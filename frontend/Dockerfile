FROM node:19.8.1

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]