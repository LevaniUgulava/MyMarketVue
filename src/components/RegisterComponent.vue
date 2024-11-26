<template>
  <div id="app">
    <div class="register-card">
      <div class="register-content">
        <h2>Create an Account</h2>
        <p>Please register to create an account</p>
        <router-link to='/ka/login' class="loginlink">Login</router-link>
        <form @submit.prevent="register" method="post" id="registerForm">
          <label for="name">Name:</label>
          <input v-model="name" type="text" name="name" id="name" required>
          <label for="email">Email:</label>
          <input v-model="email" type="email" name="email" id="email" required>
          <label for="password">Password:</label>
          <input v-model="password" type="password" name="password" id="password" required>
          <button type="submit">Register</button>
        </form>
      </div>
      <div class="image-content">
        <img src="https://via.placeholder.com/300" alt="Sample Image">
        <div class="card">
          <h3>Join Our Community</h3>
          <p>Sign up and start enjoying our features.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "RegisterComponent",
  data() {
    return {
      name: '',
      email: '',
      password: '',
    }
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('register', {
          name: this.name,
          email: this.email,
          password: this.password
        });
        response
        this.$router.push("/email/verification");
      } catch (error) {
        console.error(error);
      }
    },
  }
}
</script>

<style scoped>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.register-card {
  display: flex;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 900px;
}

.register-content {
  padding: 20px;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  font-size: 14px;
  margin-bottom: 20px;
  color: #666;
}

.loginlink {
  text-decoration: none;
  color: #0000ff;
  margin-bottom: 20px;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
}

input {
  margin-bottom: 15px;
  padding: 10px;
  font-size: 14px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ddd;
}

button {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #0000ff;
  color: white;
}

button:disabled {
  background-color: grey;
  cursor: not-allowed;
}



.image-content {
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  padding: 20px;
}

.image-content img {
  max-width: 100%;
  border-radius: 10px;
  margin-bottom: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.card h3 {
  margin-bottom: 10px;
  font-size: 18px;
}

.card p {
  font-size: 14px;
  color: #666;
}
</style>
