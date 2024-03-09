<template>
  <div class="footer">
    <div class="answers">
      Question: {{ store.currentQuestion.priority }} => Answers: {{ store.answerCount }}
    </div>
  </div>
</template>

<script>
import { store } from '../store/store.js'; // Correct path to your store.js

export default {
  computed: {
    store() {
      return store;
    },
  },
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

.answers {
  color: var(--primary-color);
  font-size: 1em;
}
</style>
