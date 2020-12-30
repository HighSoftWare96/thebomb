FROM node:12.16.1-alpine

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN ls -la

RUN npm ci

COPY . .

EXPOSE 3000

# Execute moleculer-runner
CMD ["npm", "start"]
