import api from "@/api";

const state = {
    categories: [],
    sections: [],
  };
  
  const mutations = {
    setCategories(state, categoriesData) {
      state.categories = categoriesData;
    },
    setSections(state, section) {
      state.sections = section;
    }
  };
  
  const actions = {
    async loadData({ commit }) {
      try {
        const [productsResponse, collectionResponse] = await Promise.all([
          api.get('display', {
            tokenOptional: true,
            params: { section: ['all', 'discount'] }
          }),
          api.get('collection/display')
        ]);
  
        let categoriesData = [
          { key: 'all', title: 'ყველა პროდუქტი', products: productsResponse.data.all.data },
          { key: 'discount', title: 'ფასდაკლებული პროდუქტი', products: productsResponse.data.discount.data },
        ];
  
        commit("setCategories", categoriesData);
        commit("setSections", collectionResponse.data);
  
      } catch (error) {
        console.error('Error loading data:', error);
      }
    },
  };
  
  const getters = {
    getCategories: (state) => state.categories,
    getSections: (state) => state.sections,
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
  };
  