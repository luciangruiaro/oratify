create
    definer = teamcodingro_oratify@`%` procedure user_join(IN paramPresentationCode varchar(128),
                                                           IN paramFirstName varchar(128),
                                                           IN paramLastName varchar(128))
BEGIN
    DECLARE newUserId INT;
    insert into users(first_name, last_name) values (paramFirstName, paramLastName);
    SET newUserId = (SELECT LAST_INSERT_ID());

    insert into sessions (presentation_id, user_id)
    values (presentationId_byPresentationCode(paramPresentationCode), newUserId);

end;

