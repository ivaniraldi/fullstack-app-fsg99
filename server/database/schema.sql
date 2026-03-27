create database products;
--\c products
create table item (id SERIAL PRIMARY KEY, name TEXT, price INT);

create table users (id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT);
