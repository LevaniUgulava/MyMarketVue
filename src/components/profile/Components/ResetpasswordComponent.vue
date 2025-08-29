<template>
  <div>
    <div v-if="message" :class="['message', message.type === 'error' ? 'error' : 'success']">
      <div>
        <p>{{ message.message }}</p>
      </div>
      <div @pointerdown="close" class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>
    </div>
    <h3>პაროლის შეცვლა</h3>
    <div class="custom-line"></div>
    <p :class="[getHasPassword.password ? '' : 'visibility']">მიმდინარე პაროლი</p>
    <div :class="['div', getHasPassword.password ? '' : 'visibility']">
      <div class="input-profile">
        <div class="input-container">
          <input :disabled="!getHasPassword.password" v-model="currentPassword" type="text" name="current_password"
            id="current_password" placeholder="მიმდინარე პაროლი" />
        </div>
      </div>

      <div class="input-profile"></div>



    </div>
    <div class="custom-line"></div>
    <p v-if="!getHasPassword.password" class="info-text">
      თქვენ შეხვედით {{ getHasPassword.platform }}-ით. პაროლის დასაყენებლად შეავსეთ ქვემოთ მოცემული ველები.
    </p>

    <p>ახალი პაროლი</p>

    <div class="div">
      <div class="input-profile">
        <div class="input-container">
          <input v-model="newPassword" type="text" name="new_password" id="new_password" placeholder="ახალი პაროლი" />

        </div>
      </div>
      <div class="input-profile">
        <div class="input-container">
          <input v-model="repeatPassword" type="text" name="repeat_password" id="repeat_password"
            placeholder="გაიმეორე პაროლი" />

        </div>
      </div>
    </div>

    <div class="btn-container">
      <button class="btn" @click="resetPassword" :disabled="!appearButton">შეინახე</button>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import { mapGetters } from 'vuex';

export default {

  data() {
    return {
      currentPassword: '',
      repeatPassword: '',
      newPassword: '',
      message: "",
      currentError: '',
      newError: '',
      repeatError: '',
      clearMessageTimeout: null
    }
  },
  computed: {
    ...mapGetters('auth', ['getHasPassword']),

    appearButton() {
      return (
        this.newPassword &&
        this.repeatPassword &&
        this.newPassword === this.repeatPassword &&
        (this.getHasPassword.password ? this.currentPassword : true)
      );
    }

  },
  watch: {
    message(newVal) {
      if (this.clearMessageTimeout) {
        clearTimeout(this.clearMessageTimeout);
      }
      if (newVal) {
        this.clearMessageTimeout = setTimeout(() => {
          this.message = null;
          this.clearMessageTimeout = null;
        }, 8000);
      }
    }
  },

  methods: {
    close() {
      this.message = ''
    },
    async resetPassword() {
      try {
        const response = await api.post('/profile/update/password', {
          oldpassword: this.currentPassword,
          newpassword: this.newPassword
        });
        if (response.status === 200) {
          this.$store.commit('auth/setHasPassword', {
            password: true,
            platform: ''
          });
          this.message = { 'message': response.data, 'type': "success" };
          this.currentPassword = '',
            this.newPassword = '',
            this.repeatPassword = ''
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 422) {
            this.message = { 'message': "პაროლის ველი უნდა იყოს მინიმუმ 8 სიმბოლო.", 'type': "error" };
          } else if (error.response.status === 403) {
            this.message = { "message": error.response.data, 'type': 'error' }
          } else {
            this.message = { "message": "მოხდა შეცდომა", 'type': 'error' }

          }
        }

      }
    }
  },

}


</script>

<style scoped>
.visibility {
  opacity: 0.4;
}

.info-text {
  background-color: rgb(207, 241, 207);
  padding: 10px;
  border-radius: 10px;
}

.icon {
  display: flex;
  margin-right: 20px;
  align-items: center;
  cursor: pointer;
}

.input-error {
  border-color: #e74c3c;
}

.message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border-radius: 10px;
}

.success {
  background-color: rgb(207, 241, 207);
}

.error {
  background-color: rgb(246, 212, 212);
}

.message p {
  font-size: 14px;
  margin-left: 15px;
}

p {
  font-size: 13px;
}

.div {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 20px;
  padding: 0 0 20px;
}

.input-container {
  position: relative;
  width: 100%;
}

.input-profile {
  width: 50%;
}

.input-container input {
  width: 100%;
  font-size: 14px;
  text-indent: 15px;
  height: 50px;
  border: 1px solid #dbdbdb;
  border-radius: 10px;
  color: black;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.custom-line {
  width: 100%;
  height: 1px;
  background-color: #dbdbdb;

}

.btn-container {
  padding: 0 0 20px;
  width: 100%;
}

.btn {
  color: #ffffff;
  background-color: #7a1dff;
  border: none;
  border-radius: 6px;
  width: fit-content;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}
</style>