import { ref } from 'vue';
import { useGreedStore } from '../stores/greedStore';
import { storeToRefs } from 'pinia';
import { greedService } from '../services/greedService';
import axios from 'axios';

export function useSessions() {
  const store = useGreedStore();
  const { activeSessionId, sessions } = storeToRefs(store);
  
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const createNewSession = async (characterId: string, charName: string) => {
    isLoading.value = true;
    error.value = null;
    try {
    const data = await greedService.createSession(characterId);
    store.setActiveSession(data.session_id);

    store.addSession({
      id: data.session_id,
      name: `Забіг #${data.session_id.slice(0, 5)}`,
      characterName: charName,
    });
    return data.session_id;
  } catch (err) {
      const errMessage = axios.isAxiosError(err) ? err.message : (err instanceof Error ? err.message : 'Помилка');
      error.value = errMessage;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const connectSession = async (sessionId: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    try {
      const isValid = await greedService.verifySession(sessionId);
      if (isValid) {
        store.setActiveSession(sessionId);
        return true;
      } else {
        error.value = 'Сесію не знайдено або вона не валідна (404)';
        return false;
      }
    } catch (err) {
      error.value = 'Невалідний ID сесії';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return { activeSessionId, sessions, isLoading, error, createNewSession, connectSession, removeSession: store.removeSession };
}