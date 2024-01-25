FROM node:20 as build

COPY package.json .
COPY package-lock.json .

COPY . .

RUN npm install

RUN npm run build


ENTRYPOINT ["node", "dist/src/main.js"]