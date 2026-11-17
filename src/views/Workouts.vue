<template lang="pug">
  h1.text-white.text-sm.font-bold Тренировки

  section.section
    .flex.items-center.justify-between
      .text-xs.font-bold.text-white Создать тренировку
      el-button(
        v-if="!store.editedWorkout"
        size="small"
        round
        type="primary"
        @click="createNewWorkout"
      )
        icon-plus(size="14")

  template(v-if="store.workouts.length")
    h2.text-white.text-sm.font-bold Список тренировок

    workout-list(
      v-model="store.workouts"
      @start="setActiveWorkout"
      @remove="id => store.workouts = store.workouts.filter(w => w.id !== id)"
      @edit="editWorkout"
    )

  section.section(v-else)
    icon-clipboard.mb-2.mx-auto(size="24" :color="colors.gray[500]")
    p.text-gray-500.text-center Нет ни одной тренировки — создайте первую выше

  workout-modal(
    v-if="workoutModalIsShow"
    :model-value="!!store.activeWorkout"
    @close="workoutModalIsShow = false"
  )

  exercise-edit-modal(
    v-if="!!store.editedExercise"
    :model-value="!!store.editedExercise"
    :exercise="store.getExerciseInWorkoutById(store.editedExercise)"
    @update:model-value="store.editedExercise = null"
  )

  el-drawer(
    :model-value="!!store.editedWorkout"
    body-class="!pl-5 !pr-1"
    header-class="!mb-2"
    :title="store.editedWorkout?.id ? 'Редактирование тренировки' : 'Создание тренировки'"
    :size="mq.sm ? '100%' : 375"
    @update:model-value="store.editedWorkout = null"
  )
    workout-editor(
      v-if="!!store.editedWorkout"
      :exercises-list="store.exercises"
      :edited-workout="store.editedWorkout"
      :is-edit="workoutIsEdit"
      @edited-workout:update="val => store.editedWorkout = val"
      @save="workout => store.workouts.push(workout)"
      @update="updated => { const idx = store.workouts.findIndex(w => w.id === updated.id); if (~idx) store.workouts[idx] = updated; }"
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
  import { useStore } from '~/store';
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
        store.editedWorkout = {
          id: null,
          name: '',
          exercises: []
        };
      };

      const editWorkout = (v) => {
        workoutIsEdit.value = true;
        store.editedWorkout = v;
      }

      const setActiveWorkout = workoutId => {
        const fullWorkout = store.getWorkoutById(workoutId);
        const lastIdenticalWorkout = store.history.reverse().find(el => el.workoutId === workoutId) || null;

        const getTrend = (exerciseIdx, approacheIndex, weight) => {
          return lastIdenticalWorkout ? weight - lastIdenticalWorkout.exercises[exerciseIdx]?.approache?.[approacheIndex]?.weight || 0 : 0 ;
        };

        const getWeight = (exercise, approacheIndex) => lastIdenticalWorkout ? lastIdenticalWorkout.exercises.find(el => el.exerciseId === exercise.exerciseId)?.approache?.[approacheIndex]?.weight || 0 : 0;

        const updatedWorkout = {
          ...fullWorkout,
          timer: 0,
          exercises: fullWorkout.exercises.map((exercise, idx) => ({
            ...exercise,
            title: store.getExerciseById(exercise.exerciseId)?.title || '',
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

        store.activeWorkout = updatedWorkout;
      }

      watch(() => !!store.activeWorkout, newValue => {
        if (newValue) workoutModalIsShow.value = true;
      }, { immediate: true });

      watch(() => store.editedWorkout, (v) => {
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
