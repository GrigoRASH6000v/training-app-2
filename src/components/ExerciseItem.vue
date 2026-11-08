<template lang="pug">
  .exercise-item
    el-row.mb-2(v-if="isEdited")
      el-col(:span="24")
        icon-menu.mx-auto(size="16")
    el-row.gap-1.mb-4
      el-col.items-center(
        class="!flex"
        :span="2"
      )
        .text-xs.text-gray-300 {{ itemData.index + 1 }}
      el-col.flex.items-center(
        :span="19"
        class="!flex"
      )
        .text-xs.text-gray-300 {{ store.getters.getExerciseById(itemData.exerciseId)?.title || '' }}
      el-col.items-center(:span="2" class="!flex")
        .ml-auto.flex.items-center
          slot

    el-row(v-if="isEdited")
      el-col(:span="8")
        .flex.flex-col.px-2
          .text-xs.uppercase.text-gray-300.mx-auto.mb-2 Подходы
          el-input-number(
            :model-value="itemData.repetition"
            class="!w-full"
            placeholder="Выбор повторений"
            :max="30"
            size="small"
            @update:model-value="value => $emit('update', { name: 'repetition', value })"
          )
      el-col(:span="8")
        .flex.flex-col.px-2
          .text-xs.uppercase.text-gray-300.mx-auto.mb-2 Повторения
          el-input-number(
            :model-value="itemData.approache"
            class="!w-full"
            placeholder="Выбор подходов"
            :max="30"
            size="small"
            @update:model-value="value => $emit('update', { name: 'approache', value })"
          )
      el-col(:span="8")
        .flex.flex-col.px-2
          .text-xs.uppercase.text-gray-300.mx-auto.mb-2 Отдых, сек
          el-input-number(
            :model-value="itemData.restTime"
            class="!w-full"
            placeholder="Задайте время"
            size="small"
            @update:model-value="value => $emit('update', { name: 'restTime', value })"
          )

    el-row(v-else)
      el-col(:span="8")
        .flex.flex-col
          .text-xs.uppercase.text-gray-300.mb-2 Подходы
          .text-xs.text-gray-300 {{ itemData.repetition }}
      el-col(:span="8")
        .flex.flex-col
          .text-xs.uppercase.text-gray-300.mb-2 Повторения
          .text-xs.text-gray-300 {{ isArray(itemData.approache) ? itemData.approache.length : itemData.approache }}
      el-col(:span="8")
        .flex.flex-col
          .text-xs.uppercase.text-gray-300.mb-2 Отдых, сек
          .text-xs.text-gray-300 {{ itemData.restTime }}

    el-divider(v-if="divider")
</template>

<script>
  import IconPlay from '~/components/ui/icons/play';
  import IconMenu from '~/components/ui/icons/menu';
  import IconChevron from '~/components/ui/icons/chevron';
  import isArray from 'lodash/isArray';
  import { useStore } from "vuex";
  import { ref } from 'vue';

  export default {
    components: {
      IconPlay,
      IconMenu,
      IconChevron
    },
    props: {
      itemData: {
        type: Object,
        default: () => ({})
      },
      divider: {
        type: Boolean,
        default: false
      },
      isEdited: {
        type: Boolean,
        default: false
      }
    },
    setup() {
      const store = useStore();
      return {
        store,
        isArray,
      };
    }
  }
</script>

<style lang="scss">
  .exercise-item {
    user-select: none;
    background-color: $black;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid $black-light;
    margin-bottom: 20px;

    &:not(:last-child) {
      margin-bottom: 20px;
    }

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
