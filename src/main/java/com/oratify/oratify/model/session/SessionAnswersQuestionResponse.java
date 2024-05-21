package com.oratify.oratify.model.session;

import lombok.Data;

@Data
public class SessionAnswersQuestionResponse {
    private int id;
    private int user_id;
    private int presentation_id;
    private int question_id;
    private String answer;
    private String question_type;
}
