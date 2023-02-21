FROM node:latest

EXPOSE 3000

COPY . /workspace
RUN npm install -g typescript
RUN npm i -g @nestjs/cli

CMD ["tail", "-f"]