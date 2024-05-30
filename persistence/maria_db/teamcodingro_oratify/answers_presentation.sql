create
    definer = teamcodingro_oratify@`%` procedure answers_presentation(IN paramPresentationId int)
BEGIN
    SELECT id, user_id, presentation_id, question_id, answer, questionType_byQuestionId(question_id) as question_type
    FROM answers
    WHERE presentation_id = paramPresentationId;
END;

