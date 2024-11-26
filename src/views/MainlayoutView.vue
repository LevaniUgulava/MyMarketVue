<template>
  <div class="layout-container">
    <!-- Header and Sidebar remain as they are -->
    <div class="fixed-wrapper">
      <HeaderComponentVue class="header" @search="handleSearch" />
      <HomeSideBarVue class="sidebar" />


    </div>

   <div class="main-content">
      <router-view />
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
  methods: {
    handleSearch(searchData) {
      console.log(searchData.searchname);
      this.$router.push({
        path: '/',
        query: { searchname: searchData.searchname, page: 1 },
      });
    },
  },
};
</script>

<style scoped>
/* Layout Container */
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

/* Fixed Header and Sidebar */
.fixed-wrapper {
  display: flex;
  flex-direction: column;
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 100;
}

.header {
  width: calc(100% - 250px); 
  position: fixed;
  top: 0;
  left: 250px;
  height: 60px;
  background-color: #f8f8f8;
  z-index: 200;
}

.sidebar {
  padding: 10px;
  overflow-y: auto;
  height: calc(100vh - 60px); /* Full height minus header */
}

/* Main Content Area */
.main-content {
  flex-grow: 1;
  width: calc(100% - 250px);
  margin-left: 250px;
  margin-top: 60px; /* Offset for header height */
  padding: 10px;
  overflow-y: auto;
  box-sizing: border-box;
  min-height: calc(100vh - 60px); /* Ensures footer is pushed if content is short */
  overflow-y: auto;
}

/* Footer */
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


/* Responsive adjustments */
@media (max-width: 390px) {
  .fixed-wrapper {
    width: 100px;
  }
  .sidebar {
    width: 100px;
    padding: 5px;
  }
  .main-content {
    margin-left: 100px;
    width: calc(100% - 100px);
  }
}

@media (max-width: 575px) {
  .main-content {
    margin-top: 5%;
    width: calc(100% - 100px);
    margin-left: 100px;
    padding: 5px;
    overflow-y: auto;
    box-sizing: border-box;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .main-content {
    margin-top: 5%;
    width: calc(100% - 120px);
    margin-left: 120px;
    padding: 5px;
    overflow-y: auto;
    box-sizing: border-box;
  }
}

</style>
