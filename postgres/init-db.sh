#!/bin/bash
gosu postgres postgres --single -jE <<- EOSQL
   CREATE DATABASE bills;
EOSQL
echo
gosu postgres postgres --single -jE bills <<- EOSQL
   CREATE USER bills WITH PASSWORD 'bills123';
    CREATE SEQUENCE images_seq;
    CREATE TABLE users (
    id bigint NOT NULL DEFAULT nextval('images_seq'),
    email varchar(255) DEFAULT NULL,
    name varchar(255) DEFAULT NULL,
    password varchar(255) DEFAULT NULL,
    remember_token varchar(100) DEFAULT NULL,
    updated_at timestmp DEFAULT NULL,
    created_at timestamp DEFAULT NULL
   );
    ALTER SEQUENCE images_seq OWNED BY users.id;
   GRANT ALL PRIVILEGES ON DATABASE bills to bills;
   ALTER DATABASE bills OWNER TO bills;
   ALTER TABLE users OWNER TO bills;
EOSQL
echo
