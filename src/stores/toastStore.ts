import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastMessage[]>([]);
  const counter = ref(0);

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  const addToast = (message: string, type: 'success' | 'error' = 'error') => {
    const id = ++counter.value;
    toasts.value.push({ id, message, type });
    window.setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  return { toasts, addToast, removeToast };
});