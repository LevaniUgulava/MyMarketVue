<template lang="">
    <div>
        
<div class="container rounded bg-white mt-5 mb-5">
    <div class="row">
      <h1 v-if="localsavebtn">Update Profile</h1>
        <div class="col-md-3 border-right">
            <div class="d-flex flex-column align-items-center text-center p-3 py-5"><img class="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"></div>
        </div>
        <div class="col-md-5 border-right">
            <div class="p-3 py-5">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="text-right">Profile Settings</h4>
                </div>
                <div class="row mt-2">
                    <div class="col-md-6"><label class="labels">Name</label><br>
                    <input type="text" class="form-control" placeholder="name" v-model="localName">
                    </div>
                    <br>
                    <div class="col-md-6"><label class="labels">Email</label><br>
                    <input type="text" class="form-control" v-model="localEmail" placeholder="Email">
                    </div>
                </div>
               
                <div class="mt-5 text-center">
              <button class="btn btn-primary profile-button" v-if="localsavebtn" @click="saveProfile" type="button">Save Profile</button>
              <router-link class="btn btn-primary profile-button" style="text-decoration:none" v-else to="/profile/update">Move to Update</router-link>
            </div>
            </div>
        </div>
       
    </div>
</div>
</div>


</template>
<script>
export default {
  
    name:"ProfileComponent",
     props: {
        initialName: {
            type: String,
            required: true
        },
        initialEmail: {
            type: String,
            required: true
        },
        initialsavebtn:{
            type:Boolean,
            required: true
        }

    },
    data() {
        return {
            localName: this.initialName,
            localEmail: this.initialEmail,
            localsavebtn:this.initialsavebtn
        };
    },
      methods: {
        saveProfile() {
            this.$emit('save-profile', { name: this.localName, email: this.localEmail });
        }
      }
   

    
}
</script>
<style scoped>
body {
  background: rgb(99, 39, 120);
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

.form-control {
  box-shadow: none;
  width: 500px;
  height: 50px;
  border: 1px solid black ;
  border-radius: 5px;
}

.form-control:focus {
  box-shadow: none;
  border-color: #BA68C8;
}

.profile-button {
  background: rgb(99, 39, 120);
  box-shadow: none;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
}

.profile-button:hover {
  background: #682773;
}

.profile-button:focus {
  background: #682773;
  box-shadow: none;
}

.profile-button:active {
  background: #682773;
  box-shadow: none;
}

.back:hover {
  color: #682773;
  cursor: pointer;
}

.labels {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}


h4 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.img-container {
  margin-top: 50px;
}

.img-container img {
  border-radius: 50%;
  margin-top: 20px;
}

.text-black-50 {
  color: rgba(0, 0, 0, 0.5);
}

.font-weight-bold {
  font-weight: bold;
}

.border-right {
  border-right: 1px solid #ddd;
}

.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.text-center {
  text-align: center;
}

.mt-5 {
  margin-top: 3rem;
}

.mb-5 {
  margin-bottom: 3rem;
}

.p-3 {
  padding: 1rem;
}

.py-5 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.mt-2 {
  margin-top: 1rem;
}

.mt-3 {
  margin-top: 1.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.justify-content-between {
  justify-content: space-between;
}
</style>
