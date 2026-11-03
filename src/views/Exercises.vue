<template lang="pug">
  .space-y-4
    h1.text-white.text-sm.font-bold Упражнения

    section.section.editor(class="backdrop-blur-[10px] bg-white/30")
      plan-editor(@save="handlePlanSave")

    section.section(class="backdrop-blur-[10px] bg-white/30")
      .flex.items-center.justify-between
        .text-xs.font-bold.text-white.mb-2 Список упражнений

      exercises-list(
        :items="filteredExercises"
        @remove="store.commit('removeExercise', $event)"
      )
</template>

<script>
  import PlanEditor from '~/components/PlanEditor';
  import ExercisesList from '~/components/ExercisesList';
  import IconPlus from '~/components/ui/icons/plus';
  import IconEye from '~/components/ui/icons/eye';
  import { useStore } from 'vuex';
  import { ref, computed } from 'vue';

  export default {
    name: 'ExercisesView',
    components: {
      IconEye,
      IconPlus,
      PlanEditor,
      ExercisesList,
    },
    setup () {
      const activePlainEditor = ref(false);
      const exercisesList = ref(false);
      const searchQuery = ref('');
      const store = useStore();

      store.dispatch('initializeStore');

      const filteredExercises = computed(() => {
        if (!searchQuery.value) return store.state.exercises;
        const query = searchQuery.value.toLowerCase();
        return store.state.exercises.filter(ex =>
          ex.name?.toLowerCase().includes(query)
        );
      });

      const handlePlanSave = plan => {
        store.commit('addExercises', plan);
      };

      return {
        activePlainEditor,
        exercisesList,
        searchQuery,
        filteredExercises,
        handlePlanSave,
        store,
      };
    }
  };
</script>

<style scoped lang="scss">
  .section {
    background-color: $black;
  }
</style>
