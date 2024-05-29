package com.oratify.oratify.service;

import com.oratify.oratify.inmem.AnswersInMem;
import com.oratify.oratify.model.answers.SessionAnswerQuestionResponse;
import com.oratify.oratify.persistency.AnswersPersistent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AnswersService {
    public static final String ANSWER = "answer";
    public static final String INPUT = "input";
    private static final Logger logger = LoggerFactory.getLogger(AnswersService.class);
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

    public String setSessionAnswerQuestion(int userId, int presentationId, int questionId, String answer) {
        String userTopic = "";
        try {
            answersPersistent.setSessionAnswerQuestion(userId, presentationId, questionId, answer);
            List<SessionAnswerQuestionResponse> answers = answersPersistent.getSessionAnswersQuestion(presentationId, questionId);
            if (!answers.isEmpty()) {
                String target = answers.get(0).getQuestion_target();
                String type = answers.get(0).getQuestion_type();
                if (ANSWER.equals(target) && INPUT.equals(type)) {
                    userTopic = answer;
                }
            }
            answers.forEach(answersInMem::addSessionAnswerQuestionToMem);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return userTopic;
    }
}
