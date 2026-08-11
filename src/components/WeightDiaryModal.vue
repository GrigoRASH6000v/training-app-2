<template lang="pug">
  el-drawer(
    :model-value="modelValue"
    size="100%"
    @update:model-value="$emit('update:model-value', false)"
  )
    .flex.flex-col.h-full
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
      el-button.mt-auto.mx-auto(type="primary" @click="save") Сохранить
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
      ElNotification,
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
    setup(props) {
      const store = useStore();
      const weight  = ref(store.state.weightDiary[ store.state.weightDiary.length - 1]?.weight || 0);
      const trendIsShow = ref(false);

      const save = () => {
        store.commit('addWeightEntry', weight.value);
        trendIsShow.value = true;
        ElNotification.success({ title: 'Успех', message: 'Запись добавлена' })
      };

      const trend = computed(() => {
        const previousRecord = store.state.weightDiary[ store.state.weightDiary.length - 2];
        return previousRecord ? previousRecord.weight - weight.value : 0
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
