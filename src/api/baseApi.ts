import axios from 'axios';
import { useGreedStore } from '../stores/greedStore';
import { useToastStore } from '../stores/toastStore';

export const baseApi = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

baseApi.interceptors.request.use(
  (config) => {
    const greedStore = useGreedStore();
    if (greedStore.activeSessionId && config.headers) {
      config.headers.set('X-Session-ID', greedStore.activeSessionId);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    let message = error.message || 'Мережева помилка';
    
    if (error.response && error.response.data) {
      if (Array.isArray(error.response.data.detail)) {
        message = error.response.data.detail.map((err: { msg: string, loc: string[] }) => `${err.msg} (${err.loc.join('.')})`).join(', ');
      } 
      else if (typeof error.response.data.detail === 'string') {
        message = error.response.data.detail;
      }
      else if (error.response.data.message) {
        message = error.response.data.message;
      }
    }
    
    const toastStore = useToastStore();
    toastStore.addToast(`Помилка [${status || 'Network'}]: ${message}`, 'error');
    return Promise.reject(error);
  }
);