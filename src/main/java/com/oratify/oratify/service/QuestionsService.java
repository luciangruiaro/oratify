package com.oratify.oratify.service;

import com.oratify.oratify.inmem.QuestionsInMem;
import com.oratify.oratify.llm.CB;
import com.oratify.oratify.model.questions.SessionQuestionCurrResponse;
import com.oratify.oratify.persistency.QuestionsPersistent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuestionsService {

    public static final String SLIDE = "slide";
    private static final Logger logger = LoggerFactory.getLogger(QuestionsService.class);
    private final QuestionsPersistent questionsPersistent;
    private final QuestionsInMem questionsInMem;
    private final CB cb;


    @Autowired
    public QuestionsService(QuestionsPersistent questionsPersistent, QuestionsInMem questionsInMem, CB cb) {
        this.questionsPersistent = questionsPersistent;
        this.questionsInMem = questionsInMem;
        this.cb = cb;
    }

    public SessionQuestionCurrResponse getSessionCurrentQuestion(int presentationId) {
        SessionQuestionCurrResponse sessionQuestionCurrResponse = questionsInMem.getSessionCurrentQuestionFromMem(presentationId);
        if (sessionQuestionCurrResponse == null) {
            questionsInMem.addSessionCurrentQuestionToMem(questionsPersistent.getSessionCurrentQuestionFromPersistent(presentationId));
        }
        sessionQuestionCurrResponse = questionsInMem.getSessionCurrentQuestionFromMem(presentationId);
        if (SLIDE.equals(sessionQuestionCurrResponse.getType()) && sessionQuestionCurrResponse.getSlideText() == null) {
            sessionQuestionCurrResponse.setSlideText(cb.analyzeWithAI(sessionQuestionCurrResponse.getTarget()));
        }
        return sessionQuestionCurrResponse;
    }

    public void setSessionQuestion(int presentationId, int currQuestionId) {
        try {
            questionsPersistent.setSessionQuestion(presentationId, currQuestionId);
            questionsInMem.addSessionCurrentQuestionToMem(questionsPersistent.getSessionCurrentQuestionFromPersistent(presentationId));
        } catch (Exception e) {
            logger.error("setSessionQuestion, presentationId: {}, currQuestionId: {}, error: {}", presentationId, currQuestionId, e.getMessage());
            throw new RuntimeException(e);
        }

    }
}