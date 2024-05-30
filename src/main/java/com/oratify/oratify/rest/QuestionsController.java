package com.oratify.oratify.rest;

import com.oratify.oratify.model.questions.SessionQuestionCurrResponse;
import com.oratify.oratify.model.questions.SessionQuestionCurrSetRequest;
import com.oratify.oratify.helper.SuccessResponse;
import com.oratify.oratify.service.QuestionsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class QuestionsController {

    private static final Logger logger = LoggerFactory.getLogger(SessionController.class);
    private final QuestionsService questionsService;

    @Autowired
    public QuestionsController(QuestionsService questionsService) {
        this.questionsService = questionsService;
    }

    @GetMapping("/session_question_curr")
    public ResponseEntity getSessionCurrentQuestion(@RequestParam int presentation_id) {
        logger.info("GET /session_question_curr, presentation_id: {}", presentation_id);
        SessionQuestionCurrResponse sessionQuestionCurrResponse;
        try {
            sessionQuestionCurrResponse = questionsService.getSessionCurrentQuestion(presentation_id);
            logger.info("GET /session_question_curr, sessionQuestionCurrResponse: {}", sessionQuestionCurrResponse);
        } catch (Exception e) {
            logger.error("GET /session_question_curr, presentation_id: {}, error: {}", presentation_id, e.getMessage());
            return ResponseEntity.badRequest().body(new SuccessResponse(false));
        }
        return ResponseEntity.ok(sessionQuestionCurrResponse);
    }

    @PostMapping("/session_question_set")
    public ResponseEntity setSessionQuestion(@RequestBody SessionQuestionCurrSetRequest sessionQuestionCurrSetRequest) {
        logger.info("POST /session_question_set, sessionQuestionCurrSetRequest: {}", sessionQuestionCurrSetRequest);
        try {
            questionsService.setSessionQuestion(sessionQuestionCurrSetRequest.getPresentation_id(), sessionQuestionCurrSetRequest.getCurr_question_id());
        } catch (Exception e) {
            logger.error("POST /session_question_set, sessionQuestionCurrSetRequest: {}, error: {}", sessionQuestionCurrSetRequest, e.getMessage());
            return ResponseEntity.badRequest().body(new SuccessResponse(false));
        }
        return ResponseEntity.ok(new SuccessResponse(true));
    }
}
