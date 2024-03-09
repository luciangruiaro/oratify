<template>
  <div class="footer">
    <div class="answers">
      Question: {{ store.currentQuestion.priority }} => Answers: {{ store.answerCount }}
    </div>
    <div class="navigation-arrows">
      <Button icon="pi pi-arrow-left" @click="changeQuestion('decrement')"/>
      <Button icon="pi pi-arrow-right" @click="changeQuestion('increment')"/>
    </div>
  </div>
</template>

<script>
import {store} from '../store/store.js'; // Correct path to your store.js
import axios from 'axios';
import Button from 'primevue/button';

export default {
  components: {
    Button
  },
  computed: {
    store() {
      return store;
    },
  },
  methods: {
    async changeQuestion(action) {
      const currentId = store.currentQuestion.id;
      const newId = action === 'increment' ? currentId + 1 : currentId - 1;

      try {
        await axios.post('/session_question_set', {
          presentation_id: store.currentQuestion.presentation_id,
          curr_question_id: newId
        });

        this.$emit('questionChanged');
      } catch (error) {
        console.error('Error changing question:', error);
      }
    }
  }
};
</script>

<style scoped>
.footer {
  background-color: var(--background-color);
  height: 50px;
  border-top: 1px solid white;
  display: flex;
  align-items: center;
  //justify-content: center;
  padding: 25px;
}

.navigation-arrows {
  position: absolute;
  bottom: 2px;
  right: 10px;
  display: flex;
  gap: 10px;
}

.answers {
  color: var(--primary-color);
  font-size: 1em;
}
</style>
