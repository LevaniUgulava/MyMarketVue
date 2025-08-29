import { Capacitor } from "@capacitor/core";


export const authMixin ={
    computed:{
        isAuth() {
      return localStorage.getItem('token') ? true : false;
    }
    }
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