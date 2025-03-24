<template>
  <div id="app">
    <div class="card">
      <form @submit.prevent="sendPassword" method="post" class="form">
        <div class="input-container">
          <input v-model="password" type="password" name="password" id="password" required placeholder=" "
            class="input-field" />
          <label for="password" class="input-label">Password</label>
        </div>
        <div class="input-container">
          <input v-model="repeatpassword" type="password" name="repeatpassword" id="repeatpassword" required
            placeholder=" " class="input-field" />
          <label for="repeatpassword" class="input-label">Repeat Password</label>
        </div>
        <button type="submit" class="submit-btn">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  props: ['id', 'token'],
  data() {
    return {
      password: "",
      repeatpassword: "",
    };
  },
  methods: {
    async sendPassword() {
      if (this.password !== this.repeatpassword) {
        alert("Passwords do not match.");
        return;
      }
      if (this.password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
      }
      const response = await api.post(`/reset/password/${this.id}?token=${this.token}`, { password: this.password });
      console.log(response);

    },
  },
};
</script>

<style scoped>
#app {
  margin-top: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 20px;
  max-width: 400px;
  width: 100%;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.input-container {
  position: relative;
  width: 100%;
}

.input-field {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease-in-out;
}

.input-field:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
}

.input-label {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  font-size: 16px;
  color: #aaa;
  pointer-events: none;
  transition: 0.3s ease-in-out;
}

.input-field:focus+.input-label,
.input-field:not(:placeholder-shown)+.input-label {
  top: -10px;
  font-size: 12px;
  color: #007bff;
}

.submit-btn {
  background-color: #365f8c;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.submit-btn:active {
  background-color: #003f7f;
}
</style>
