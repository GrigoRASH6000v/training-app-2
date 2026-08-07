<template lang="pug">
  el-drawer(
    :model-value="modelValue",
    :with-header="false"
    size="100%",
    @update:model-value="$emit('update:model-value', null)"
  )
    .h-full.flex.flex-col
      .bg-white.sticky.top-0.z-4
        .flex.items-center.justify-end
          el-button(
            text
            size="small"
            @click="closeDrawer"
          )
            icon-close
        el-divider

      template(v-if="fullExercise" )
        el-row.mb-4(v-if="fullExercise.detail" )
          el-col(:span="22")
            .flex.flex-col
              .text-xs.text-gray-500 Название
              .text-xs {{ fullExercise.detail.title }}

        el-row.mb-4
          el-col(:span="22")
            .flex.flex-col
              .text-xs.text-gray-500.mb-2 Кол-во повторений
              el-select(
                v-model="repetition",
                placeholder="Выбор повторений"
              )
                el-option(
                  v-for="(item, idxRepetition) in repetitions",
                  :key="idxRepetition",
                  :label="item",
                  :value="item"
                )

        el-row.mb-4
          el-col(:span="22")
            .flex.flex-col
              .text-xs.text-gray-500.mb-2 Кол-во подходов
              el-select(
                v-model="approache",
                placeholder="Выбор повторений"
              )
                el-option(
                  v-for="(item, idxRepetition) in approaches",
                  :key="idxRepetition",
                  :label="item",
                  :value="item"
                )

        el-row.mb-8
          el-col(:span="22")
            .flex.flex-col
              .text-xs.text-gray-500.mb-2 Время отдыха (в мин)
              el-input-number(
                v-model="restTime",
                placeholder="Задайте время"
              )

        el-row.mt-auto
          el-col(:span="22")
            el-button(
              type="primary"
              @click="save"
            ) Сохранить

</template>

<script>
  import IconClose from '~/components/ui/icons/close';
  import SValidate from '~/components/ui/SValidate';
  import { ElMessageBox } from 'element-plus';
  import { required } from '@vuelidate/validators';
  import { toRaw, ref } from 'vue';
  import { useVuelidate } from '@vuelidate/core';
  import { ElNotification } from 'element-plus'
  import { useStore } from "vuex";

  export default {
    name: 'ExerciseEditModal',
    emits: ['update:model-value'],
    components: {
      IconClose,
      SValidate
    },
    props: {
      modelValue: {
        type: Boolean,
        default: false,
      },
      exercise: {
        type: Object,
        default: () => ({})
      }
    },
    setup(props, ctx) {
      const store = useStore();
      const rawExercise = toRaw(props.exercise);
      const exerciseLocal = structuredClone(rawExercise);
      const fullExercise = { ...exerciseLocal, detail: exerciseLocal ? toRaw(store.getters.getExerciseById(exerciseLocal.exerciseId)) : null };
      const repetitions = Array.from({ length: 30 }, (_, i) => i + 1);
      const repetition = ref(fullExercise.repetition);
      const approache = ref(fullExercise.approache);
      const approaches = Array.from({ length: 30 }, (_, i) => i + 1);
      const restTime = ref(fullExercise.restTime);

      const v$ = useVuelidate();

      const save = () => {
        v$.value.$touch();
        if (v$.value.$error) {
          ElNotification.warning({ title: 'Внимание', message: 'Заполните все обязательные поля' })
        } else {
          try {
            store.commit('updateExerciseInWorkout', {
              workoutId: store.state.editedWorkout.id,
              exerciseId: props.exercise.exerciseId,
              updates: {
                approache: approache.value,
                repetition: repetition.value,
                restTime: restTime.value
              }
            });
            ElNotification.success({ title: 'Успех', message: 'Упражнение обновлено' });
            ctx.emit('update:model-value', null);
          } catch (error) {
            ElNotification.success({ title: 'Ошибка', message: 'Ошибка при обновлении упражнения' })
            console.warn(error);
          }
        }
      }

      const closeDrawer = () => {
        ElMessageBox.confirm(
          'Сохранить изменения?',
          'Подтверждение действия',
          {
            confirmButtonText: 'Да',
            cancelButtonText: 'Нет',
            type: 'warning',
            center: true
          },
        ).then(save).catch(() => ctx.emit('update:model-value', null))
      }

      return {
        v$,
        save,
        restTime,
        approache,
        approaches,
        repetition,
        repetitions,
        closeDrawer,
        fullExercise,
      };
    },
    validations () {
      return {
        approache: { required },
        repetition: { required },
        restTime: { required }
      }
    }
  }
</script>
