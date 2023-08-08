FROM node:latest

EXPOSE 3000
EXPOSE 3069

WORKDIR /workspace

COPY . .

RUN npm i
RUN npm i -g @nestjs/cli

CMD ["npm", "run", "start:dev"]
# CMD ["npm", "run", "start:prod"]

