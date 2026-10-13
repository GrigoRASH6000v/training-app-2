<template lang="pug">
  .app
    header.header
      .grid.grid-cols-3.items-center
        .text-xs.font-bold.col-span-2 Тренька
        .text-xs.font-bold.col-span-1.text-right v1.1.7
    main.container
      section.section.editor
        .flex.items-center.justify-between
          .text-xs.font-bold Создать упражнение
          el-button(
            size="small"
            round
            @click="activePlainEditor = true"
          )
            icon-plus(size="14")

        el-drawer(
          v-model="activePlainEditor"
          title="Создать упражнение"
          size="100%"
        )
          plan-editor(@save="handlePlanSave")

      section.section.history
        .flex.items-center.justify-between
          .text-xs.font-bold Список упражнений
          el-button(
            size="small"
            round
            @click="exercisesList = true"
          )
            icon-eye(size="14")

          el-drawer(
            v-model="exercisesList"
            title="Создать упражнение"
            size="100%"
          )
            exercises-list(:items="store.state.exercises", @remove="store.commit('removeExercise', $event)")

      section.section
        .flex.items-center.justify-between
          .text-xs.font-bold Создать тренировку
          el-button(
            v-if="!store.state.editedWorkout"
            size="small"
            round
            @click="createNewWorkout"
          )
            icon-plus(size="14")

          el-drawer(
            :model-value="!!store.state.editedWorkout",
            :title="store.state.editedWorkout?.id ? 'Редактирование тренировки' : 'Создание тренировки'"
            size="100%"
            @update:model-value="store.commit('setEditedWorkout', null)"
          )
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

      el-button(@click="weightDiaryModalIsShow = !weightDiaryModalIsShow") Дневник веса

      workout-modal(
        v-if="!!store.state.activeWorkout"
        :model-value="!!store.state.activeWorkout"
        :workout="store.getters.getWorkoutById(store.state.activeWorkout)"
        @update:model-value="store.commit('setActiveWorkout', $event)"
      )

      weight-diary-modal(v-model="weightDiaryModalIsShow")

      exercise-edit-modal(
        v-if="!!store.state.editedExercise"
        :model-value="!!store.state.editedExercise"
        :exercise="store.getters.getExerciseInWorkoutById(store.state.editedExercise)"
        @update:model-value="store.commit('setEditedExercise', $event)"
      )
</template>

<script>
  import WeightDiaryModal from './components/WeightDiaryModal';
  import WeightDiary from '~/components/WeightDiary';
  import ExerciseEditModal from '~/components/ExerciseEditModal';
  import WorkoutModal from '~/components/WorkoutModal';
  import WorkoutEditor from '~/components/WorkoutEditor';
  import WorkoutList from '~/components/WorkoutList';
  import PlanEditor from '~/components/PlanEditor';
  import ExercisesList from '~/components/ExercisesList';
  import IconPlus from '~/components/ui/icons/plus';
  import IconEye from '~/components/ui/icons/eye';
  import { useStore } from 'vuex';
  import { ref, watch } from 'vue';

  export default {
    name: 'App',
    components: {
      IconEye,
      IconPlus,
      PlanEditor,
      WorkoutList,
      WeightDiary,
      WorkoutModal,
      ExercisesList,
      WorkoutEditor,
      WeightDiaryModal,
      ExerciseEditModal,
    },
    setup () {
      const drawer = ref(false);
      const activePlainEditor = ref(0);
      const exercisesList = ref(0);
      const store = useStore();
      const weightDiaryModalIsShow = ref(false);

      watch(() => store.state.activeWorkout, newValue => drawer.value = !!newValue);

      store.dispatch('initializeStore');

      const handlePlanSave = plan => {
        store.commit('addExercises', plan);
      };

      const createNewWorkout = () => {
        store.commit('setEditedWorkout', {
          id: null,
          name: '',
          exercises: []
        });
      }

      return {
        weightDiaryModalIsShow,
        activePlainEditor,
        createNewWorkout,
        handlePlanSave,
        exercisesList,
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
