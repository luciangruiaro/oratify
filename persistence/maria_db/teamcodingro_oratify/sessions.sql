create table sessions
(
    presentation_id int                                  null,
    user_id         int                                  null,
    join_time       datetime default current_timestamp() null
);

