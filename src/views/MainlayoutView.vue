<template>
  <div class="layout-container">
    <SwiperContent class="banner" />
    <HeaderComponentVue :isMobile="isMobile" @search="handleSearch" />

    <HomeSideBarVue class="sidebar" v-if="isMobile" />


    <div class="main-content">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
    <div class="checkout" @pointerdown.stop.prevent="redirect" v-if="getCheckoutInfo.checkout_in_progress && !checkout">
      <svg class="icon basket" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
        fill="white">
        <path
          d="m40-240 20-80h220l-20 80H40Zm80-160 20-80h260l-20 80H120Zm623 240 20-160 29-240 10-79-59 479ZM240-80q-33 0-56.5-23.5T160-160h583l59-479H692l-11 85q-2 17-15 26.5t-30 7.5q-17-2-26.5-14.5T602-564l9-75H452l-11 84q-2 17-15 27t-30 8q-17-2-27-15t-8-30l9-74H220q4-34 26-57.5t54-23.5h80q8-75 51.5-117.5T550-880q64 0 106.5 47.5T698-720h102q36 1 60 28t19 63l-60 480q-4 30-26.5 49.5T740-80H240Zm220-640h159q1-33-22.5-56.5T540-800q-35 0-55.5 21.5T460-720Z" />
      </svg>

      <svg class="icon arrow" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
        fill="white">
        <path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z" />
      </svg>
      <span class="badge">{{ getCheckoutInfo.cart_items }}</span>
    </div>

    <div class="chat-icon">
      <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="white">
        <path
          d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
      </svg>
    </div>


    <FooterComponentVue class="footer" />
  </div>
</template>

<script>
import HeaderComponentVue from '@/components/HeaderComponent.vue';
import HomeSideBarVue from '@/components/HomeSideBar.vue';
import FooterComponentVue from '@/components/FooterComponent.vue';
import SwiperContent from '@/components/SwiperContent.vue';
import { getPlatform } from '@/mixin/reuse';
import { mapGetters } from 'vuex'
export default {
  name: 'MainLayout',
  mixins: [getPlatform],
  components: {
    HeaderComponentVue,
    HomeSideBarVue,
    FooterComponentVue,
    SwiperContent
  },
  data() {
    return {
      isMobile: window.innerWidth <= 768,
      platform: this.currentPlatform
    };
  },
  computed: {
    ...mapGetters('auth', ['getCheckoutInfo']),
    checkout() {
      return this.$route.path.startsWith('/checkout');
    }

  },
  mounted() {
    this.checkPlatform();
    window.addEventListener('resize', this.checkScreenSize);
    this.$store.dispatch('auth/checkoutInfo', null, { root: true });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  methods: {
    redirect() {
      this.$router.push({ name: 'checkout' });
    },
    checkPlatform() {
      const isIos = this.platform === "ios";

      const el = document.querySelector('.main-content');

      if (isIos && window.matchMedia('(max-width: 768px)').matches) {
        el.style.paddingTop = "calc(60px + env(safe-area-inset-top))";

      } else {
        el.style.paddingTop = "";
      }
    },

    checkScreenSize() {
      this.isMobile = window.innerWidth <= 768;
    },
  },
};
</script>

<style scoped>
.chat-icon {
  position: fixed;
  display: flex;
  align-items: center;
  z-index: 1000;
  bottom: 20px;
  background-color: #7c317c;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 100px;
  justify-content: center;
  cursor: pointer;
}

.checkout {
  position: fixed;
  display: flex;
  align-items: center;
  z-index: 1000;
  bottom: 90px;
  background-color: #7c317c;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 100px;
  justify-content: center;
  cursor: pointer;
}

.checkout .icon {
  position: absolute;
  transition: all 0.35s ease;
}

.checkout .icon.basket {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.checkout .icon.arrow {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}

.checkout:hover .icon.basket {
  opacity: 0;
  transform: translateY(-10px) scale(0.9);
}

.checkout:hover .icon.arrow {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.checkout .badge {
  position: absolute;
  top: -2px;
  right: 0;
  width: 22px;
  height: 22px;
  background-color: red;
  color: white;
  font-size: 12px;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

.banner {
  position: fixed;
  top: 0;
  left: 0;
  height: 40px;
  width: 100%;
  background-color: #F7F9FD;
  color: #191919;
  text-align: center;
  font-size: 0.7rem;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ios-banner {
  padding-top: env(safe-area-inset-top) !important;
}

.sidebar {
  width: 250px;
  height: calc(100vh - 70px);
  position: fixed;
  top: 70px;
  left: 0;
  background-color: #f0f4f5;
  padding: 10px;
  /* overflow-y: auto; */
  z-index: 200;
  display: none;
  flex-direction: column;
}


.main-content {
  flex-grow: 1;
  width: 100%;
  box-sizing: border-box;
  min-height: calc(100vh - 60px);
  overflow: hidden;
  margin-top: 160px;
}

.footer {
  text-align: center;
  padding: 0;
  position: relative;
}

@media (max-width: 768px) {
  .banner {
    display: none;

  }

  .sidebar {
    width: 100%;
    height: 60px;
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    top: auto !important;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 9999;
    padding: 0;
    overflow: hidden;
    flex-direction: row;
  }

  .header {
    width: 100%;
    left: 0;
  }

  .main-content {
    width: 100% !important;
    margin-left: 0 !important;
    padding-bottom: 70px !important;
    margin-top: 0px;
    overflow: hidden;
    padding-top: 60px;
    padding-bottom: 20px;
  }


}
</style>