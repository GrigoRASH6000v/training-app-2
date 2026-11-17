import { defineStore } from 'pinia';
import { saveAs } from 'file-saver';
import vuexState from './vuex-state.json';

export const useStore = defineStore('training', {
  state: () => ({
    exercises: [],
    workouts: [],
    exercisesGroups: [
      { label: 'Грудь', value: 1 },
      { label: 'Спина', value: 2 },
      { label: 'Ноги', value: 3 },
      { label: 'Плечи', value: 4 },
      { label: 'Руки', value: 5 },
      { label: 'Пресс', value: 6 },
      { label: 'Другое', value: 7 },
    ],
    activeWorkout: null,
    editedWorkout: null,
    editedExercise: null,
    history: [],
    weightDiary: [],
  }),
  getters: {
    getExerciseInWorkoutById: (state) => (id) => {
      if (!state.editedWorkout) return null;
      return state.editedWorkout.exercises.find(exercise => exercise.exerciseId === id);
    },
    getExerciseById: (state) => (id) => {
      return state.exercises.find(exercise => exercise.id === id) || null;
    },
    getWorkoutById: (state) => (id) => {
      return state.workouts.find(workout => workout.id === id) || null;
    },
  },
  actions: {
    saveWorkoutToHistory(workout) {
      const historyItemIndex = this.history.findIndex(el => el.id === workout.id);
      if (~historyItemIndex) {
        this.history[historyItemIndex] = workout;
      } else {
        this.history.push(workout);
      }
    },
    initializeStore() {
      if (localStorage.getItem('state')) {
        const saved = JSON.parse(localStorage.getItem('state'));
        Object.assign(this.$state, saved);
      } else if (vuexState) {
        Object.assign(this.$state, vuexState);
      }
    },
    saveState() {
      try {
        const jsonState = JSON.stringify(this.$state, null, 2);
        const blob = new Blob([jsonState], { type: 'application/json' });
        saveAs(blob, 'training-app-store.json');
      } catch (e) {
        console.warn(e);
      }
    },
    loadState(data) {
      Object.assign(this.$state, data);
    },
  },
  persist: true,
});
