package com.oratify.oratify.inmem;

import com.oratify.oratify.model.session.SessionAnswerQuestionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AnswersInMem {
    private static final Logger logger = LoggerFactory.getLogger(AnswersInMem.class);

    private final List<SessionAnswerQuestionResponse> sessionAnswerQuestionResponseList = new ArrayList<>();

    public List<SessionAnswerQuestionResponse> getSessionAnswersQuestionFromMem(int presentationId, int questionId) {
        logger.info("getSessionAnswersQuestionFromMem, presentationId: {}, questionId: {}", presentationId, questionId);
        return sessionAnswerQuestionResponseList.stream()
                .filter(response -> response.getPresentation_id().equals(Long.valueOf(presentationId)) &&
                        response.getQuestion_id().equals(Long.valueOf(questionId)))
                .collect(Collectors.toList());
    }

    public void addSessionAnswerQuestionToMem(SessionAnswerQuestionResponse sessionAnswerQuestionResponse) {
        logger.info("addSessionAnswersQuestionToMem, sessionAnswerQuestionResponse: {}", sessionAnswerQuestionResponse);

        Optional<SessionAnswerQuestionResponse> existingEntry = sessionAnswerQuestionResponseList.stream()
                .filter(entry -> entry.getPresentation_id().equals(sessionAnswerQuestionResponse.getPresentation_id()) &&
                        entry.getQuestion_id().equals(sessionAnswerQuestionResponse.getQuestion_id()) &&
                        entry.getUser_id().equals(sessionAnswerQuestionResponse.getUser_id()))
                .findFirst();

        if (existingEntry.isPresent()) {
            sessionAnswerQuestionResponseList.remove(existingEntry.get());
            logger.info("Replaced existing entry with presentation_id: {}, question_id: {}, and user_id: {}",
                    sessionAnswerQuestionResponse.getPresentation_id(),
                    sessionAnswerQuestionResponse.getQuestion_id(),
                    sessionAnswerQuestionResponse.getUser_id());
        } else {
            logger.info("Added new entry with presentation_id: {}, question_id: {}, and user_id: {}",
                    sessionAnswerQuestionResponse.getPresentation_id(),
                    sessionAnswerQuestionResponse.getQuestion_id(),
                    sessionAnswerQuestionResponse.getUser_id());
        }

        sessionAnswerQuestionResponseList.add(sessionAnswerQuestionResponse);
    }
}
