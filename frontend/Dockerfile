# Build stage
FROM node:23-alpine3.19 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:23-alpine3.19

WORKDIR /app

RUN npm install serve
COPY --from=build /app/build ./build
EXPOSE 80
CMD ["npx", "serve", "-s", "build", "-l", "80"]
