FROM postgres:10.4

MAINTAINER me
RUN mkdir -p /database
WORKDIR /database

ENV POSTGRES_USER=Home 
ENV POSTGRES_PASSWORD=psqlpwd

ADD ./PricesData3.csv /database

COPY schema.sql /docker-entrypoint-initdb.d

EXPOSE 5432