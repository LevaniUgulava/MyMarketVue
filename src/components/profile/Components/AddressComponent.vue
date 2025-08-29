<template>
    <h2>მისამართები</h2>

    <div class="input-group">
        <button :class="['address-button', addresses.length == 0 && selectedAddressError ? 'radio-error' : null]"
            @click.prevent="addressmodal = !addressmodal">

            <div>
                <i class="fa-solid fa-plus"></i> მისამართის დამატება
            </div>
        </button>
        <div v-for="(option, index) in addresses" :key="index" class="radio-button">

            <label :for="'address-' + index">
                {{ option.town }} {{ option.address }} {{ option.additionalInfo }}
            </label>
            <p @click="deleteAddress(option.id)" class="delete-button">წაშლა</p>
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
            addressmodal: false

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
    margin-bottom: 15px;
}

.address-button {
    width: 100%;
    background-color: white;
    color: #916ac7;
    padding: 12px;
    justify-content: center;
    border: 2px solid #966bd3;
    height: 50px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}

.address-button,
input {
    box-sizing: border-box;
}

.radio-button {
    display: flex;
    align-items: center;
    background-color: white;
    border: 2px solid #916ac7;
    border-radius: 8px;
    padding: 0px 16px;
    margin-top: 10px;
    height: 50px;
    font-size: 16px;
    font-weight: 500;
    font-family: Arial;
    cursor: pointer;
    transition: border-color 0.3s ease, background-color 0.3s ease;
}

.radio-error {
    border-color: #e74c3c;

}

.radio-button input[type="radio"] {
    margin-right: 12px;
    accent-color: #916ac7;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    cursor: pointer;
}

.radio-button label {
    cursor: pointer;
    font-weight: 500;
    color: #916ac7;
    font-size: 14px;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.delete-button {
    font-size: 12px;
    color: rgb(221, 109, 109);
}
</style>