<template lang="pug">
  .app
    header.header
      .grid.grid-cols-3.items-center
        .text-xs.font-bold.col-span-2 Тренька
        .text-xs.font-bold.col-span-1.text-right v1.0.2
    main.container
      section.section.editor
        el-collapse(v-model="activePlainEditor", accordion)
          el-collapse-item(name="1")
            template(#title)
              .text-xs.font-bold Создать упражнение
            plan-editor(@save="handlePlanSave")
      section.section.history
        el-collapse(v-model="exercisesList", accordion)
          el-collapse-item(name="1")
            template(#title)
              .text-xs.font-bold Список упражнений
            exercises-list(:items="store.state.exercises", @remove="store.commit('removeExercise', $event)")
      section.section
        workout-editor(
          :exercises-list="store.state.exercises"
          :edited-workout="store.state.editedWorkout"
          @edited-workout:update="store.commit('setEditedWorkout', $event)"
          @save="store.commit('addWorkout', $event)"
          @update="store.commit('updateWorkout', $event)"
        )
      section.section
        workout-list(
          v-model="store.state.workouts"
          @start="store.commit('setActiveWorkout', $event)"
          @remove="store.commit('removeWorkout', $event)"
          @edit="store.commit('setEditedWorkout', $event)"
        )
      workout-modal(
        v-if="!!store.state.activeWorkout"
        :model-value="!!store.state.activeWorkout"
        :workout="store.getters.getWorkoutById(store.state.activeWorkout)"
        @update:model-value="store.commit('setActiveWorkout', $event)"
      )

      exercise-edit-modal(
        v-if="!!store.state.editedExercise"
        :model-value="!!store.state.editedExercise"
        :exercise="store.getters.getExerciseInWorkoutById(store.state.editedExercise)"
        @update:model-value="store.commit('setEditedExercise', $event)"
      )
</template>

<script>
  import ExerciseEditModal from '~/components/ExerciseEditModal';
  import WorkoutModal from '~/components/WorkoutModal';
  import WorkoutEditor from '~/components/WorkoutEditor';
  import WorkoutList from '~/components/WorkoutList';
  import PlanEditor from '~/components/PlanEditor';
  import ExercisesList from '~/components/ExercisesList';
  import { useStore } from 'vuex';
  import { ref, watch } from 'vue';

  export default {
    name: 'App',
    components: {
      PlanEditor,
      WorkoutList,
      WorkoutModal,
      ExercisesList,
      WorkoutEditor,
      ExerciseEditModal
    },
    setup () {
      const drawer = ref(false);
      const activePlainEditor = ref(0);
      const exercisesList = ref(0);
      const store = useStore();

      watch(() => store.state.activeWorkout, newValue => drawer.value = !!newValue);

      store.dispatch('initializeStore');

      const handlePlanSave = plan => {
        store.commit('addExercises', plan);
      };

      const handleTick = () => {};

      return {
        activePlainEditor,
        handlePlanSave,
        exercisesList,
        handleTick,
        drawer,
        store,
      };
    }
  };
</script>

<style scoped>
  .app {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    color: #333;
    background-color: #f5f5f5;
    min-height: 100dvh;
  }

  .header {
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
    background: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
  }
  .container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
    max-width: 400px;
    margin: 0 auto;
  }
  .section {
    background: #fff;
    border: 1px solid #eaeaea;
    border-radius: 8px;
    padding: 1rem;
  }
</style>
