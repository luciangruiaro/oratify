package com.oratify.oratify.model.questions;

import lombok.Data;

@Data
public class SessionQuestionCurrSetRequest {
    private int presentation_id;
    private int curr_question_id;
}
