import { createApp, h } from 'vue';
import { router } from './router';
import Index from './views/index';

const app = createApp(
  {
    setup() {
      return () => h(Index);
    }
  },
  {
    router
  }
);

app.use(router);

app.mount('#app');
