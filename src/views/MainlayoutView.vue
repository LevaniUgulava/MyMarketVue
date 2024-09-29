<template>
  <div class="layout-container">
    <div class="fixed-wrapper">
      <HeaderComponentVue class="header"  @search="handleSearch" />
      <HomeSideBarVue class="sidebar" />
    </div>

    <div class="main-content">
      <!-- router-view will load the dynamic component based on the route -->
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderComponentVue from '@/components/HeaderComponent.vue';
import HomeSideBarVue from '@/components/HomeSideBar.vue';

export default {
  name: 'MainLayout',
  components: {
    HeaderComponentVue,
    HomeSideBarVue,

  },

  methods:{
 handleSearch(searchData) {
      console.log(searchData.searchname);

      this.$router.push({
        path: '/',
        query: { searchname: searchData.searchname, page: 1 }, 
    })
  }
  }
};
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.fixed-wrapper {
  display: flex;
  flex-direction: column;
  width: 250px; /* Adjust sidebar width */
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 100;
}

.header {
  width: calc(100% - 250px); /* Ensure header spans the rest of the screen */
  position: fixed;
  top: 0;
  left: 250px; /* Align with the sidebar */
  z-index: 200; /* Make sure the header is above the sidebar */
  height: 60px; /* Set a fixed height for the header */
  background-color: #f8f8f8;
}

.sidebar {
  padding: 10px;
  overflow-y: auto;
}

.main-content {
  width: calc(100% - 250px); /* Ensure content fits within remaining space */
  margin-left: 250px;
  padding: 10px;
  overflow-y: auto;
  box-sizing: border-box; /* Ensure padding is included in the width calculation */
}
@media (max-width: 390px) {
  .sidebar {
    width: 100px; /* Further reduce sidebar width */
    padding: 5px;
  }

  .fixed-wrapper {
    width: 100px; /* Adjust fixed-wrapper to match sidebar */
  }

  .main-content {
    margin-left: 100px; 
    width: calc(100% - 100px); /* Adjust content width */
  }

  .sidebar ul li a,
  .sidebar ul li button {
    padding: 5px; /* Further adjust padding */
    font-size: 0.8rem; /* Further reduce font size */
  }

  /* Hide text and show icons only */
  .sidebar ul li a i {
    margin-right: 0;
  }
  
  .sidebar ul li a {
    display: flex;
    justify-content: center; /* Center the icons */
    align-items: center;
  }

  .sidebar ul li a span {
    display: none; /* Hide the text */
  }
  }
/* Media query for smaller screens (mobile devices) */
@media (max-width: 575px) {
  .main-content {
    margin-top: 5%;
    width: calc(100% - 100px); /* Adjusted width */
    margin-left: 100px;
    padding: 5px;
    overflow-y: auto;
    box-sizing: border-box;
  }
}

/* Media query for tablets */
@media (min-width: 576px) and (max-width: 767px) {
  .main-content {
    margin-top: 5%;
    width: calc(100% - 100px); /* Adjusted width */
    margin-left: 120px;
    padding: 5px;
    overflow-y: auto;
    box-sizing: border-box;
  }
}


</style>