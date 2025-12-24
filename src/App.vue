<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useAuth } from './mixin/reuse';
import api from './api';

const { isAuth } = useAuth();
function getSource() {
  const source = new URLSearchParams(window.location.search).get('source');
  if (source) {
    localStorage.setItem('traffic_source', source);
  }
}

async function saveSource() {
  const source = localStorage.getItem('traffic_source');
  if (!source) return;

  try {
    await api.post('/traffic/record', { source });
    localStorage.removeItem('traffic_source');
  } catch (error) {
    console.log(error);
  }
}
onMounted(async () => {
  if (isAuth.value) {
    window.Echo.join(`online-users`)
  }
  getSource();
  setTimeout(() => {
    saveSource();
  }, 2 * 60 * 1000);
})

</script>


<style>
html {
  scroll-behavior: instant;

}

* {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-tap-highlight-color: transparent;

}
</style>
