create
    definer = teamcodingro_oratify@`%` procedure session_question_set(IN paramPresentationId int, IN paramCurrQuestionId int)
BEGIN
    INSERT INTO sessions_flow (presentation_id, curr_question_id)
    VALUES (paramPresentationId, paramCurrQuestionId);
END;

