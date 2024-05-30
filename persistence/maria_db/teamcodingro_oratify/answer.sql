create
    definer = teamcodingro_oratify@`%` procedure answer(IN paramUserId int, IN paramPresentationId int,
                                                        IN paramQuestionId int, IN paramAnswer text)
BEGIN
    DECLARE targetField VARCHAR(128) DEFAULT (SELECT target FROM questions WHERE id = paramQuestionId);

    INSERT INTO answers (user_id, presentation_id, question_id, answer)
    VALUES (paramUserId, paramPresentationId, paramQuestionId, paramAnswer)
    ON DUPLICATE KEY UPDATE answer = paramAnswer;

    IF targetField LIKE 'user:%' THEN
        CALL user_edit(paramUserId, SUBSTRING_INDEX(targetField, ':', -1), paramAnswer);
    END IF;
END;

