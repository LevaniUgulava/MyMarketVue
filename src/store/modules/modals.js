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
    confirmationemail: null,
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
    setemail(state, email) {
      state.confirmationemail = email;
    },
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
  };
  