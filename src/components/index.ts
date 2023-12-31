import { App } from 'vue';

import APdf from './APdf/index.vue'


export default {
  install(app: App) {
    app.component("APdf", APdf);
  },
};

export * from './APdf/types/index'

export * from './APdf/hooks/index'

export { APdf }