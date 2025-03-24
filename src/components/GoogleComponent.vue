<template>
  <div>
    <GoogleLogin :callback="handleLogin" prompt />
  </div>
</template>

<script setup>
import api from '@/api';
const handleLogin = async (googleResponse) => {
  try {
    const idToken = googleResponse.credential;

    console.log(idToken);

    const response = await api.post('google/callback', {
      tokenRequired: false,
      token: idToken
    });

    localStorage.setItem('name', response.data.name);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('roles', response.data.roles[0]);
    window.location.href = '/';
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Token validation failed.");
    } else {
      console.error("Login failed:", error);
    }
  }
};



</script>

<style></style>
