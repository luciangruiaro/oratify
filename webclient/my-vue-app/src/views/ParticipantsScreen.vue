<template>
  <SpeakerHeader/>
  <Participants/>
  <SpeakerFooter/>
</template>


<script>
import SpeakerHeader from '../components/SpeakerHeader.vue';
import Participants from '../components/Participants.vue';
import SpeakerFooter from '../components/SpeakerFooter.vue';

export default {
  components: {
    SpeakerHeader,
    Participants,
    SpeakerFooter
  }
};
</script>

<style scoped>

</style>