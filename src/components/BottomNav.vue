<template lang="pug">
  nav.bottom-nav
    router-link.bottom-nav-item(
      v-for="{ path, isActive, icon, label } in items"
      :key="path"
      :to="path"
      :class="{ '--active': isActive }"
    )
      component(
        :is="icon"
        :size="20"
        :color="isActive ? colors.neutral[50] : colors.neutral[400]"
      )
      span(:class="[ isActive ? 'text-neutral-50' : 'text-neutral-400' ]") {{ label }}
</template>

<script>
  import IconMenu from '~/components/ui/icons/menu';
  import IconEye from '~/components/ui/icons/eye';
  import IconPlus from '~/components/ui/icons/plus';
  import IconSettings from '~/components/ui/icons/settings';
  import IconSave from '~/components/ui/icons/save';
  import IconHome from '~/components/ui/icons/home';
  import IconSquarePen from '~/components/ui/icons/square-pen';
  import colors from 'tailwindcss/colors';
  import { useRoute } from 'vue-router';
  import { computed } from 'vue';

  export default {
    name: 'BottomNav',
    components: {
      IconMenu,
      IconEye,
      IconPlus,
      IconSave,
      IconHome,
      IconSettings,
      IconSquarePen,
    },
    setup() {
      const route = useRoute();
      const isActive = (path) => route.path === path;
      const items = computed(() => [
        { path: '/exercises', label: 'Упражнения', icon: 'IconSquarePen', isActive: isActive('/exercises') },
        { path: '/workouts', label: 'Тренировки', icon: 'IconSettings', isActive: isActive('/workouts') },
        { path: '/diary', label: 'Дневник', icon: 'IconSave', isActive: isActive('/diary') },
      ]);

      return { items, isActive, colors };
    }
  };
</script>

<style scoped lang="scss">
  .bottom-nav {
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0.5rem 0;
    border-radius: 8px 8px 0 0;
    background-color: $black;

    &.--active {
      opacity: 1;
    }
  }

  .bottom-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    text-decoration: none;
    color: #666;
    font-size: 0.75rem;
    padding: 0.5rem;
    transition: color 0.2s;
  }

  .bottom-nav-item:hover,
  .bottom-nav-item.router-link-active,
  .bottom-nav-item.active {
    color: #181236;
  }
</style>
