FROM node:latest
ADD package.json /app/package.json
WORKDIR /app
RUN npm install
