FROM node:18.14.1-alpine3.17 as build
WORKDIR /tmp
COPY package.json /tmp/
RUN yarn cache clean && yarn install 
COPY . /tmp
RUN yarn build

FROM nginx:1.23.1-alpine as app
COPY --from=build /tmp/dist /usr/share/nginx/html/
