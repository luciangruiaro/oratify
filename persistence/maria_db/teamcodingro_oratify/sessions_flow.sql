create table sessions_flow
(
    presentation_id  int                                  null,
    curr_question_id int                                  null,
    step_time        datetime default current_timestamp() null
);

