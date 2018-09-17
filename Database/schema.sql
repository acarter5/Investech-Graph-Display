DROP DATABASE IF EXISTS company_data;
CREATE DATABASE company_data;

\c company_data;

DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
  id serial,
  name varchar,
  prices varchar,
  PRIMARY KEY (id)
); 

COPY companies(name,prices) FROM '/database/PricesData3.csv' DELIMITER ',' CSV HEADER;