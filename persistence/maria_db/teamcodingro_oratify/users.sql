create table users
(
    id           int auto_increment
        primary key,
    first_name   varchar(512)                         null,
    last_name    varchar(512)                         null,
    email        varchar(128)                         null,
    birth_date   date                                 null,
    created_time datetime default current_timestamp() null
);

