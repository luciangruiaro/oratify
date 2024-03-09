<template>
  <Header/>
  <Content :question="store.currentQuestion"/>
  <Footer :question="store.currentQuestion"/>
</template>

<script>
import Header from '../components/Header.vue';
import Content from '../components/Content.vue';
import Footer from '../components/Footer.vue';
import {store} from "../store/store.js";

export default {
  data() {
    return {
      store
    };
  },
  components: {
    Header,
    Content,
    Footer
  }
};
</script>

<style>
/* Add any additional global styles if needed */
</style>
