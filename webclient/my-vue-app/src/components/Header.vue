<template>
  <div class="header">
    <div class="timer">
      <!-- Input field and play button shown when isStarted is false -->

      <!-- Countdown shown when isStarted is true -->
      <vue-countdown
          ref="countdown"
          :key="countdownKey"
          :time="time * 1000"
          :auto-start="isStarted"
          v-slot="{ days, hours, minutes, seconds }"
      >
        <span v-if="hours > 0">{{ formatNumber(hours) }}:</span>{{ formatNumber(minutes) }}:{{ formatNumber(seconds) }}
      </vue-countdown>
    </div>
    <div class="active-users">
      <span class="user-count">{{ store.userCount }}</span>
      <span class="pi pi-users"></span>
    </div>
  </div>
</template>

<script>
import VueCountdown from '@chenfengyuan/vue-countdown';
import {store} from "../store/store.js";
import InputText from 'primevue/inputtext';



export default {
  data() {
    return {
      initialMinutes: 50, // Default initial minutes
      initialSeconds: 0,  // Default initial seconds
      time: 0,
      isStarted: false, // Initially false
      countdownKey: 0,
    };
  },
  computed: {
    store() {
      return store;
    }
  },
  mounted() {
    // Initialize with the value from the store
    this.initializeCountdown();
  },
  methods: {
    initializeCountdown() {
      this.time = store.presentationTime;
      this.isStarted = this.time > 0;
      if (this.isStarted) {
        this.countdownKey += 1;
      }
    },
    startPresentation() {
      const duration = this.initialMinutes * 60; // Convert minutes to seconds
      this.$root.startPresentation(duration);
      this.isStarted = true;
    },
    formatNumber(value) {
      return value.toString().padStart(2, '0');
    }
  },
  watch: {
    'store.presentationTime': function (newTime) {
      this.time = newTime;
      this.isStarted = newTime > 0;
      if (this.isStarted) {
        this.countdownKey += 1; // Trigger re-render of countdown
      }
    }
  },
  components: {
    VueCountdown,
    InputText
  }
};
</script>

<style scoped>
.header {
  background-color: var(--background-color);
  height: 50px;
  border-bottom: 1px solid white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
}

.timer {
  color: var(--primary-color);
  font-size: 2em;
  display: flex;
  align-items: center;
}

.timer button {
  margin-left: 10px;
  background: var(--primary-color);
  border: none;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
}

.active-users {
  color: var(--primary-color);
  display: flex;
  align-items: center;
  font-size: 1.5em;
}

.user-count {
  margin-right: 10px;
}

.minute-input {
  width: 90px; /* Adjust as necessary */
}
</style>
