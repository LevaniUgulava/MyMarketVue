<template>
  <div v-if="open" class="overlay"></div>


  <div v-if="open" class="modal">
    <div class="login-wrapper">
      <div :class="['login-card', platform === 'ios' ? 'ios-padding' : '']">


        <div class="login-content">
          <div class="title">
            <h2>პაროლის აღდგენა</h2>
            <button class="close" @click="closeModal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="dotted-line">
            <span></span>
          </div>
          <form @submit.prevent="sendEmail" method="post" id="loginform">
            <div class="input-container">
              <span v-if="emailError" class="error-text">{{ emailError }}</span>
              <input v-model="email" :class="{ 'input-error': emailError }" type="email" name="email" id="email"
                placeholder=" " />
              <label for="email">ელ.ფოსტა</label>
            </div>

            <button class="loginbtn">გაგზავნა</button>
          </form>

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
import { validateInputFields } from '@/components/utils/validate';
import { Capacitor } from '@capacitor/core';

export default {
  name: "ForgetPassword",
  props: ['open'],

  data() {
    return {
      email: "",
      emailError: '',
      ErrorName: "",
      ErrorText: "",
      platform: Capacitor.getPlatform()
    };
  },
  methods: {
    async sendEmail() {
      const valid = validateInputFields(this, [
        { model: 'email', errorKey: 'emailError', message: 'ელ.ფოსტა აუცილებელია' },
      ]);

      if (!valid) return;
      try {
        await api.post('/forget/password', { email: this.email });
        let data = {
          "email": this.email,
          "from": "forget"
        }
        this.$emit('emaildata', data);
      } catch (error) {
        if (error.response.status === 422) {
          this.ErrorName = "არასწორი ფორმატი"
          this.ErrorText = "გაითვალისწინეთ, პაროლი უნდა შედგებოდეს არანკლებ 8 სიმბოლოსგან, ასევე შეამოწმეთ ელ.ფოსტის ფორმატი"
        } else if (error.response.status === 500) {
          this.ErrorName = "არასწორი ელ.ფოსტა"
          this.ErrorText = "ჩანაწერები არ ემთხევა"
        }
      }
    },
    closeModal() {
      this.$emit('close');
    },

  }
};
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
  width: 365px;

  bottom: 10px;
}

#loginform {
  position: relative;
  top: 20px;
}

input {
  width: 100%;
  text-indent: 15px;

  font-size: 16px;
  height: 50px;
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
  max-width: 50vh;
  height: 95%;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.ios-padding {
  padding-top: calc(80px + env(safe-area-inset-top)) !important;
}

.close {

  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;

}

.title {
  display: flex;
  padding-top: 20px;
  margin: 0 auto 0 60px;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .modal {
    position: fixed;
    top: 0px;
    right: 0px;
    width: 100vh;
    border-radius: none;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .login-card {
    background: white;
    border-radius: 0px;
    padding: 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-right: 2px solid #ccc;
    height: 100%;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  }
}
</style>
