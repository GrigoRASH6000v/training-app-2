<template lang="pug">
  el-drawer(
    :model-value="modelValue",
    :with-header="false"
    size="100%",
  )

    .h-full.flex.flex-col.gap-4(v-if="workout")
      .flex.flex-col
        .flex.items-center.justify-between.p-4.bg-stone-900.border-t.border-neutral-800.z-4
          el-button(
            text
            size="small"
            @click="closeDrawer"
          )
            icon-close

          .flex.flex-col
            .text-sm.text-neutral-200 {{ workout.name }}
            workout-timer(
              v-model="workout.timer"
              size="text-sm"
              @update:modelValue="updateWorkout"
            )

          el-button(
            text
            size="small"
            :type="workoutProgress === 100 ? 'primary' : 'default'"
            @click="finishWorkout"
          )
            icon-flag.mr-2(size="18")
            | Завершить

        el-progress(
          :percentage="workoutProgress"
          status="success"
          text-inside
        )

      transition(name="fade")
        .rounded-xl.border-1.border-lime-500.p-2.text-center(
          v-if="workoutProgress === 100"
          class="bg-lime-500/10"
        )
          .flex.items-center.justify-center.gap-2
            icon-check(size="16" :color="colors.lime[500]")
            .text-neutral-200.font-bold.text-sm Все подходы выполнены. Пора заканчивать!

      .overflow-auto.h-full
        .bg-stone-900.p-4.rounded-lg.border-1(
          v-for="(exercise, exerciseIdx) in workout.exercises"
          :key="`exercise-item-${exerciseIdx}`"
          :class="exerciseStyles(exerciseIdx)"
        )
          el-row
            el-col(:span="8")
              .text-xs.text-neutral-200.mb-2 Подход
            el-col(:span="12")
              .text-xs.text-neutral-200mb-2 Вес
          .mb-2(
            v-for="(approache, approacheIdx) in exercise.approache"
            :key="`approache-${approacheIdx}`"
          )
            el-row(:class="{'disabled': !approache.isActive}")
              el-col(:span="8")
                .flex.items-center.h-full
                  .text-xs.text-neutral-200 {{ getOrdinal(approacheIdx + 1) }}
              el-col(:span="9")
                el-input-number(
                  v-model="approache.weight"
                  :disabled="!approache.isActive"
                  size="small"
                  @change="updateWorkout"
                )
              el-col(:span="3")
                .flex.justify-center.h-full.items-center
                  icon-arrow-trend-up(
                    v-if="getTrend(exerciseIdx, approacheIdx, approache.weight) > 0"
                    size="14"
                    :color="colors.green[500]"
                  )
                  icon-arrow-trend-down(
                    v-if="getTrend(exerciseIdx, approacheIdx, approache.weight) < 0"
                    size="14"
                    :color="colors.red[500]"
                  )
              el-col(:span="4")
                .flex.justify-center.items-center.h-full
                  icon-check(
                    v-if="approache.isComplete"
                    size="16"
                    :color="colors.green[500]"
                  )

                  el-button(
                    v-else
                    :disabled="!approache.isActive || approache.weight === 0"
                    size="small"
                    text
                    @click="saveApproache(exerciseIdx, approacheIdx)"
                  )
                    icon-save(
                      size="14"
                      :color="!approache.isActive || approache.weight === 0 ? colors.gray[300] : colors.blue[500]"
                    )

      s-expander
        .flex.items-center.justify-between(v-if="currentTime !== null && workoutProgress !== 100" )
          timer(:initial-seconds="currentTime" size="64")
</template>

