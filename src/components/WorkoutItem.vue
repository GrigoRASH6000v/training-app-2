<template lang="pug">
  .workout-item
    el-row
      el-col(:span="18")
        .field
          .label Название
          span {{ itemData.name }}
      el-col(:span="6")
        .flex
          el-button(round, size="small")
            icon-pen(size="14")

          el-button(
            round,
            size="small"
            type="danger"
            @click="remove(itemData.id)"
          )
            icon-remove(size="14")

    exercise-item(
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

      return { remove }
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
