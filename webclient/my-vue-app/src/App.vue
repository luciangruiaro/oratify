<template>
  <div class="app-container">
    <router-view/>
    <Footer @questionChanged="fetchData"/>
  </div>
</template>

<script>
import {store} from './store/store.js'; // Adjust the path as needed
import axios from 'axios';

export default {
  data() {
    const presentationId = localStorage.getItem('presentationId');
    const userId = localStorage.getItem('userId');
    console.log('presentationId:', presentationId); // Log the retrieved values
    console.log('userId:', userId);
    return {
      presentationId,
      userId
    };
  },
  mounted() {
    if (this.presentationId) {
      this.fetchData();
      this.fetchRemainingTime();
      this.interval = setInterval(this.fetchData, 3000);
    } else {
      console.error('Presentation ID is null');
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    async fetchData() {
      await this.fetchQuestionData();
      await this.fetchAnswers();
      await this.fetchParticipants();
      await this.fetchUserData();
    },
    async fetchQuestionData() {
      try {
        const response = await axios.get(`/session_question_curr?presentation_id=${this.presentationId}`);
        store.updateCurrentQuestion(response.data);
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    },
    async fetchAnswers() {
      try {
        const questionId = store.currentQuestion.id;
        const response = await axios.get(`/answers_question?presentation_id=${this.presentationId}&question_id=${questionId}`);
        store.updateAnswerCount(response.data.length); // Assuming response data is an array

        if (JSON.stringify(store.answers) !== JSON.stringify(response.data)) {
          store.updateAnswers(response.data);
        }
      } catch (error) {
        console.error('Error fetching answer count:', error);
      }
    },
    async fetchParticipants() {
      try {
        const questionId = 1; // This should be the ID of the question used for joining
        const response = await axios.get(`/answers_question?presentation_id=${this.presentationId}&question_id=${questionId}`);
        if (JSON.stringify(store.participants) !== JSON.stringify(response.data)) {
          store.updateParticipants(response.data);
        }
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    },
    async fetchUserData() {
      try {
        const response = await axios.get(`/sessions_users?presentation_id=${this.presentationId}`);
        store.updateUserCount(response.data.length); // Update the user count
        // store.updateParticipants(response.data); // Update the participants (if needed
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async startPresentation(duration) {
      try {
        await axios.post('/presentation_play', {
          presentation_id: this.presentationId,
          duration
        });
        await this.fetchRemainingTime(); // Fetch the new remaining time
      } catch (error) {
        console.error('Error starting presentation:', error);
      }
    },
    async fetchRemainingTime() {
      try {
        const response = await axios.get(`/presentation_remaining_time?presentation_id=${this.presentationId}`);
        store.updatePresentationTime(response.data.remaining_seconds);
      } catch (error) {
        console.error('Error fetching remaining time:', error);
      }
    },
  },
};
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full viewport height */
}

.content {
  flex-grow: 1; /* Ensures content takes the available space */
  padding-bottom: 100px; /* Space for the footer */
}
</style>
