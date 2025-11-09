<template lang="pug">
  .workout-item
    el-row
      el-col(:span="22")
        .field
          .label Название
          span {{ itemData.name }}
      el-col(:span="2")
        el-button(round, size="small")
          icon-pen(size="14")

    exercise-item(
      v-for="(exercise, idx) in itemData.exercises",
      :key="idx"
      :item-data="{ index: idx,  ...exercise }"
    )
      el-row
        el-col(:span="6")
          el-button(type="primary", @click="$emit('start', item.id)") Начать

      el-divider
</template>

<script>
  import IconPen from '~/components/ui/icons/pen';
  import ExerciseItem from '~/components/ExerciseItem';

  export default {
    components: { IconPen, ExerciseItem },
    props: {
      itemData: {
        type: Object,
        default: () => ({})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .workout-item {
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
