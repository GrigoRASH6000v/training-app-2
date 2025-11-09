<template lang="pug">
  .s-validated(:class="{ '--invalid': v.$invalid && v.$dirty }")
    slot
    .s-validated__errors(v-if="v.$invalid && v.$dirty" :id="`${name}-error`")
      .s-validated__error(v-for="(error, index) in v.$errors" :key="index") {{ error.$message }}

</template>

<script setup>
  import { defineProps, toRef } from 'vue'

  const props = defineProps({
    v: {
      type: Object,
      required: true
    },
    inputClass: {
      type: [String, Array, Object],
      default: ''
    }
  })
</script>

<style lang="scss">
  .s-validated {
    margin-bottom: 1rem;

    &.--invalid {
      .el-input__wrapper,
      .el-select__wrapper{
        box-shadow: 0 0 0 1px var(--el-color-danger) inset;
      }
    }

    &__errors {
      margin-top: 0.25rem;
    }

    &__error {
      font-size: 12px;
      color: var(--el-color-danger);
    }
  }
</style>
