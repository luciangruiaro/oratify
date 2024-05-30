create
    definer = teamcodingro_oratify@`%` procedure presentation_remaining_time(IN paramPresentationId int)
BEGIN
    DECLARE playTime DATETIME DEFAULT (SELECT playTime
                                       FROM presentations
                                       WHERE id = paramPresentationId);
    DECLARE dur INT DEFAULT (SELECT duration
                             FROM presentations
                             WHERE id = paramPresentationId);

    SELECT GREATEST(dur - TIMESTAMPDIFF(SECOND, playTime, NOW()), 0) AS remaining_seconds;
END;

