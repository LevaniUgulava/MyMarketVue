<template>
    <div class="input-group">
        <div class="address-button">
            <button @click.prevent="addressmodal = !addressmodal">

                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="#162e63">
                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                </svg>
            </button>

            <button v-show="selectedAddress">
                <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px"
                    fill="#162e63">
                    <path
                        d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" />
                </svg>
            </button>
        </div>



        <div class="radio-buttons">
            <div v-for="(option, index) in addresses" :key="index" class="radio-button">
                <input type="radio" class="radio" :id="'address-' + index" name="selectedAddress" :value="option.id"
                    v-model="selectedAddress" />
                <label :for="'address-' + index">
                    {{ option.town }} {{ option.address }} {{ option.additionalInfo }}
                </label>
            </div>
        </div>

        <AddressModal :open="addressmodal" @save="getAddresses()" @close="addressmodal = false" />

    </div>
</template>
<script>
import api from '@/api';
import AddressModal from '@/components/AddressModal.vue';

export default {
    data() {
        return {
            addresses: [],
            addressmodal: false,
            selectedAddress: null

        }
    },
    components: {
        AddressModal
    },
    computed: {

        visibleAddress() {
            const selected = this.addresses.find(address => address.id === this.selectedAddress);
            return selected ? selected.town + ", " + selected.address : '---';
        },
        additionalInfoClass() {
            const selected = this.addresses.find(address => address.id === this.selectedAddress);
            return selected && selected.additionalInfo
        },

    },
    methods: {
        async deleteAddress(id) {
            try {
                const response = await api.delete(`/deleteAddress/${id}`, {
                    tokenRequired: true
                });
                this.addresses = this.addresses.filter(option => option.id !== id);

                this.addressdeletemessage = response.data;
            } catch (error) {

                this.addressdeletemessage = error.response.data
            }
        },
        async getAddresses() {
            try {
                const response = await api.get('/getAddress', {
                    tokenRequired: true
                });
                this.addresses = response.data;
                this.isload = true;

            } catch (error) {
                console.log(error);
            }
        },
    },
    watch: {
        addressdeletemessage() {
            setTimeout(() => {
                this.addressdeletemessage = ''
            }, 2000);
        },

    },

    mounted() {
        this.getAddresses();
    },

}
</script>
<style scoped>
.input-group {
    margin-bottom: 10px;
}


.address-button {
    background-color: white;
    padding: 5px 0;
    justify-content: center;
    display: flex;
    justify-content: space-between;
}

.address-button button {
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: transparent;
}

.address-button button:hover {
    background-color: #ede9e93f;

}


.address-button,
input {
    box-sizing: border-box;
}

.radio-buttons {
    display: flex;
    gap: 10px;
    flex-direction: column;
}

.radio-button {
    display: flex;
    align-items: center;
    background-color: white;
    border: 1.5px solid #162e63;
    border-radius: 5px;
    padding: 0 5px;
    height: 30px;
    font-size: 12px;
    font-weight: 500;
    font-family: Arial;
    cursor: pointer;
    transition: border-color 0.3s ease, background-color 0.3s ease;
}



.radio-button input[type="radio"] {
    margin: 0 5px 0 0;
    accent-color: #162e63;
    width: 13px;
    height: 13px;
    flex-shrink: 0;
    cursor: pointer;
    vertical-align: middle;
}



.radio-button label {
    cursor: pointer;
    font-weight: 500;
    color: #162e63;
    font-size: 12px;
    flex: 1;
    line-height: 14px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>