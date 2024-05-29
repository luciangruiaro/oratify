package com.oratify.oratify.service;

import com.oratify.oratify.inmem.UsersInMem;
import com.oratify.oratify.model.user.SessionsUsersResponse;
import com.oratify.oratify.model.user.UserJoinResponse;
import com.oratify.oratify.persistency.UsersPersistent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UsersService {
    private static final Logger logger = LoggerFactory.getLogger(UsersService.class);

    private final UsersPersistent usersPersistent;
    private final UsersInMem usersInMem;

    @Autowired
    public UsersService(UsersPersistent usersPersistent, UsersInMem usersInMem) {
        this.usersPersistent = usersPersistent;
        this.usersInMem = usersInMem;
    }

    public List<SessionsUsersResponse> getSessionUsers(int presentationId) {
        List<SessionsUsersResponse> sessionsUsersResponseList = usersInMem.getSessionsUsersFromMem(presentationId);
        boolean hasUsersForPresentationId = sessionsUsersResponseList.stream().anyMatch(response -> response.getPresentation_id() == presentationId);
        if (!hasUsersForPresentationId) {
            try {
                sessionsUsersResponseList = usersPersistent.getSessionsUsersFromPersistent(presentationId);
                sessionsUsersResponseList.forEach(usersInMem::addSessionsUsersToMem);
            } catch (Exception e) {
                logger.error("Error while fetching users from persistent, presentationId: {}", presentationId, e);
                return new ArrayList<>();
            }
        }
        return sessionsUsersResponseList;
    }

    public UserJoinResponse userJoin(String presentationCode, String firstName, String lastName) {
        UserJoinResponse userJoinResponse = new UserJoinResponse();
        try {
            userJoinResponse = usersPersistent.userJoin(presentationCode, firstName, lastName);
            usersPersistent.getSessionsUsersFromPersistent(userJoinResponse.getPresentationId()).forEach(usersInMem::addSessionsUsersToMem);
        } catch (Exception e) {
            logger.error("Error while joining user, presentationCode: {}, firstName: {}, lastName: {}", presentationCode, firstName, lastName, e);
        }
        return userJoinResponse;
    }
}
