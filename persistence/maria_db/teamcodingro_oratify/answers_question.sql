create
    definer = teamcodingro_oratify@`%` procedure answers_question(IN paramPresentationId int, IN paramQuestionId int)
BEGIN
    select id,
           user_id,
           presentation_id,
           question_id,
           answer,
           questionType_byQuestionId(question_id)   as question_type,
           questionTarget_byQuestionId(question_id) as question_target
    from answers
    where presentation_id = paramPresentationId
      and question_id = paramQuestionId;
END;

