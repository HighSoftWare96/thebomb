FROM node:12.16.1-alpine as builder
WORKDIR /app
RUN ls -la
COPY ./frontend/package*.json ./
RUN ls -la
RUN npm ci
COPY frontend ./
RUN npx ng build --prod thebomb
RUN ls -la ./dist/thebomb

FROM nginx
COPY frontend/deploy/nginx.conf /etc/nginx/nginx.conf
COPY frontend/deploy/security-headers.conf /etc/nginx/security-headers.conf
COPY --from=builder /app/dist/thebomb /usr/share/nginx/html
EXPOSE 8888