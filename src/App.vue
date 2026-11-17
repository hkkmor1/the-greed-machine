<script setup lang="ts">
import { computed } from 'vue';
import { useToastStore } from './stores/toastStore';

const toastStore = useToastStore();
const toasts = computed(() => toastStore.toasts);
</script>

<template>
  <RouterView />
  <div class="toast toast-end toast-bottom z-50">
    <div 
      v-for="toast in toasts" 
      :key="toast.id" 
      :class="['alert', toast.type === 'error' ? 'alert-error' : 'alert-success']"
    >
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>