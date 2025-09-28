<template>
  <div v-if="open" class="overlay"></div>


  <div v-if="open" class="modal">
    <div class="login-wrapper">
      <div
        :class="['login-card', platform === 'ios' ? 'ios-padding' : '', platform === 'android' ? 'android-padding' : '']">


        <div class="login-content">
          <div class="title">
            <h2>ავტორიზაცია</h2>
            <button class='close' @click="closeModal">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="social-login">
            <FacebookComponentVue class="fb" />
            <GoogleComponent class="google" />
          </div>

          <div class="dotted-line">
            <span>ან</span>
          </div>
          <form @submit.prevent="login" method="post" id="loginform">
            <div class="input-container">
              <span v-if="emailError" class="error-text">{{ emailError }}</span>
              <input v-model="email" :class="{ 'input-error': emailError }" type="text" name="email" id="email"
                placeholder=" " />
              <label for="email">ელ.ფოსტა</label>
            </div>

            <div class="input-container">
              <span v-if="passwordError" class="error-text">{{ passwordError }}</span>

              <input v-model="password" :class="{ 'input-error': passwordError }"
                :type="isPassword ? 'password' : 'text'" name="password" id="password" placeholder=" " />
              <label for="password">პაროლი</label>

              <button type="button" class="toggle-password" @click="isPassword = !isPassword"
                aria-label="Toggle password visibility">
                <i :class="isPassword ? 'fa fa-eye' : 'fa fa-eye-slash'"></i>
              </button>
            </div>

            <button class="loginbtn">შესვლა</button>
          </form>

          <div class="links">
            <span class="link">
              დაგავიწყდა პაროლი? <a @click.prevent="openforgetmodal" class="forget">პაროლის აღდგენა</a>
            </span>
            <span class="link">
              არ გაქვს ანგარიში? <a @click.prevent="openregistermodal" class="forget">რეგისტრაცია</a>
            </span>
          </div>

          <div class="dotted-line">
            <span></span>
          </div>

        </div>
        <div class="Error" v-if="ErrorName && ErrorText">
          <strong>{{ ErrorName }}</strong>
          <hr />
          <p>{{ ErrorText }}</p>
          <button v-if="showVerifyButton" class="link-verify" @pointerdown="redirectVerify">
            დაადასტურე ელფოსტა
          </button>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
import FacebookComponentVue from './FacebookComponent.vue';
import GoogleComponent from './GoogleComponent.vue';
import { mapActions } from 'vuex';
import { validateInputFields } from './utils/validate';
import { Capacitor } from '@capacitor/core';
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
      emailError: '',
      passwordError: '',
      showVerifyButton: false,
      isPassword: true,
      ErrorName: "",
      ErrorText: "",
      platform: Capacitor.getPlatform()
    }
  },
  methods: {
    ...mapActions('auth', {
      loginAction: 'login',
    }),
    redirectVerify() {
      let data = {
        "email": this.email,
        "from": "register"
      }
      this.$emit('emaildata', data);
    },
    async login() {
      const valid = validateInputFields(this, [
        { model: 'email', errorKey: 'emailError', message: 'ელ.ფოსტა აუცილებელია' },
        { model: 'password', errorKey: 'passwordError', message: 'პაროლი აუცილებელია' },
      ]);

      if (!valid) return;

      try {

        const response = await this.loginAction({
          email: this.email,
          password: this.password,
          client_type: this.platform
        });
        console.log(response);

        if (response.status === 200) {
          this.closeModal();
        } else {
          if (response.status === 422) {
            this.ErrorName = "არასწორი ფორმატი"
            this.ErrorText = "გაითვალისწინეთ, პაროლი უნდა შედგებოდეს არანკლებ 8 სიმბოლოსგან, ასევე შეამოწმეთ ელ.ფოსტის ფორმატი"
          } else if (response.status === 404) {
            this.ErrorName = "არასწორი ელ.ფოსტა ან პაროლი"
            this.ErrorText = "შეყვანილი მონაცემები არ ემთხვევა ჩანაწერებს"
          }
          else if (response.status === 403 && response.action === "verify_email") {
            this.ErrorName = "ვერიფიკაცია არ დასრულებულა";
            this.ErrorText = "ვერიფიკაციის გარეშე წვდომას ვერ მიიღებთ ანგარიშზე. გსურთ გააგრძელოთ ვერიფიკაცია?";
            this.showVerifyButton = true;
          }
        }

      } catch (error) {
        console.log(error);
      }
    },


    closeModal() {
      this.$emit('close');
    },
    openregistermodal() {
      this.$emit('openregister');
      this.closeModal();
    },
    openforgetmodal() {
      this.$emit('openforget');
      this.closeModal();
    },

  },

}
</script>

<style scoped>
.Error {
  background-color: #ffe5e5;
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

.link-verify {
  background: none;
  border: none;
  color: #0000ff;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: 12px !important;
  font: inherit;
}


.input-container {
  position: relative;
  margin-bottom: 30px;
}

.input-container input {
  width: 100%;
  font-size: 16px;
  padding: 0px 0px !important;
  text-indent: 15px;
  height: 50px;
  border: 1px solid #dbdbdb;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-error {
  border-color: #e74c3c;
}

.input-container label {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  font-size: 14px;
  color: #aaa;
  pointer-events: none;
  padding: 0 5px;
  background: white;
  transition: all 0.3s ease;
}

.input-container input:focus+label,
.input-container input:not(:placeholder-shown)+label {
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

.toggle-password {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #888;
  padding: 4px;
  z-index: 2;
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

.login-content {
  position: relative;
  width: 365px;
  margin: auto;
  bottom: 10px;
}

#loginform {
  position: relative;
  top: 20px;
  padding: 20px;
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
  margin: auto;
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
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  width: 100%;
  justify-content: center;
}

.fb,
.google {
  cursor: pointer;
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
  height: 95%;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.ios-padding {
  padding-top: calc(80px + env(safe-area-inset-top)) !important;
}

.android-padding {
  padding-top: 60px !important;
}

.close {
  background-color: transparent;
  border: none;
  cursor: pointer;
  border-radius: 40%;
  font-size: 20px;

}

.title {
  display: flex;
  padding-top: 20px;
  margin: 0 auto 0 30px;
  justify-content: space-between;
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

  .login-card {
    background: white;
    border-radius: 0px;
    padding: 0px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-right: 2px solid #ccc;
    max-width: 100vw;
    height: 100%;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  }

  .links {
    padding: 0 10px
  }

  .title {
    padding-top: 35px;
  }
}
</style>
