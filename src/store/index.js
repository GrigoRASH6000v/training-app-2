import { createStore } from 'vuex';
import { saveAs } from 'file-saver';
import vuexState from './vuex-state.json';

export default createStore({
  state: {
    exercises: [],
    workouts: [],
    activeWorkout: null,
  },
  getters: {
    getExerciseById: state => id => {
      return state.exercises.find(exercise => exercise.exerciseId === id) || null;
    },
    getWorkoutById: state => id => {
      return state.workouts.find(workout => {
        return workout.id === id;
      }) || null;
    }
  },
  mutations: {
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
    }
  },
  actions: {
    initializeStore({ state, }) {
      if (localStorage.getItem('state')) {
        this.replaceState(
          Object.assign(state, JSON.parse(localStorage.getItem('state')))
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
