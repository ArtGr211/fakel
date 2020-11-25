FROM node:10.23.0-alpine3.10
RUN apk add g++ make python

WORKDIR /home/app

COPY ./ /home/app

RUN npm install -g nodemon
RUN npm install

CMD npm run dev
