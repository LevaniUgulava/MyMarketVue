<template lang="">
    <div>
        <HeaderComponent/>
        <ProfileComponent v-if="loaded" :initialName="Name" :initialEmail="Email" :initialsavebtn="savebtn" />
    </div>
</template>

<script>
import ProfileComponent from '../components/ProfileComponent.vue';
import HeaderComponent from "../components/HeaderComponent.vue";
import axios from 'axios';

export default {
    name: "ProfileView",
    components: {
        ProfileComponent,
        HeaderComponent
    },
    data() {
        return {
            Name: '',
            Email: '',
            loaded: false,
            savebtn:false
        };
    },
    methods: {
        async getprofile() {
            try {
                const token = localStorage.getItem('token');
                console.log(token);

                if (!token) {
                    this.$router.push('/login');
                    return;
                }

                const response = await axios.get('http://127.0.0.1:8000/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.Name = response.data.message.name;
                this.Email = response.data.message.email;
                this.loaded = true;

            } catch (error) {
                console.log(error);
            }
        }
    },
    mounted() {
        this.getprofile();
    }
}
</script>

<style lang="">
/* Add your styles here if needed */
</style>
