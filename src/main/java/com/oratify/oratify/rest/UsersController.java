package com.oratify.oratify.rest;

import com.oratify.oratify.model.user.SessionsUsersResponse;
import com.oratify.oratify.model.user.UserJoinRequest;
import com.oratify.oratify.model.user.UserJoinResponse;
import com.oratify.oratify.service.UsersService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UsersController {

    private static final Logger logger = LoggerFactory.getLogger(UsersController.class);
    private final UsersService usersService;


    @Autowired
    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @GetMapping("/sessions_users")
    public ResponseEntity getSessionsUsers(@RequestParam int presentation_id) {
        logger.info("GET /sessions_users, presentation_id: {}", presentation_id);
        List<SessionsUsersResponse> sessionsUsersList;
        try {
            sessionsUsersList = usersService.getSessionUsers(presentation_id);
        } catch (Exception e) {
            logger.error("GET /sessions_users, presentation_id: {}, error: {}", presentation_id, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok(sessionsUsersList);
    }

    @PostMapping("/user_join")
    public ResponseEntity userJoin(@RequestBody UserJoinRequest userJoinRequest) {
        logger.info("POST /user_join, userJoinRequest: {}", userJoinRequest);
        UserJoinResponse userJoinResponse;
        try {
            userJoinResponse = usersService.userJoin(userJoinRequest.getPresentation_code(), userJoinRequest.getFirst_name(), userJoinRequest.getLast_name());
        } catch (Exception e) {
            logger.error("POST /user_join, userJoinRequest: {}, error: {}", userJoinRequest, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok(userJoinResponse);
    }
}
