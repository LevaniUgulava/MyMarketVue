<template>
{{message}}
  <div class="profile-container">
    <div class="content">
      <div class="left-sections">
        <div class="section">
          <h3>{{$t("profile.user.userdetail")}}</h3>
        <div class="input-profile">
            <label>{{$t("profile.user.name")}}</label>
            <input name="name" type="text" placeholder="Name..." v-model="name">
            <label>{{$t("profile.user.email")}}</label>
            <input name="email" type="email" placeholder="Email..." v-model="email">
          </div>
          <button class="btn" @click="updateprofile">{{$t("profile.user.save", { msg: $t("header.user.profile") })}}</button>
        </div> 
        
        

        <div class="section">
          <h3>{{$t("profile.user.passchange")}}</h3>
          <div class="input-profile">
            <label>{{$t("profile.user.currentpass", { msg: ":" })}}</label>
            <input name="currentpassword" type="password" :placeholder="$t('profile.user.currentpass', { msg: '...' })" v-model="currentpassword">
            <label>{{$t("profile.user.newpass", { msg: ":" })}}</label>
            <input name="newpassword" type="password" :placeholder="$t('profile.user.newpass', { msg: '...' })" v-model="newpassword">
          </div>
          <button class="btn" @click="updatepassword">{{$t("profile.user.save", { msg: $t("profile.user.password") })}}</button>
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
 
         <UserStatusComponentVue/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import UserStatusComponentVue from './UserStatusComponent.vue';
export default {
  name: "ProfileComponent",
  components:{
    UserStatusComponentVue
  },
  data() {
    return {
      name: null,
      email: null,
      currentpassword: null,
      newpassword: null,
      message:""
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
        const response = await axios.get("getprofile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.name = response.data.user.name;
        this.email = response.data.user.email;
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    },
    async updateprofile(){
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Error: Token not found");
        return;
      }

      try {
        const response = await axios.post("/profile/update", {
          name:this.name,
          email:this.email
        },{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.message=response.data.message
        
      } catch (error) {
        console.error("Error fetching profile:", error);
      }

    },
    async updatepassword(){
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Error: Token not found");
        return;
      }

      try {
        const response = await axios.post("/profile/update/password", {
          oldpassword:this.currentpassword,
          newpassword:this.newpassword
        },{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
         this.currentpassword =""
         this.newpassword=""
         this.message=response.data

        
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
        const response = await axios.post('/resend/verification', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  font-family: 'Raleway', sans-serif;
}

.content {
  display: flex;
  justify-content: space-between;
}

.left-sections {
  display: flex;
  gap:25px;
  flex-direction: column;
  width: 60%;
}

.section {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9fb;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.section:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.section1 {
  width: 35%;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  background-color: #007bff;
  border: none;
  border-radius: 6px;
  width: fit-content;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.btn:active {
  background-color: #004085;
}

.side-section {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  font-family: 'Raleway', sans-serif;
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
  .section{
    margin-top: 5%;
  }

  .left-sections,
  .section1 {
    width: 100%;
    margin: 0;
  }
  h1{
    display: none;
  }
  h3{
    font-size: 0.8rem;
  }
  label{
    font-size: 0.5rem;
  }
  .input-profile input{
  width: 100%;
  padding: 10px;
  margin-bottom: 5px;
  font-size: 0.6rem;
  }
  .btn{
   font-size: 0.6rem;
  border-radius: 6px;
  padding: 5px 10px;
  font-weight: 600;
  }
  .profile-container {
  margin-top: 0%;
}
.side-section h3{
  font-size: 0.8rem ;
}
.side-section p{
    font-size: 0.6rem;
}
.side-section button{
  font-size: 0.6rem;
  padding: 10px 20px;
}
}
</style>
