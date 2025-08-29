<template>
  <div id="app">
    <router-view v-if="!loading" />
    <PincodeComponent v-if="!loading && showPinPopup" @unlocked="handleUnlocked" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Capacitor } from '@capacitor/core'
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin'

import PincodeComponent from './components/PinCode/PincodeComponent.vue'

const loading = ref(true)
const showPinPopup = ref(false)

async function checkLock() {
  if (!Capacitor.isNativePlatform()) {
    loading.value = false
    return
  }

  try {
    const res = await SecureStoragePlugin.get({ key: 'pincode' }).catch(() => null)
    const pinValue = res?.value ?? res
    if (pinValue && String(pinValue).length > 0) {
      showPinPopup.value = true
    }
  } catch (err) {
    console.error('Error checking PIN:', err)
  } finally {
    loading.value = false
  }
}

function handleUnlocked() {
  showPinPopup.value = false
}

onMounted(() => {
  checkLock()
})
</script>


<style>
html {
  scroll-behavior: instant;

}

* {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;

}

</style>
