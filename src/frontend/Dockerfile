FROM node:latest

RUN mkdir -p /app
WORKDIR /app
COPY . .

# install dependencies
RUN npm install -g next
RUN npm install --legacy-peer-deps

ENV NODE_ENV production
RUN npm run build

# EXPOSE 3000
CMD [ "npm", "start" ]