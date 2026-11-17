<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { definePage } from 'unplugin-vue-router/runtime';
import { RoutesNamedMap } from '../../router-map';
import { useGreedMachine } from '../../composables/useGreedMachine';
import GreedMachine from '../../components/GreedMachine.vue';

definePage({
  meta: { requiresAuth: true },
});

const route = useRoute();
const router = useRouter();

const sessionId = computed(() => (route.params as Record<string, string>).id);

const { state, isLoading, fetchState, donate, useBomb, reset } = useGreedMachine();
const hasUnsavedActions = ref(false);

onMounted(() => {
  fetchState();
});

const hundreds = computed(() => Math.floor((state.value.coins_in_machine % 1000) / 100));
const tens = computed(() => Math.floor((state.value.coins_in_machine % 100) / 10));
const units = computed(() => state.value.coins_in_machine % 10);

async function handleDonate() {
  hasUnsavedActions.value = true;
  await donate();
}

async function handleBomb() {
  await useBomb();
  hasUnsavedActions.value = false;
}

async function handleReset() {
  await reset();
  hasUnsavedActions.value = false;
}

onBeforeRouteLeave((to, from) => {
  if (hasUnsavedActions.value && state.value.coins_in_machine > 0) {
    const answer = window.confirm('У вас є незавершені ставки у машині! Бажаєте залишити забіг?');
    if (!answer) return false;
  }
  return true;
});

function goHome() {
  router.push({ name: RoutesNamedMap.HOME });
}
</script>

<template>
  <div class="min-h-screen bg-base-100 p-8 flex flex-col items-center">
    <div class="w-full max-w-2xl flex justify-between items-center mb-6">
      <button @click="goHome" class="btn btn-sm btn-ghost">На головну</button>
      <div class="badge badge-outline">Сесія: {{ sessionId }}</div>
    </div>

    <div class="stats shadow bg-base-200 mb-8 w-full max-w-md">
      <div class="stat place-items-center">
        <div class="stat-title">Монети</div>
        <div class="stat-value text-primary">{{ state.wallet }}</div>
      </div>
      <div class="stat place-items-center">
        <div class="stat-title">Бомби</div>
        <div class="stat-value text-secondary">{{ state.bombs }}</div>
      </div>
    </div>

    <GreedMachine
  :isJammed="state.is_jammed"
  :jamChance="state.jam_chance"
>
  <span class="countdown">
    <span :style="`--value: ${hundreds};`"></span>
    </span>
      <span class="countdown">
      <span :style="`--value: ${tens};`"></span>
     </span>
     <span class="countdown">
     <span :style="`--value: ${units};`"></span>
     </span>
    </GreedMachine>

    <div class="flex flex-col gap-3 w-full max-w-md mt-6">
      <button
        @click="handleDonate"
        :disabled="state.is_jammed || isLoading"
        class="btn btn-primary w-full"
      >
        Донат у автомат
      </button>
      <button
        @click="handleBomb"
        :disabled="!state.is_jammed || state.bombs <= 0 || isLoading"
        class="btn btn-error w-full"
      >
        Підірвати бомбою
      </button>
      <button @click="handleReset" :disabled="isLoading" class="btn btn-outline btn-neutral w-full">
        Скинути спробу
      </button>
    </div>
  </div>
</template>