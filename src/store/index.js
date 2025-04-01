import { createStore } from 'vuex';

import auth from './modules/auth'; 
import categories from './modules/categories';

const store = createStore({
  modules: {
    auth, 
    categories
  },
});

export default store;
