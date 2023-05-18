local=$(HOME)/.local

.PHONY: init

.DEFAULT_GOAL := all

all: up
	@echo "All done"

init:
	mkdir -p /goinfre/$(USER)/local
	mkdir -p $(HOME)/$(local)
	ln -s /goinfre/$(USER)/local $(local)
	npm install -g @nestjs/cli

build:
	docker compose --build
	@echo "Build complete"

down:
	docker compose down
up:
	docker compose up --build

clean: 
	docker system prune -f


fclean: down clean
	-@ docker compose stop $(docker ps -a -q)
	-@ docker compose rm $(docker ps -a -q)
	-@ docker volume rm nestjs postgres
	-@ docker rmi $(shell docker images -q | tr "\n" " ")
	
