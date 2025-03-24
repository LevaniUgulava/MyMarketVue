<template>
  <div id="app">
    <div class="register-card">
      <div class="register-content">
        <h2>Create an Account</h2>
        <p>Please register to create an account</p>
        <router-link to='/ka/login' class="loginlink">Login</router-link>
     <form @submit.prevent="register" method="post" id="registerForm">
  <div class="input-container">
    <input v-model="name" type="text" name="name" id="name" placeholder=" " required />
    <label for="name">Name</label>
  </div>
  <div class="input-container">
    <input v-model="email" type="email" name="email" id="email" placeholder=" " required />
    <label for="email">Email</label>
  </div>
  <div class="input-container">
    <input v-model="password" type="password" name="password" id="password" placeholder=" " required />
    <label for="password">Password</label>
  </div>
  <button :disabled="!name || !email || !password" type="submit">Register</button>
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
import api from '@/api';

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
        const response = await api.post('register', {
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
 margin-top:10%;
 display: flex;
 justify-content: center;
 align-items: center;
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

.input-container {
  position: relative;
  margin-bottom: 20px;
  width: 100%;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  background: none;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #007BFF;
}

label {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  font-size: 14px;
  color: #aaa;
  pointer-events: none;
  transition: all 0.3s ease;
}

input:focus + label,
input:not(:placeholder-shown) + label {
  top: -10px;
  font-size: 12px;
  color: #007BFF;
  background: white;
  padding: 0 5px;
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
@media (min-width: 375px) and (max-width: 430px) {
.login-content {
  padding: 10px;
  width: 60%;
}
.image-content {
  width: 40%;
  padding: 10px;
}
p{
  font-size: 0.5rem;
}
h2{
    font-size: 1rem;
}
.registerlink{
    font-size: 0.6rem;
}
label{
      font-size: 0.7rem;
}
input{
  width:100%;
  height: 35px;
}
button{
 padding: 5px 10px;
  font-size: 0.8rem;
}
.card p{
  font-size: 0.5rem;
}
.card h3{
  font-size: 0.8rem;
}
.card{
  margin-bottom: 20px;
}
.loginlink{
  font-size: 0.6rem;
}

}
</style>
