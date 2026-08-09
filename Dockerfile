FROM node:22-alpine AS build
WORKDIR /tmp
COPY package*.json /tmp/
RUN npm ci
COPY . /tmp
RUN npm run build

FROM nginx:1.27-alpine AS app
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /tmp/dist /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
