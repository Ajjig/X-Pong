local=$HOME/.local

init:
	mkdir -p /goinfre/$(USER)/local
	ln -s /goinfre/$(USER)/local $(HOME)/$(local)
	npm install -g @nestjs/cli