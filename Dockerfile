FROM node:16-alpine3.11

RUN mkdir -p /usr/src/athena

WORKDIR /usr/src/athena

COPY . /usr/src/athena

RUN yarn install

RUN yarn build

WORKDIR /usr/src/athena/build

RUN yarn install --production

RUN mkdir .config

RUN cd /.config

RUN touch .spotify

EXPOSE 5555

CMD ["yarn", "start"]
