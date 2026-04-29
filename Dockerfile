FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_MONEYPENNY_BASE_URL=/api
ARG VITE_MONEYPENNY_CLIENT_ID
ARG VITE_VERYS_BASE_URL
ARG VITE_OAUTH2_CLIENT_ID
ARG VITE_OAUTH2_SCOPE=openid email

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
