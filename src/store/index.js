import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import auth from './modules/auth'; 
import categories from './modules/categories';
import modals from './modules/modals';
import product from './modules/product';
import platform from './modules/platform';

const store = createStore({
  modules: {
    auth, 
    categories,
    modals,
    product,
    platform
    

  },
  plugins: [
    createPersistedState({
      key: 'app-state', 
      paths: ['modals'], 
    }),
  ],
});

export default store;
