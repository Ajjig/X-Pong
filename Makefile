local=$(HOME)/.local

.PHONY: init

.DEFAULT_GOAL := all

all: build up
	@echo "All done"

init:
	mkdir -p /goinfre/$(USER)/local
	mkdir -p $(HOME)/$(local)
	ln -s /goinfre/$(USER)/local $(local)
	npm install -g @nestjs/cli

build:
	@mkdir -p vl/nestjs vl/postgres vl/front
	docker-compose build
	@echo "Build complete"

down:
	docker-compose down
up:
	docker-compose up

clean: 
	rm -rf vl
	docker system prune -f


fclean: down clean
	-@ docker-compose stop $(docker ps -a -q)
	-@ docker-compose rm $(docker ps -a -q)
	-@ docker volume rm nestjs postgres
	-@ docker rmi $(docker images -q | tr "\n" " ")
	
