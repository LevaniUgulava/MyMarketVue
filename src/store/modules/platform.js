import { Capacitor } from "@capacitor/core"

const state={
    platform:null,
    
}
const mutations={
    setPlatform(state,platform){
        state.platform = platform
    },
  
}
const actions = {
    async initPlatform({ commit }) {
        const platform = Capacitor.getPlatform();
        commit("setPlatform", platform);  
    }
};

const getters={
    platform: (state) => state.platform,
}
export default{
    namespaced:true,
    actions,
    getters,
    mutations,
    state

}