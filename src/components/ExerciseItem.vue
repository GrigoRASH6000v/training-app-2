<template lang="pug">
  .exercise-item
    el-row
      el-col(:span="$slots.default ? 14 : 17")
        .flex.flex-col
          .text-xs.text-gray-500 Название упр.
          .text-xs {{ store.getters.getExerciseById(itemData.exerciseId)?.title || '' }}
      el-col(:span="2")
        .flex.flex-col
          .text-xs.text-gray-500 Пов.
          .text-xs {{ itemData.repetition }}
      el-col(:span="2")
        .flex.flex-col
          .text-xs.text-gray-500 Под.
          .text-xs {{ isArray(itemData.approache) ? itemData.approache.length : itemData.approache }}
      el-col(:span="2")
        .flex.flex-col
          .text-xs.text-gray-500 Отд.
          .text-xs {{ itemData.restTime }}
      el-col(v-if="$slots.default" :span="4")
        .ml-4
          slot

    el-divider(v-if="divider")
</template>

<script>
  import IconPlay from '~/components/ui/icons/play';
  import { isArray } from 'lodash';
  import { useStore } from "vuex";

  export default {
    components: {
      IconPlay
    },
    props: {
      itemData: {
        type: Object,
        default: () => ({})
      },
      divider: {
        type: Boolean,
        default: false
      }
    },
    setup() {
      const store = useStore();
      return {
        store,
        isArray
      };
    }
  }
</script>

<style lang="scss">
  .exercise-item {
    .el-divider--horizontal {
      margin: 12px 0;
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
