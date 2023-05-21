FROM node:latest

EXPOSE 3000
EXPOSE 3069

WORKDIR /workspace/

COPY . .

RUN rm -rf node_modules
RUN rm -rf dist

RUN npm i

RUN npm i -g @nestjs/cli
RUN npm i -g prisma

RUN npm rebuild bcrypt --update-binary

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]
