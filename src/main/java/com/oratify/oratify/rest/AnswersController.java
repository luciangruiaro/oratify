package com.oratify.oratify.rest;

import com.oratify.oratify.model.answers.SessionAnswerQuestionResponse;
import com.oratify.oratify.model.answers.SessionAnswerRequest;
import com.oratify.oratify.helper.SuccessResponse;
import com.oratify.oratify.service.AnswersService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AnswersController {
    private static final Logger logger = LoggerFactory.getLogger(AnswersController.class);
    private final AnswersService answersService;

    @Autowired
    public AnswersController(AnswersService answersService) {
        this.answersService = answersService;
    }

    @GetMapping("/answers_question")
    public ResponseEntity getAnswersQuestion(@RequestParam int presentation_id, @RequestParam int question_id) {
        logger.info("GET /answers_question, presentation_id: {}, question_id: {}", presentation_id, question_id);
        List<SessionAnswerQuestionResponse> sessionAnswerQuestionResponseList;
        try {
            sessionAnswerQuestionResponseList = answersService.getSessionAnswersQuestion(presentation_id, question_id);
        } catch (Exception e) {
            logger.error("GET /answers_question, presentation_id: {}, question_id: {}, error: {}", presentation_id, question_id, e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(sessionAnswerQuestionResponseList);
    }

    @PostMapping("/answer")
    public ResponseEntity setAnswer(@RequestBody SessionAnswerRequest sessionAnswerRequest) {
        logger.info("POST /answer, sessionAnswerRequest: {}", sessionAnswerRequest);
        try {
            answersService.setSessionAnswerQuestion(sessionAnswerRequest.getUser_id(), sessionAnswerRequest.getPresentation_id(), sessionAnswerRequest.getQuestion_id(), sessionAnswerRequest.getAnswer());
        } catch (Exception e) {
            logger.error("POST /answer, sessionAnswerRequest: {}, error: {}", sessionAnswerRequest, e.getMessage());
            return ResponseEntity.badRequest().body(new SuccessResponse(false));
        }
        return ResponseEntity.ok(new SuccessResponse(true));
    }
}
