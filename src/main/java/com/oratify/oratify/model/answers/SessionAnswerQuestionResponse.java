package com.oratify.oratify.model.answers;

import lombok.Data;

@Data
public class SessionAnswerQuestionResponse {
    private int id;
    private Long user_id;
    private Long presentation_id;
    private Long question_id;
    private String answer;
    private String question_type;
}
