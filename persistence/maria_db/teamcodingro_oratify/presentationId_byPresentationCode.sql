create
    definer = teamcodingro_oratify@`%` function presentationId_byPresentationCode(paramPresentationCode varchar(128)) returns int
    RETURN (select id from presentations where code = paramPresentationCode);

