FROM node:latest

EXPOSE 3000

COPY . /workspace

WORKDIR /workspace/tsc

RUN npm install

CMD ["npm", "run", "start:dev"]