<script>
  import Timer from '~/components/Timer';
  import WorkoutTimer from '~/components/WorkoutTimer';
  import IconSave from '~/components/ui/icons/save';
  import IconPen from '~/components/ui/icons/pen';
  import IconArrowTrendUp from '~/components/ui/icons/arrow-trend-up';
  import IconArrowTrendDown from '~/components/ui/icons/arrow-trend-down';
  import IconStop from '~/components/ui/icons/stop';
  import IconPlay from '~/components/ui/icons/play';
  import IconClose from '~/components/ui/icons/close';
  import IconCheck from '~/components/ui/icons/check';
  import IconFlag from '~/components/ui/icons/flag';
  import ExerciseItem from '~/components/ExerciseItem';
  import SExpander from '~/components/ui/SExpander';
  import { useStore } from 'vuex';
  import colors from 'tailwindcss/colors';
  import { ref, computed, reactive } from 'vue';
  import getOrdinal from '~/utils/getOrdinal';
  import sleep from '~/utils/sleep';
  import { ElMessageBox } from 'element-plus';

  export default {
    name: 'WorkoutModal',
    emits: ['close'],
    components: {
      IconPen,
      IconStop,
      IconSave,
      IconPlay,
      IconClose,
      IconFlag,
      IconCheck,
      IconArrowTrendUp,
      IconArrowTrendDown,
      Timer,
      WorkoutTimer,
      ExerciseItem,
      SExpander
    },
    props: {
      modelValue: {
        type: Boolean,
        default: false,
      },
    },
    setup(_, ctx) {
      const store = useStore();
      const firstApproacheIsSaved = ref(false);
      const currentTime = ref(null);
      const activeWorkout = store.state.activeWorkout;
      const workout = reactive(activeWorkout ? { ...activeWorkout } : null);
      const lastIdenticalWorkout = workout && store.state.history.reverse().find(el => el.workoutId === workout.id) || null ;

      const closeDrawer = () => {
        ElMessageBox.confirm(
          'Записанные веса не сохранятся в истории.',
          'Отменить тренировку?',
          {
            confirmButtonText: 'Да',
            cancelButtonText: 'Нет',
            type: 'error',
            center: true
          },
        )
          .then(() => {
            store.commit('setActiveWorkout', null);
            ctx.emit('close');
          })
      }

      const getTrend = (exerciseIdx, approacheIdx, weight) => {
        return lastIdenticalWorkout ? weight - lastIdenticalWorkout.exercises[exerciseIdx]?.approache?.[approacheIdx]?.weight || 0 : 0 ;
      };

      const workoutProgress = computed(() => {
        const { total, completed } = workout.exercises.reduce((acc, exercise) => {
          exercise.approache.forEach(approache => {
            acc.total += 1;
            if (approache.isComplete) acc.completed += 1;
          });
          return acc;
        }, { total: 0, completed: 0 });
        return total ? Math.round((completed / total) * 100) : 0;
      });

      const updateCurrentTime = () => {
        currentTime.value = workout.exercises.find(exercise => exercise.isActive && exercise.approache.length ? !!exercise.approache.find(approache => approache.isActive) : false)?.restTime || 120;
      };

      const saveApproache = async (exerciseIdx, approacheIdx) => {
        currentTime.value = null;
        if (!firstApproacheIsSaved.value) firstApproacheIsSaved.value = true;

        const exercise = workout.exercises[exerciseIdx];
        const approache = exercise.approache[approacheIdx];

        approache.isActive = false;
        approache.isComplete = true;

        exercise.approache[approacheIdx + 1] ? exercise.approache[approacheIdx + 1].isActive = true : null;

        const allApproacheIsComplete = exercise.approache.every(el => el.isComplete);

        const hasNextExercise = workout.exercises[exerciseIdx + 1]
        if (allApproacheIsComplete) {
          exercise.isActive = false;
          exercise.isComplete = true;

          if (hasNextExercise) {
            workout.exercises[exerciseIdx + 1].isActive = true;
            workout.exercises[exerciseIdx + 1].approache[0].isActive = true;
          }
        }

        if (!firstApproacheIsSaved.value) return null;
        await sleep(100);
        updateCurrentTime();
      }

      const exerciseStyles = idx => ([
        { 'mb-4': idx !== workout.exercises.length - 1 },
        workout.exercises[idx].isActive ? 'border-lime-500' : 'opacity-50 pointer-events-none border-transparent'
      ]);

      const finishWorkout = () => {
        console.log(workoutProgress)
        ElMessageBox.confirm(
          workoutProgress.value === 100 ? 'Все подходы выполнены — отличный результат!' : 'Не все упражнения выполнены',
          'Завершить тренировку?',
          {
            confirmButtonText: 'Да',
            cancelButtonText: 'Нет',
            type: workoutProgress.value === 100 ? 'success' :  'warning',
            center: true
          },
        )
          .then(() => {
            store.commit('setActiveWorkout', null);
            store.dispatch('saveWorkoutToHistory', {
              id: Date.now(),
              workoutId: workout.id,
              name: workout.name,
              exercises: workout.exercises.map(exercise => ({
                exerciseId: exercise.exerciseId,
                repetition: exercise.repetition,
                restTime: exercise.restTime,
                weight: exercise.weight,
                approache: exercise.approache.map(approache => ({
                  trend: approache.trend,
                  weight: approache.weight
                }))
              }))
            });
            ctx.emit('close');
          })
      };

      const updateWorkout = () => store.commit('setActiveWorkout', workout);

      return {
        store,
        colors,
        workout,
        getTrend,
        getOrdinal,
        currentTime,
        closeDrawer,
        finishWorkout,
        saveApproache,
        updateWorkout,
        exerciseStyles,
        workoutProgress,
      };
    }
  };
</script>

<style lang="scss" scoped>
  .el-divider--horizontal {
    margin: 12px 0;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
