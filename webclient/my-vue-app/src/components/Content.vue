<template>
  <div class="content">
    <h1 class="question-title">{{ store.currentQuestion.question }}</h1>
    <div v-if="store.currentQuestion.type === 'multiple-choice'">
      <div v-for="(option, index) in optionsArray" :key="index" class="flex align-items-center">
        <Checkbox v-model="checkboxAnswers" :value="option"/>
        <span>{{ option }}</span>
      </div>
    </div>
    <Calendar v-else-if="store.currentQuestion.target === 'user:birth_date'" v-model="calendarAnswer"/>
    <InputText v-else-if="store.currentQuestion.target === 'user:email'" v-model="inputAnswer" type="email"/>
    <div v-else-if="store.currentQuestion.type === 'input' && store.currentQuestion.target === 'answer'">
      <div v-if="!submitted">
        <InputText v-model="inputAnswer" maxlength="200" class="wide-input"/>
        <p class="char-counter">{{ remainingChars }} characters remaining</p>
      </div>
    </div>
    <div v-else-if="store.currentQuestion.type === 'slide'">
      <p class="slide-message">Content is being shared on the speaker's screen.</p>
    </div>
    <Button v-if="!submitted && store.currentQuestion.type !== 'title' && store.currentQuestion.type !== 'slide' && store.currentQuestion.target !== 'join'"
            class="submit-button" label="Submit"
            @click="submitAnswer"/>
    <p v-if="submitted" class="success-message">Answer submitted successfully!</p>
    <p v-if="submitted && generation && store.currentQuestion.type === 'input' && store.currentQuestion.target === 'answer'"
       class="generation-message">{{ generation }}</p>
  </div>
</template>


<script>
import {store} from '../store/store.js';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Calendar from "primevue/calendar";
import axios from 'axios';
import {watch} from 'vue';

export default {
  components: {InputText, Checkbox, Button, Calendar},
  data() {
    return {
      inputAnswer: '',
      calendarAnswer: '',
      checkboxAnswers: [],
      submitted: false,
      presentationId: localStorage.getItem('presentationId'),
      userId: localStorage.getItem('userId'),
      generation: null  // Added state for generation
    };
  },
  mounted() {
    watch(() => this.store.currentQuestion.id, () => {
      this.resetForm();
    });
  },
  computed: {
    store() {
      return store;
    },
    optionsArray() {
      return this.store.currentQuestion.options ? this.store.currentQuestion.options.split('|') : [];
    },
    isEmailValid() {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(this.inputAnswer);
    },
    remainingChars() {
      return 200 - this.inputAnswer.length;
    }
  },
  methods: {
    resetForm() {
      this.submitted = false;
      this.inputAnswer = '';
      this.calendarAnswer = '';
      this.checkboxAnswers = [];
      this.generation = null;  // Reset generation field
    },
    async submitAnswer() {
      if (this.store.currentQuestion.target === 'user:email' && !this.isEmailValid) {
        alert("Please enter a valid email address");
        return;
      }
      const answer = this.determineAnswer();
      try {
        const response = await axios.post('/answer', {
          user_id: this.userId, // Replace with actual user ID
          presentation_id: this.presentationId,
          question_id: this.store.currentQuestion.id,
          answer: answer
        });
        this.submitted = true;
        this.generation = response.data.generation || null;  // Set generation field
      } catch (error) {
        console.error('Error submitting answer:', error);
      }
    },
    determineAnswer() {
      if (this.store.currentQuestion.target === 'user:birth_date') {
        return this.formatDate(this.calendarAnswer);
      }
      if (this.store.currentQuestion.type === 'multiple-choice') {
        return this.checkboxAnswers.join(', ');
      }
      return this.inputAnswer;
    },
    formatDate(date) {
      if (!date) return '';

      const d = new Date(date);
      const year = d.getFullYear();
      const month = `${d.getMonth() + 1}`.padStart(2, '0');
      const day = `${d.getDate()}`.padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
  }
};
</script>


<style scoped>

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

.success-message {
  color: var(--primary-color) !important;
  margin-top: 20px;
}

.generation-message { /* New style for generation message */
  color: var(--primary-color);
  margin-top: 10px;
  width: 80%;
}

.slide-message { /* New style for slide message */
  color: #595959;
  margin-top: 20px;
  font-size: 1.2em;
  text-align: center;
}

.content .question-title {
  color: var(--primary-color) !important;
  text-align: center;
  margin-bottom: 20px;
}

.submit-button {
  margin-top: 30px;
}

.char-counter {
  color: #6450ff;
  margin-top: 5px;
  font-size: 0.9em;
}

.wide-input {
  width: 100%;
  max-width: 600px;
  margin-top: 10px;
}
</style>

