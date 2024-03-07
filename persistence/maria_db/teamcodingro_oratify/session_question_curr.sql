create
    definer = teamcodingro_oratify@`%` procedure session_question_curr(IN paramPresentationId int)
BEGIN
    SELECT curr_question_id
    FROM sessions_flow
    WHERE presentation_id = paramPresentationId
    ORDER BY step_time DESC
    LIMIT 1;
END;

