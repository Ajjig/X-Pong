FROM node:latest

EXPOSE 3000

COPY . /workspace
RUN npm install -g typescript
RUN npm i -g @nestjs/cli

RUN npm i -g class-transformer
RUN npm i -g --save @nestjs/typeorm typeorm



CMD ["tail", "-f"]