package com.oratify.oratify.persistency;

import com.oratify.oratify.model.session.SessionQuestionCurrResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
public class QuestionsPersistent {
    public static final String CALL_SESSION_QUESTION_CURR_S = "call session_question_curr(%s)";
    public static final String CALL_SESSION_QUESTION_SET_S_S = "call session_question_set(%s, %s)";
    private static final Logger logger = LoggerFactory.getLogger(QuestionsPersistent.class);
    private final DbQ dbQ;

    @Autowired
    public QuestionsPersistent(DbQ dbQ) {
        this.dbQ = dbQ;
    }

    public SessionQuestionCurrResponse getSessionCurrentQuestionFromPersistent(int presentationId) {
        String query = String.format(CALL_SESSION_QUESTION_CURR_S, presentationId);
        List<Class<?>> targetClasses = List.of(SessionQuestionCurrResponse.class);
        List<Object> results;
        try {
            results = dbQ.executeQuery(query, targetClasses);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return (SessionQuestionCurrResponse) results.getFirst();
    }

    public void setSessionQuestion(int presentationId, int currQuestionId) {
        String query = String.format(CALL_SESSION_QUESTION_SET_S_S, presentationId, currQuestionId);
        try {
            dbQ.executeQuery(query, null);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
