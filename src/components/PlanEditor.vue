<template lang="pug">
  .plan-editor
    .field
      .label Название
      el-input(v-model="title", placeholder="Например: Присед")
    .field
      .label Заметки
      el-input(
        v-model="notes",
        :rows="3",
        type="textarea",
        placeholder="Дополнительная информация..."
      )
    el-button(:disabled="!title" @click="save") Сохранить упражнение
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
    gap: 0.75rem;
  }
  .field {
    display: flex;
    flex-direction: column;
  }
  .label {
    font-size: 12px;
    color: #555;
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
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    background: #2d8cff;
    color: #fff;
    cursor: pointer;
  }
  button:disabled {
    background: #a0c4ff;
    cursor: not-allowed;
  }
</style>
