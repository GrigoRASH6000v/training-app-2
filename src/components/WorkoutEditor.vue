<template lang="pug">
  .workout-editor
    h2 Создать тренировку

    .field
      .label Название
      el-input(v-model="name", placeholder="День 1")

    div(
      v-for="(exercise, idx) in exercises",
      :key="idx"
    )
      .field
        .label Название упражнения

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

        span(v-else) {{ exercise.exerciseId }}

      .field(
        v-if="exercise.isEdit ? exercise.exerciseId : true"
      )
        .label Кол-во повторений

        el-select(
          v-if="exercise.isEdit",
          v-model="exercise.repetition",
          placeholder="Выбор повторений"
        )
          el-option(
            v-for="(repetition, idxRepetition) in repetitions",
            :key="idxRepetition",
            :label="repetition",
            :value="repetition"
          )

        span(v-else) {{ exercise.repetition }}

      .field(
        v-if="exercise.isEdit ? exercise.exerciseId && exercise.repetition : true"
      )
        .label Кол-во подходов

        el-select(
          v-if="exercise.isEdit",
          v-model="exercise.approache",
          placeholder="Выбор подходов"
        )
          el-option(
            v-for="(approache, idxApproaches) in approaches",
            :key="idxApproaches",
            :label="approache",
            :value="approache"
          )

        span(v-else) {{ exercise.approache }}

      .field(
        v-if="exercise.isEdit ? exercise.exerciseId && exercise.repetition && exercise.approache : true"
      )
        .label Время отдыха (в мин)

        el-input-number(
          v-if="exercise.isEdit",
          v-model="exercise.restTime",
          placeholder="Задайте время"
        )

        span(v-else) {{ exercise.restTime }} мин

      el-button(
        v-if="exercise.isEdit",
        @click="saveExercise(exercise)"
      ) Сохранить

    el-button(
      v-if="exerciseIsActiveEdit",
      @click="add"
    ) Добавить упражнение

    el-button(
      v-if="exerciseIsActiveEdit",
      type="primary",
      @click="saveWorkout"
    ) Сохранить тренировку
</template>

<script>
  import { ref, computed } from 'vue';

  export default {
    name: 'WorkoutEditor',
    props: {
      exercisesList: {
        type: Array,
        default: () => []
      }
    },
    emits: ['save'],
    setup (props, { emit }) {
      const name = ref('');
      const exercise = {
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
      const exerciseIsActiveEdit = computed(() => exercises.value.map(exercise => exercise.isEdit).every(el => !el));


      const add = () => {
        exercises.value.push({ id: Date.now(), ...exercise });
      };

      const saveExercise = exercise => {
        exercise.isEdit = false;
      };

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
        saveExercise,
        saveWorkout,
        exerciseIsActiveEdit
      };
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
