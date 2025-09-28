<template>
  <div id="app">
    <router-view v-if="!loading" />
    <PincodeComponent v-if="!loading && showPinPopup" @unlock="handleUnlocked" />
  </div>
</template>
<!-- v-if="!loading && showPinPopup" -->
<script setup>
import { onMounted, ref } from 'vue'
import { checkIfExist } from '@/mixin/Capacitor'

import PincodeComponent from './components/PinCode/PincodeComponent.vue'

const loading = ref(true)
const showPinPopup = ref(false)

function handleUnlocked() {
  showPinPopup.value = false
}

onMounted(async () => {
  await checkIfExist(loading, showPinPopup);
});
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
