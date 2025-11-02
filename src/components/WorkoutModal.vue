<template>
  <el-drawer
    :model-value="modelValue"
    size="100%"
    @update:model-value="$emit('update:model-value', null)"
  >
    <div class="workout">
      <timer
        class="timer"
        :initialSeconds="60"
        @tick="handleTick"
      />

      <el-row>
        <el-col :span="22">
          <div class="field">
            <div class="label">Название</div>
            <span>{{ workout.name }}</span>
          </div>
        </el-col>
        <el-col :span="2">
          <el-button round size="small">
            <icon-pen size="14"/>
          </el-button>
        </el-col>
      </el-row>

      <div
        v-for="(exercise, idx) in workout.exercises"
        :key="idx"
      >
        <el-row>
          <el-col :span="1">
            <div class="label">№</div>
            <span>{{ idx + 1 }}</span>
          </el-col>
          <el-col :span="17">
            <div class="field">
              <div class="label">Название упр.</div>
              <span>{{ store.getters.getExerciseById(exercise.id) }}</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="field">
              <div class="label">Пов.</div>
              <span>{{ exercise.repetition }}</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="field">
              <div class="label">Под.</div>
              <span>{{ exercise.approache }}</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="field">
              <div class="label">Отд.</div>
              <span>{{ exercise.restTime }}</span>
            </div>
          </el-col>
        </el-row>
        <el-divider />
      </div>
    </div>
  </el-drawer>
</template>

<script>
import Timer from '@/components/Timer';
import IconPen from '@/components/ui/icons/pen';
import { useStore } from 'vuex';

export default {
  name: 'WorkoutModal',
  components: { IconPen, Timer },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    workout: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const handleTick = () => console.log('handleTick');
    const store = useStore();

    return {
      handleTick,
      store
    };
  }
};
</script>

<style lang="scss" scoped>
  .workout {
    &__item {
      padding: 10px 0;
      //border-top: 1px solid var(--el-color-primary);
      //border-bottom: 1px solid var(--el-color-primary);

      &:not(:last-child) {
        margin-bottom: 15px;
      }
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

    .field {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
    }

    .timer {
      margin-bottom: 40px;
    }
  }
</style>
