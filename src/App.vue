<template lang="pug">
  header.header.border-neutral-500.border-b.border-b-1
    .grid.grid-cols-3.items-center
      .text-xs.font-bold.col-span-2.text-white Тренька
      .text-xs.font-bold.col-span-1.text-right.text-white v1.2.10
  main.container
    router-view

  bottom-nav(class="!mt-auto")
</template>

<script>
  import BottomNav from '~/components/BottomNav';
  import { useStore } from 'vuex';

  export default {
    name: 'App',
    components: {
      BottomNav,
    },
    setup() {
      const store = useStore();
      store.dispatch('initializeStore');
    }
  };
</script>

<style>
  #app {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    color: #333;
    background-color: #181236;
    background-image: linear-gradient(135deg, #1B082F 0%, #360F59 26%, #381578 51%, #1E0D4F 76%, #0B0417 100%);
    height: 100dvh;
    display: flex;
    flex-direction: column;
  }

  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100dvh;
    overscroll-behavior: none;
  }

  section {
    border-radius: 8px;
    padding: 1rem;
  }

  .header {
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
    padding: 1rem;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 50;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
    max-width: 400px;
    margin: 0 auto;
    overflow-y: auto;
    align-content: start;
    min-height: 0;
  }
</style>
