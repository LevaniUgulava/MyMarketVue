// store/modules/modals.js

const state = () => ({
  loginmodal: false,
  registermodal: false,
  forgetmodal: false,
  confirmmodal: false,
  passwordmmodal: false,
  data: {},
});

const mutations = {
  openmodal(state, modalName) {
    Object.keys(state).forEach(name => {
      if (name !== 'data' && name !== modalName) {
        state[name] = false;
      }
    });
    state[modalName] = true;
  },
  closemodal(state, modalName) {
    state[modalName] = false;
  },
  setdata(state, data) {
    state.data = data;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
