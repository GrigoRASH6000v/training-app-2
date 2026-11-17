<template lang="pug">
  .space-y-4
    h1.text-white.text-sm.font-bold Упражнения

    section.section.editor(class="backdrop-blur-[10px] bg-white/30")
      plan-editor(@save="plan => store.exercises.push(plan)")

    section.section(class="backdrop-blur-[10px] bg-white/30")
      .flex.items-center.justify-between
        .text-xs.font-bold.text-white.mb-2 Список упражнений

      exercises-list(
        :items="filteredExercises"
        @remove="removeExercise"
        @edit="exercise => store.editedExercise = exercise"
      )

    el-drawer(
      :model-value="!!store.editedExercise"
      body-class="px-4"
      header-class="!mb-2"
      title="Редактирование упражнения"
      :size="mq.sm ? '100%' : 375"
      @update:model-value="store.editedExercise = null"
    )
      plan-editor(
        v-if="store.editedExercise"
        :editing-data="store.editedExercise"
        @update="handleUpdatePlan"
      )
</template>

<script>
  import PlanEditor from '~/components/PlanEditor';
  import ExercisesList from '~/components/ExercisesList';
  import IconPlus from '~/components/ui/icons/plus';
  import IconEye from '~/components/ui/icons/eye';
  import { useStore } from '~/store';
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
        if (!searchQuery.value) return store.exercises;
        const query = searchQuery.value.toLowerCase();
        return store.exercises.filter(ex =>
          ex.name?.toLowerCase().includes(query)
        );
      });

      const handleUpdatePlan = plan => {
        const index = store.exercises.findIndex(e => e.id === plan.id);
        if (~index) store.exercises[index] = plan;
        store.editedExercise = null;
      }

      const removeExercise = id => {
        store.exercises = store.exercises.filter(exercise => exercise.id !== id);
      };

      return {
        activePlainEditor,
        exercisesList,
        searchQuery,
        removeExercise,
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
