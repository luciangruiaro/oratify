package com.oratify.oratify.persistency;

import com.oratify.oratify.model.answers.SessionAnswerQuestionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnswersPersistent {
    public static final String CALL_ANSWERS_QUESTION_S_S = "call answers_question(%s, %s)";
    public static final String CALL_ANSWER_S_S_S_S = "call answer(%s, %s, %s, '%s')";
    private static final Logger logger = LoggerFactory.getLogger(AnswersPersistent.class);
    private final DbQ dbQ;

    @Autowired
    public AnswersPersistent(DbQ dbQ) {
        this.dbQ = dbQ;
    }

    public List<SessionAnswerQuestionResponse> getSessionAnswersQuestion(int presentationId, int questionId) {
        String query = String.format(CALL_ANSWERS_QUESTION_S_S, presentationId, questionId);
        List<Class<?>> targetClasses = List.of(SessionAnswerQuestionResponse.class);
        List<Object> results;
        try {
            results = dbQ.executeQuery(query, targetClasses);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return results.stream()
                .filter(SessionAnswerQuestionResponse.class::isInstance)
                .map(SessionAnswerQuestionResponse.class::cast)
                .collect(Collectors.toList());
    }

    public void setSessionAnswerQuestion(int userId, int presentationId, int questionId, String answer) {
        String query = String.format(CALL_ANSWER_S_S_S_S, userId, presentationId, questionId, answer);
        try {
            dbQ.executeQuery(query, null);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
