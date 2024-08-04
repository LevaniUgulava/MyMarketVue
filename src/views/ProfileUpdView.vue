<template lang="">
    <div>
        <HeaderComponentVue />
        <ProfileComponentVue v-if="loaded" :initialName="Name" :initialEmail="Email" :initialsavebtn="savebtn" @save-profile="updateProfile" />
    </div>
</template>

<script>
import ProfileComponentVue from '@/components/ProfileComponent.vue'
import HeaderComponentVue from '@/components/HeaderComponent.vue'
import axios from 'axios';

export default {
    name: "ProfileUpdView",
    components: {
        ProfileComponentVue,
        HeaderComponentVue
    },
    data() {
        return {
            Name: '',
            Email: '',
            loaded: false,
            savebtn: true
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
        },

        async update(name, email) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    this.$router.push('/login');
                    return;
                }

                const response = await axios.post('http://127.0.0.1:8000/api/profile/update', {
                    name: name,
                    email: email
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                localStorage.setItem('name', name);
                this.Name = name;
                this.Email = email;
                window.location.reload();

                console.log('Profile updated:', response.data);
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        },
        
        updateProfile(profileData) {
            this.update(profileData.name, profileData.email);
        }
    },
    mounted() {
        this.getprofile();
    }
}
</script>

<style lang="">
</style>
