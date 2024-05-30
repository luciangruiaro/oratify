create table answers
(
    id              int auto_increment
        primary key,
    user_id         int          null,
    presentation_id int          null,
    question_id     int          null,
    answer          varchar(512) null,
    constraint idx_user_presentation_question
        unique (user_id, presentation_id, question_id)
);

