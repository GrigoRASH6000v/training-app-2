<template>
  <div class="history-list">
    <ul>
      <li
        v-for="(item, key) in items"
        :key="item.id"
        class="history-list__item"
      >
        <span v-if="item?.title">{{ item.title }}</span>
        <span v-if="item?.duration"> ({{ item.duration }} мин)</span>
        <el-button
          class="history-list__item-close"
          size="small"
          round
          @click="$emit('remove', key)"
        >
          <icon-close size="14"/>
        </el-button>
      </li>
    </ul>
  </div>
</template>

<script>

import IconClose from '@/components/ui/icons/close';
export default {
  name: 'ExercisesList',
  components: {
    IconClose
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
};
</script>

<style scoped lang="scss">
  .history-list {
    &__item {
      display: flex;
      padding: 6px 0;
      border-bottom: 1px dashed #eee;

      &-close {
        margin-left: auto;
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  }
</style>
