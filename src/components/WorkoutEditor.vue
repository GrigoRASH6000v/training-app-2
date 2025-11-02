<template>
  <div class="workout-editor">
    <h2>Создать тренировку</h2>

    <div class="field">
      <div class="label">Название</div>
      <el-input v-model="name" placeholder="День 1"/>
    </div>

    <div
      v-for="(exercise, idx) in exercises"
      :key="idx"
    >
      <div class="field">
        <div class="label">Название упражнения</div>

        <el-select
          v-if="exercise.isEdit"
          v-model="exercise.exerciseId"
          placeholder="Выбор упражнения"
        >
          <el-option
            v-for="item in exercisesList"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>

        <span v-else>{{ exercise.exerciseId }}</span>
      </div>

      <div v-if="exercise.isEdit ? exercise.exerciseId : true" class="field">
        <div class="label">Кол-во повторений</div>

        <el-select
          v-if="exercise.isEdit"
          v-model="exercise.repetition"
          placeholder="Выбор повторений"
        >
          <el-option
            v-for="(repetition, idxRepetition) in repetitions"
            :key="idxRepetition"
            :label="repetition"
            :value="repetition"
          >
          </el-option>
        </el-select>

        <span v-else>{{ exercise.repetition }}</span>
      </div>

      <div v-if="exercise.isEdit ? exercise.exerciseId && exercise.repetition : true" class="field">
        <div class="label">Кол-во подходов</div>

        <el-select
          v-if="exercise.isEdit"
          v-model="exercise.approache"
          placeholder="Выбор подходов"
        >
          <el-option
            v-for="(approache, idxApproaches) in approaches"
            :key="idxApproaches"
            :label="approache"
            :value="approache"
          >
          </el-option>
        </el-select>

        <span v-else>{{ exercise.approache }}</span>
      </div>

      <div v-if="exercise.isEdit ? exercise.exerciseId && exercise.repetition && exercise.approache : true" class="field">
        <div class="label">Время отдыха (в мин)</div>

        <el-input-number
          v-if="exercise.isEdit"
          v-model="exercise.restTime"
          placeholder="Задайте время"
        />

        <span v-else>{{ exercise.restTime }} мин</span>
      </div>

      <el-button v-if="exercise.isEdit" @click="saveExercise(exercise)">Сохранить</el-button>
    </div>

    <el-button v-if="exerciseIsActiveEdit" @click="add">Добавить упражнение</el-button>
    <el-button
      v-if="exerciseIsActiveEdit"
      type="primary"
      @click="saveWorkout"
    >Сохранить тренировку</el-button>
  </div>
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
