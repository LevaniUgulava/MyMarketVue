<template>
  <div id="app">
      <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
    <div class="login-card">
      <div class="login-content">
        <h2>Welcome Back!</h2>
        <p>Please login to your account</p>
        <router-link to='/ka/register' class="registerlink">Register</router-link>
<form @submit.prevent="login" method="post" id="loginform">
  <div class="input-container">
    <input v-model="email" type="text" name="email" id="email" required placeholder=" " />
    <label for="email">Email</label>
  </div>
  <div class="input-container">
    <input v-model="password" type="password" name="password" id="password" required placeholder=" " />
    <label for="password">Password</label>
  </div>
  <button :disabled="!email || !password">Login</button>
  <a href="/forget/password" class="forget">forget password?</a>
  <div class="social-login">
    <FacebookComponentVue />
    <GoogleComponent />
  </div>
</form>

      </div>
      <div class="image-content">
        <img src="https://via.placeholder.com/300" alt="Sample Image">
        <div class="card">
          <h3>Welcome to Our Service</h3>
          <p>Enjoy our features by logging in.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import FacebookComponentVue from './FacebookComponent.vue';
import GoogleComponent from './GoogleComponent.vue';


export default {
  name: "LoginComponent",
    components: {
    FacebookComponentVue,
    GoogleComponent
  },
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('login', {
          email: this.email,
          password: this.password
        });

        localStorage.setItem('name', response.data.name);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('roles', response.data.roles[0]);
        localStorage.setItem('userid', response.data.id);
 

        this.$router.push("/ka");
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
.forget{
  margin: 5px;
  text-decoration: none;
}

.login-card {
  display: flex;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 900px;
}

.login-content {
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

.registerlink {
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
  color: #333;
  background-color: #fff;
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

}
</style>
