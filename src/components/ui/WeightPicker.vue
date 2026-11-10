<template>
  <div
    class="weight-picker"
    ref="pickerRef"
  >
    <label class="weight-label">Вес</label>

    <div class="drums-row">
      <!-- Кг барабан -->
      <div
        class="drum-wrapper"
        @touchstart="onKgTouchStart"
        @touchmove="onKgTouchMove"
        @touchend="onKgTouchEnd"
      >
        <div class="drum-mask">
          <div class="drum-scroll" :style="kgScrollStyle">
            <div
              v-for="(val, idx) in kgRange"
              :key="val"
              class="drum-item"
              :class="{ 'drum-item-active': val === kg }"
            >
              {{ val }}
            </div>
          </div>
        </div>
        <div class="drum-highlight"></div>
      </div>

      <!-- Десятые барабан -->
      <div
        class="drum-wrapper drum-wrapper-sm"
        @touchstart="onDecTouchStart"
        @touchmove="onDecTouchMove"
        @touchend="onDecTouchEnd"
      >
        <div class="drum-mask">
          <div class="drum-scroll" :style="decScrollStyle">
            <div
              v-for="val in decRange"
              :key="val"
              class="drum-item"
              :class="{ 'drum-item-active': val === dec }"
            >
              {{ val }}
            </div>
          </div>
        </div>
        <div class="drum-highlight"></div>
      </div>
    </div>

    <p class="weight-total">Итого: {{ totalWeight }} кг</p>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';

  interface Props {
    modelValue?: number;
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

  const ITEM_HEIGHT = 48;
  const CENTER_OFFSET = 1; // средний из 3 видимых

  const kg = ref(Math.floor(props.modelValue));
  const dec = ref(Math.round((props.modelValue - kg.value) * 10));

  const kgRange = computed(() => {
    const range = [];
    for (let i = props.minKg; i <= props.maxKg; i++) {
      range.push(i);
    }
    return range;
  });

  const decRange = computed(() => {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  });

  const kgIndex = computed(() => kgRange.value.indexOf(kg.value));
  const decIndex = computed(() => decRange.value.indexOf(dec.value));

  const updateFromModel = () => {
    const val = props.modelValue;
    kg.value = Math.max(props.minKg, Math.min(props.maxKg, Math.floor(val)));
    dec.value = Math.max(0, Math.min(9, Math.round((val - kg.value) * 10)));
  };

  updateFromModel();

  watch(() => props.modelValue, () => {
    updateFromModel();
  });

  const totalWeight = computed(() => {
    return kg.value + dec.value / 10;
  });

  const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
  };

  const kgScrollStyle = computed(() => {
    const scrollY = clamp(kgIndex.value - CENTER_OFFSET, 0, kgRange.value.length - 3) * ITEM_HEIGHT;
    return {
      transform: `translateY(${-scrollY}px)`,
      transition: 'transform 0.3s ease'
    };
  });

  const decScrollStyle = computed(() => {
    const scrollY = clamp(decIndex.value - CENTER_OFFSET, 0, decRange.value.length - 3) * ITEM_HEIGHT;
    return {
      transform: `translateY(${-scrollY}px)`,
      transition: 'transform 0.3s ease'
    };
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

  const SWIPE_THRESHOLD = 30;

  // Кг свайпы
  const kgTouchStartY = ref(0);
  const kgIsSwiping = ref(false);

  const onKgTouchStart = (e: TouchEvent) => {
    kgTouchStartY.value = e.touches[0].clientY;
    kgIsSwiping.value = false;
  };

  const onKgTouchMove = (e: TouchEvent) => {
    const deltaY = e.touches[0].clientY - kgTouchStartY.value;
    if (Math.abs(deltaY) > SWIPE_THRESHOLD && !kgIsSwiping.value) {
      kgIsSwiping.value = true;
    }
  };

  const onKgTouchEnd = (e: TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - kgTouchStartY.value;

    if (kgIsSwiping.value) {
      if (deltaY > 0) {
        changeKg(-1);
      } else if (deltaY < 0) {
        changeKg(1);
      }
    }

    kgIsSwiping.value = false;
  };

  // Десятые свайпы
  const decTouchStartY = ref(0);
  const decIsSwiping = ref(false);

  const onDecTouchStart = (e: TouchEvent) => {
    decTouchStartY.value = e.touches[0].clientY;
    decIsSwiping.value = false;
  };

  const onDecTouchMove = (e: TouchEvent) => {
    const deltaY = e.touches[0].clientY - decTouchStartY.value;
    if (Math.abs(deltaY) > SWIPE_THRESHOLD && !decIsSwiping.value) {
      decIsSwiping.value = true;
    }
  };

  const onDecTouchEnd = (e: TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - decTouchStartY.value;

    if (decIsSwiping.value) {
      if (deltaY > 0) {
        changeDec(-1);
      } else if (deltaY < 0) {
        changeDec(1);
      }
    }

    decIsSwiping.value = false;
  };
</script>

<style scoped>
  .weight-picker {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    font-family: system-ui, -apple-system, sans-serif;
    touch-action: none;
    user-select: none;
  }

  .drums-row {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  .weight-label {
    font-weight: 600;
    color: #333;
  }

  .drum-wrapper {
    position: relative;
    width: 80px;
    height: calc(var(--item-height, 48px) * 3);
    overflow: hidden;
    border-radius: 12px;
    touch-action: none;
  }

  .drum-wrapper-sm {
    width: 48px;
  }

  .drum-mask {
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .drum-scroll {
    will-change: transform;
  }

  .drum-item {
    height: var(--item-height, 48px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: 500;
    color: #999;
    transition: all 0.3s ease;
  }

  .drum-item-active {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    transform: scale(1.1);
  }

  .drum-highlight {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    height: var(--item-height, 48px);
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    pointer-events: none;
  }

  .weight-total {
    margin-top: 8px;
    font-size: 1.1rem;
    color: #555;
  }
</style>
