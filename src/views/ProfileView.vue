<template>
    <div>
        <ProfileComponent @load="handleload" />
        <div class="btnclass">
            <button v-if="!loading" class="logout" @click.prevent="logout">გამოსვლა</button>
            <button v-if="!loading" @click.prevent="toggleOpen" class="deactivate">ანგარიშის დეაქტივაცია</button>
        </div>

        <DeactivateComponent :open="open" @close="open = false" />
    </div>
</template>

<script>
import ProfileComponent from '../components/ProfileComponent.vue';
import DeactivateComponent from '@/components/DeactivateComponent.vue';
import { mapActions } from 'vuex';

export default {
    name: "ProfileView",
    components: {
        ProfileComponent,
        DeactivateComponent
    },
    watch: {
        open(newVal) {
            this.noscroll(newVal);
            localStorage.setItem("deactivate", newVal);
        }
    },
    data() {
        return {
            open: JSON.parse(localStorage.getItem("deactivate")) || false,
            loading: true,
        };
    },

    methods: {
        ...mapActions("auth", {
            logoutAction: 'logout',
        }),
        logout() {
            this.logoutAction();
            this.$router.push('/');
        },
        handleload(data) {
            this.loading = data;
        },
        toggleOpen() {
            this.open = !this.open;
        },
        noscroll(newVal) {
            this.$nextTick(() => {
                if (newVal) {
                    document.body.classList.add('no-scroll');
                } else {
                    document.body.classList.remove('no-scroll');
                }
            });
        },
    }
}
</script>

<style scoped>
.no-scroll {
    overflow: hidden;
}

.deactivate {
    display: block;
    margin-left: auto;
    font-size: 15px;
    margin-right: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 15px 25px;
    border: none;
    background-color: #f44336;
    color: white;
    border-radius: 10px;
    cursor: pointer;
}

.deactivate:hover {
    background-color: #eb281a;
}

.logout {
    display: none;
}

.btnclass {
    display: flex;
}

@media (max-width: 768px) {
    .deactivate {
        font-size: 12px;
        padding: 10px 15px;

    }

    .logout {
        display: block;
        font-size: 12px;
        margin-right: auto;
        margin-top: 10px;
        margin-left: 10px;
        margin-bottom: 10px;
        padding: 10px 15px;
        border: none;
        background-color: #f44336;
        color: white;
        border-radius: 10px;
        cursor: pointer;
    }
}
</style>
