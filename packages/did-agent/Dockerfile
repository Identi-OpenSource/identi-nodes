FROM node:20

WORKDIR /usr/src/app

COPY . .

ADD config config

# RUN yarn install --production

EXPOSE 3331

CMD ["yarn", "start"]
