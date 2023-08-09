FROM node:latest

EXPOSE 3001


WORKDIR /workspace

COPY . .

RUN npm i --legacy-peer-deps


CMD ["npm", "run", "launch"]
# CMD ["npm", "run", "dev"]

