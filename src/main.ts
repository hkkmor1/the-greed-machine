import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useGreedStore } from './stores/greedStore';
import { useToastStore } from './stores/toastStore';
import './style.css';

const app = createApp(App);
app.use(createPinia());
app.use(router); 

router.beforeEach((to) => {
  const requiresAuth = to.meta?.requiresAuth;
  const greedStore = useGreedStore();
  const toastStore = useToastStore();
  
  if (requiresAuth && !greedStore.activeSessionId) {
    toastStore.addToast('Спочатку оберіть сесію!', 'error');
    return { name: '/' };
  }
  return true;
});

app.mount('#app');