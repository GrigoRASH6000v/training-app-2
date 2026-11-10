<template lang="pug">
  el-drawer(
    :model-value="modelValue"
    title="Добавить запись"
    header-class="!mb-0"
    size="100%"
    @update:model-value="$emit('update:model-value', false)"
  )
    .flex.flex-col.h-full.p-4
      weight-picker.mb-6(v-model="weight")

      .mx-auto(v-if="trendIsShow")
        icon-arrow-trend-up(
          v-if="trend < 0"
          size="20"
          :color="colors.red[500]"
        )
        icon-arrow-trend-down(
          v-else-if="trend > 0"
          size="20"
          :color="colors.green[500]"
        )

      .flex.flex-col.gap-2.mt-auto
        el-button.w-full(type="primary" @click="save") Сохранить
        el-button.w-full(class="!ml-0" @click="$emit('update:model-value', false)") Отмена
</template>

<script>
  import { useStore } from 'vuex';
  import WeightPicker from '~/components/ui/WeightPicker';
  import IconArrowTrendUp from '~/components/ui/icons/arrow-trend-up';
  import IconArrowTrendDown from '~/components/ui/icons/arrow-trend-down';
  import { computed, ref, watch } from 'vue';
  import { ElNotification } from 'element-plus';
  import colors from 'tailwindcss/colors';

  export default {
    name: 'WeightDiaryModal',
    emits: ['update:model-value'],
    components: {
      IconArrowTrendUp,
      IconArrowTrendDown,
      WeightPicker
    },
    props: {
      modelValue: {
        type: Boolean,
        default: false,
      }
    },
    setup(props, { emit }) {
      const store = useStore();
      const weight = ref(store.state.weightDiary.length ? store.state.weightDiary[store.state.weightDiary.length - 1].weight : 70);
      const trendIsShow = ref(false);

      const save = () => {
        store.commit('addWeightEntry', {
          weight: weight.value,
          date: Date.now(),
        });
        trendIsShow.value = true;
        ElNotification.success({ title: 'Успех', message: 'Запись добавлена' });
        setTimeout(() => emit('update:model-value', false), 500);
      };

      const trend = computed(() => {
        const diary = store.state.weightDiary;
        if (diary.length < 2) return 0;
        const previousRecord = diary[diary.length - 2];
        return previousRecord.weight - weight.value;
      });

      watch(() => props.modelValue, () => trendIsShow.value = false);

      return {
        trendIsShow,
        colors,
        weight,
        trend,
        save
      };
    }
  };
</script>
