<template>
  <div v-if="message" :class="['message', messageType]" :style="{ backgroundColor: backgroundColor, color: textColor }">
    <span>{{ message }}</span>
    <button @click="removemessage">x</button>
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
    backgroundColor: {
      type: String,
      default: "#f8d7da",
    },
    textColor: {
      type: String,
      default: "#721c24",
    },
  },
  methods: {
    removemessage() {
      this.$emit("close");
    },
  },
};

</script>

<style scoped>
.message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  display: flex;
  justify-content: space-between;
  align-items: center; 
  margin: 1rem 0;
  font-size: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.message button {
  background: transparent;
  border: none;
  color: #721c24;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  margin-left: 1rem;
  transition: color 0.3s ease;
}

.message button:hover {
  color: #d9534f; 
}
</style>
