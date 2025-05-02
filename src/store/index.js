import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import auth from './modules/auth'; 
import categories from './modules/categories';
import modals from './modules/modals';
import product from './modules/product';

const store = createStore({
  modules: {
    auth, 
    categories,
    modals,
    product
  },
  plugins: [
    createPersistedState({
      key: 'modals',
      paths: ['modals'],
    }),
  ],
});

export default store;
