<template lang="pug">
  .history-list
    ul
      li(
        v-for="(item, key) in items",
        :key="item.id",
        class="history-list__item"
      )
        .text-xs(v-if="item?.title") {{ item.title }}
        el-button(
          class="history-list__item-close",
          size="small",
          round
          type="danger"
          @click="$emit('remove', key)"
        )
          icon-remove(size="14" color="#fff")
</template>

<script>
  import IconRemove from '~/components/ui/icons/remove';


  export default {
    name: 'ExercisesList',
    components: {
      IconRemove
    },
    props: {
      items: {
        type: Array,
        default: () => []
      }
    }
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
