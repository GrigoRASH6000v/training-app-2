<template lang="pug">
  .flex.justify-center.items-center
    .font-bold.text-white(:class="size") {{ formattedTime }}
</template>

<script>
  import { ref, computed, onUnmounted, onMounted, watch } from 'vue';

  export default {
    name: 'WorkoutTimer',
    props: {
      modelValue: {
        type: Number,
        default: 0
      },
      size: {
        type: String,
        default: 'text-2xl'
      }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const seconds = ref(props.modelValue);

      const formattedTime = computed(() => {
        const hrs = Math.floor(seconds.value / 3600);
        const mins = Math.floor((seconds.value % 3600) / 60);
        const secs = seconds.value % 60;
        return [
          String(hrs).padStart(2, '0'),
          String(mins).padStart(2, '0'),
          String(secs).padStart(2, '0'),
        ].join(':');
      });

      let timer = null;

      const start = () => {
        if (timer) return;
        timer = setInterval(() => {
          seconds.value += 1;
          emit('update:modelValue', seconds.value);
        }, 1000);
      };

      const stop = () => {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      };

      watch(() => props.modelValue, (val) => {
        seconds.value = val;
      });

      onMounted(() => {
        start();
      });

      onUnmounted(() => {
        stop();
      });

      return { formattedTime, size: props.size };
    }
  };
</script>
