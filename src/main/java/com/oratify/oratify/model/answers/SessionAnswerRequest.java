package com.oratify.oratify.model.answers;

import lombok.Data;

@Data
public class SessionAnswerRequest {
    private int user_id;
    private int presentation_id;
    private int question_id;
    private String answer;
}
