FROM node:latest as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
ARG configuration=production
RUN npm run build -- --output-path=./dist/out --base-href=/app/ --configuration $configuration

FROM nginx:alpine
COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html/app
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
