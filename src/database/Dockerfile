FROM postgres:latest

EXPOSE 5432

COPY ./conf/updated.sql /docker-entrypoint-initdb.d/

CMD ["postgres"]

