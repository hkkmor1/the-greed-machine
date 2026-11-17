<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { definePage } from 'unplugin-vue-router/runtime';
import { RoutesNamedMap } from '../router-map';
import { useSessions } from '../composables/useSessions';
import { greedService, type Character } from '../services/greedService';

definePage({
  meta: { requiresAuth: false },
});

const router = useRouter();
const { createNewSession, connectSession, sessions, isLoading } = useSessions();

const characters = ref<Character[]>([]);
const selectedCharacterId = ref<string>('');
const manualSessionId = ref<string>('');
const isConnecting = ref(false);

onMounted(async () => {
  try {
    characters.value = await greedService.getCharacters();
    if (characters.value.length > 0) {
      selectedCharacterId.value = characters.value[0]?.id || '';
    }
  } catch (e) {
    console.error('Помилка завантаження персонажів');
  }
});

const handleStartRun = async () => {
  const char = characters.value.find((c) => c.id === selectedCharacterId.value);
  const charName = char ? char.name : 'Unknown';
  try {
    const sessionId = await createNewSession(selectedCharacterId.value, charName);
    // @ts-ignore - ігноруємо баг типізації unplugin-vue-router
    router.push({ name: RoutesNamedMap.SESSION, params: { id: sessionId } });
  } catch (e) {
    console.error(e);
  }
};

const handleConnect = async () => {
  if (!manualSessionId.value) return;
  isConnecting.value = true;
  const success = await connectSession(manualSessionId.value);
  isConnecting.value = false;
  if (success) {
    router.push({ name: RoutesNamedMap.SESSION, params: { id: manualSessionId.value } });
  }
};

const selectExistingSession = (id: string) => {
  connectSession(id);
  router.push({ name: RoutesNamedMap.SESSION, params: { id } });
};
</script>

<template>
  <div class="min-h-screen bg-base-100 p-8 flex flex-col items-center justify-center">
    <div class="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
    
      <div class="card bg-base-200 p-6 shadow-xl">
        <h2 class="text-xl font-bold mb-4 text-primary">Новий забіг</h2>
        <div class="form-control mb-4">
          <label class="label"><span class="label-text">Оберіть персонажа</span></label>
          <select v-model="selectedCharacterId" class="select select-bordered w-full">
            <option v-for="char in characters" :key="char.id" :value="char.id">
              {{ char.name }} (Удача: {{ char.luck }})
            </option>
          </select>
        </div>
        <button @click="handleStartRun" :disabled="isLoading" class="btn btn-primary w-full">Почати</button>
        
        <div class="divider my-6">АБО ПІДКЛЮЧИТИСЯ</div>
        
        <div class="form-control">
          <label class="label"><span class="label-text">ID існуючої сесії</span></label>
          <div class="join w-full">
            <input v-model="manualSessionId" type="text" placeholder="greed_..." class="input input-bordered join-item w-full" />
            <button @click="handleConnect" :disabled="isConnecting || isLoading" class="btn btn-secondary join-item">Підключити</button>
          </div>
        </div>
      </div>

      <div class="card bg-base-200 p-6 shadow-xl">
        <h2 class="text-xl font-bold mb-4 text-secondary">Збережені сесії</h2>
        <div v-if="sessions.length === 0" class="text-base-content/60 py-8 text-center">
          Немає збережених забігів.
        </div>
        <TransitionGroup v-else name="list" tag="div" class="space-y-3 max-h-72 overflow-y-auto">
          <div v-for="sess in sessions" :key="sess.id" class="flex items-center justify-between p-3 bg-base-100 rounded-box border border-base-300">
            <div>
              <div class="font-bold text-sm">{{ sess.name }}</div>
              <div class="text-xs text-base-content/60">{{ sess.characterName }}</div>
            </div>
            <button @click="selectExistingSession(sess.id)" :disabled="isLoading" class="btn btn-sm btn-outline btn-primary">Відновити</button>
          </div>
        </TransitionGroup>
      </div>
      
    </div>
  </div>
</template>