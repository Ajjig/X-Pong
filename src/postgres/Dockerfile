FROM postgres:latest

EXPOSE 5432

COPY /conf/mybackup.sql /docker-entrypoint-initdb.d/

CMD ["postgres"]

