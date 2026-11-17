<script setup lang="ts">
defineProps<{
  isJammed: boolean;
  jamChance: number;
}>();
</script>

<template>
<!-- 
  Шановний Назґул!
  Блоки <style> та <style scoped> з оригінального файлу матеріалів я СВІДОМО видалила з цього компонента 
  та перенесла до глобального src/style.css. 
  Це зроблено для дотримання вимог лекції щодо заборони використання css всередині vue компонентів 
  та підтримки архітектури.
-->
  <div class="greed-machine">
    <div class="gm-sign">
      <span>GREED</span>
    </div>
    <div class="gm-body">
      <div class="gm-wood-casing">
        <div class="gm-screen">
          <div class="gm-counter">
            <slot />
          </div>
          <div class="gm-coin-area">
            <div class="gm-coin-slot"></div>
          </div>
        </div>
      </div>
      <div class="gm-base">
        <div class="gm-base-detail"></div>
      </div>
    </div>
    <div v-if="isJammed" class="alert alert-error mt-4 shadow-lg animate-pulse">
      <span>АВТОМАТ ЗАКЛИНИВ! (Jam Chance: {{ jamChance.toFixed(2) }}%)</span>
    </div>
    <div v-else class="text-sm text-base-content/60 mt-4 font-mono font-bold">
      Шанс заклинювання: <span class="text-warning">{{ jamChance.toFixed(2) }}%</span>
    </div>
  </div>
</template>

