<template lang="pug">
  transition(
    name="s-expander"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
  )
    slot
</template>

<script>
  export default {
    methods: {
      enter(element) {
        element.style.width = getComputedStyle(element).width;
        element.style.position = 'absolute';
        element.style.visibility = 'hidden';
        element.style.height = 'auto';

        const height = getComputedStyle(element).height;

        element.style.width = null;
        element.style.position = null;
        element.style.visibility = null;
        element.style.height = 0;

        // eslint-disable-next-line no-unused-expressions
        getComputedStyle(element).height;

        setTimeout(() => {
          element.style.height = height;
        });
      },

      afterEnter(element) {
        element.style.height = 'auto';
      },

      leave(element) {
        element.style.height = getComputedStyle(element).height;

        // eslint-disable-next-line no-unused-expressions
        getComputedStyle(element).height;

        setTimeout(() => {
          element.style.height = 0;
        });
      }
    }
  };
</script>

<style lang="scss">
  .s-expander {

    &-enter-active,
    &-leave-active {
      transition: height 0.25s ease-in-out;
      overflow: hidden;
    }

    &-enter,
    &-leave-to {
      height: 0;
    }
  }
</style>
