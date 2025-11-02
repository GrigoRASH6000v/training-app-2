export default {
  props: {
    size: {
      type: [Number, String],
      default: 24
    },
    color: {
      type: String,
      default: ''
    }
  },
  computed: {
    currentColor() {
      return this.color ? this.color : 'currentColor';
    }
  }
};
