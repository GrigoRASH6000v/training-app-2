<template lang="pug">
  h1.text-white.text-sm.font-bold Тренировки

  section.section
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

  section.section
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
    :model-value="!!store.state.editedWorkout",
    body-class="px-4"
    header-class="!mb-2"
    :title="store.state.editedWorkout?.id ? 'Редактирование тренировки' : 'Создание тренировки'"
    :size="mq.sm ? '100%' : 375"
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
  import WeightDiaryModal from '~/components/WeightDiaryModal';
  import ExerciseEditModal from '~/components/ExerciseEditModal';
  import WorkoutModal from '~/components/WorkoutModal';
  import WorkoutEditor from '~/components/WorkoutEditor';
  import WorkoutList from '~/components/WorkoutList';
  import IconPlus from '~/components/ui/icons/plus';
  import { useMq } from 'vue3-mq';
  import { useStore } from 'vuex';
  import { ref } from 'vue';

  export default {
    name: 'WorkoutsView',
    components: {
      IconPlus,
      WorkoutList,
      WorkoutModal,
      WorkoutEditor,
      WeightDiaryModal,
      ExerciseEditModal,
    },
    setup () {
      const mq = useMq();
      const store = useStore();
      const weightDiaryModalIsShow = ref(false);
      const exercisesList = ref(false);

      store.dispatch('initializeStore');

      const createNewWorkout = () => {
        store.commit('setEditedWorkout', {
          id: null,
          name: '',
          exercises: []
        });
      }

      return {
        weightDiaryModalIsShow,
        exercisesList,
        createNewWorkout,
        store,
        mq
      };
    }
  };
</script>

<style scoped lang="scss">
  .section {
    background-color: $black;
  }
</style>

