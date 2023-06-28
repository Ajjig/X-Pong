FROM node:latest

EXPOSE 3000
EXPOSE 3069

WORKDIR /workspace

COPY . .

RUN npm i --force

CMD ["npm", "run", "start:dev"]
# RUN npm i -g @nestjs/cli
# RUN npm i -g prisma

# RUN npm rebuild bcrypt --update-binary

# RUN npx prisma generate
