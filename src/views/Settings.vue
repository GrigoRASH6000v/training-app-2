<template lang="pug">
  .space-y-4
    h1.text-white.text-sm.font-bold Настройки

    section.section.flex.justify-between
      .text-gray-300.text-sm Выгрузить store
      el-button(
        type="primary"
        size="small"
        round
        @click="exportStore"
      )
        icon-download(size="14")

    section.section.flex.justify-between.items-center
      .text-gray-300.text-sm Загрузить store
      el-upload(
        :auto-upload="false"
        accept=".json"
        :show-file-list="false"
        :on-change="handleFileChange"
      )
        el-button(
          type="primary"
          size="small"
          round
        )
          icon-upload(size="14")
</template>

<script>
  import { useStore } from 'vuex';
  import IconSettings from '~/components/ui/icons/settings';
  import IconDownload from '~/components/ui/icons/download';
  import IconUpload from '~/components/ui/icons/upload';
  import { ElNotification } from 'element-plus';

  export default {
    name: 'SettingsView',
    components: {
      IconSettings,
      IconDownload,
      IconUpload
    },
    setup() {
      const store = useStore();

      const exportStore = async () => {
        try {
          await store.dispatch('saveState');
          ElNotification.success({ title: 'Успех', message: 'Данные выгружены' });
        } catch (error) {
          ElNotification.error({ title: 'Ошибка', message: 'Не удалось выгрузить данные' });
          console.error(error);
        }
      };

      const handleFileChange = async file => {
        try {
          if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            ElNotification.error({ title: 'Ошибка', message: 'Пожалуйста, выберите JSON‑файл' });
            return
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              store.commit('loadState', JSON.parse(e.target.result))
            } catch (err) {
              ElNotification.error({ title: 'Ошибка', message: 'Файл не является корректным JSON: ' + err.message });
            }
          }

          reader.onerror = () => {
            ElNotification.error({ title: 'Ошибка', message: 'Не удалось загрузить данные' });
          }

          reader.readAsText(file.raw)
          ElNotification.success({ title: 'Успех', message: 'Данные загружены' });
        } catch (error) {
          ElNotification.error({ title: 'Ошибка', message: 'Не удалось загрузить данные' });
          console.error(error);
        }
      }

      return {
        exportStore,
        handleFileChange,
      };
    }
  };
</script>

<style scoped lang="scss">
  .section {
    background-color: $black;
  }
</style>
