<template lang="pug">
  .flex.justify-center.items-center
    .text-2xl.font-bold.mr-4(:class="{'blink-red': timeIsOver}") {{ minutes }} : {{ secondsTwoDigits }}
    .controls
      el-button(
        text
        size="small"
        @click="running ? pause() : start()"
      )
        icon-pause(v-if="running" size="16")
        icon-play(v-else size="16")

      el-button(@click="reset"  size="small") Сброс
</template>

<script>
  import IconPlay from '~/components/ui/icons/play';
  import IconPause from '~/components/ui/icons/pause';
  import {
    ref,
    computed,
    onUnmounted,
    watch
  } from 'vue';

  export default {
    name: 'Timer',
    components: {
      IconPlay,
      IconPause
    },
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
      const timeIsOver = ref(false);
      let timer = null;

      const minutes = computed(() => Math.floor(total.value / 60));
      const seconds = computed(() => total.value % 60);
      const secondsTwoDigits = computed(() => String(seconds.value).padStart(2, '0'));

      watch(() => props.initialSeconds, value => {
        total.value = value;

      }, { immediate: true })

      const tick = () => {
        if (total.value !== 0) {
          total.value -= 1;
        } else {
          clearInterval(timer)
          timeIsOver.value = true;
        }

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
        total.value = props.initialSeconds;
        timeIsOver.value = false;
      };

      onUnmounted(() => {
        if (timer) clearInterval(timer);
      });

      // реактивность на изменение initialSeconds
      watch(() => props.initialSeconds, (n) => {
        total.value = n;
      });

      return {minutes, secondsTwoDigits, running, timeIsOver, start, pause, reset};
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

  @keyframes blink-red {
    0% {
      opacity: 1;
      filter: brightness(1);
    }
    50% {
      opacity: 0.3;
      filter: brightness(0.7) saturate(1.5) hue-rotate(0deg);
    }
    100% {
      opacity: 1;
      filter: brightness(1);
    }
  }

  .blink-red {
    animation: blink-red 1.5s infinite ease-in-out;
    color: var(--color-red-400);
  }
</style>
