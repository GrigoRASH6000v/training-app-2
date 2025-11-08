<template lang="pug">
  .workout-list
    h2 Список тренировок

    div(
      v-for="(item, index) in modelValue",
      :key="index",
      class="workout-list__item"
    )
      el-row
        el-col(:span="22")
          .field
            .label Название
            span {{ item.name }}
        el-col(:span="2")
          el-button(round, size="small")
            icon-pen(size="14")

      div(
        v-for="(exercise, idx) in item.exercises",
        :key="idx"
      )
        el-row
          el-col(:span="1")
            .label №
            span {{ idx + 1 }}
          el-col(:span="17")
            .field
              .label Название упр.
              span {{ getExercise(exercise.exercisId) }}
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

        el-row
          el-col(:span="6")
            el-button(type="primary", @click="$emit('start', item.id)") Начать

        el-divider
</template>

<script>
  import { useStore } from 'vuex';
  import IconPen from '~/components/ui/icons/pen';
  import { useMq } from 'vue3-mq';

  export default {
    name: 'WorkoutList',
    props: {
      modelValue: {
        type: Array,
        default: () => []
      }
    },
    components: {
      IconPen
    },
    setup() {
      const mq = useMq();
      const store = useStore();
      const getExercise = id => store.getters.getExerciseById(id)?.title || '';
      return {
        mq,
        getExercise
      };
    }
  };
</script>

<style lang="scss" scoped>
  .workout-list {
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
  }
</style>
