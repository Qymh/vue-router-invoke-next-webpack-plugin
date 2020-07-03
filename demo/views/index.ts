import { defineComponent, h } from 'vue';
import { RouterView } from 'vue-router';

import './index.scss';

export default defineComponent({
  setup(props) {
    return () => h(RouterView);
  }
});
