<template>
  <div v-if="!loading" class="profile-container">
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
          <div v-if="isVerified" class="side-section verified">
            <h3>ვერიფიკაცია</h3>
            <i class="fa-solid fa-circle-check"></i>
            <p>თქვენი ელფოსტა წარმატებით დადასტურდა. ახლა შეგიძლიათ პლატფორმის ყველა მახასიათებლის წვდომა.</p>
          </div>

          <div v-else class="side-section unverified">
            <h3>ვერიფიკაცია</h3>
            <i class="fa-solid fa-square-xmark"></i>
            <p>თქვენი ელფოსტა ჯერ არ დადასტურდა. გთხოვთ გაიაროთ ვერიფიკაცია თქვენი ელფოსტით.</p>
            <p>ვერიფიკაციისთვის დააჭირეთ<button class="sendbtn" @click.prevent="send">გაგზავნა</button></p>
            <div class="messageverify">
              {{ messageverify }}
            </div>
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
import { mapMutations } from 'vuex';
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
      message: "",
      isVerified: "",
      loading: true,
      messageverify: "",

    };
  },
  methods: {
    ...mapMutations('modals', ['openmodal', 'closemodal', 'setdata']),

    async send() {
      try {
        const response = await api.post("/resend-verify", { email: this.email }, {
          tokenRequired: true
        });
        if (response.status === 200) {
          this.messageverify = "შეამოწმეთ ელფოსტა, ვერიფიკაციის კოდი გამოგზავნილია"
          let data = {
            email: this.email,
            from: "register"
          };
          this.setdata(data);
          this.openmodal('confirmmodal');

        }
      } catch (error) {
        console.error(error);
      }


    },
    async getprofile() {

      try {
        const response = await api.get("getprofile", {
          tokenRequired: true
        });
        this.name = response.data.user.name;
        this.email = response.data.user.email;
        this.isVerified = response.data.isVerified;
        this.loading = false;
        this.$emit("load", this.loading);
      } catch (error) {
        console.error("Error fetching profile:", error);
        this.loading = false;
        this.$emit("load", this.loading);

      }
    },
    async updateprofile() {
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

.messageverify {
  color: #388e3c;
  font-size: 13px;
  line-height: 1.5;
}

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

.sendbtn {
  background-color: transparent;
  border: none;
  color: #007bff;
  cursor: pointer;
}

.sendbtn:hover {
  color: #004085;
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
  padding: 25px;
  text-align: center;
  flex: 1;
}

.side-section h3 {
  font-size: 20px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 10px
}

.side-section p {
  font-size: 14px;
  color: #777777;
  margin-bottom: 20px;
  line-height: 1.5;
}

.verified i {
  font-size: 2.5rem;
  color: #388e3c;
  margin-top: 1rem;
}

.unverified i {
  font-size: 2.5rem;
  color: #f11a1a;
  margin-top: 1rem;
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
