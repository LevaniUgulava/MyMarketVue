<template>
  <div class="layout-container">
    <div class="banner">
      რეგისტრაციის შემთხვევაში თქვენ შეგეძლებათ მიიღოთ სტატუსები, რაც საშუალებას გაძლევთ კონკრეტულ პროდუქტზე ექკლუზიურ
      ფასდაკლების მიღებას
    </div>
    <HeaderComponentVue class="header" :isMobile="isMobile" @search="handleSearch" />

    <HomeSideBarVue class="sidebar" v-if="isMobile" />

    <div class="main-content">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>

    <FooterComponentVue class="footer" />
  </div>
</template>

<script>
import HeaderComponentVue from '@/components/HeaderComponent.vue';
import HomeSideBarVue from '@/components/HomeSideBar.vue';
import FooterComponentVue from '@/components/FooterComponent.vue';

export default {
  name: 'MainLayout',
  components: {
    HeaderComponentVue,
    HomeSideBarVue,
    FooterComponentVue,
  },
  data() {
    return {
      isMobile: window.innerWidth <= 768,
    };
  },
  mounted() {
    window.addEventListener('resize', this.checkScreenSize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  methods: {
    checkScreenSize() {
      this.isMobile = window.innerWidth <= 768;
    },
  },
};
</script>

<style scoped>
.banner {
  position: fixed;
  top: 0;
  left: 0;
  height: 10px;
  width: 100%;
  background-color: #62389c;
  color: white;
  text-align: center;
  padding: 15px;
  font-size: 0.7rem;
  font-weight: bold;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sidebar {
  width: 250px;
  height: calc(100vh - 70px);
  position: fixed;
  top: 70px;
  left: 0;
  background-color: #f0f4f5;
  padding: 10px;
  overflow-y: auto;
  z-index: 200;
  display: none;
  flex-direction: column;
}

.header {
  width: 100%;
  position: fixed;
  top: 0;
  height: 60px;
  background-color: #f8f8f8;
  z-index: 200;
  display: flex;
  left: 0;
  align-items: center;
  padding: 10px;
}

.main-content {
  flex-grow: 1;
  width: 100%;
  box-sizing: border-box;
  min-height: calc(100vh - 60px);
  margin-top: 130px;
  overflow-y: auto;
}

.footer {
  width: 100%;
  text-align: center;
  font-size: 0.9em;
  padding: 15px 0;
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
    margin-top: 70px;

  }

  .footer {
    width: 100% !important;
    margin-left: 0 !important;
  }
}
</style>