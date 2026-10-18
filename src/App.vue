<template lang="pug">
  .app
    header.header.border-neutral-500.border-b.border-b-1
      .grid.grid-cols-3.items-center
        .text-xs.font-bold.col-span-2.text-white Тренька
        .text-xs.font-bold.col-span-1.text-right.text-white v1.1.8
    main.container
      section.section.editor(class="backdrop-blur-[10px] bg-white/30")
        .flex.items-center.justify-between
          .text-xs.font-bold.text-white Создать упражнение
          el-button.px-8(
            size="small"
            round
            type="primary"
            @click="activePlainEditor = true"
          )
            icon-plus(size="14")

      section.section.history(class="backdrop-blur-[10px] bg-white/30")
        .flex.items-center.justify-between
          .text-xs.font-bold.text-white Список упражнений
          el-button(
            size="small"
            round
            type="primary"
            @click="exercisesList = true"
          )
            icon-eye(size="14")

      section.section(class="backdrop-blur-[10px] bg-white/30")
        .flex.items-center.justify-between
          .text-xs.font-bold.text-white Создать тренировку
          el-button(
            v-if="!store.state.editedWorkout"
            size="small"
            round
            type="primary"
            @click="createNewWorkout"
          )
            icon-plus(size="14")

      section.section(class="backdrop-blur-[10px] bg-white/30")
        workout-list(
          v-model="store.state.workouts"
          @start="store.commit('setActiveWorkout', $event)"
          @remove="store.commit('removeWorkout', $event)"
          @edit="store.commit('setEditedWorkout', $event)"
        )

      el-button(type="primary" @click="weightDiaryModalIsShow = !weightDiaryModalIsShow") Дневник веса

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

      el-drawer(
        v-model="activePlainEditor"
        title="Создать упражнение"
        size="100%"
      )
        plan-editor(@save="handlePlanSave")

      el-drawer(
        v-model="exercisesList"
        title="Список упражнение"
        size="100%"
      )
        exercises-list(:items="store.state.exercises", @remove="store.commit('removeExercise', $event)")

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
    background-color: #181236; /* Базовый цвет */
    background-image: linear-gradient(135deg, #1B082F 0%, #360F59 26%, #381578 51%, #1E0D4F 76%, #0B0417 100%);
    min-height: 100dvh;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: #181236; /* Базовый цвет */
    background-image: linear-gradient(
      to bottom right,
      rgba(45, 27, 90, 1) 0%,   /* Глубокий фиолетовый */
      rgba(30, 15, 60, 1) 40%,  /* Темно-синий */
      rgba(20, 10, 40, 1) 100%  /* Очень темный синий */
    );
  }

  .header {
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
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
    border-radius: 8px;
    padding: 1rem;
  }
</style>
