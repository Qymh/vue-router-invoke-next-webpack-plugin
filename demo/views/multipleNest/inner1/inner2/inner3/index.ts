import { defineComponent, h } from 'vue';

export default defineComponent({
  setup(props) {
    return () => h('div', 123);
  }
});
