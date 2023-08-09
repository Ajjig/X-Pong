FROM node:latest

EXPOSE 3000
EXPOSE 3069

WORKDIR /app

COPY . .

RUN npm i
RUN npm i -g @nestjs/cli
RUN npm i -g prisma
RUN npx prisma generate

RUN npm run build

CMD ["npm", "run", "start"]

