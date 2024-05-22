package com.oratify.oratify.service;

import com.oratify.oratify.inmem.AnswersInMem;
import com.oratify.oratify.model.answers.SessionAnswerQuestionResponse;
import com.oratify.oratify.persistency.AnswersPersistent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AnswersService {

    private final AnswersPersistent answersPersistent;
    private final AnswersInMem answersInMem;
    private final Map<String, Boolean> syncStatusMap = new ConcurrentHashMap<>();


    @Autowired
    public AnswersService(AnswersPersistent answersPersistent, AnswersInMem answersInMem) {
        this.answersPersistent = answersPersistent;
        this.answersInMem = answersInMem;
    }

    public List<SessionAnswerQuestionResponse> getSessionAnswersQuestion(int presentationId, int questionId) {
        List<SessionAnswerQuestionResponse> sessionAnswerQuestionResponseList = answersInMem.getSessionAnswersQuestionFromMem(presentationId, questionId);
        boolean hasAnswersForQuestionSession = sessionAnswerQuestionResponseList.stream().anyMatch(response -> response.getPresentation_id() == presentationId && response.getQuestion_id() == questionId);
        String key = generateKey(presentationId, questionId);
        if (!hasAnswersForQuestionSession && Boolean.TRUE.equals(!syncStatusMap.getOrDefault(key, false))) {
            try {
                sessionAnswerQuestionResponseList = answersPersistent.getSessionAnswersQuestion(presentationId, questionId);
                sessionAnswerQuestionResponseList.forEach(answersInMem::addSessionAnswerQuestionToMem);
                syncStatusMap.put(key, true);
            } catch (Exception e) {
                return new ArrayList<>();
            }
        }
        return sessionAnswerQuestionResponseList;
    }

    private String generateKey(int presentationId, int questionId) {
        return presentationId + "_" + questionId;
    }

    public void setSessionAnswerQuestion(int userId, int presentationId, int questionId, String answer) {
        try {
            answersPersistent.setSessionAnswerQuestion(userId, presentationId, questionId, answer);
            answersPersistent.getSessionAnswersQuestion(presentationId, questionId).forEach(answersInMem::addSessionAnswerQuestionToMem);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
