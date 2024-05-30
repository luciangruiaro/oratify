<template>
  <div class="join-screen">
    <h1>Hello, nice to meet you!</h1>
    <InputText v-model="presentationCode" placeholder="Join with code" maxlength="8" class="code"/>
    <div v-if="presentationCode.length >= 4">
      <div>
        <InputText v-model="firstName" placeholder="First Name" class="name"/>
      </div>
      <div>
        <InputText v-model="lastName" placeholder="Last Name (optional)" class="name"/>
      </div>
      <div class="button">
        <Button label="Join" @click="joinPresentation" :disabled="!isJoinEnabled"/>
      </div>
    </div>
    <p v-if="errorMessage">{{ errorMessage }}</p>

  </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import axios from 'axios';
import {useRouter} from 'vue-router';

export default {
  data() {
    return {
      presentationCode: '',
      firstName: '',
      lastName: '',
      errorMessage: ''
    };
  },
  setup() {
    const router = useRouter();
    return {router};
  },
  computed: {
    isJoinEnabled() {
      return this.presentationCode.length >= 4 && this.firstName.length > 0;
    }
  },
  methods: {
    async joinPresentation() {
      if (!this.firstName) {
        this.errorMessage = "First name is required";
        return;
      }
      if (this.isJoinEnabled) {
        try {
          const response = await axios.post('/user_join', {
            presentation_code: this.presentationCode,
            first_name: this.firstName,
            last_name: this.lastName
          });
          if (response.data.presentationId && response.data.userId) {
            localStorage.setItem('presentationId', response.data.presentationId);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('redirected', 'true');
            this.router.push('/user');
          } else {
            this.errorMessage = "Invalid presentation code or user details";
          }
        } catch (error) {
          this.errorMessage = "An error occurred while joining the presentation";
          console.error(error);
        }
      }
    }
  },
  components: {
    InputText,
    Button
  }
};
</script>

<style scoped>
.join-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 10px
}

.code, .name, .button {
  margin: 5px;
  align-items: center;
}

.button {
  display: flex;
  justify-content: center;
}
</style>
