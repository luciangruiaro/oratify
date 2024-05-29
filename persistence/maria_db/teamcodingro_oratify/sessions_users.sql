create
    definer = teamcodingro_oratify@`%` procedure sessions_users(IN paramPresentationId int)
BEGIN
    SELECT s.presentation_id,
           s.user_id,
           s.join_time,
           u.id,
           u.first_name,
           u.last_name,
           u.email,
           u.birth_date,
           u.created_time
    FROM sessions s,
         users u
    WHERE s.user_id = u.id
      and presentation_id = paramPresentationId;
END;

