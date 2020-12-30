FROM node:12.16.1-alpine

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3001

# Execute moleculer-runner
CMD ["npm", "start"]
