<template lang="pug">
  .plan-editor
    .field
      .text-white.text-xs.mb-1.text-purple-100 Название
      el-input(v-model="title", placeholder="Например: Присед")
    .field
      .text-white.text-xs.mb-1.text-purple-100 Заметки
      el-input(
        v-model="notes",
        :rows="3",
        type="textarea",
        placeholder="Дополнительная информация..."
      )
    el-button.mt-auto(
      :disabled="!title"
      type="primary"
      @click="save"
    ) Сохранить упражнение
</template>

<script>
  import { ref } from 'vue';
  import { ElNotification } from 'element-plus'

  export default {
    name: 'PlanEditor',
    emits: ['save'],
    setup(props, { emit }) {
      const title = ref('');
      const notes = ref('');

      const save = () => {
        if (!title.value) return;
        const plan = {
          id: Date.now(),
          title: title.value,
          notes: notes.value,
          createdAt: new Date().toISOString()
        };
        emit('save', plan);

        title.value = '';
        notes.value = '';
        ElNotification.success({ title: 'Готово', message: 'Упражнение добавлено!' })
      };

      return { title, notes, save };
    }
  };
</script>

<style scoped>
  .plan-editor {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 0.75rem;
  }
  .field {
    display: flex;
    flex-direction: column;
  }
  .label {
    margin-bottom: 4px;
  }
  input, textarea {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font: inherit;
  }
  textarea {
    min-height: 80px;
    resize: vertical;
  }
  button {
    align-self: flex-start;
    cursor: pointer;
  }
  button:disabled {
    cursor: not-allowed;
  }
</style>
