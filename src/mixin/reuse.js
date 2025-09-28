import { Capacitor } from "@capacitor/core";
import { computed } from "vue";


export const authMixin ={
    computed:{
        isAuth() {
      return localStorage.getItem('token') ? true : false;
    }
    }
}
export function useAuth() {
  const isAuth = computed(() => !!localStorage.getItem('token'))
  return { isAuth }
}

export const getPlatform = {
  data() {
    return {
      platformType: ''
    };
  },
  async created() {
    this.platformType = await Capacitor.getPlatform();
  },
  computed: {
    currentPlatform() {
      return this.platformType;
    }
  }
};