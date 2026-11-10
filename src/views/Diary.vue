<template lang="pug">
  .space-y-4
    h1.text-white.text-sm.font-bold Дневник веса

    section.section
      .flex.items-center.justify-between.mb-4
        .text-xs.font-bold.text-white График веса
      .chart-container
        line-chart(
          :data="chartData"
          :options="chartOptions"
        )

    section.section
      .flex.items-center.justify-between.mb-4
        .text-xs.font-bold.text-white Записи
        el-button(
          size="small"
          round
          type="primary"
          @click="showModal = true"
        )
          icon-plus(size="14")

      .weight-entries(v-if="entries.length")
        .weight-entry(
          v-for="entry in sortedEntries"
          :key="entry.date"
        )
          .weight-entry__date {{ formatDate(entry.date) }}
          .weight-entry__value {{ entry.weight }} кг

      .text-center.text-neutral-400.text-xs(v-else) Нет записей

    weight-diary-modal(v-model="showModal")
</template>

<script>
  import { defineComponent } from 'vue';
  import { Line } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  import WeightDiaryModal from '~/components/WeightDiaryModal';
  import IconPlus from '~/components/ui/icons/plus';
  import { useStore } from 'vuex';
  import { computed, ref } from 'vue';
  import moment from 'moment';

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  export default defineComponent({
    name: 'DiaryView',
    components: {
      LineChart: Line,
      WeightDiaryModal,
      IconPlus,
    },
    setup() {
      const store = useStore();
      const showModal = ref(false);

      store.dispatch('initializeStore');

      const entries = computed(() => store.state.weightDiary || []);

      const sortedEntries = computed(() => {
        return [...entries.value].sort((a, b) => new Date(b.date) - new Date(a.date));
      });

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: false },
        },
        scales: {
          x: {
            ticks: { color: '#aaa' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          },
          y: {
            ticks: { color: '#aaa' },
            grid: { color: 'rgba(255,255,255,0.1)' }
          }
        }
      };

      const chartData = computed(() => {
        if (!sortedEntries.value.length) return { labels: [], datasets: [] };

        return {
          labels: sortedEntries.value.map(entry => formatDate(new Date(entry.date))),
          datasets: [{
            label: 'Вес (кг)',
            data: sortedEntries.value.map(entry => entry.weight),
            borderColor: '#fff',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#fff',
            pointRadius: 4,
            tension: 0.3,
            fill: true,
          }]
        };
      });

      const formatDate = date => moment(date).format('DD.MM.YYYY');

      return {
        showModal,
        entries,
        sortedEntries,
        chartData,
        chartOptions,
        formatDate,
      };
    }
  });
</script>

<style scoped lang="scss">
  .chart-container {
    position: relative;
    height: 200px;
  }

  .weight-entries {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .weight-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  .weight-entry__date {
    color: #aaa;
    font-size: 0.875rem;
  }

  .weight-entry__value {
    color: #fff;
    font-weight: 600;
  }

  .section {
    background-color: $black;
  }
</style>
