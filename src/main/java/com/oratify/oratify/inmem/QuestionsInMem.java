package com.oratify.oratify.inmem;

import com.oratify.oratify.model.questions.SessionQuestionCurrResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuestionsInMem {

    private static final Logger logger = LoggerFactory.getLogger(QuestionsInMem.class);

    private final List<SessionQuestionCurrResponse> sessionQuestionCurrResponseList = new ArrayList<>();

    public SessionQuestionCurrResponse getSessionCurrentQuestionFromMem(int presentationId) {
        logger.info("getSessionCurrentQuestionFromMem, presentationId: {}", presentationId);
        return sessionQuestionCurrResponseList.stream().filter(response -> response.getPresentation_id().equals(Long.valueOf(presentationId))).findFirst().orElse(null);
    }

    public synchronized void addSessionCurrentQuestionToMem(SessionQuestionCurrResponse sessionQuestionCurrResponse) {
        logger.info("addSessionCurrentQuestionToMem, sessionQuestionCurrResponse: {}", sessionQuestionCurrResponse);

        Optional<SessionQuestionCurrResponse> existingEntry = sessionQuestionCurrResponseList.stream().filter(entry -> entry.getPresentation_id().equals(sessionQuestionCurrResponse.getPresentation_id())).findFirst();

        if (existingEntry.isPresent()) {
            sessionQuestionCurrResponseList.remove(existingEntry.get());
            logger.info("Replaced existing entry with presentation_id: {}", sessionQuestionCurrResponse.getPresentation_id());
        } else {
            logger.info("Added new entry with presentation_id: {}", sessionQuestionCurrResponse.getPresentation_id());
        }

        sessionQuestionCurrResponseList.add(sessionQuestionCurrResponse);
    }

}
