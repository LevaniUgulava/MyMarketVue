<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <h4>User Profile</h4>
     
        <div class="form-group">
          <label class="labels">Name</label>
          <input 
            v-model="name" 
            type="text" 
            class="form-control" 
            placeholder="Enter your name" 
          />
        </div>
        <div class="form-group">
          <label class="labels">Email</label>
          <input 
            v-model="email" 
            type="email" 
            class="form-control" 
            placeholder="Enter your email" 
          />
        </div>
        <div class="form-group">
          <label class="labels">Bio</label>
          <textarea 
            v-model="bio" 
            class="form-control" 
            placeholder="Tell something about yourself"
          ></textarea>
        </div>
      </div>
      <div class="profile-footer">
        <button 
          @click="updateprofile" 
          class="profile-button"
        >
          Save Profile
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "ProfileComponent",

  data() {
    return {
     name:null,
     email:null,
  

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
    const response = await axios.get("http://127.0.0.1:8000/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`  
      }
    });
    this.name=response.data.user.name;  
    this.email=response.data.user.email;  

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
    const response = await axios.post("http://127.0.0.1:8000/api/profile/update",{name:this.name,email:this.email}, {
      headers: {
        Authorization: `Bearer ${token}`  
      }
    });
    console.log(response)

  } catch (error) {
    console.error("Error fetching profile:", error);  
  }

}
  },
    mounted() {
    this.getprofile();
    }
};
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.profile-card {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.profile-header {
  text-align: center;
  margin-bottom: 20px;
}

.profile-header h4 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.profile-body {
  margin-bottom: 20px;
}

.img-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.img-container img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid #ddd;
}

.form-group {
  margin-bottom: 15px;
}

.labels {
  font-size: 14px;
  font-weight: bold;
  color: #555;
  display: block;
  margin-bottom: 5px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: none;
  font-size: 14px;
}

.form-control:focus {
  border-color: #4caf50;
}

textarea.form-control {
  height: 100px;
}

.profile-footer {
  text-align: center;
}

.profile-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.profile-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.profile-button:hover:not(:disabled) {
  background-color: #45a049;
}
</style>
