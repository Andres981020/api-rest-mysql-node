CREATE DATABASE database_links;

use database_links;

create table users(
    id int(11) not null,
    username varchar(16) not null,
    password varchar(60) not null,
    fullname varchar(100) not null
);

alter table users
    add primary key (id);

alter table users
    modify id int(11) not null auto_increment, auto_incremente = 2;