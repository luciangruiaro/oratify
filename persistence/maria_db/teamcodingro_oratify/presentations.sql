create table presentations
(
    id         int auto_increment
        primary key,
    name       varchar(128) null,
    code       varchar(8)   null,
    start_time datetime     null,
    end_time   datetime     null
);

