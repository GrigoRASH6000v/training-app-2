<template lang="pug">
  .workout-list
    h3 Список тренировок

    workout-item(
      v-for="(item, index) in modelValue",
      :key="index",
      :item-data="item"
      @start="$emit('start', $event)"
      @remove="$emit('remove', $event)"
    )
</template>

<script>
  import WorkoutItem from '~/components/WorkoutItem';
  import { useStore } from 'vuex';
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
      WorkoutItem
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
  }
</style>
