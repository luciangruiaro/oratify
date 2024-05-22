<template>
  <div class="participants">
    <h1 class="title">Participants</h1>
    <div class="grid">
      <div v-for="(participant, index) in displayedParticipants" :key="index" class="grid-item">
        {{ participant.answer }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { store } from '../store/store.js';

export default {
  setup() {
    const isJoinQuestion = computed(() => store.currentQuestion.target === 'join');
    const displayedParticipants = computed(() => {
      if (store.currentQuestion.target === 'join') {
        return store.participants;
      }
      return [];
    });

    return { displayedParticipants, isJoinQuestion };
  }
};
</script>

<style scoped>
.participants {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

.title {
  /* Same style as in AnswerChart.vue */
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Adjust as needed */
  gap: 10px; /* Adjust as needed */
  width: 100%;
}

.grid-item {
  /* Style for each grid item */
  background-color: var(--secondary-color);
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
}
</style>
