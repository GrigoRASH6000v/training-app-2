import { createStore } from 'vuex';

export default createStore({
  state: {
    exercises: [],
    workouts: [],
    activeWorkout: null,
  },
  getters: {
    getExerciseById: state => id => {
      return state.exercises.find(exercise => exercise.id === id) || null;
    },
    getWorkoutById: state => id => {
      console.log(state.workouts, id);
      return state.workouts.find(workout => {
        console.log(workout.id, id);
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
      }
    },
  },
  modules: {
    //
  }
});
