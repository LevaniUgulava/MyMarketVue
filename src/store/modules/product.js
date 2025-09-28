import api from "@/api";

const state = {
  categories: [],
  sections: [],
  brands: [],
  banners: [],
  apiLoaded: false,
  allproducts:[],
  discountproducts:[],
  newproducts:[],
  lastLoadTime: null,
  allcategory:[]
};

const mutations = {
  setCategories(state, categoriesData) {
    state.categories = categoriesData;
  },
  setSections(state, section) {
    state.sections = section;
  },
  setBrands(state, brand) {
    state.brands = brand;
  },
  setBanners(state, banner) {
    state.banners = banner;
  },
  setApiLoaded(state, load) {
    state.apiLoaded = load;
  },
  setAllproducts(state, products){
    state.allproducts = products;
  },
  setDiscountproducts(state, products){
    state.discountproducts = products;
  },
  setNewproducts(state, products){
    state.newproducts = products;
  },
  setAllCategory(state, category){
    state.allcategory = category;

  }

};

const actions = {
  async loadData({ commit }) {
    try {
      const [productsResponse, collectionResponse, brandResponse, bannerResponse, categoryResponse] = await Promise.all([
        api.get('display', {
          tokenOptional: true,
          params: { section: ['all', 'discount', 'new'] }
        }),
        api.get('collection/display'),
        api.get("/brand/display"),
        api.get('/banner/display'),
        api.get('/category')
      ]);

      let categoriesData = [
        { key: 'all', title: 'ყველა პროდუქტი', products: productsResponse.data.all.data },
        { key: 'discount', title: 'ფასდაკლებული პროდუქტი', products: productsResponse.data.discount.data },
      ];

      commit("setAllCategory", categoryResponse.data);

      commit("setAllproducts", productsResponse.data.all.data);
      commit("setDiscountproducts", productsResponse.data.discount.data);
      commit("setNewproducts", productsResponse.data.new.data);
      commit("setCategories", categoriesData);
      commit("setSections", collectionResponse.data);
      commit("setBrands", brandResponse.data);
      commit("setBanners", bannerResponse.data);
      
      commit("setApiLoaded", true);
      
    } catch (error) {
      console.error('Error loading data:', error);
      commit("setApiLoaded", false);
    }
  },
};

const getters = {
  getCategories: (state) => state.categories,
  getAllproducts: (state) => state.allproducts,
  getDiscountproducts:(state)=>state.discountproducts,
  getNewproducts:(state)=>state.newproducts,
  getSections: (state) => state.sections,
  getBrands: (state) => state.brands,
  getBanners: (state) => state.banners,
  getAllCategory:(state)=>state.allcategory,
  getApiLoaded: (state) => state.apiLoaded,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
