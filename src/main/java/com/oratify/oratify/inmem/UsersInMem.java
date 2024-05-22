package com.oratify.oratify.inmem;

import com.oratify.oratify.model.user.SessionsUsersResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UsersInMem {
    private static final Logger logger = LoggerFactory.getLogger(UsersInMem.class);

    private final List<SessionsUsersResponse> sessionsUsersResponseList = new ArrayList<>();

    public List<SessionsUsersResponse> getSessionsUsersFromMem(int presentationId) {
        logger.info("getSessionsUsersFromMem, presentationId: {}", presentationId);
        return sessionsUsersResponseList.stream().filter(response -> response.getPresentation_id() == presentationId).toList();
    }

    public void addSessionsUsersToMem(SessionsUsersResponse sessionsUsersResponse) {
        logger.info("addSessionsUsersToMem, sessionsUsersResponse: {}", sessionsUsersResponse);
        boolean exists = sessionsUsersResponseList.stream().anyMatch(entry -> entry.getPresentation_id() == sessionsUsersResponse.getPresentation_id() && entry.getUser_id() == sessionsUsersResponse.getUser_id());
        if (!exists) {
            sessionsUsersResponseList.add(sessionsUsersResponse);
            logger.info("Added new entry with presentation_id: {} and user_id: {}", sessionsUsersResponse.getPresentation_id(), sessionsUsersResponse.getUser_id());
            //        }
            //        else {
            //            logger.info("Skipped adding entry as it already exists with presentation_id: {} and user_id: {}", sessionsUsersResponse.getPresentation_id(), sessionsUsersResponse.getUser_id());
        }
    }
}
