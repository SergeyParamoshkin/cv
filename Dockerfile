FROM node:22-alpine AS build
WORKDIR /tmp
COPY package*.json /tmp/
RUN npm ci --omit=dev
COPY . /tmp
RUN npm run build

FROM nginx:1.27-alpine AS app
COPY --from=build /tmp/dist /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
