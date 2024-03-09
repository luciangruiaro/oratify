<template>
  <SpeakerHeader/>
  <AnswerChart/>
  <SpeakerFooter/>
</template>


<script>
import SpeakerHeader from '../components/SpeakerHeader.vue';
import AnswerChart from '../components/AnswerChart.vue';
import SpeakerFooter from '../components/SpeakerFooter.vue';

export default {
  components: {
    SpeakerHeader,
    AnswerChart,
    SpeakerFooter
  }
};
</script>

<style scoped>

</style>