<template lang="pug">
  .h-full.flex.flex-col
    .field(v-if="!nameIsSave" )
      .text-xs.t.bg-grayext-gray-500.mb-2 Название
      s-validate(:v="v$.name")
        el-input(v-model="name", placeholder="День 1")

    h1.text-white.text-sm.font-bold.mb-4(v-else) {{ name }}

    .bg-gray.p-4.rounded.rounded-lg(
      v-for="(exercise, idx) in exercisesFilteredByEdit",
      :key="idx"
    )
      el-select.mb-4(
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

      .flex.gap-4.mb-4
        .flex.flex-1.flex-col(
          v-if="exercise.isEdit"
        )
          .text-xs.text-gray-500.mb-2.mx-auto.uppercase Подходы
          el-input-number(
            v-if="exercise.isEdit"
            v-model="exercise.repetition"
            class="!w-full"
            placeholder="Выбор повторений"
            :max="30"
            size="small"
          )

        .flex.flex-1.flex-col(
          v-if="exercise.isEdit"
        )
          .text-xs.text-gray-500.mb-2.mx-auto.uppercase Повторения

          el-input-number(
            v-if="exercise.isEdit"
            v-model="exercise.approache"
            class="!w-full"
            placeholder="Выбор подходов"
            :max="30"
            size="small"
          )

        .flex.flex-1.flex-col(v-if="exercise.isEdit")
          .text-xs.text-gray-500.mb-2.mx-auto.uppercase Отдых, сек

          el-input-number(
            v-if="exercise.isEdit",
            v-model="exercise.restTime",
            class="!w-full"
            placeholder="Задайте время"
            size="small"
          )

      el-button.w-full(
        :disabled="!saveExerciseBtnIsReady"
        type="primary"
        @click="saveExercise"
      )
        icon-plus.mr-2(size="14")
        | Добавить

    .flex.flex-col.mb-4
      el-button(
        v-if="!nameIsSave"
        type="primary"
        :disabled="!name"
        @click="createWorkout"
      )
        icon-plus(size="14").mr-2
        | Создать тренировку

      el-button(
        v-if="nameIsSave && !exerciseIsActiveEdit",
        @click="add"
      )
        icon-plus.mr-2(size="14")
        | Добавить упражнение

    vue-draggable(
      ref="el"
      v-model="exercises"
      delay="200"
      drag-class="drag"
      chosen-class="chosen-item"
    )
      exercise-item.mb-4.cursor-pointer(
        v-for="(exercise, idx) in exercisesFilteredByReady"
        :key="`exercise-item-${idx}`"
        :item-data="{ index: idx, ...exercise }"
        :is-edited="isEdit"
        @update="$event => handleUpdateExercise(idx, $event)"
      )
        el-button(
          class="!px-1 !w-5 !h-5 !bg-transparent !border-transparent"
          round
          size="small"
          @click.stop="removeExercise(exercise.exerciseId)"
        )
          icon-remove(size="14" :color="colors.red['400']")

    el-button.sticky.mt-auto(
      v-if="saveTrainBtnIsShow"
      type="primary"
      @click="editedWorkout.id ? updateWorkout() : saveWorkout()"
    ) {{ editedWorkout.id ? 'Обновить' : 'Сохранить тренировку' }}
</template>

<script>
  import ExerciseItem from '~/components/ExerciseItem';
  import SValidate from '~/components/ui/SValidate';
  import IconRemove from '~/components/ui/icons/remove';
  import IconPlus from '~/components/ui/icons/plus';
  import IconMenu from '~/components/ui/icons/menu';
  import colors from 'tailwindcss/colors';
  import { ref, computed, watch } from 'vue';
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';
  import { VueDraggable } from 'vue-draggable-plus'

  export default {
    name: 'WorkoutEditor',
    components: {
      IconPlus,
      IconMenu,
      SValidate,
      IconRemove,
      ExerciseItem,
      VueDraggable,
    },
    props: {
      exercisesList: {
        type: Array,
        default: () => []
      },
      editedWorkout: {
        type: Object,
        default: () => ({})
      },
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    emits: ['save', 'edited-workout:update', 'update'],
    setup (props, { emit }) {
      let name = ref('');
      const nameIsSave = ref(false);

      const exerciseEmpty = {
        exerciseId: '',
        approache: 3,
        repetition: 8,
        weight: 0,
        restTime: 120,
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
      const saveExerciseBtnIsReady = computed(() => !!(exerciseIsActiveEdit.value && currentExercise.value && currentExercise.value.exerciseId && currentExercise.value.approache && currentExercise.value.repetition));

      const saveExercise = () => {
        exercises.value[currentIndex.value].isEdit = false;
      }

      const handleUpdateExercise = (index, { name, value }) => exercises.value[index][name] = value;

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

      const createWorkout = () => {
        nameIsSave.value = true;
        add();
      }

      watch(() => props.editedWorkout, newValue => newValue && fillData());

      return {
        add,
        name,
        create,
        colors,
        exercises,
        nameIsSave,
        approaches,
        repetitions,
        saveWorkout,
        saveExercise,
        currentIndex,
        createWorkout,
        updateWorkout,
        removeExercise,
        saveTrainBtnIsShow,
        handleUpdateExercise,
        exerciseIsActiveEdit,
        saveExerciseBtnIsReady,
        exercisesFilteredByEdit,
        exercisesFilteredByReady,
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

<style scoped lang="scss">
  .chosen-item {
    border-color: #6a7282;
  }
</style>
