#!/bin/bash
gosu postgres postgres --single -jE <<- EOSQL
   CREATE DATABASE bills;
EOSQL
echo
gosu postgres postgres --single -jE bills <<- EOSQL
   CREATE USER bills WITH PASSWORD 'bills123';
    CREATE SEQUENCE images_seq;
    CREATE TABLE tbl_users (
    id bigint NOT NULL DEFAULT nextval('images_seq'),
    email_id varchar(255) DEFAULT NULL,
    first_name varchar(255) DEFAULT NULL,
    last_name varchar(255) DEFAULT NULL
    password varchar(255) DEFAULT NULL,
    contact_no varchar(100) DEFAULT NULL,
    updated_at timestamp DEFAULT NULL,
    created_at timestamp DEFAULT NULL
   );
    ALTER SEQUENCE images_seq OWNED BY tbl_users.id;
   GRANT ALL PRIVILEGES ON DATABASE bills to bills;
   ALTER DATABASE bills OWNER TO bills;
   ALTER TABLE tbl_users OWNER TO bills;
EOSQL
echo
