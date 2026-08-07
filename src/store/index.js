import { createStore } from 'vuex';
import { saveAs } from 'file-saver';
import vuexState from './vuex-state.json';

export default createStore({
  state: {
    exercises: [],
    workouts: [],
    activeWorkout: null,
    editedWorkout: null,
    editedExercise: null,
    history: [],
  },
  getters: {
    getExerciseInWorkoutById: state => id => {
      console.log(id, state.editedWorkout)
      if (!state.editedWorkout) return null;
      console.log(id, state.editedWorkout.exercises)
      return state.editedWorkout.exercises.find(exercise => exercise.exerciseId === id);
    },
    getExerciseById: state => id => {
      return state.exercises.find(exercise => exercise.id === id) || null;
    },
    getWorkoutById: state => id => {
      return state.workouts.find(workout => {
        return workout.id === id;
      }) || null;
    }
  },
  mutations: {
    updateExerciseInWorkout(state, { workoutId, exerciseId, updates }) {
      const workoutIndex = state.workouts.findIndex(workout => workout.id === workoutId);
      if (~workoutIndex) {
        const exerciseIndex = state.workouts[workoutIndex].exercises.findIndex(exercise => exercise.exerciseId === exerciseId);
        if (~exerciseIndex) {
          const exercise = state.workouts[workoutIndex].exercises[exerciseIndex];
          state.workouts[workoutIndex].exercises[exerciseIndex] = { ...exercise, ...updates};
        }
      }
    },
    setEditedExercise(state, payload) {
      state.editedExercise = payload;
    },
    setEditedWorkout(state, payload) {
      state.editedWorkout = payload;
    },
    removeWorkout(state, payload) {
      state.workouts = state.workouts.filter(workout => workout.id !== payload);
    },
    setActiveWorkout(state, payload) {
      state.activeWorkout = payload;
    },
    addExercises(state, payload) {
      state.exercises.push(payload);
    },
    removeExercise(state, index)  {
      state.exercises = state.exercises.filter((_, idx) => idx !== index);
    },
    addWorkout(state, payload) {
      state.workouts.push(payload);
    },
    updateWorkout(state, payload) {
      const index = state.workouts.findIndex(workout => workout.id === payload.id);
      state.workouts[index] = payload;
    },
    updateHistory(state, { index, value }) {
      state.history[index] = value;
    },
    clearHistory(state) {
      state.history = [];
    },
    addHistory(state, value) {
      state.history.push(value);
    }
  },
  actions: {
    saveWorkoutToHistory({ state, commit }, workout) {
      const historyItemIndex = state.history.findIndex(el => el.id === workout.id);

      if (~historyItemIndex) {
        commit('updateHistory', { index: historyItemIndex, value: workout });
      } else {
        commit('addHistory', workout);
      }
    },
    initializeStore({ state, }) {
      if (localStorage.getItem('state')) {
        this.replaceState(
          Object.assign(state, {
            ...JSON.parse(localStorage.getItem('state')),
            activeWorkout: null,
            editedWorkout: null,
          })
        );

      } else if(vuexState) {
        this.replaceState(
          Object.assign(state, vuexState)
        );
      }
    },
    saveState({ state, }) {
      try {
        const jsonState = JSON.stringify(state, null, 2);

        const blob = new Blob([jsonState], { type: 'application/json' });

        saveAs(blob, 'vuex-state.json');
      } catch (e) {
        console.warn(e);
      }
    }
  },
  modules: {
    //
  }
});
