FROM node:latest

EXPOSE 3000
EXPOSE 3069

WORKDIR /workspace

COPY . .

RUN npm i
RUN npm i -g @nestjs/cli

# RUN npm rebuild bcrypt --update-binary
# RUN npx prisma generate

CMD ["npm", "run", "start:dev"]

