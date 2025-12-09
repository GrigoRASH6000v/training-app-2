<template lang="pug">
  el-drawer(
    :model-value="modelValue",
    size="100%",
    @update:model-value="$emit('update:model-value', null)"
  )

    .workout
      el-button(@click="store.commit('clearHistory')") clear history
      timer(
        class="timer",
        :initialSeconds="60",
      )

      el-row.mb-4
        el-col(:span="22")
          .field
            .text-gray-500 Название
            .text-sm {{ workout.name }}

      div(
        v-for="(exercise, idx) in updatedExercises"
        :key="`exercise-item-${idx}`"
      )
        exercise-item(:item-data="exercise")
          el-button(
            size="small"
            text
            @click="toggleActiveExercise(exercise)"
          )
            icon-stop(
              v-if="exercise.isActive"
              size="14"
              :color="colors.yellow[800]"
            )
            icon-play(
              v-else
              size="14"
              :color="colors.green[500]"
            )

        s-expander
          div.pt-2(v-if="exercise.isActive")
            el-row
              el-col(:span="8")
                .text-xs.text-gray-500.mb-2 Подход
              el-col(:span="12")
                .text-xs.text-gray-500.mb-2 Вес
            div.mb-2(
              v-for="(approache, index) in exercise.approache"
              :key="`approache-${index}`"
            )
              el-row(:class="{'disabled': !approache.isActive}")
                el-col(:span="8")
                  .flex.items-center.h-full
                    .text-xs {{ getOrdinal(index + 1) }}
                el-col(:span="12")
                  el-input-number(
                    v-model="approache.weight"
                    :disabled="!approache.isActive"
                    size="small"
                  )
                el-col(:span="4")
                  el-button.ml-4(
                    :disabled="!approache.isActive || approache.weight === 0"
                    size="small"
                    text
                    @click="saveApproache(exercise.approache, index)"
                  )
                    icon-save(
                      size="14"
                      :color="!approache.isActive || approache.weight === 0 ? colors.gray[300] : colors.blue[500]"
                    )
        el-divider
</template>

<script>
  import Timer from '~/components/Timer';
  import IconSave from '~/components/ui/icons/save';
  import IconPen from '~/components/ui/icons/pen';
  import IconStop from '~/components/ui/icons/stop';
  import IconPlay from '~/components/ui/icons/play';
  import ExerciseItem from '~/components/ExerciseItem';
  import SExpander from '~/components/ui/SExpander';
  import { useStore } from 'vuex';
  import colors from 'tailwindcss/colors';
  import { ref, toRaw } from 'vue';
  import getOrdinal from '~/utils/getOrdinal';
  import { ElMessageBox } from 'element-plus';

  export default {
    name: 'WorkoutModal',
    emits: ['update:model-value'],
    components: {
      IconPen,
      IconStop,
      IconSave,
      Timer,
      ExerciseItem,
      IconPlay,
      SExpander
    },
    props: {
      modelValue: {
        type: Boolean,
        default: false,
      },
      workout: {
        type: Object,
        default: () => ({})
      }
    },
    setup(props) {
      const store = useStore();
      const historyId = Date.now();

      const lastIdenticalWorkout = store.state.history.reverse().find(el => el.workoutId === props.workout.id) || null;

      console.log('lastIdenticalWorkout', lastIdenticalWorkout);

      const getWeight = (exerciseId, approacheIndex) => {
        const res = lastIdenticalWorkout ? lastIdenticalWorkout.exercises.find(el => el.exerciseId === exerciseId)?.approache?.[approacheIndex]?.weight || 0 : 0;
        console.log('tesr', lastIdenticalWorkout.exercises.find(el => el.exerciseId === exerciseId))
        return res;
      };

      const updatedExercises = ref(props.workout.exercises.map(exercise => ({
        ...exercise,
        isActive: false,
        approache: Array(exercise.approache).fill(null).map((_, index) => ({ weight: getWeight(exercise.exerciseId, index), isActive: index === 0 }))
      })));

      const saveApproache = (approache, index) => {
        approache[index].isActive = false;
        approache[index + 1] ? approache[index + 1].isActive = true : null;
      }

      const runExercise = exercise => {
        exercise.isActive = true;
      }

      const saveExercise = exercise => {

        console.log('exercise', exercise)

        ElMessageBox.confirm(
          'Вы уверены, что сохранить упражнение в историю?',
          'Подтверждение действия',
          {
            confirmButtonText: 'Да',
            cancelButtonText: 'Нет',
            type: 'warning',
            center: true
          },
        )
          .then(() => {
            store.dispatch('saveWorkoutToHistory', {
              id: historyId,
              workoutId: props.workout.id,
              name: props.workout.name,
              exercises: updatedExercises.value.map(el => el.exerciseId === exercise.exerciseId ? toRaw(exercise) :  toRaw(el))
            });
            exercise.isActive = false;
          })
      }

      const toggleActiveExercise = exercise => {
        exercise.isActive ? saveExercise(exercise) : runExercise(exercise);
      };

      return {
        store,
        colors,
        getOrdinal,
        runExercise,
        saveExercise,
        saveApproache,
        updatedExercises,
        toggleActiveExercise
      };
    }
  };
</script>

<style lang="scss" scoped>
  .workout {
    .timer {
      margin-bottom: 40px;
    }

    .el-divider--horizontal {
      margin: 12px 0;
    }

    .disabled {
      position: relative;

      &:after {
        content: '';
        position: absolute;
        left: -5px;
        top: 0;
        height: 100%;
        width: calc(100% + 10px);
        background-color: var(--color-black);
        opacity: .1;
        z-index: 20;
      }
    }
  }
</style>
