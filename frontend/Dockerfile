# Frontend Dockerfile
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18 AS dev
WORKDIR /app
COPY --from=build /app /app
EXPOSE 3000
CMD ["npm", "start"] 