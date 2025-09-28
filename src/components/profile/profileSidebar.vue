<template>
    <div :class="['sidebar-container', !isMobile ? 'web-padding' : 'native-padding']">
        <div :class="['sidebar', !isMobile ? 'web-sidebar' : 'native-sidebar']">
            <div class="profile">
                <img class="profile-image" src="../../assets/no_profile_img.png">
                <span class="name">{{ name }}</span>

            </div>
            <hr class="custom-line" />

            <div class="router">
                <router-link :to="{ name: 'profile-info' }" active-class="active-link">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="currentcolor">
                        <path
                            d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
                    </svg> პირადი ინფორმაცია
                </router-link>

                <router-link :to="{ name: 'status-info' }" active-class="active-link">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="currentcolor">
                        <path
                            d="m387-412 35-114-92-74h114l36-112 36 112h114l-93 74 35 114-92-71-93 71ZM240-40v-309q-38-42-59-96t-21-115q0-134 93-227t227-93q134 0 227 93t93 227q0 61-21 115t-59 96v309l-240-80-240 80Zm240-280q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70ZM320-159l160-41 160 41v-124q-35 20-75.5 31.5T480-240q-44 0-84.5-11.5T320-283v124Zm160-62Z" />
                    </svg> სტატუსის კონტროლი
                </router-link>
                <router-link :to="{ name: 'address-info' }" active-class="active-link">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="currentcolor">
                        <path
                            d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
                    </svg> მისამართები
                </router-link>
                <!-- <router-link :to="{ name: 'verification' }" active-class="active-link">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="currentcolor">
                        <path
                            d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Zm0 200q17 0 29.5-12.5T522-322q0-17-12.5-29.5T480-364q-17 0-29.5 12.5T438-322q0 17 12.5 29.5T480-280Zm-29-128h60v-22q0-11 5-21 6-14 16-23.5t21-19.5q17-17 29.5-38t12.5-46q0-45-34.5-73.5T480-680q-40 0-71.5 23T366-596l54 22q6-20 22.5-34t37.5-14q22 0 38.5 13t16.5 33q0 17-10.5 31.5T501-518q-12 11-24 22.5T458-469q-7 14-7 29.5v31.5Z" />
                    </svg> ვერიფიკაცია
                </router-link> -->

                <router-link :to="{ name: 'reset' }" active-class="active-link">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="currentcolor">
                        <path
                            d="M280-400q-33 0-56.5-23.5T200-480q0-33 23.5-56.5T280-560q33 0 56.5 23.5T360-480q0 33-23.5 56.5T280-400Zm0 160q-100 0-170-70T40-480q0-100 70-170t170-70q67 0 121.5 33t86.5 87h352l120 120-180 180-80-60-80 60-85-60h-47q-32 54-86.5 87T280-240Zm0-80q56 0 98.5-34t56.5-86h125l58 41 82-61 71 55 75-75-40-40H435q-14-52-56.5-86T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Z" />
                    </svg> პაროლი შეცვლა
                </router-link>
                <router-link v-if="platformType !== 'web'" @pointerup="redirect">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="currentcolor">
                        <path
                            d="M480-480q-51 0-85.5-34.5T360-600q0-50 34.5-85t85.5-35q50 0 85 35t35 85q0 51-35 85.5T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560ZM240-240v-76q0-21 10.5-39.5T279-385q46-27 96.5-41T480-440q54 0 104.5 14t96.5 41q18 11 28.5 29.5T720-316v76H240Zm240-120q-41 0-80 10t-74 30h308q-35-20-74-30t-80-10Zm0-240Zm0 280h154-308 154ZM160-80q-33 0-56.5-23.5T80-160v-160h80v160h160v80H160ZM80-640v-160q0-33 23.5-56.5T160-880h160v80H160v160H80ZM640-80v-80h160v-160h80v160q0 33-23.5 56.5T800-80H640Zm160-560v-160H640v-80h160q33 0 56.5 23.5T880-800v160h-80Z" />
                    </svg> პასკოდი და ბიომეტრიული მონაცემები
                </router-link>

                <button @pointerup="opendeactivatemodal" class="deactivate" active-class="active-link">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="currentcolor">
                        <path
                            d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                    </svg> დეაქტივაცია
                </button>

                <button class="logout" active-class="active-link" @pointerup="logout">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="currentcolor">
                        <path
                            d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z" />
                    </svg> გასვლა
                </button>


            </div>
            <DeactivateComponent :open="isOpen" @close="isOpen = false" />
        </div>
    </div>
</template>

<script>
import { getPlatform } from '@/mixin/reuse';
import { mapActions } from 'vuex';
import DeactivateComponent from '../DeactivateComponent.vue';


export default {
    mixins: [getPlatform],
    components: {
        DeactivateComponent
    },
    data() {
        return {
            name: localStorage.getItem('name'),
            isMobile: window.innerWidth <= 768,
            isOpen: false,

        }
    },
    methods: {
        opendeactivatemodal() {
            this.isOpen = !this.isOpen
        },
        checkScreenSize() {
            this.isMobile = window.innerWidth <= 768;
        },
        redirect() {
            this.$router.push('/pincode-biometric')
        },
        ...mapActions("auth", {
            logoutAction: 'logout',

        }),
        async logout() {
            const success = await this.logoutAction();
            if (success) {
                this.$router.push('/')

            }
        }

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
.icon {
    display: flex;
    align-items: center;
    align-items: center;
}

.sidebar-container {
    display: flex;
    height: 100%;
    background-color: white;
    flex-direction: row;
    gap: 10px;
}

.web-padding {
    padding: 50px;

}

.native-padding {
    padding-top: 70px;
}

.profile {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    flex-direction: column;
}

.name {
    font-size: 14px;
}

.profile-image {
    width: 60px;
}

.custom-line {
    border: 0;
    height: 1px;
    background-color: #2b27311a;
    width: 100%;
    margin: 20px 0;
}


.sidebar {
    display: flex;
    flex-direction: column;
    padding: 20px;
    height: fit-content;
    overflow-y: auto;
    border-radius: 10px;
}

.web-sidebar {
    width: 300px;
    border: 1.5px solid #2b27311a;
}

.native-sidebar {
    width: 100%;
}

.sidebar a,
button {
    display: flex;
    color: #2b2731b3;
    align-items: center;
    gap: 10px;
    padding: 15px;
    text-decoration: none;
    font-size: 15px;

}

button {
    width: 100%;
    background-color: white;
    border: none;
}

.sidebar a:hover {
    background-color: #9b9a9a0b;
    border-radius: 20px;
}

.deactivate:hover {
    background-color: #9b9a9a0b;
    border-radius: 20px;

}

.sidebar .active-link {
    font-weight: bold;
    color: black;
    font-family: 'Courier New', Courier, monospace;
}

.logout {
    display: none;
}

@media (max-width: 768px) {
    .logout {
        display: flex;
    }
}
</style>
