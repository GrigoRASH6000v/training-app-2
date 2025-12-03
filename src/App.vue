<template lang="pug">
  .app
    header.header
      el-row
        el-col(:span="12")
          .text-xs.font-bold Тренька

        el-col(:span="12")
          el-button(@click="store.dispatch('saveState')") сохранить
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
        )
      section.section
        workout-list(
          v-model="store.state.workouts"
          @start="store.commit('setActiveWorkout', $event)"
          @remove="store.commit('removeWorkout', $event)"
        )
      workout-modal(
        :model-value="!!store.state.activeWorkout"
        :workout="store.getters.getWorkoutById(store.state.activeWorkout)"
        @update:model-value="store.commit('setActiveWorkout', $event)"
      )
</template>

<script>
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
      WorkoutEditor
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
  }
  .header {
    padding: 1rem;
    background: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
  }
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
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
  @media (max-width: 900px) {
    .container {
      grid-template-columns: 1fr;
    }
  }
</style>
