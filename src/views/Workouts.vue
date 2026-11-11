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

  template(v-if="store.state.workouts.length")
    h2.text-white.text-sm.font-bold Список тренировок

    workout-list(
      v-model="store.state.workouts"
      @start="setActiveWorkout"
      @remove="store.commit('removeWorkout', $event)"
      @edit="editWorkout"
    )

  section.section(v-else)
    icon-clipboard.mb-2.mx-auto(size="24" :color="colors.gray[500]")
    p.text-gray-500.text-center Нет ни одной тренировки — создайте первую выше

  workout-modal(
    v-if="workoutModalIsShow"
    :model-value="!!store.state.activeWorkout"
    @close="workoutModalIsShow = false"
  )

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
      v-if="!!store.state.editedWorkout"
      :exercises-list="store.state.exercises"
      :edited-workout="store.state.editedWorkout"
      :is-edit="workoutIsEdit"
      @edited-workout:update="store.commit('setEditedWorkout', $event)"
      @save="store.commit('addWorkout', $event)"
      @update="store.commit('updateWorkout', $event)"
    )
</template>

<script>
  import ExerciseEditModal from '~/components/ExerciseEditModal';
  import WorkoutModal from '~/components/WorkoutModal';
  import WorkoutEditor from '~/components/WorkoutEditor';
  import WorkoutList from '~/components/WorkoutList';
  import IconPlus from '~/components/ui/icons/plus';
  import IconClipboard from '~/components/ui/icons/clipboard';
  import colors from 'tailwindcss/colors';
  import { useMq } from 'vue3-mq';
  import { useStore } from 'vuex';
  import { ref, watch } from 'vue';

  export default {
    name: 'WorkoutsView',
    components: {
      IconPlus,
      WorkoutList,
      WorkoutModal,
      IconClipboard,
      WorkoutEditor,
      ExerciseEditModal,
    },
    setup () {
      const mq = useMq();
      const store = useStore();
      const exercisesList = ref(false);
      const workoutModalIsShow = ref(false);
      const workoutIsEdit = ref(false);

      const createNewWorkout = () => {
        store.commit('setEditedWorkout', {
          id: null,
          name: '',
          exercises: []
        });
      };

      const editWorkout = (v) => {
        workoutIsEdit.value = true;
        store.commit('setEditedWorkout', v);
      }

      const setActiveWorkout = workoutId => {
        const fullWorkout = store.getters.getWorkoutById(workoutId);
        const lastIdenticalWorkout = store.state.history.reverse().find(el => el.workoutId === workoutId) || null;

        const getTrend = (exerciseIdx, approacheIndex, weight) => {
          return lastIdenticalWorkout ? weight - lastIdenticalWorkout.exercises[exerciseIdx]?.approache?.[approacheIndex]?.weight || 0 : 0 ;
        };

        const getWeight = (exercise, approacheIndex) => lastIdenticalWorkout ? lastIdenticalWorkout.exercises.find(el => el.exerciseId === exercise.exerciseId)?.approache?.[approacheIndex]?.weight || 0 : 0;

        const updatedWorkout = {
          ...fullWorkout,
          timer: 0,
          exercises: fullWorkout.exercises.map((exercise, idx) => ({
            ...exercise,
            title: store.getters.getExerciseById(exercise.exerciseId)?.title || '',
            isActive: idx === 0,
            isComplete: false,
            approache: Array(exercise.approache).fill(null).map((_, index) => ({
              weight: getWeight(exercise, index),
              trend: getTrend(exercise, index),
              isActive: idx === 0 && index === 0,
              isComplete: false,
              isChanged: false
            }))
          }))
        };

        store.commit('setActiveWorkout', updatedWorkout);
      }

      watch(() => !!store.state.activeWorkout, newValue => {
        if (newValue) workoutModalIsShow.value = true;
      }, { immediate: true });

      watch(() => store.state.editedWorkout, (v) => {
        if (!v) workoutIsEdit.value = false;
      });

      return {
        workoutModalIsShow,
        createNewWorkout,
        setActiveWorkout,
        exercisesList,
        workoutIsEdit,
        editWorkout,
        colors,
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

