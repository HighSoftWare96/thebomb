FROM node:12.16.1-alpine

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY package.json .

RUN npm ci

COPY . .

# Execute moleculer-runner
CMD ["node", "./node_modules/moleculer/bin/moleculer-runner.js"]
