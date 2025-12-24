<template>
    <div class="profile-container">
        <div v-if="!isMobile" class="web">
            <profile-sidebar />
            <div class="main-content">
                <router-view />
            </div>
        </div>

        <div v-else class="native">
            <div v-if="$route.path === '/profile'">
                <profile-sidebar />
            </div>
            <div class="main-content">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script>
import profileSidebar from '@/components/profile/profileSidebar.vue';

export default {
    name: "ProfileView",
    components: {
        profileSidebar
    },
    data() {
        return {
            isMobile: window.innerWidth <= 768,
        };
    },

    watch: {
        $route() {
            this.isMobile = window.innerWidth <= 768;
        }
    },
    methods: {
        checkScreenSize() {
            this.isMobile = window.innerWidth <= 768;
        },
    },
    mounted() {
        window.addEventListener('resize', this.checkScreenSize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkScreenSize);
    },


}
</script>

<style scoped>
.web {
    display: flex;
    flex-direction: row;
    height: 100%;
}

.main-content {
    margin-left: 350px;
    width: calc(100% - 350px);
    padding: 20px;
}

@media (max-width: 768px) {
    .main-content {
        width: 95%;
        margin: 0 auto;
        padding-right: 0px;
        padding-top: 20px;
    }

}
</style>
