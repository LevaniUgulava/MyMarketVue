// store/modules/modals.js

const modalKeys = [
    'loginmodal',
    'registermodal',
    'forgetmodal',
    'confirmmodal',
    'passwordmmodal',
  ];
  
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
      modalKeys.forEach(name => {
        state[name] = name === modalName;
      });
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
  