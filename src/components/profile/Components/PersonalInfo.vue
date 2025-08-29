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
    <h3>მომხმარებლის დეტალები:</h3>

    <div class="div">
      <div class="input-profile">
        <div class="input-container">
          <span v-if="emailError" class="error-text">{{ emailError }}</span>
          <input v-model="name" :class="{ 'input-error': emailError }" type="text" name="name" id="name"
            placeholder=" " />
          <label for="name">სახელი</label>
        </div>
      </div>

      <div class="input-profile">
        <div class="input-container">
          <span v-if="emailError" class="error-text">{{ emailError }}</span>
          <input v-model="surname" :class="{ 'input-error': emailError }" type="text" name="surname" id="surname"
            placeholder=" " />
          <label for="surname">გვარი</label>
        </div>
      </div>
    </div>

    <div class="div">
      <div class="input-profile">
        <div class="input-container">
          <span v-if="emailError" class="error-text">{{ emailError }}</span>
          <input v-model="email" :class="{ 'input-error': emailError }" type="text" name="email" id="email"
            placeholder=" " />
          <label for="email">ელ.ფოსტა</label>
        </div>
      </div>
      <div class="input-profile"></div>

    </div>


    <div class="btn-container">
      <button class="btn" @click="updateprofile" :disabled="!hasChanged">შეინახე</button>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      name: "",
      surname: "",
      email: "",
      emailError: "",
      message: "",
      original: {
        name: "",
        surname: "",
        email: ""
      },
      clearMessageTimeout: null
    }
  },

  computed: {
    hasChanged() {
      return (
        this.name !== this.original.name ||
        this.surname !== this.original.surname ||
        this.email !== this.original.email
      );
    }
  },

  methods: {
    async getProfile() {
      try {
        const res = await api.get("/getprofile");
        const user = res.data.user;

        this.name = user.name || "";
        this.surname = user.surname || "";
        this.email = user.email || "";

        this.original = {
          name: this.name,
          surname: this.surname,
          email: this.email
        };
      } catch (error) {
        console.log(error);
      }
    },

    async updateprofile() {
      try {
        const res = await api.post('/profile/update', {
          email: this.email,
          name: this.name,
          surname: this.surname
        });

        if (res.status === 200) {
          await this.getProfile();
          this.message = { 'message': res.data.message, 'type': "success" };
        }
      } catch (error) {
        console.log(error);
        this.emailError = "დაფიქსირდა შეცდომა.";
      }
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
  mounted() {
    this.getProfile();
  }
}
</script>

<style scoped>
.div {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 20px;
  padding: 10px 0 20px 0;
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

.icon {
  display: flex;
  margin-right: 20px;
  align-items: center;
  cursor: pointer;
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

.input-container label {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  font-size: 14px;
  color: #aaa;
  pointer-events: none;
  padding: 0 5px;
  background: transparent;
  transition: all 0.3s ease;
}

.input-container input:focus+label,
.input-container input:not(:placeholder-shown)+label {
  top: -10px;
  font-size: 12px;
  color: #333;
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