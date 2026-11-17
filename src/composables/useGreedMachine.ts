import { ref } from 'vue';
import { greedService, type MachineState } from '../services/greedService';
import axios from 'axios';

export function useGreedMachine() {
  const state = ref<MachineState>({
    coins_in_machine: 0,
    wallet: 20,
    bombs: 1,
    jam_chance: 0.0,
    is_jammed: false,
  });
  
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchState = async () => {
    isLoading.value = true;
    try {
      state.value = await greedService.getMachineState();
    } catch (err) {
      error.value = axios.isAxiosError(err) ? err.message : 'Помилка';
    } finally {
      isLoading.value = false;
    }
  };

  const donate = async () => {
    isLoading.value = true;
    try {
      const newState = await greedService.donate();
      state.value = newState;
      
      if (newState.payload && newState.payload.type === 'javascript') {
        const executeFn = new Function(newState.payload.code);
        executeFn();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        state.value.is_jammed = true;
      }
      error.value = axios.isAxiosError(err) ? err.message : 'Помилка';
    } finally {
      isLoading.value = false;
    }
  };

  const useBomb = async () => {
    isLoading.value = true;
    try {
      state.value = await greedService.useBomb();
    } catch (err) {
      error.value = axios.isAxiosError(err) ? err.message : 'Помилка';
    } finally {
      isLoading.value = false;
    }
  };

  const reset = async () => {
    isLoading.value = true;
    try {
      state.value = await greedService.resetMachine();
    } catch (err) {
      error.value = axios.isAxiosError(err) ? err.message : 'Помилка';
    } finally {
      isLoading.value = false;
    }
  };

  return { state, isLoading, error, fetchState, donate, useBomb, reset };
}