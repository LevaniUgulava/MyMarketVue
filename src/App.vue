<template>

  <head>
    <!-- Include Noto Sans Georgian font from Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian&display=swap" rel="stylesheet">
  </head>

  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
html {
  scroll-behavior: instant;
}

body {
  font-family: 'Noto Sans Georgian', sans-serif;
}
</style>
