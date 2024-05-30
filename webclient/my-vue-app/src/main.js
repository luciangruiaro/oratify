import {createApp} from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import router from './router';
import './assets/styles/global.css';


import 'primeicons/primeicons.css';
import 'primevue/resources/themes/lara-dark-teal/theme.css';
// import 'primevue/resources/themes/aura-light-blue/theme.css';
// import './assets/_theme.css';
// import 'primevue/resources/primevue.min.css';
import axios from "axios"; // Core styling

async function init() {
    try {
        const configResponse = await fetch('/config.json');
        const config = await configResponse.json();
        axios.defaults.baseURL = config.apiBaseUrl;

        const app = createApp(App);
        // ... any other app initialization
        app.use(router)
        app.use(PrimeVue)
        app.mount('#app');

    } catch (error) {
        console.error('Failed to load configuration:', error);
    }
}

init();