<template>
  <div v-if="open" class="overlay"></div>


  <div v-if="open" class="modal">
    <div class="login-wrapper">
      <div class="login-card">
        <button class="close" @click="closeModal">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="login-content">
          <h2>ავტორიზაცია</h2>
          <div class="dotted-line">
            <span></span>
          </div>
          <form @submit.prevent="login" method="post" id="loginform">
            <div class="input-container">
              <input v-model="email" type="text" name="email" id="email" required placeholder="" />
              <label for="email">ელ.ფოსტა</label>

            </div>
            <div class="input-container">
              <input v-model="password" type="password" name="password" id="password" required placeholder="" />
              <label for="email">პაროლი</label>
            </div>
            <button class="loginbtn">შესვლა</button>
            <div class="links">
              <span class="link">
                დაგავიწყდა პაროლი? <a href="/forget/password" class="forget">პაროლის აღდგენა</a>
              </span>
              <span class="link">
                არ გაქვს ანგარიში? <a @click="openregistermodal" class="forget">რეგისტრაცია</a>
              </span>
            </div>

            <div class="dotted-line">
              <span>გააგრძელეთ</span>
            </div>

            <div class="social-login">
              <FacebookComponentVue class="fb" />
              <GoogleComponent class="google" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import FacebookComponentVue from './FacebookComponent.vue';
import GoogleComponent from './GoogleComponent.vue';

export default {
  name: "LoginComponent",
  props: ['open'],
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
        const response = await api.post('login', {
          email: this.email,
          password: this.password
        });

        localStorage.setItem('name', response.data.name);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('roles', response.data.roles[0]);
        localStorage.setItem('userid', response.data.id);

        this.$router.push("/");

        // this.closeModal();


      } catch (error) {
        console.error(error);
      }
    },
    closeModal() {
      this.$emit('close');
    },
    openregistermodal() {
      this.$emit('openregister');

      this.closeModal();
    }
  }
}
</script>

<style scoped>
.links {
  display: flex;
  flex-direction: column;
  margin-top: 25px;
  gap: 10px;
}

span {
  color: #7c7878;
  font-size: 14px;
}

.dotted-line {
  display: flex;
  margin-top: 30px;
  align-items: center;
  justify-content: center;
  position: relative;
  align-items: center;
  text-align: center;
  width: 100%;
}

.dotted-line::before,
.dotted-line::after {
  content: "";
  flex-grow: 1;
  border-bottom: 1.5px dotted #dbdbdb;
  margin: 0 5px;
}

.dotted-line span {
  font-size: 12px;
  border: 1px solid #dbdbdb;
  padding: 5px;
  border-radius: 5px;
  color: #4e4c4c;
}


.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
}

.modal {
  position: fixed;
  top: 10px;
  right: 10px;
  bottom: 10px;
  width: 50vh;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.input-container {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.login-content {
  position: relative;
  bottom: 10px;
}

#loginform {
  position: relative;
  top: 20px;
}

input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  height: 50px;
  border: 1px solid #dbdbdb;
  border-radius: 10px;
  outline: none;
  background: #f9f9f9;
  transition: 0.3s;
}

input:focus+label,
input:not(:placeholder-shown)+label {
  top: -10px;
  font-size: 12px;
  color: #333;
  padding: 0 5px;
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

.loginbtn {
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
  border: none;
  background-color: #62389c;
  color: white;
  width: 100%;
  font-weight: 500;
  transition: background-color 0.3s;
}

h2 {
  display: flex;
  justify-content: center;
  font-size: 1.5rem;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.loginbtn:hover {
  background-color: #4b6ee6;
}


.forget {
  text-decoration: none;
  color: #0000ff;
  font-size: 14px;
  margin-left: 10px;
}

.social-login {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  width: 100%;
  justify-content: center;
}

.fb,
.google {
  flex: 1;
}

.login-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-radius: 10px;
  height: 100%;
}

.login-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-right: 2px solid #ccc;
  width: 100%;
  max-width: 50vh;
  height: 100%;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.close {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 40%;
  font-size: 24px;
  z-index: 1000;

}
</style>
