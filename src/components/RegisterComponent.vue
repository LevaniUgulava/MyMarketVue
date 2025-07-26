<template>
  <div v-if="open" class="overlay"></div>


  <div v-if="open" class="modal">
    <div class="registration-wrapper">
      <div :class="['registration-card', platform === 'ios' ? 'ios-padding' : '']">


        <div class="registration-content">
          <div class="title">
            <h2>რეგისტრაცია</h2>
            <button class='close' @click="closeModal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="dotted-line">
            <span></span>
          </div>
          <form @submit.prevent="register" method="post" id="registrationform">
            <div class="input-container">
              <span v-if="nameError" class="error-text">{{ nameError }}</span>
              <input v-model="name" :class="{ 'input-error': nameError }" type="text" name="name" id="name"
                placeholder="" />
              <label for="name">სახელი</label>
            </div>
            <div class="input-container">
              <span v-if="emailError" class="error-text">{{ emailError }}</span>
              <input v-model="email" :class="{ 'input-error': emailError }" type="email" name="email" id="email"
                placeholder="" />
              <label for="email">ელ.ფოსტა</label>
            </div>
            <div class="input-container">
              <span v-if="passwordError" class="error-text">{{ passwordError }}</span>
              <input v-model="password" :class="{ 'input-error': passwordError }" type="password" name="password"
                id="password" placeholder=" " />
              <label for="email">პაროლი</label>
            </div>
            <button class="registrationbtn">რეგისტრაცია</button>
          </form>
          <div class="links">
            <span class="link">
              უკვე გაქვს ანგარიში? <a @click="openregistermodal" class="forget">ავტორიზაცია</a>
            </span>
          </div>
          <div class="dotted-line">
            <span></span>
          </div>
          <div class="Error" v-if="ErrorName && ErrorText">
            <strong>{{ ErrorName }}</strong>
            <hr />
            <p>{{ ErrorText }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/api';
import { validateInputFields } from './utils/validate';
import { Capacitor } from '@capacitor/core';

export default {
  name: "RegisterComponent",
  props: ['open'],

  data() {
    return {
      name: '',
      email: '',
      password: '',
      nameError: '',
      emailError: '',
      passwordError: '',
      ErrorName: "",
      ErrorText: "",
      platform: Capacitor.getPlatform()

    }
  },
  methods: {
    async register() {
      const valid = validateInputFields(this, [
        { model: 'name', errorKey: 'nameError', message: 'სახელი აუცილებელია' },
        { model: 'email', errorKey: 'emailError', message: 'ელ.ფოსტა აუცილებელია' },
        { model: 'password', errorKey: 'passwordError', message: 'პაროლი აუცილებელია' },
      ]);

      if (!valid) return;
      try {
        await api.post('register', {
          name: this.name,
          email: this.email,
          password: this.password
        });
        let data = {
          "email": this.email,
          "from": "register"
        }
        this.$emit('emaildata', data);
      } catch (error) {
        if (error.response.status === 422) {
          this.ErrorName = "არასწორი ფორმატი"
          this.ErrorText = "გაითვალისწინეთ, პაროლი უნდა შედგებოდეს არანკლებ 8 სიმბოლოსგან, ასევე შეამოწმეთ ელ.ფოსტის ფორმატი"
        }
      }
    },
    closeModal() {
      this.$emit('close');
    },
    openregistermodal() {
      this.$emit('openlogin');
      this.closeModal();
    }
  }

}
</script>

<style scoped>
.Error {
  background-color: #ffe5e5;
  border: 1px solid #ffaea8;
  color: #b71c1c;
  padding: 16px 24px;
  margin: 20px auto;
  border-radius: 10px;
  max-width: 600px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  line-height: 1.5;
}

.Error strong {
  font-size: 14px;
  display: block;
  margin-bottom: 8px;
}

.Error p {
  margin: 0;
  font-size: 12px;

}

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

.registration-content {
  position: relative;
  width: 365px;
  margin: auto;
  bottom: 10px;
}

#registrationform {
  position: relative;
  width: 365px;
  top: 20px;
}

input {
  width: 100%;
  font-size: 16px;
  height: 50px;
  text-indent: 15px;

  border: 1px solid #dbdbdb;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-error {
  border-color: #e74c3c;
}

label {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  font-size: 14px;
  color: #aaa;
  pointer-events: none;
  padding: 0 5px;
  transition: all 0.3s ease;
}

input:focus+label,
input:not(:placeholder-shown)+label {
  top: -10px;
  font-size: 12px;
  color: #333;
}

.error-text {
  position: absolute;
  top: -20px;
  right: 0;
  color: #e74c3c;
  font-size: 12px;
  background: white;
  padding: 0 5px;
}

.registrationbtn {
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

.registrationbtn:hover {
  background-color: #4b6ee6;
}


.forget {
  text-decoration: none;
  color: #0000ff;
  font-size: 14px;
  margin-left: 10px;
}

.registration-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-radius: 10px;
  height: 100%;
}

.registration-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-right: 2px solid #ccc;
  width: 100%;
  max-width: 50vh;
  height: 95%;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.ios-padding {
  padding-top: calc(60px + env(safe-area-inset-top)) !important;
}


.title {
  display: flex;
  padding-top: 20px;
  margin: 0 auto 0 100px;
  justify-content: space-between;
}

.close {

  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;

}

@media (max-width: 768px) {
  .modal {
    position: fixed;
    top: 0px;
    right: 0px;
    width: 100vw;
    border-radius: none;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .registration-card {
    background: white;
    border-radius: 0px;
    padding: 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-right: 2px solid #ccc;
    max-width: 100vw;
    height: 100%;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  }
}
</style>
