FROM node:20

WORKDIR /usr/src/app

COPY package.json .

ADD config config

RUN npm install --production

EXPOSE 3330

CMD ["npm", "run", "start"]
