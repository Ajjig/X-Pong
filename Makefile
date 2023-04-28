local=$(HOME)/.local

.PHONY: init

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
	sudo docker-compose up

fclean:
	docker-compose stop $(docker ps -a -q)
	docker-compose rm $(docker ps -a -q)
	docker system prune -f
	rm -rf vl
	docker volume rm nestjs postgres front