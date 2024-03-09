import {createRouter, createWebHistory} from 'vue-router';
import UserScreen from '../views/UserScreen.vue';
import SpeakerScreen from '../views/SpeakerScreen.vue';
import JoinScreen from '../views/JoinScreen.vue';


const routes = [
    {
        path: '/join',
        name: 'JoinScreen',
        component: JoinScreen
    },
    {
        path: '/user',
        name: 'UserScreen',
        component: UserScreen
    },
    {
        path: '/speaker',
        name: 'SpeakerScreen',
        component: SpeakerScreen
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


export default router;
