<template>
  <div class="admin-container">
    <AdminSideBar />
    <div class="admin-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import AdminSideBar from '../components/Admin/SideBar.vue'

export default {
  name: 'AdminView',
  components: {
    AdminSideBar,
  },
}
</script>

<style scoped>
.admin-container {
  display: flex;
}

.admin-content {
  flex: 1; /* This will take up the remaining space */
  padding: 20px; /* Optional: add some padding */
}
</style>
