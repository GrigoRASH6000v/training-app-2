<template lang="pug">
  .space-y-4
    h1.text-white.text-sm.font-bold Упражнения

    section.section.editor(class="backdrop-blur-[10px] bg-white/30")
      plan-editor(@save="plan => store.commit('addExercises', plan)")

    section.section(class="backdrop-blur-[10px] bg-white/30")
      .flex.items-center.justify-between
        .text-xs.font-bold.text-white.mb-2 Список упражнений

      exercises-list(
        :items="filteredExercises"
        @remove="store.commit('removeExercise', $event)"
        @edit="store.commit('setEditedExercise', $event)"
      )

    el-drawer(
      :model-value="!!store.state.editedExercise",
      body-class="px-4"
      header-class="!mb-2"
      title="Редактирование упражнения"
      :size="mq.sm ? '100%' : 375"
      @update:model-value="store.commit('setEditedExercise', null)"
    )
      plan-editor(
        v-if="store.state.editedExercise"
        :editing-data="store.state.editedExercise"
        @update="handleUpdatePlan"
      )
</template>

<script>
  import PlanEditor from '~/components/PlanEditor';
  import ExercisesList from '~/components/ExercisesList';
  import IconPlus from '~/components/ui/icons/plus';
  import IconEye from '~/components/ui/icons/eye';
  import { useStore } from 'vuex';
  import { ref, computed } from 'vue';
  import { useMq } from 'vue3-mq';

  export default {
    name: 'ExercisesView',
    components: {
      IconEye,
      IconPlus,
      PlanEditor,
      ExercisesList,
    },
    setup () {
      const mq = useMq();
      const activePlainEditor = ref(false);
      const exercisesList = ref(false);
      const searchQuery = ref('');
      const store = useStore();

      const filteredExercises = computed(() => {
        if (!searchQuery.value) return store.state.exercises;
        const query = searchQuery.value.toLowerCase();
        return store.state.exercises.filter(ex =>
          ex.name?.toLowerCase().includes(query)
        );
      });

      const handleUpdatePlan = plan => {
        store.commit('updateExercise', plan);
        store.commit('setEditedExercise', null);
      }

      return {
        activePlainEditor,
        exercisesList,
        searchQuery,
        filteredExercises,
        handleUpdatePlan,
        store,
        mq,
      };
    }
  };
</script>

<style scoped lang="scss">
  .section {
    background-color: $black;
  }
</style>
