<template lang="pug">
  .flex.flex-col.gap-4
    .flex.flex-col
      .text-white.text-xs.mb-1.text-purple-100 Название
      el-input(v-model="title", placeholder="Например: Присед")

    .flex.flex-col
      .text-white.text-xs.mb-1.text-purple-100 Группа
      el-select(v-model="group")
        el-option(
          v-for="group in groups"
          :key="group.value"
          :value="group.value"
          :label="group.label"
        )

    .flex.flex-col
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
      @click="() => editingData ? update() : save()"
    ) {{ editingData ? 'Обновить упражнение' : 'Сохранить упражнение' }}
</template>

<script>
  import { ref } from 'vue';
  import { ElNotification } from 'element-plus'
  import { useStore } from 'vuex';

  export default {
    name: 'PlanEditor',
    emits: ['save', 'update'],
    props: {
      editingData: {
        type: [Object, null],
        default: null
      }
    },
    setup(props, { emit }) {
      const store = useStore();
      const groups = store.state.exercisesGroups;
      const title = ref('');
      const notes = ref('');
      const group = ref(1);

      if (props.editingData) {
        title.value = props.editingData.title;
        notes.value = props.editingData.notes;
        group.value = props.editingData.group || 1;
      }

      const update = () => {
        if (!title.value) return;

        const plan = {
          ...props.editingData,
          title: title.value,
          notes: notes.value,
          group: group.value,
        };

        emit('update', plan);

        title.value = '';
        notes.value = '';
        group.value = 1;

        ElNotification.success({ title: 'Готово', message: 'Упражнение обновлено!' });
      }

      const save = () => {
        if (!title.value) return;
        const plan = {
          id: Date.now(),
          title: title.value,
          notes: notes.value,
          group: group.value,
          createdAt: new Date().toISOString()
        };
        emit('save', plan);

        title.value = '';
        notes.value = '';
        group.value = 1;
        ElNotification.success({ title: 'Готово', message: 'Упражнение добавлено!' })
      };

      return {
        title,
        notes,
        save,
        group,
        groups,
        update,
      };
    }
  };
</script>
