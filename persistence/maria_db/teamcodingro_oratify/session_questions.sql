create
    definer = teamcodingro_oratify@`%` procedure session_questions(IN paramPresentationId int)
BEGIN

    select id, presentation_id, priority, question, type, options, target
    from questions
    where presentation_id = paramPresentationId
    order by priority;

END;

