<template>
  <div class="answers">
    <h1 class="question-title">{{ store.currentQuestion.question }}</h1>

    <!-- Display bar chart for multiple-choice questions -->
    <div v-if="isMultipleChoice" class="card">
      <Chart type="bar" :data="chartData" :options="chartOptions" />
    </div>

    <!-- Display list of answers for input type questions with target 'answer' -->
    <div v-if="isInputTypeWithTargetAnswer" class="answer-list">
      <ul>
        <li v-for="answer in store.answers" :key="answer.id">
          {{ answer.answer }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch} from "vue";
import {store} from '../store/store.js'; // Adjust the path as needed
import Chart from 'primevue/chart';

const isMultipleChoice = computed(() => store.currentQuestion.type === 'multiple-choice');
const isInputTypeWithTargetAnswer = computed(() => store.currentQuestion.type === 'input' && store.currentQuestion.target === 'answer');

const chartData = ref();
const chartOptions = ref();

watch(() => store.answers, (newAnswers) => {
  if (isMultipleChoice.value) {
    chartData.value = setChartData(newAnswers);
    chartOptions.value = setChartOptions();
  }
}, {immediate: true});

const setChartData = (answers) => {
  if (!answers || !answers.length) return;

  const answerCounts = answers.reduce((acc, answer) => {
    acc[answer.answer] = (acc[answer.answer] || 0) + 1;
    return acc;
  }, {});

  return {
    labels: Object.keys(answerCounts),
    datasets: [
      {
        label: 'Answer Counts',
        data: Object.values(answerCounts),
        backgroundColor: ['#f97316', '#06b6d4', '#6b7280', '#8b5cf6'], // Example colors
        borderColor: ['#f97316', '#06b6d4', '#6b7280', '#8b5cf6'], // Example border colors
        borderWidth: 0.5
      }
    ]
  };
};

const setChartOptions = () => {
  return {
    plugins: {
      legend: {
        labels: {
          color: 'black' // Adjust as needed
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'grey' // Adjust as needed
        },
        grid: {
          color: '#ccc' // Adjust as needed
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: 'grey' // Adjust as needed
        },
        grid: {
          color: '#ccc' // Adjust as needed
        }
      }
    }
  };
}
</script>

<style scoped>
.answers {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

.question-title {
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 20px;
}

.card {
  width: 100%;
  max-width: 1200px;
}

.answer-list ul {
  list-style: none;
  padding: 0;
}

.answer-list li {
  background-color: var(--secondary-color);
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
}
</style>

