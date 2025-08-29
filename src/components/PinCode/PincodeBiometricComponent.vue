<template>
    <div class="overlay" v-if="!setmodal">
        <div class="back" @pointerup="redirect">
            <img src="../../assets/svg/back.svg" alt="back-icon">
        </div>

        <div @pointerup="setPincodemodal" class="passcode">
            <img src="../../assets/svg/passkey.svg" alt="passkey-icon">
            <div class="info">
                <span>პასკოდი</span>
                <label :class="pinExist ? 'success' : 'not'">{{ pinStatus }}</label>
            </div>
        </div>

        <div class="biometric">
            <img src="../../assets/svg/biometric.svg" alt="biometric-icon">
            <div class="info">
                <span>ბიომეტრიული მონაცემები</span>
                <label>დაყენებულია</label>
            </div>
        </div>
    </div>
    <SetPincodeComponent :open="setmodal" @close="setmodal = false" />

</template>

<script>
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import SetPincodeComponent from './SetPincodeComponent.vue';
export default {
    data() {
        return {
            pinExist: false,
            setmodal: false
        };
    },
    components: {
        SetPincodeComponent

    },
    methods: {
        setPincodemodal() {
            this.setmodal = !this.setmodal
        },
        async redirect() {
            this.$router.push('/profile');
        },
        async checkPinExist() {
            try {
                const storedPin = await SecureStoragePlugin.get({ key: "pincode" });
                console.log("PIN კოდი დევს:", storedPin.value);

                if (storedPin && storedPin.value) {
                    console.log("PIN კოდი დევს:", storedPin.value);
                    this.pinExist = true;
                } else {
                    console.log("PIN კოდი არ არსებობს.");
                    this.pinExist = false;
                }
            } catch (error) {
                console.error("შეცდომა SecureStoragePlugin-ში:", error);
                this.pinExist = false;
            }
        }

    },
    computed: {
        pinStatus() {
            return this.pinExist ? "დაყენებულია" : "არ არის დაყენებული";
        }
    },
    mounted() {
        this.checkPinExist();
    }
};
</script>


<style scoped>
.overlay {
    bottom: env(safe-area-inset-top);
}

.passcode,
.biometric {
    display: flex;
    width: 100%;
    height: 70px;
    align-items: center;
    font-size: 20px;
    gap: 20px;
    color: #888;
    border-bottom: 1px solid #ddd;
    /* Divider between sections */
    padding: 10px;
}


/* Image styling */
.passcode img,
.biometric img {
    width: 25px;
    height: 25px;
}

.back {
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #ddd;
}

/* Information section styling */
.info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* Text label styling */
.info span {
    font-size: 15px;
    font-weight: 600;
    color: #333;
}

/* Small label styling for "installed" text */
.info label {
    font-size: 12px;
    font-weight: 500;
}

.info .success {
    color: green;

}

.info .not {
    color: red;

}

/* Biometric specific section */
.biometric {
    margin-top: 20px;
}

button {
    background-color: white;
    padding: 20px;
    border: none;
}

button img {
    width: 20px;
    height: 20px;
}
</style>
