<template lang="pug">
  el-progress(
    type="dashboard"
    :width="80"
    :percentage="percentage"
    :color="colors.lime[500]"
  )
    template(#default)
      .text-2xl.font-bold.text-lime-500(v-if="total > 0") {{ displaySeconds }}
      .text-xl.font-bold.timer-finished(v-else) ЕБАШЬ!
</template>

<script>
  import { ref, computed, watch, onUnmounted } from 'vue';
  import colors from 'tailwindcss/colors';

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

      const percentage = computed(() => {
        const unit = props.initialSeconds / 100;
        return total.value / unit;
      });

      watch(() => props.initialSeconds, (val) => {
        reset(val);
      }, { immediate: true });

      onUnmounted(() => {
        if (timer) clearInterval(timer);
      });

      return {
        total,
        colors,
        percentage,
        isFinished,
        displaySeconds,
      };
    }
  };
</script>

<style scoped lang="scss">
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
