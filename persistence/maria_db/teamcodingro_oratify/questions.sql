create table questions
(
    id              int auto_increment
        primary key,
    presentation_id int          null,
    priority        int          null comment 'order of questions by session. 1 - highest',
    question        varchar(512) not null,
    type            varchar(128) null,
    options         text         null,
    target          varchar(128) null comment 'what is it updating. user or answers',
    slideText       text         null
);

