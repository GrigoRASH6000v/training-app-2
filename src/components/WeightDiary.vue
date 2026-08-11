<template lang="pug">
  section.section
    .weight-diary
      .weight-diary__content
        .text-xs.font-bold.mb-2 Дневник веса

        .weight-diary__form
          .flex.flex-col
            .text-xs.text-gray-500 Для веса (кг)
            el-input(
              v-model="weight"
              step="0.1"
              min="0"
              placeholder="Введите вес"
            )
          .weight-diary__actions
            button(
              type="button"
              @click="addEntry"
            ) Добавить запись

        // Журнал записей
        .weight-diary__journal(v-if="entries.length")
          h3 Журнал
          table
            thead
              tr
                th Дата
                th Вес (кг)
                th actions
            tbody
              tr(
                v-for="entry in sortedEntries"
                :key="entry.id"
              )
                td {{ formatDate(entry.date) }}
                td {{ entry.weight }}
                td
                  button(@click="removeEntry(entry.id)") Удалить

          .weight-diary__stats
            p Последний вес: {{ lastWeight }} кг
            p Всего записей: {{ entries.length }}

        .weight-diary__empty(v-else)
          p Нет записей. Добавьте первый вес!
</template>

<script>
export default {
  name: 'WeightDiary',
  data() {
    return {
      weight: '',
      selectedDate: new Date().toISOString().split('T')[0],
    };
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0];
    },
    entries() {
      return this.$store.state.weightDiary || [];
    },
    sortedEntries() {
      return [...this.entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    lastWeight() {
      if (this.sortedEntries.length === 0) return '—';
      return this.sortedEntries[0].weight;
    },
  },
  methods: {
    addEntry() {
      if (isNaN(weight) || weight <= 0) return;

      this.$store.dispatch('addWeightEntry', {
        weight,
        date: new Date(this.selectedDate).toISOString(),
      });

      this.weightInput = '';
    },
    removeEntry(id) {
      this.$store.dispatch('removeWeightEntry', id);
    },
    formatDate(isoDate) {
      const date = new Date(isoDate);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    },
  },
};
</script>

<style scoped>
  .weight-diary {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: sans-serif;
  }

  .weight-diary__content h2 {
    margin-bottom: 16px;
    color: #333;
  }

  .weight-diary__form {
    background: #f9f9f9;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .weight-diary__field {
    margin-bottom: 12px;
  }

  .weight-diary__field label {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
    color: #555;
  }

  .weight-diary__field input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
  }

  .weight-diary__actions {
    margin-top: 12px;
  }

  .weight-diary__actions button {
    background: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  .weight-diary__actions button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .weight-diary__actions button:hover:not(:disabled) {
    background: #43a047;
  }

  .weight-diary__journal {
    margin-top: 20px;
  }

  .weight-diary__journal h3 {
    margin-bottom: 12px;
    color: #333;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f5f5f5;
    font-weight: 600;
    color: #555;
  }

  button {
    background: #f44336;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  }

  button:hover {
    background: #d32f2f;
  }

  .weight-diary__stats {
    margin-top: 16px;
    padding: 12px;
    background: #e8f5e9;
    border-radius: 4px;
  }

  .weight-diary__stats p {
    margin: 4px 0;
    color: #2e7d32;
  }

  .weight-diary__empty {
    text-align: center;
    padding: 40px 20px;
    color: #999;
    font-size: 14px;
  }
</style>
