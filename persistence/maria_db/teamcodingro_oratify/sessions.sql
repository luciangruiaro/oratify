create table sessions
(
    presentation_id int                                  not null,
    user_id         int                                  not null,
    join_time       datetime default current_timestamp() null
);

