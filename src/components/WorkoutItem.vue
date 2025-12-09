<template lang="pug">
  .workout-item
    el-row
      el-col.mb-4(:span="17")
        .flex.flex-col
          .text-xs.text-gray-500 Название
          .text-xs {{ itemData.name }}
      el-col(:span="7")
        .flex
          el-button(
            round,
            size="small"
            @click="emit('edit', itemData)"
          )
            icon-pen(size="14")

          el-button(
            round,
            size="small"
            type="danger"
            @click="remove(itemData.id)"
          )
            icon-remove(size="14")

    exercise-item.mb-4(
      v-for="(exercise, idx) in itemData.exercises",
      :key="idx"
      :item-data="{ index: idx,  ...exercise }"
    )
    el-row
      el-col(:span="6")
        el-button(type="primary", @click="$emit('start', itemData.id)") Начать
    el-divider
</template>

<script>
  import IconPen from '~/components/ui/icons/pen';
  import IconRemove from '~/components/ui/icons/remove';
  import ExerciseItem from '~/components/ExerciseItem';
  import { ElMessageBox } from 'element-plus';

  export default {
    components: {
      IconPen,
      ExerciseItem,
      IconRemove
    },
    props: {
      itemData: {
        type: Object,
        default: () => ({})
      },
    },
    setup(_, { emit }) {
      const remove = id => {
        ElMessageBox.confirm(
          'Вы уверены, что хотите удалить этот элемент?',
          'Подтверждение действия',
          {
            confirmButtonText: 'Да',
            cancelButtonText: 'Нет',
            type: 'warning',
            center: true
          },
        )
          .then(() => {
            emit('remove', id)
          })
      }

      return { remove, emit }
    }
  }
</script>

<style lang="scss" scoped>
  .workout-item {
    .field {
      display: flex;
      flex-direction: column;
    }
  }
</style>
