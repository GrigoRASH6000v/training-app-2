<template>
  <div class="workout-list">
    <h2>Список тренировок</h2>

    <div
      v-for="(item, index) in modelValue"
      :key="index"
      class="workout-list__item"
    >
      <el-row>
        <el-col :span="22">
          <div class="field">
            <div class="label">Название</div>
            <span>{{ item.name }}</span>
          </div>
        </el-col>
        <el-col :span="2">
          <el-button round size="small">
            <icon-pen size="14"/>
          </el-button>
        </el-col>
      </el-row>

      <div
        v-for="(exercise, idx) in item.exercises"
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
              <span>{{ getExercise(exercise.exercisId) }}</span>
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
        <el-row>
          <el-col :span="6">
            <el-button type="primary" @click="$emit('start', item.id)">Начать</el-button>
          </el-col>
        </el-row>
        <el-divider />
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import IconPen from '@/components/ui/icons/pen';
import { useMq } from 'vue3-mq';

export default {
  name: 'WorkoutList',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  components: {
    IconPen
  },
  setup() {
    const mq = useMq();
    const store = useStore();
    const getExercise = id => store.getters.getExerciseById(id)?.title || '';
    return {
      mq,
      getExercise
    };
  }
};
</script>

<style lang="scss" scoped>
  .workout-list {
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
  }
</style>
