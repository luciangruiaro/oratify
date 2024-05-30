create
    definer = teamcodingro_oratify@`%` procedure presentation_curr_get()
BEGIN
    DECLARE aux INT;
    SELECT presentadion_id INTO aux FROM sessions_curr LIMIT 1;
    IF aux IS NULL THEN
        SET aux = 1;
    END IF;
    SELECT aux as presentadion_id;
END;

