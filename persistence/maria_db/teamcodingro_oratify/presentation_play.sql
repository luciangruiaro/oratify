create
    definer = teamcodingro_oratify@`%` procedure presentation_play(IN paramPresentationId int, IN paramDuration int)
BEGIN
    update presentations set playTime = now(), duration = paramDuration where id = paramPresentationId;
END;

