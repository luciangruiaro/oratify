create
    definer = teamcodingro_oratify@`%` procedure presentation_curr_set(IN paramPresentationId int)
BEGIN
    replace into sessions_curr (presentadion_id) values (paramPresentationId);
END;

