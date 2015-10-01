#!/bin/bash
gosu postgres postgres --single -jE <<- EOSQL
   CREATE DATABASE bills;
EOSQL
echo    
gosu postgres postgres --single -jE bills <<- EOSQL
   CREATE USER bills WITH PASSWORD 'bills123';
   CREATE TABLE users (
    id bigint PRIMARY KEY NOT NULL DEFAULT '0',
    email varchar(255) DEFAULT NULL,
    friend_ids varchar(9000) DEFAULT NULL,
    pic_url varchar(500) DEFAULT NULL,
    first_name varchar(255) DEFAULT NULL,
    gender varchar(10) DEFAULT NULL,
    last_name varchar(255) DEFAULT NULL,
    link varchar(1000) DEFAULT NULL,
    locale varchar(10) DEFAULT NULL,
    name varchar(255) DEFAULT NULL,
    timezone integer DEFAULT NULL,
    updated_time varchar(30) DEFAULT NULL,
    verified integer DEFAULT NULL
   );

   GRANT ALL PRIVILEGES ON DATABASE bills to bills;
   ALTER DATABASE bills OWNER TO bills;
   ALTER TABLE users OWNER TO bills;
EOSQL
echo
