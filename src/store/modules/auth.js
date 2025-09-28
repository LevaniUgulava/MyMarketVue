import api from "@/api";

const state = {
    name: localStorage.getItem('name') || "",
    email: localStorage.getItem('email') || "",
    token: localStorage.getItem('token') || "", 
    roles: localStorage.getItem('roles') || "", 
    userId: localStorage.getItem('userid') || "",  
    checkoutInfo:{
      checkout_in_progress:false,
      cart_items: 0
    },
   hasPassword: {
    password: localStorage.getItem('hasPassword') === "true",
    platform: localStorage.getItem('authPlatform') || '',
  },
  };
  
  const mutations = {
    SetCheckoutInfo(state,checkInfo){
    state.checkoutInfo = checkInfo
    },
    setName(state, name) {
      state.name = name;
      localStorage.setItem('name', name);
    },
    setEmail(state, email) {
      state.email = email;
      localStorage.setItem('email', email);
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    setRoles(state, roles) {
      state.roles = roles;
      localStorage.setItem('roles', roles);
    },
    setUserId(state, userId) {  
      state.userId = userId;  
      localStorage.setItem('userid', userId); 
    },
    setHasPassword(state, hasPasswordObj) {  
       const password = Boolean(hasPasswordObj?.password);
    const platform = hasPasswordObj?.platform || '';

    state.hasPassword = {
      password,
      platform,
    };

    localStorage.setItem('hasPassword', password.toString());
    localStorage.setItem('authPlatform', platform);
    },
  };
  
  const getters = {
    getCheckoutInfo:(state)=>state.checkoutInfo,
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.name, 
    getEmail: (state) => state.email, 
    getToken: (state) => state.token,
    getRoles: (state) => state.roles,
    getUserId: (state) => state.userId,
    getHasPassword: (state) => state.hasPassword,

  };
  
  const actions = {
    async login({ commit, dispatch }, { email, password, client_type }) {
  try {
    const response = await api.post(
      'login',
      { email, password, client_type },
      {
        headers: { 'X-Login-Request': true },
        withCredentials: true
      }
    );

    const status = response?.status ?? 0;
    const token  = response?.data?.access_token;

    if (!token) {
      return { ok: false, status, message: 'No access_token in response' };
    }

    commit('setToken', token);

    const meRes = await api.get('/me', { tokenRequired: true });
    const meStatus = meRes?.status ?? 0;

    if (meStatus >= 200 && meStatus < 300) {
      const user   = meRes?.data?.user || {};

      if (user?.name)  commit('setName',  user.name);
      if (user?.email) commit('setEmail', user.email);
       commit('setRoles',meRes.data.role);
      if (user?.id)    commit('setUserId', user.id);
      commit('setHasPassword', meRes?.data?.hasPassword);

    }

    if (status >= 200 && status < 300) {
      await dispatch('product/loadData', null, { root: true });
      commit('modals/closemodal', 'loginmodal', { root: true });
      await dispatch('auth/checkoutInfo', null, { root: true })

    }

    return { ok: true, status: status };

  } catch (error) {
    const errStatus = error?.response?.status ?? 0;
    const errData   = error?.response?.data;
    console.error('login error:', errStatus, errData || error?.message);
    return { ok: false, status: errStatus, action: error?.response?.data.action };
  }
},


  async facebookLogin({ commit, dispatch }, { accessToken, client_type }) {
  try {
    const response = await api.post(
      'auth/facebook',
      { client_type, accessToken },
      { tokenRequired: false } 
    );

    const token  = response?.data?.access_token;
    const status = response?.status ?? 0;

    if (!token) {
      console.error('facebookLogin: no access_token in response');
      return { ok: false, status, message: 'No access_token' };
    }

    commit('setToken', token);

    const meRes = await api.get('/me', { tokenRequired: true });
    const meOk  = meRes?.status >= 200 && meRes?.status < 300;

    if (meOk) {
      const user  = meRes?.data?.user || {};
      const roles = response?.data?.roles || [];

      if (user?.name)  commit('setName', user.name);
      if (user?.email) commit('setEmail', user.email);
      if (roles.length) commit('setRoles', roles[0]);
      if (user?.id)    commit('setUserId', user.id);
      commit('setHasPassword', meRes?.data?.hasPassword);

    } else {
      console.warn('facebookLogin: /me not ok', meRes?.status, meRes?.data);
    }

    if (status >= 200 && status < 300) {
      await dispatch('product/loadData', null, { root: true });
      commit('modals/closemodal', 'loginmodal', { root: true });
    }

    return { ok: true, status: status };

  } catch (error) {
    const status  = error?.response?.status ?? 0;
    const payload = error?.response?.data ?? error?.message;
    console.error('facebookLogin error:', status, payload);
    return { ok: false, status, message: payload };
  }
},

    
    async logout({ commit }) {
        try {
            await api.post('logout', {}, {
              tokenRequired: true
            });
            commit('setName', null);
            commit('setEmail', null);
            commit('setToken', null);
            commit('setRoles', null);
            commit('setUserId', null);
      
            localStorage.removeItem('name');
            localStorage.removeItem('email');
            localStorage.removeItem('token');
            localStorage.removeItem('roles');
            localStorage.removeItem('userid');
            return true;

          } catch (error) {
            console.error('Logout failed', error);
          }    
        },

        async checkoutInfo({commit}){
          try{
            const response = await api.get('/checkoutinfo',{
              tokenRequired:true
            });
            commit('SetCheckoutInfo',response.data)
          }catch(error){
            console.error('checkInfo Error',error)
          }
        }
  };
  
  export default {
    namespaced:true,
    state,
    mutations,
    actions,
    getters,
  };