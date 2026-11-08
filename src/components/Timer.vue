<template lang="pug">
  .timer-container
    svg.timer-ring(
      viewBox="0 0 120 120"
      :style="styles"
    )
      circle(
        class="ring-bg"
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke-width="6"
      )
      circle(
        class="ring-progress"
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke-width="6"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      )
    .timer-content
      template(v-if="total > 0")
        .text-2xl.font-bold.text-lime-500 {{ displaySeconds }}
      template(v-else)
        .text-xl.font-bold.timer-finished ЕБАШЬ!
</template>

<script>
  import { ref, computed, watch, onUnmounted } from 'vue';

  const RADIUS = 54;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  export default {
    name: 'Timer',
    props: {
      initialSeconds: {
        type: Number,
        default: 60
      },
      size: {
        type: [Number, String],
        default: 120
      }
    },
    emits: ['finish'],
    setup(props, { emit }) {
      const total = ref(props.initialSeconds);
      let timer = null;

      const circumference = CIRCUMFERENCE;
      const dashOffset = computed(() => {
        const progress = total.value / props.initialSeconds;
        return circumference * (1 - progress);
      });

      const displaySeconds = computed(() => {
        return String(Math.max(0, total.value)).padStart(2, '0');
      });

      const tick = () => {
        if (total.value > 0) {
          total.value -= 1;
        } else {
          clearInterval(timer);
          timer = null;
          emit('finish');
        }
      };

      const isFinished = computed(() => total.value <= 0);

      const start = () => {
        if (timer) return;
        timer = setInterval(tick, 1000);
      };

      const reset = (seconds) => {
        clearInterval(timer);
        timer = null;
        total.value = seconds;
        start();
      };

      watch(() => props.initialSeconds, (val) => {
        reset(val);
      }, { immediate: true });

      onUnmounted(() => {
        if (timer) clearInterval(timer);
      });

      const containerSize = () => {
        const s = typeof props.size === 'number' ? props.size : parseInt(props.size) || 120;
        return `${s}px`;
      };

      const styles = computed(() => ({
        width: containerSize(),
        height: containerSize(),
        transform: 'rotate(-90deg)'
      }));

      return {
        total,
        circumference,
        dashOffset,
        displaySeconds,
        styles,
        isFinished,
      };
    }
  };
</script>

<style scoped lang="scss">
  .timer-container {
    position: relative;
  }

  .timer-ring {
    width: 100%;
    height: 100%;
  }

  .ring-bg {
    stroke: rgba(255, 255, 255, 0.1);
  }

  .ring-progress {
    stroke: #fff;
    stroke-linecap: round;
    transition: stroke-dashoffset 1s linear;
  }

  .timer-content {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .timer-finished {
    animation: timer-blink 1s infinite ease-in-out;
    color: var(--color-red-500);
  }

  @keyframes timer-blink {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.3;
      transform: scale(1.1);
    }
  }
</style>
