FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG REACT_APP_API_SERVICE
ARG REACT_APP_WEBSOCKET_SERVICE
ARG REACT_APP_INSIGHT_SERVICE

ENV REACT_APP_API_SERVICE=$REACT_APP_API_SERVICE
ENV REACT_APP_WEBSOCKET_SERVICE=$REACT_APP_WEBSOCKET_SERVICE
ENV REACT_APP_INSIGHT_SERVICE=$REACT_APP_INSIGHT_SERVICE

RUN chmod +x -R node_modules/.bin

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]