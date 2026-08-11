<template>
  <div class="weight-picker">
    <label class="weight-label">Вес</label>

    <!-- Поле кг -->
    <div class="spinner-wrapper">
      <button
        :disabled="kg >= maxKg"
        class="spinner-btn up"
        @click="changeKg(1)"
      >
        ▲
      </button>
      <div class="spinner-display kg">{{ kg }}</div>
      <button
        :disabled="kg <= minKg"
        class="spinner-btn down"
        @click="changeKg(-1)"
      >
        ▼
      </button>
    </div>

    <!-- Десятые доли -->
    <div class="spinner-wrapper decimals">
      <button
        :disabled="dec >= 9"
        class="spinner-btn up"
        @click="changeDec(1)"
      >
        ▲
      </button>
      <div class="spinner-display dec">{{ dec }}</div>
      <button
        :disabled="dec <= 0"
        class="spinner-btn down"
        @click="changeDec(-1)"
      >
        ▼
      </button>
    </div>

    <p class="weight-total">Итого: {{ totalWeight }} кг</p>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';

  interface Props {
    modelValue?: number; // общий вес в кг, например 75.3
    minKg?: number;
    maxKg?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: 0,
    minKg: 0,
    maxKg: 200,
  });

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void;
  }>();

  // Разбиваем общий вес на кг и десятые
  const kg = ref(Math.floor(props.modelValue));
  const dec = ref(Math.round((props.modelValue - kg.value) * 10));

  // Пересчитываем при изменении modelValue извне
  const updateFromModel = () => {
    const val = props.modelValue;
    kg.value = Math.max(props.minKg, Math.min(props.maxKg, Math.floor(val)));
    dec.value = Math.max(0, Math.min(9, Math.round((val - kg.value) * 10)));
  };

  // Синхронизация при изменении пропса
  updateFromModel();

  watch(() => props.modelValue, () => {
    updateFromModel();
  });

  const totalWeight = computed(() => {
    return kg.value + dec.value / 10;
  });

  const changeKg = (delta: number) => {
    let newVal = kg.value + delta;
    if (newVal < props.minKg) newVal = props.minKg;
    if (newVal > props.maxKg) newVal = props.maxKg;

    kg.value = newVal;
    emit('update:modelValue', totalWeight.value);
  };

  const changeDec = (delta: number) => {
    let newVal = dec.value + delta;
    if (newVal < 0) newVal = 0;
    if (newVal > 9) newVal = 9;

    dec.value = newVal;
    emit('update:modelValue', totalWeight.value);
  };
</script>

<style scoped>
  .weight-picker {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .weight-label {
    font-weight: 600;
    color: #333;
  }

  .spinner-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .spinner-wrapper.decimals {
    gap: 4px;
  }

  .spinner-display {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1.2rem;
    font-weight: bold;
    color: #222;
  }

  .spinner-btn {
    width: 36px;
    height: 36px;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 6px;
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #444;
  }

  .spinner-btn:hover:not(:disabled) {
    background: #fafafa;
  }

  .spinner-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .weight-total {
    margin-top: 8px;
    font-size: 1.1rem;
    color: #555;
  }
</style>
