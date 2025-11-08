<template lang="pug">
  .timer
    h2 Таймер
    .display {{ minutes }} : {{ secondsTwoDigits }}
    .controls
      el-button(:disabled="running", @click="start") Старт
      el-button(:disabled="!running", @click="pause") Пауза
      el-button(@click="reset") Сброс
</template>

<script>
  import { ref, computed, onUnmounted, watch } from 'vue';

  export default {
    name: 'Timer',
    props: {
      initialSeconds: {
        type: Number,
        default: 60
      }
    },
    emits: ['tick'],
    setup(props) {
      const total = ref(0);
      const running = ref(false);
      let timer = null;

      const minutes = computed(() => Math.floor(total.value / 60));
      const seconds = computed(() => total.value % 60);
      const secondsTwoDigits = computed(() => String(seconds.value).padStart(2, '0'));

      const tick = () => {
        total.value += 1;
      };

      const start = () => {
        if (timer) return;
        running.value = true;
        timer = setInterval(tick, 1000);
      };

      const pause = () => {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
        running.value = false;
      };

      const reset = () => {
        pause();
        total.value = 0;
      };

      onUnmounted(() => {
        if (timer) clearInterval(timer);
      });

      // реактивность на изменение initialSeconds
      watch(() => props.initialSeconds, (n) => {
        total.value = n;
      });

      return {minutes, secondsTwoDigits, running, start, pause, reset};
    }
  };
</script>

<style scoped>
  .timer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .display {
    font-size: 48px;
    font-weight: bold;
    letter-spacing: 2px;
  }

  .controls {
    display: flex;
    gap: 0.5rem;
  }

  button {
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    background: #2d8cff;
    color: white;
    cursor: pointer;
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
