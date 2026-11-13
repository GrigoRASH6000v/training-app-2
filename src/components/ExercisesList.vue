<template lang="pug">
  .history-list
    el-input.mb-4(v-model="search" placeholder="поиск...")
    ul.flex.flex-col.gap-4
      li(
        v-for="(group, key) in groupedItems"
        :key="`group-${key}`"
      )
        .text-xs.text-gray-500.mb-2 {{ group.title }}
        ul.history-list__group
          li.p-3.flex.items-center(
            v-for="(exercise, key) in group.exercises",
            :key="exercise.id",
            class="history-list__item"
          )
            span.text-xs.text-purple-100(v-if="exercise?.title") {{ exercise.title }}
            .ml-auto
              el-button(
                class="!px-1",
                size="small",
                @click="$emit('edit', exercise)"
              )
                icon-pen(size="14" color="#fff")

              el-button.ml-2(
                class="!px-1",
                size="small",
                type="danger"
                @click="$emit('remove', key)"
              )
                icon-remove(size="14" color="#fff")
</template>

<script>
  import IconRemove from '~/components/ui/icons/remove';
  import IconPen from '~/components/ui/icons/pen';
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';

  export default {
    name: 'ExercisesList',
    components: {
      IconRemove,
      IconPen
    },
    props: {
      items: {
        type: Array,
        default: () => []
      }
    },
    setup(props) {
      const store = useStore();
      const groups = store.state.exercisesGroups;
      const search = ref('');

      const sortedList = computed(() => props.items.sort((a, b) => a.title.localeCompare(b.title)));

      const filteredItems = computed(() => {
        const query = search.value.toLowerCase().trim();
        if (!query) return sortedList.value;
        return sortedList.value.filter(item => item.title.toLowerCase().includes(query));
      });

      const groupedItems = computed(() => filteredItems.value.reduce((acc, item) => {
        const currentGroup = groups.find(group => group.value === item.group);

        if (!currentGroup) {
          if (!acc[7]) {
            acc[7] = { title: 'Другое', exercises: [] };
          }

          acc[7].exercises.push(item);
        } else if (!acc[currentGroup.value]) {
          acc[currentGroup.value] = {
            title: currentGroup.label,
            exercises: [item]
          }
        } else {
          acc[currentGroup.value].exercises.push(item);
        }

        return acc;
      }, {}));

      return {
        search,
        groupedItems,
        sortedList
      }
    }
  };
</script>

<style scoped lang="scss">
  .history-list {
    &__group {
      border-radius: 5px;
      border: 1px solid $gray;
    }

    &__item {
      &:not(:last-child) {
        border-bottom: 1px solid $gray;
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  }
</style>
