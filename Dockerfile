FROM node:12.20.1-slim as node-base
RUN apt-get update && apt-get -y install wget
RUN mkdir /confd
RUN wget -O '/confd/confd' 'https://github.com/kelseyhightower/confd/releases/download/v0.15.0/confd-0.15.0-linux-amd64'
RUN chmod +x /confd/confd

FROM node:12.18.3 as build
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node-base as production
RUN groupadd -r app && useradd -r -g app app
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV SERVER_PORT=8080
WORKDIR /usr/app
RUN mkdir ./confd && cp /confd/confd ./confd/confd
COPY ./run.sh ./run.sh
RUN chmod +x run.sh

COPY ./package*.json ./
RUN npm install --only=production
COPY ./docs ./docs
COPY ./confd ./confd
COPY --from=build /usr/src/app/dist .

RUN chown -R app . && mkdir -p /home/app/.config && chown -R app:app /home/app
USER app:app

HEALTHCHECK CMD wget http://127.0.0.1:${SERVER_PORT}/liveness -O /dev/null || exit 1

CMD ["./run.sh"]
