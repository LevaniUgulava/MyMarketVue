<template>
  <div class="layout-container">
    <div class="fixed-wrapper" :class="{ 'is-collapsed': isSidebarCollapsed }">
      <HeaderComponentVue class="header" @search="handleSearch" />
      <HomeSideBarVue class="sidebar" @sidebar-collapse="handleSidebarCollapse"/>
      
    </div>

   <div class="main-content" :class="{ 'is-collapsed': isSidebarCollapsed }">
      <router-view v-slot="{ Component }">
        <component :is="Component" :is-sidebar-collapsed="isSidebarCollapsed" />
      </router-view>
    </div>
    <FooterComponentVue class="footer" :class="{ 'is-collapsed': isSidebarCollapsed }" />
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
      isSidebarCollapsed: window.innerWidth <= 1024, // Initialize collapsed state for mobile
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed; // Toggle sidebar collapse state
    },
    handleSidebarCollapse(isCollapsed) {
      this.isSidebarCollapsed = isCollapsed; // Update state when emitted by sidebar
    },
    handleResize() {
      this.isSidebarCollapsed = window.innerWidth <= 1024; // Adjust based on screen size
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize); // Add resize listener
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize); // Clean up listener
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
  width: 250px; /* Default width */
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 100;
  transition: width 0.3s ease; /* Smooth transition for sidebar width */
}

.fixed-wrapper.is-collapsed {
  width: 60px; /* Collapsed width */
}

.header {
  width: calc(100% - 250px); 
  position: fixed;
  top: 0;
  left: 250px;
  height: 60px;
  background-color: #f8f8f8;
  z-index: 200;
  transition: left 0.3s ease, width 0.3s ease;
}

.header.is-collapsed {
  left: 60px;
  width: calc(100% - 60px);
}

.sidebar {
  padding: 10px;
  overflow-y: auto;
  height: calc(100vh - 60px); 
}

.main-content {
  flex-grow: 1;
  width: calc(100% - 250px); /* Default width */
  margin-left: 250px; /* Default margin */
  margin-top: 60px; /* Offset for header height */
  padding: 10px;
  box-sizing: border-box;
  min-height: calc(100vh - 60px); /* Ensures footer is pushed if content is short */
  overflow-y: auto;
  transition: margin-left 0.3s ease, width 0.3s ease;
}

.main-content.is-collapsed {
  width: calc(100% - 60px); /* Adjust for collapsed sidebar */
  margin-left: 60px;
}

/* Footer */
.footer {
  width: calc(100% - 250px); /* Default width */
  margin-left: 250px; /* Default margin */
  background-color: #333;
  color: #fff;
  text-align: center;
  font-size: 0.9em;
  padding: 15px 0;
  position: relative;
  transition: margin-left 0.3s ease, width 0.3s ease;
}

.footer.is-collapsed {
  width: calc(100% - 60px); 
  margin-left: 60px;
}

@media (min-width: 375px) and (max-width: 430px) {
  .fixed-wrapper {
    width: 100px;
  }
  .fixed-wrapper.is-collapsed {
    width: 60px !important; 
  }
  .main-content {
    width: calc(100% - 100px);
    margin-left: 100px;
  }
  .main-content.is-collapsed {
    width: calc(100% - 50px);
    margin-left: 50px;
  }
  .footer {
    width: calc(100% - 100px);
    margin-left: 100px;
  }
  .footer.is-collapsed {
    width: calc(100% - 60px);
    margin-left: 60px;
  }
}

</style>
