<template lang="pug">
  .workout-editor
    .flex.items-center.justify-between
      .text-xs.font-bold Создать тренировку
      el-button(
        v-if="!editedWorkout"
        size="small"
        round
        @click="create"
      )
        icon-plus(size="14")

    template(v-if="editedWorkout")
      .field
        .label Название
        s-validate(:v="v$.name")
          el-input(v-model="name", placeholder="День 1")

      exercise-item.mb-4(
        v-for="(exercise, idx) in exercisesFilteredByReady"
        :key="`exercise-item-${idx}`"
        :item-data="{ index: idx, ...exercise }"
        @click="$store.commit('setEditedExercise', exercise.exerciseId)"
      )
        el-button(
          round
          type="danger"
          size="small"
          @click.stop="removeExercise(exercise.exerciseId)"
        )
          icon-remove(size="14")

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
            v-model="exercise.repetition",
            placeholder="Выбор повторений"
          )
            el-option(
              v-for="(repetition, idxRepetition) in repetitions",
              :key="idxRepetition",
              :label="repetition",
              :value="repetition"
            )

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

        .field(
          v-if="exercise.isEdit ? exercise.exerciseId && exercise.repetition && exercise.approache : true"
        )
          .label Время отдыха (в мин)

          el-input-number(
            v-if="exercise.isEdit",
            v-model="exercise.restTime",
            placeholder="Задайте время"
          )

      .flex.flex-col
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
          @click="editedWorkout.id ? updateWorkout() : saveWorkout()"
        ) {{ editedWorkout.id ? 'Обновить' : 'Сохранить тренировку' }}
</template>

<script>
  import IconPlus from '~/components/ui/icons/plus';
  import ExerciseItem from '~/components/ExerciseItem';
  import SValidate from '~/components/ui/SValidate';
  import IconRemove from '~/components/ui/icons/remove';
  import { ref, computed, watch } from 'vue';
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';

  export default {
    name: 'WorkoutEditor',
    components: {
      SValidate,
      ExerciseItem,
      IconPlus,
      IconRemove
    },
    props: {
      exercisesList: {
        type: Array,
        default: () => []
      },
      editedWorkout: {
        type: Object,
        default: () => ({})
      }
    },
    emits: ['save', 'edited-workout:update', 'update'],
    setup (props, { emit }) {
      let name = ref('');
      const exerciseEmpty = {
        exerciseId: '',
        approache: '',
        repetition: '',
        weight: 0,
        restTime: 1,
        isEdit: true
      };

      const approaches = Array.from({ length: 30 }, (_, i) => i + 1);
      const repetitions = Array.from({ length: 30 }, (_, i) => i + 1);
      let exercises = ref([]);

      const add = () => {
        exercises.value.push(structuredClone(exerciseEmpty));
      };

      const exercisesFilteredByReady = computed(() => exercises.value.filter(el => !el.isEdit));
      const exercisesFilteredByEdit = computed(() => exercises.value.filter(el => el.isEdit));
      const exerciseIsActiveEdit = computed(() => !!exercisesFilteredByEdit.value.length);
      const currentIndex = computed(() => exercises.value.length - 1);
      const currentExercise = computed(() => exercises.value[currentIndex.value] || null);
      const saveTrainBtnIsShow = computed(() => exercises.value.length && !exerciseIsActiveEdit.value);
      const saveExerciseBtnIsShow = computed(() => !!(exerciseIsActiveEdit.value && currentExercise.value && currentExercise.value.exerciseId && currentExercise.value.approache && currentExercise.value.repetition));


      const saveExercise = () => {
        exercises.value[currentIndex.value].isEdit = false;
      }

      const reset = () => {
        name.value = '';
        exercises.value = [];
        emit('edited-workout:update', null);
      };

      const saveWorkout = () => {
        emit('save', {
          id: Date.now(),
          name: name.value,
          exercises: exercises.value
        });
        reset();
      };

      const updateWorkout = () => {
        emit('update', {
          id: props.editedWorkout.id,
          name: name.value,
          exercises: exercises.value
        });
        reset();
      };

      const create = () => {
        emit('edited-workout:update', {
          id: null,
          name: '',
          exercises: []
        });
      }

      const fillData = () => {
        name.value = ref(props.editedWorkout.name).value;
        exercises.value = ref(props.editedWorkout.exercises).value;
      };

      const removeExercise = id => exercises.value = exercises.value.filter(exercise => exercise.exerciseId !== id);

      watch(() => props.editedWorkout, newValue => newValue && fillData());

      return {
        name,
        add,
        create,
        exercises,
        approaches,
        repetitions,
        saveWorkout,
        updateWorkout,
        removeExercise,
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
            approache: { required },
            repetition: { required },
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

    ::v-deep() {
      .el-button + .el-button {
        margin-left: 0;
        margin-top: 15px;
      }
    }
  }
</style>
