create
    definer = teamcodingro_oratify@`%` function questionType_byQuestionId(paramQuestionId int) returns varchar(128)
    RETURN (SELECT type from questions where id = paramQuestionId);

