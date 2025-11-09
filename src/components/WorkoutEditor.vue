<template lang="pug">
  .workout-editor
    h3 Создать тренировку

    .field
      .label Название

      s-validate(:v="v$.name")
        el-input(v-model="name", placeholder="День 1")

    exercise-item(
      v-for="(exercise, idx) in exercisesFilteredByReady"
      :key="`exercise-item-${idx}`"
      :item-data="{ index: idx, ...exercise }"
    )

    div(
      v-for="(exercise, idx) in exercisesFilteredByEdit",
      :key="idx"
    )
      .field
        el-select(
          v-if="exercise.isEdit",
          v-model="exercise.exerciseId",
          placeholder="Выбор упражнения"
        )
          el-option(
            v-for="item in exercisesList",
            :key="item.id",
            :label="item.title",
            :value="item.id"
          )

      .field(
        v-if="exercise.isEdit ? exercise.exerciseId : true"
      )
        .label Кол-во повторений

        el-select(
          v-if="exercise.isEdit",
          v-model="exercise.repetitions",
          placeholder="Выбор повторений"
        )
          el-option(
            v-for="(repetition, idxRepetition) in repetitions",
            :key="idxRepetition",
            :label="repetition",
            :value="repetition"
          )

      .field(
        v-if="exercise.isEdit ? exercise.exerciseId && exercise.repetitions : true"
      )
        .label Кол-во подходов

        el-select(
          v-if="exercise.isEdit",
          v-model="exercise.approaches",
          placeholder="Выбор подходов"
        )
          el-option(
            v-for="(approache, idxApproaches) in approaches",
            :key="idxApproaches",
            :label="approache",
            :value="approache"
          )

      .field(
        v-if="exercise.isEdit ? exercise.exerciseId && exercise.repetitions && exercise.approaches : true"
      )
        .label Время отдыха (в мин)

        el-input-number(
          v-if="exercise.isEdit",
          v-model="exercise.restTime",
          placeholder="Задайте время"
        )

    el-button(
      v-if="!exerciseIsActiveEdit",
      @click="add"
    ) Добавить упражнение

    el-button(
      v-if="saveExerciseBtnIsShow"
      type="primary",
      @click="saveExercise"
    ) Сохранить упражнение

    el-button(
      v-if="saveTrainBtnIsShow"
      type="primary",
      @click="saveWorkout"
    ) Сохранить тренировку
</template>

<script>
  import ExerciseItem from '~/components/ExerciseItem';
  import SValidate from '~/components/ui/SValidate';
  import { ref, computed, reactive } from 'vue';
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';

  export default {
    name: 'WorkoutEditor',
    components: {
      SValidate,
      ExerciseItem
    },
    props: {
      exercisesList: {
        type: Array,
        default: () => []
      }
    },
    emits: ['save'],
    setup (props, { emit }) {
      const name = ref('');
      const exerciseEmpty = {
        exerciseId: '',
        approaches: '',
        repetitions: '',
        weight: 0,
        restTime: 1,
        isEdit: true
      };

      const approaches = Array.from({ length: 30 }, (_, i) => i + 1);
      const repetitions = Array.from({ length: 30 }, (_, i) => i + 1);
      const exercises = ref([]);

      const add = () => {
        exercises.value.push({ id: Date.now(), ...exerciseEmpty });
      };

      const exercisesFilteredByReady = computed(() => exercises.value.filter(el => !el.isEdit));
      const exercisesFilteredByEdit = computed(() => exercises.value.filter(el => el.isEdit));
      const exerciseIsActiveEdit = computed(() => !!exercisesFilteredByEdit.value.length);
      const currentIndex = computed(() => exercises.value.length - 1);
      const currentExercise = computed(() => exercises.value[currentIndex.value] || null);
      const saveTrainBtnIsShow = computed(() => exercises.value.length && !exerciseIsActiveEdit.value);
      const saveExerciseBtnIsShow = computed(() => !!(exerciseIsActiveEdit.value && currentExercise.value && currentExercise.value.exerciseId && currentExercise.value.approaches && currentExercise.value.repetitions));


      const saveExercise = () => {
        exercises.value[currentIndex.value].isEdit = false;
      }

      const saveWorkout = () => {
        emit('save', {
          id: Date.now(),
          name: name.value,
          exercises: exercises.value
        });
      };

      return {
        name,
        add,
        exercises,
        approaches,
        repetitions,
        saveWorkout,
        currentIndex,
        saveExercise,
        saveTrainBtnIsShow,
        saveExerciseBtnIsShow,
        exercisesFilteredByReady,
        exercisesFilteredByEdit,
        exerciseIsActiveEdit,
        v$: useVuelidate(),
      };
    },
    validations () {
      return {
        name: { required },
        exercises: {
          $each: {
            exerciseId: { required },
            approaches: { required },
            repetitions: { required },
          }
        },
      }
    }
  };
</script>

<style lang="scss" scoped>
  .workout-editor {
    .field {
      display: flex;
      flex-direction: column;
    }
    .label {
      font-size: 12px;
      color: #555;
      margin-bottom: 4px;
    }

    .field {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
    }
  }
</style>
