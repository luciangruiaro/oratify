// store.js
import {reactive} from 'vue';

export const store = reactive({
    currentQuestion: {
        id: null,
        question: '',
        priority: 0,
        // other properties
    },
    updateCurrentQuestion(data) {
        this.currentQuestion = {...data};
    },
    answerCount: 0,
    updateAnswerCount(count) {
        this.answerCount = count;
    },
    participantsCount: 0,
    updateParticipantsCount(count) {
        this.participantsCount = count;
    },
    answers: [],
    updateAnswers(data) {
        this.answers = data;
    },
    participants: [],
    updateParticipants(data) {
        this.participants = data;
    },
    userCount: 0, // Add this line for user count
    updateUserCount(count) { // Method to update user count
        this.userCount = count;
    },
    presentationTime: 0,
    updatePresentationTime(time) {
        this.presentationTime = time;
    }
});
