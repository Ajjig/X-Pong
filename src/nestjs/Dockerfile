FROM node:latest

EXPOSE 3000

COPY . /workspace

WORKDIR /workspace/tsc

RUN rm -rf node_modules && npm install

CMD ["npm", "run", "start:dev"]