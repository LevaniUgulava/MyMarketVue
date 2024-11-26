<template lang="">
    <div>
        <form @submit.prevent="login" methods='post'>
        <label>name:</label><br>
        <input type="text" name="email" v-model="email"><br>
        <label>password:</label><br>
        <input type="text" name="password" v-model="password"><br>
        <button type="submit">Login</button>
        </form>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name:'AdminLoginView',
data() {
    return {
        email:"",
        password:""

    }
},
    methods:{
     async login(){
        try{
            const response = await axios.post('admin/login',{
                email:this.email,
                password:this.password
            });
            response.data.roles[0]
            localStorage.setItem('name',response.data.name);
            localStorage.setItem('roles',response.data.roles[0]);
            localStorage.setItem('token',response.data.token);
            this.$router.push("/admin/dashboard");

        }catch(error){
            console.log(error);
        }
      
     }
    }
    
}
</script>
<style lang="">
    
</style>