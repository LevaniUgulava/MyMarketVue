<template>
    <div :class="['sidebar-container', !isMobile ? '' : 'native-padding']">
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
                            d="M480-492.31q-57.75 0-98.87-41.12Q340-574.56 340-632.31q0-57.75 41.13-98.87 41.12-41.13 98.87-41.13 57.75 0 98.87 41.13Q620-690.06 620-632.31q0 57.75-41.13 98.88-41.12 41.12-98.87 41.12ZM180-187.69v-88.93q0-29.38 15.96-54.42 15.96-25.04 42.66-38.5 59.3-29.07 119.65-43.61 60.35-14.54 121.73-14.54t121.73 14.54q60.35 14.54 119.65 43.61 26.7 13.46 42.66 38.5Q780-306 780-276.62v88.93H180Zm60-60h480v-28.93q0-12.15-7.04-22.5-7.04-10.34-19.11-16.88-51.7-25.46-105.42-38.58Q534.7-367.69 480-367.69q-54.7 0-108.43 13.11-53.72 13.12-105.42 38.58-12.07 6.54-19.11 16.88-7.04 10.35-7.04 22.5v28.93Zm240-304.62q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0-80Zm0 384.62Z" />
                    </svg> პირადი ინფორმაცია
                </router-link>
                <router-link :to="{ path: `/profile/orders`, query: { section: 'pending' } }"
                    active-class="active-link">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="currentcolor">
                        <path
                            d="M180-180v-476l-74.15-162.31 54.3-25.53L245.69-658h468.62l85.54-185.84 54.3 25.53L780-656v476H180Zm220-270h160q12.75 0 21.37-8.63 8.63-8.63 8.63-21.38 0-12.76-8.63-21.37Q572.75-510 560-510H400q-12.75 0-21.37 8.63-8.63 8.63-8.63 21.38 0 12.76 8.63 21.37Q387.25-450 400-450ZM240-240h480v-358H240v358Zm0 0v-358 358Z" />
                    </svg>შეკვეთები
                </router-link>

                <router-link :to="{ name: 'status-info' }" active-class="active-link">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="currentcolor">
                        <path
                            d="m392-420.46 33.08-108.62-87-67.07h108.23L480-704.31l33.69 108.16h108.23l-87.61 67.07 33.07 108.62L480-488l-88 67.54ZM260-70.77v-286.31q-38-39.69-59-91.77-21-52.07-21-111.15 0-125.54 87.23-212.77T480-860q125.54 0 212.77 87.23T780-560q0 59.08-21 111.15-21 52.08-59 91.77v286.31l-220-70-220 70ZM480-320q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70ZM320-158.62l160-42.92 160 42.92v-148.61q-34.23 22.31-74.92 34.77Q524.38-260 480-260q-44.38 0-85.08-12.46-40.69-12.46-74.92-34.77v148.61Zm160-74.3Z" />
                    </svg> სტატუსის კონტროლი
                </router-link>



                <router-link :to="{ name: 'reset' }" active-class="active-link">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="currentcolor">
                        <path
                            d="M280-415.39q-26.85 0-45.73-18.88-18.88-18.88-18.88-45.73 0-26.85 18.88-45.73 18.88-18.88 45.73-18.88 26.85 0 45.73 18.88 18.88 18.88 18.88 45.73 0 26.85-18.88 45.73-18.88 18.88-45.73 18.88ZM280-260q-91.54 0-155.77-64.23T60-480q0-91.54 64.23-155.77T280-700q64.31 0 116.31 33.19 52 33.2 79.38 86.81h360.08l100 100-153.85 153.07-74.23-55.76-76.15 56.53L553.46-380h-77.77q-27.38 53.23-79.38 86.61Q344.31-260 280-260Zm0-60q57.54 0 99.65-34.77 42.12-34.77 54.97-85.23h137.69l57.61 39.85 78.16-57.16L776-405.38 850.62-480l-40-40h-376q-12.85-50.46-54.97-85.23Q337.54-640 280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Z" />
                    </svg> პაროლი შეცვლა
                </router-link>

                <button @pointerup="opendeactivatemodal" class="deactivate" active-class="active-link">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="currentcolor">
                        <path
                            d="M696-453.85 653.85-496l83.38-84-83.38-83L696-705.77l84 84 83-84L905.77-663l-83.62 83 83.62 84L863-453.85l-83-83-84 83Zm-336-38.46q-57.75 0-98.87-41.12Q220-574.56 220-632.31q0-57.75 41.13-98.87 41.12-41.13 98.87-41.13 57.75 0 98.87 41.13Q500-690.06 500-632.31q0 57.75-41.13 98.88-41.12 41.12-98.87 41.12ZM60-187.69v-88.93q0-29.38 15.96-54.42 15.96-25.04 42.66-38.5 59.3-29.07 119.65-43.61 60.35-14.54 121.73-14.54t121.73 14.54q60.35 14.54 119.65 43.61 26.7 13.46 42.66 38.5Q660-306 660-276.62v88.93H60Zm60-60h480v-28.93q0-12.15-7.04-22.5-7.04-10.34-19.11-16.88-51.7-25.46-105.42-38.58Q414.7-367.69 360-367.69q-54.7 0-108.43 13.11-53.72 13.12-105.42 38.58-12.07 6.54-19.11 16.88-7.04 10.35-7.04 22.5v28.93Zm240-304.62q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0-80Zm0 384.62Z" />
                    </svg> დეაქტივაცია
                </button>

                <button class="logout" active-class="active-link" @pointerup="logout">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="currentcolor">
                        <path
                            d="M212.31-140Q182-140 161-161q-21-21-21-51.31v-142.3h60v142.3q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h535.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-535.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v142.3h-60v-142.3Q140-778 161-799q21-21 51.31-21h535.38Q778-820 799-799q21 21 21 51.31v535.38Q820-182 799-161q-21 21-51.31 21H212.31Zm214.61-161.54-42.15-43.38L489.85-450H140v-60h349.85L384.77-615.08l42.15-43.38L605.38-480 426.92-301.54Z" />
                    </svg> გასვლა
                </button>


            </div>
            <teleport to="body">
                <DeactivateComponent v-if="isOpen" :open="isOpen" @close="isOpen = false" />
            </teleport>
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
        },
        checkScroll() {
            const sidebar = document.querySelector('.sidebar');
            const footer = document.querySelector('footer');
            if (!sidebar || !footer) return;

            const scrollY = window.scrollY || 0;
            const sidebarHeight = sidebar.offsetHeight;
            const footerTop = footer.getBoundingClientRect().top + scrollY;

            let topValue = scrollY > 0 ? 80 : 120;




            const maxTop = footerTop - sidebarHeight;
            if (scrollY + topValue > maxTop) {
                topValue = maxTop - scrollY;
                sidebar.style.transition = 'none';
            } else {
                sidebar.style.transition = 'top 0.3s ease-in-out';
            }


            document.documentElement.style.setProperty('--top-profile-sidebar', `${topValue}px`);
        },
    },
    mounted() {
        this.checkScroll();
        window.addEventListener('scroll', this.checkScroll);

        window.addEventListener('resize', this.checkScreenSize);

    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.checkScroll);

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
}

.web-sidebar {
    position: fixed;
    top: var(--top-profile-sidebar);
    width: 300px;
    padding-top: 50px;
    border-right: 1.5px solid #2b27311a;
    transition: top 0.3s ease-in-out;

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
