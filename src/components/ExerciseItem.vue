<template lang="pug">
  .exercise-item
    el-row
      el-col(:span="1")
        .label №
        span {{ itemData.index + 1 }}
      el-col(:span="17")
        .field
          .label Название упр.
          span {{ getExercise(itemData.exercisId) }}
      el-col(:span="2")
        .field
          .label Пов.
          span {{ itemData.repetitions }}
      el-col(:span="2")
        .field
          .label Под.
          span {{ itemData.approaches }}
      el-col(:span="2")
        .field
          .label Отд.
          span {{ itemData.restTime }}

    slot
</template>

<script>
  import {useStore} from "vuex";

  export default {
    props: {
      itemData: {
        type: Object,
        default: () => ({})
      }
    },
    setup() {
      const store = useStore();
      const getExercise = id => store.getters.getExerciseById(id)?.title || '';
      return {
        getExercise
      };
    }
  }
</script>

<style lang="scss">
  .exercise-item {
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
