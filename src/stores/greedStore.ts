import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface StoredSession {
  id: string;
  name: string;
  characterName: string;
}

export const useGreedStore = defineStore('greed', () => {
  const activeSessionId = ref<string>(localStorage.getItem('activeSessionId') || '');
  const sessions = ref<StoredSession[]>(
    JSON.parse(localStorage.getItem('greedSessions') || '[]')
  );

  const setActiveSession = (id: string) => {
    activeSessionId.value = id;
    localStorage.setItem('activeSessionId', id);
  };

  const addSession = (session: StoredSession) => {
    if (!sessions.value.some((s) => s.id === session.id)) {
      sessions.value.push(session);
      localStorage.setItem('greedSessions', JSON.stringify(sessions.value));
    }
  };

  const removeSession = (id: string) => {
    sessions.value = sessions.value.filter((s) => s.id !== id);
    localStorage.setItem('greedSessions', JSON.stringify(sessions.value));
    if (activeSessionId.value === id) {
      activeSessionId.value = '';
      localStorage.removeItem('activeSessionId');
    }
  };

  return { activeSessionId, sessions, setActiveSession, addSession, removeSession };
});