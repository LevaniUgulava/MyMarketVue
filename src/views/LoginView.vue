<template>
  <div>
    <LoginComponent />
    <FacebookComponent />
  </div>
</template>

<script>
import LoginComponent from '@/components/LoginComponent.vue';

export default {
  name: "LoginView",
  components: {
    LoginComponent,
  }
};
</script>

<style scoped>
/* Add your scoped styles here if needed */
</style>
