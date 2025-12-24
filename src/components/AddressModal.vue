<template>
    <Teleport to="body">
        <div v-if="open" class="modal-overlay" @click.self="$emit('close')">
            <div class="modal-content">
                <button class="close-button" @click="$emit('close')">&times;</button>
                <div class="modal-body">
                    <h2 class="modal-title">მისამართის დამატება</h2>
                    <div class="line"></div>

                    <form @submit.prevent="saveAddress">
                        <div class="form-group">
                            <label for="city">ქალაქი</label>
                            <input id="city" type="text" class="form-control" v-model="citySearch"
                                placeholder="ჩაწერე ქალაქის სახელი" @focus="showDropdown = true"
                                @input="showDropdown = true" @blur="hideDropdownWithDelay" />
                            <ul v-if="showDropdown && filteredZones.length" class="autocomplete-list">
                                <li v-for="zone in filteredZones" :key="zone.id" @mousedown.prevent="selectZone(zone)">
                                    {{ zone.name }}
                                </li>
                            </ul>
                        </div>

                        <div class="form-group">
                            <label for="address">მისამართი</label>
                            <input id="address" type="text" class="form-control" v-model="address"
                                placeholder="შეიყვანე მისამართი" ref="addressInput" />
                        </div>

                        <div class="form-group">
                            <label for="additional">დამატებითი ინფორმაცია</label>
                            <input id="additional" type="text" class="form-control" v-model="additionalInfo"
                                placeholder="სართულზე, სადარბაზო და ა.შ." />
                        </div>

                        <div class="actions">
                            <button class="save-button" type="submit">მისამართის დამატება</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script>
import api from '@/api';
import { nextTick } from 'vue';

export default {
    props: {
        open: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            citySearch: '',
            selectedZone: null,
            address: '',
            additionalInfo: '',
            availableZones: [],
            showDropdown: false,
        };
    },
    computed: {
        filteredZones() {
            return this.availableZones.filter(zone =>
                zone.name.toLowerCase().includes(this.citySearch.toLowerCase())
            );
        },
    },
    methods: {
        async getAddressZones() {
            try {
                const response = await api.get('/availablecity');
                this.availableZones = response.data;
            } catch (error) {
                console.error('Zone fetch error:', error);
            }
        },
        selectZone(zone) {
            this.citySearch = zone.name;
            this.selectedZone = zone.id;
            this.showDropdown = false;
        },
        hideDropdownWithDelay() {
            setTimeout(() => {
                this.showDropdown = false;
            }, 150);
        },
        async saveAddress() {
            try {
                const response = await api.post('/addAddress', {
                    town: this.citySearch,
                    address: this.address,
                    additionalInfo: this.additionalInfo,
                }, {
                    tokenRequired: true
                });
                console.log(response);
            } catch (error) {
                console.log(error);
            }

            this.$emit('save');
            this.$emit('close');
        },
        // autoCompleteAddress() {
        //     const input = this.$refs.addressInput;
        //     const autocomplete = new google.maps.places.Autocomplete(input, {
        //         types: ['geocode'],
        //         componentRestrictions: { country: 'ge' }
        //     });

        //     autocomplete.addListener('place_changed', () => {
        //         const place = autocomplete.getPlace();
        //         this.address = place.formatted_address || '';
        //     });
        // },
    },
    mounted() {
        this.getAddressZones();
    },
    watch: {
        open(newVal) {
            if (newVal) {
                nextTick(() => {
                    // this.autoCompleteAddress();
                    document.body.style.overflow = 'hidden';
                });
            } else {
                document.body.style.overflow = '';
            }
        },
    },
};
</script>

<style scoped>
* {
    font-family: 'Inter', sans-serif;
    box-sizing: border-box;
}

.line {
    background-color: #e0e0e0;
    height: 1px;
    margin: 30px 0;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background-color: #fff;
    padding: 30px;
    border-radius: 8px;
    max-width: 600px;
    width: 100%;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.modal-title {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}

label {
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
}

.form-control {
    padding: 12px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    width: 100%;
}

.form-control::placeholder {
    color: #bbb;
}

.form-control:focus {
    outline: none;
    border-color: #162e63;
    background-color: #fff;
}

.autocomplete-list {
    position: absolute;
    top: 100%;
    width: 100%;
    background: white;
    border: 1px solid #ccc;
    max-height: 200px;
    overflow-y: auto;
    z-index: 999;
    list-style: none;
    padding: 0;
    margin: 0;
    border-radius: 4px;
}

.autocomplete-list li {
    padding: 8px;
    cursor: pointer;
}

.autocomplete-list li:hover {
    background-color: #f2f2f2;
}

.actions {
    margin-top: 20px;
    text-align: right;
}

.save-button {
    background-color: #162e63;
    color: white;
    padding: 12px 18px;
    border: none;
    border-radius: 6px;
    width: 100%;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

.save-button:hover {
    background-color: #6217d1;
}

.close-button {
    position: absolute;
    top: 15px;
    right: 20px;
    background: transparent;
    border: none;
    font-size: 28px;
    color: #666;
    cursor: pointer;
}

.close-button:hover {
    color: #333;
}

@media (max-width: 768px) {
    .modal-content {
        max-width: 90%;
    }
}
</style>
