import api from "@/api";

const state = {
    name: localStorage.getItem('name') || "",
    token: localStorage.getItem('token') || "", 
    roles: localStorage.getItem('roles') || "", 
    userId: localStorage.getItem('userid') || "",  
  };
  
  const mutations = {
    setName(state, name) {
      state.name = name;
      localStorage.setItem('name', name);
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
  };
  
  const getters = {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.name, 
    getToken: (state) => state.token,
    getRoles: (state) => state.roles,
    getUserId: (state) => state.userId,
  };
  
  const actions = {
    async login({ commit, dispatch }, { email, password }) {
      try {
        const response = await api.post('login', {
          email,
          password
        }, {
          headers: {
            "X-Login-Request": true
          }
        });
    
        commit('setName', response.data.name);
        commit('setToken', response.data.token);
        commit('setRoles', response.data.roles[0]);
        commit('setUserId', response.data.id);
    
        if(response.status === 200){
            await dispatch('product/loadData', null, { root: true });
        }
        
        return response.status;

    
      } catch (error) {
          return error.response.status;
      }
    },
    
    
    async logout({ commit,dispatch }) {
        try {
            await api.post('logout', {}, {
              tokenRequired: true
            });
            commit('setName', null);
            commit('setToken', null);
            commit('setRoles', null);
            commit('setUserId', null);
      
            localStorage.removeItem('name');
            localStorage.removeItem('token');
            localStorage.removeItem('roles');
            localStorage.removeItem('userid');
            await dispatch('product/loadData', null, { root: true });

          } catch (error) {
            console.error('Logout failed', error);
          }    
        },
  };
  
  export default {
    namespaced:true,
    state,
    mutations,
    actions,
    getters,
  };