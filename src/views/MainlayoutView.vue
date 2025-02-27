<template>
  <div class="layout-container">
    <HeaderComponentVue class="header" :isMobile="isMobile" @search="handleSearch" />

    <HomeSideBarVue class="sidebar" :isMobile="isMobile" />

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
  display: flex;
  flex-direction: column;
}

.header {
  width: 100vh;
  position: fixed;
  top: 0;
  height: 60px;
  background-color: #f8f8f8;
  z-index: 200;
  display: flex;
  align-items: center;
  padding: 10px;
}

.main-content {
  flex-grow: 1;
  width: calc(100% - 250px);
  margin-left: 250px;
  padding: 10px;
  box-sizing: border-box;
  min-height: calc(100vh - 60px);
  margin-top: 60px;
  overflow-y: auto;
}

.footer {
  width: calc(100% - 250px);
  margin-left: 250px;
  background-color: #333;
  color: #fff;
  text-align: center;
  font-size: 0.9em;
  padding: 15px 0;
  position: relative;
}

@media (max-width: 768px) {
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

  }

  .footer {
    width: 100% !important;
    margin-left: 0 !important;
  }
}
</style>
