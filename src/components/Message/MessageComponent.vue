<template>
  <div class="messagecomponent">
    <div v-html="message"></div>
    <div>
      <i @click.prevent="$emit('close')" class="fa-solid fa-xmark"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageComponent",
  props: {
    message: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.messagecomponent {
  display: flex;
  position: fixed;
  top: 21%;
  right: 0.1%;
  color: white;
  padding: 20px;
  background-color: #62389c;
  border: none;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 9999;
  max-width: 400px;
  width: auto;
  font-size: 13px;
  gap: 10px;
}

.messagecomponent i {
  cursor: pointer;
}

.messagecomponent a {
  color: white;
}

.messagecomponent div {
  font-weight: 900;
  text-transform: uppercase;
  font-family: 'Roboto', sans-serif;
}
</style>
