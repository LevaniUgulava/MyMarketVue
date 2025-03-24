<template>
  {{ message }}
  <div class="profile-container">
    <div class="content">
      <div class="left-sections">
        <div class="section">
          <h3>მომხმარებლის დეტალები:</h3>
          <div class="input-profile">
            <label>სახელი:</label>
            <input name="name" type="text" placeholder="Name..." v-model="name">
            <label>ელფოსტა:</label>
            <input name="email" type="email" placeholder="Email..." v-model="email">
          </div>
          <button class="btn" @click="updateprofile">შეინახე</button>
        </div>



        <div class="section">
          <h3>პაროლის შეცვლა:</h3>
          <div class="input-profile">
            <label>ძველი პაროლი:</label>
            <input name="currentpassword" type="password" placeholder="ძველი პაროლი" v-model="currentpassword">
            <label>ახალი პაროლი:</label>
            <input name="newpassword" type="password" placeholder="ახალი პაროლი" v-model="newpassword">
          </div>
          <button class="btn" @click="updatepassword">შეინახე</button>
        </div>
      </div>

      <div class="section1">

        <div class="section">
          <div class="side-section">
            <h3>Side Section</h3>
            <p>This section will be placed side by side with the two sections.</p>
            <button @click="resend">Send Verification Email</button>
          </div>
        </div>
        <div class="section">

          <UserStatusComponentVue />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserStatusComponentVue from './UserStatusComponent.vue';
import api from '@/api';
export default {
  name: "ProfileComponent",
  components: {
    UserStatusComponentVue
  },
  data() {
    return {
      name: null,
      email: null,
      currentpassword: null,
      newpassword: null,
      message: ""
    };
  },
  methods: {
    async getprofile() {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Error: Token not found");
        return;
      }

      try {
        const response = await api.get("getprofile", {
          tokenRequired: true
        });
        this.name = response.data.user.name;
        this.email = response.data.user.email;
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    },
    async updateprofile() {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Error: Token not found");
        return;
      }

      try {
        const response = await api.post("/profile/update", {
          name: this.name,
          email: this.email
        }, {
          tokenRequired: true
        });
        this.message = response.data.message

      } catch (error) {
        console.error("Error fetching profile:", error);
      }

    },
    async updatepassword() {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Error: Token not found");
        return;
      }

      try {
        const response = await api.post("/profile/update/password", {
          oldpassword: this.currentpassword,
          newpassword: this.newpassword
        }, {
          tokenRequired: true
        });
        this.currentpassword = ""
        this.newpassword = ""
        this.message = response.data


      } catch (error) {
        console.error("Error fetching profile:", error);
      }

    },

    async resend() {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Error: Token not found");
        return;
      }

      try {
        const response = await api.post('/resend/verification', {}, {
          tokenRequired: true
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  },
  mounted() {
    this.getprofile();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Raleway:wght@400;500;700&display=swap');

.profile-container {
  margin-top: 2%;
  padding: 10px;
  border-radius: 8px;
  font-family: 'Raleway', sans-serif;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}

.left-sections {
  display: flex;
  gap: 25px;
  flex-direction: column;
  width: 55%;
  justify-content: space-between;
}

.section1 {
  width: 40%;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  justify-content: space-between;
}

.section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  border-radius: 8px;
  /* background-color: #f9f9fb; */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.input-profile input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.3s;
}

.input-profile input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.1);
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

.btn:hover {
  background-color: #733ebc;
  transform: translateY(-2px);
}

.btn:active {
  background-color: #004085;
}

.side-section {
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  font-family: 'Raleway', sans-serif;
  flex: 1;
  /* Makes side section the same height as other sections */
}

.side-section h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.side-section p {
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.side-section button {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  border: none;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.side-section button:hover {
  background: linear-gradient(135deg, #00c6ff, #0072ff);
  transform: translateY(-2px);
}

.side-section button:active {
  transform: translateY(0);
  background: linear-gradient(135deg, #0072ff, #0052cc);
}

@media (min-width: 375px) and (max-width: 430px) {
  .content {
    flex-direction: column;
  }

  .section {
    margin-top: 5%;
  }

  .left-sections,
  .section1 {
    width: 100%;
    margin: 0;
  }

  h1 {
    display: none;
  }

  h3 {
    font-size: 0.8rem;
  }

  label {
    font-size: 0.5rem;
  }

  .input-profile input {
    width: 100%;
    padding: 10px;
    margin-bottom: 5px;
    font-size: 0.6rem;
  }

  .btn {
    font-size: 0.6rem;
    border-radius: 6px;
    padding: 5px 10px;
    font-weight: 600;
  }

  .profile-container {
    margin-top: 0%;
  }

  .side-section h3 {
    font-size: 0.8rem;
  }

  .side-section p {
    font-size: 0.6rem;
  }

  .side-section button {
    font-size: 0.6rem;
    padding: 10px 20px;
  }
}
</style>
