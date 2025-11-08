<template lang="pug">
  el-drawer(
    :model-value="modelValue",
    size="100%",
    @update:model-value="$emit('update:model-value', null)"
  )
    .workout
      timer(
        class="timer",
        :initialSeconds="60",
        @tick="handleTick"
      )

      el-row
        el-col(:span="22")
          .field
            .label Название
            span {{ workout.name }}
        el-col(:span="2")
          el-button(round, size="small")
            icon-pen(size="14")

      div(
        v-for="(exercise, idx) in workout.exercises",
        :key="idx"
      )
        el-row
          el-col(:span="1")
            .label №
            span {{ idx + 1 }}
          el-col(:span="17")
            .field
              .label Название упр.
              span {{ store.getters.getExerciseById(exercise.id) }}
          el-col(:span="2")
            .field
              .label Пов.
              span {{ exercise.repetition }}
          el-col(:span="2")
            .field
              .label Под.
              span {{ exercise.approache }}
          el-col(:span="2")
            .field
              .label Отд.
              span {{ exercise.restTime }}

        el-divider
</template>

<script>
  import Timer from '~/components/Timer';
  import IconPen from '~/components/ui/icons/pen';
  import { useStore } from 'vuex';

  export default {
    name: 'WorkoutModal',
    components: { IconPen, Timer },
    props: {
      modelValue: {
        type: Boolean,
        default: false,
      },
      workout: {
        type: Object,
        default: () => ({})
      }
    },
    setup() {
      const handleTick = () => console.log('handleTick');
      const store = useStore();

      return {
        handleTick,
        store
      };
    }
  };
</script>

<style lang="scss" scoped>
  .workout {
    &__item {
      padding: 10px 0;

      &:not(:last-child) {
        margin-bottom: 15px;
      }
    }

    .field {
      display: flex;
      flex-direction: column;
    }
    .label {
      font-size: 12px;
      color: #555;
      margin-bottom: 4px;
    }

    .field {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
    }

    .timer {
      margin-bottom: 40px;
    }
  }
</style>
