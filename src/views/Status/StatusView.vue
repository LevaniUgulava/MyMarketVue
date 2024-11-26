<template>
  <div class="status-view">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "StatusView",
  components:{
  }
  
};
</script>

<style scoped>
.status-view {
  padding: 20px;
}
nav {
  margin-bottom: 20px;
}
nav a {
  margin-right: 10px;
  text-decoration: none;
  color: blue;
}
</style>
