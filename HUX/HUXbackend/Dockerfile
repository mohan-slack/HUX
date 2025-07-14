# Use official Node.js LTS image
FROM node:18-alpine

WORKDIR /app

COPY package.json tsconfig.json ./
RUN npm install

COPY src ./src
COPY .env ./

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"] 