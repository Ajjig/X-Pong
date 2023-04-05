FROM node:latest

EXPOSE 3001

COPY . /workspace

WORKDIR /workspace/tsc

RUN npm install

CMD ["tail", "-f"]