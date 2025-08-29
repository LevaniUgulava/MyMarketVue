<template>
    <Message v-if="addressdeletemessage" :message="addressdeletemessage" @close="addressdeletemessage = ''" />

    <div class="checkout-container">
        <div class="left-section">
            <div class="up-section">
                <div class="desc-info">
                    <h4 class="title">მიმღების ინფორმაცია</h4>
                    <span class="desc">შეიყვანეთ მიმღების პერსონალური ინფორმაცია</span>
                </div>
                <div class="div">
                    <div class="input-group">
                        <button
                            :class="['address-button', addresses.length == 0 && selectedAddressError ? 'radio-error' : null]"
                            @click.prevent="addressmodal = !addressmodal">

                            <div>
                                <i class="fa-solid fa-plus"></i> მისამართის დამატება
                            </div>
                        </button>
                        <div v-for="(option, index) in addresses" :key="index"
                            :class="['radio-button', selectedAddressError ? 'radio-error' : null]">
                            <input type="radio" :id="'address-' + index" name="selectedAddress" :value="option.id"
                                v-model="selectedAddress" />
                            <label :for="'address-' + index">
                                {{ option.town }} {{ option.address }} {{ option.additionalInfo }}
                            </label>
                            <p @click="deleteAddress(option.id)" class="delete-button">წაშლა</p>
                        </div>

                    </div>
                    <div class="grid-container">

                        <div class="input-group">
                            <label for="firstName">სახელი <span class="required">*</span></label>
                            <span v-if="firstNameError" class="error-text">{{ firstNameError }}</span>

                            <input :class="{ 'input-error': firstNameError }" id="firstName" type="text"
                                v-model="firstName" required />
                        </div>
                        <div class="input-group">
                            <label for="lastName">გვარი <span class="required">*</span></label>
                            <span v-if="lastNameError" class="error-text">{{ lastNameError }}</span>

                            <input :class="{ 'input-error': lastNameError }" id="lastName" type="text"
                                v-model="lastName" required />
                        </div>
                    </div>

                    <div class="input-group">
                        <label for="phone">ტელეფონი <span class="required">*</span></label>
                        <span v-if="phoneError" class="error-text">{{ phoneError }}</span>
                        <input :class="{ 'input-error': phoneError }" id="phone" type="tel" v-model="phone" required />
                    </div>
                </div>
            </div>
            <div class="down-section">
                <div class="desc-info">
                    <h4 class="title">გადახდის მეთოდი</h4>
                    <span class="desc">აირჩიეთ სასურველი გადახდის მეთოდი</span>
                </div>
                <div class="div">
                    <div class="payment-button">
                        <div :class="[
                            'bog option',
                            { 'disabled': disablePayment('bog') }
                        ]">
                            <input id="bog-pay" type="radio" value="bog" v-model="paymentmethod">
                            <label for="bog-pay">საქართველოს ბანკი</label>
                            <img src="../assets/svg/bog.svg" alt="BOG Bank">
                        </div>

                        <div :class="[
                            'tbc option',
                            { 'disabled': disablePayment('tbc') }
                        ]"> <input id="tbc-pay" type="radio" value="tbc" v-model="paymentmethod">
                            <label for="tbc-pay">თიბისი ბანკი</label>
                            <img src="../assets/svg/tbc.svg" alt="TBC Bank">
                        </div>
                        <div :class="[
                            'tbc option',
                            { 'disabled': disablePayment('cash') }
                        ]">
                            <input id="cash-pay" type="radio" value="cash" v-model="paymentmethod">
                            <label for="cash-pay">კურიერთან გადახდა</label>
                        </div>
                    </div>

                </div>
            </div>


        </div>

        <div class="right-section">
            <div class="checkout">
                <h3>თქვენი შეკვეთა</h3>
                <div class="order-items" v-if="cart.orders.length > 0">
                    <div v-for="(item, index) in cart.orders" :key="index" class="order-item">
                        <span>{{ item.name }} ({{ item.color }})</span>
                        <span>{{ item.retail_price }}₾ x {{ item.quantity }}</span>
                        <span>სულ: {{ item.total_price }}₾</span>
                    </div>
                </div>
                <div class="empty" v-else-if="isload">
                    <p> შეკვეთა ცარიელია</p>
                </div>

                <hr />
                <div class="info">
                    <div class="sub-info">გადასახდელი თანხა: {{ cart.total_price > 0 ? cart.total_price + " ₾" :
                        "---"
                    }}
                    </div>
                    <div class="sub-info">მიწოდების საფასური: ---</div>
                    <div class="sub-info">მისამართი: {{ visibleAddress }} <div class="additionalinfo">{{
                        additionalInfoClass
                            }}
                        </div>
                    </div>

                </div>


                <hr />
                <p><strong>სულ: {{ cart.total_price > 0 ? cart.total_price + " ₾" :
                    "---"
                        }} </strong></p>
                <button class="button" @click="checkout">განათავსეთ შეკვეთა</button>

                <div class="slider">
                    <SliderbuttonComponent @confirm="checkout" />

                </div>


            </div>

            <div class="promocode-div">
                <span :class="{
                    promocode: true,
                    disabled: paymentmethod === null
                }" @click.prevent="paymentmethod !== null && showpromocode()">
                    ფასდაკლების კოდის გამოყენება
                </span>
                <span v-if="paymentmethod === null" class="sub-title">აირჩიეთ გადახდის მეთოდი</span>

                <div v-if="promocodeinput" class="input-with-button">
                    <input v-model="promocode" type="text" class="promocode-input" placeholder="შეიყვანეთ კოდი">
                    <button @click="applypromocode" class="promocode-button"> <i class="fa fa-check"></i>
                    </button>
                    <div class="changepay">
                        <span @click="changePayment" class="changepayment">გადახდის ტიპის შეცვლა</span>
                    </div>
                </div>


            </div>

        </div>
        <Address :open="addressmodal" @save="getAddresses()" @close="addressmodal = false" />
    </div>
</template>
<script>
import api from '@/api';
import Address from "@/components/AddressModal.vue"
import Message from '@/components/Message/MessageComponent.vue';
import SliderbuttonComponent from '@/components/SliderbuttonComponent.vue';
import { validateInputFields } from '@/components/utils/validate';
export default {
    data() {
        return {
            firstName: "",
            sliding: false,

            lastName: "",
            phone: "",
            cart: {
                orders: [],
                payment: null,
                total_price: 0
            },
            shippingCost: 0,
            addressmodal: false,
            addresses: [],
            selectedAddress: null,
            selectedAddressError: null,
            isload: false,
            firstNameError: "",
            lastNameError: "",
            phoneError: "",
            addressdeletemessage: null,
            paymentmethod: null,
            promocode: null,
            promocodeinput: false

        };
    },
    components: {
        Address,
        Message,
        SliderbuttonComponent
    },
    computed: {
        totalWithShipping() {
            return this.totalPrice + (this.shippingCost || 0);
        },

        visibleAddress() {
            const selected = this.addresses.find(address => address.id === this.selectedAddress);
            return selected ? selected.town + ", " + selected.address : '---';
        },
        additionalInfoClass() {
            const selected = this.addresses.find(address => address.id === this.selectedAddress);
            return selected && selected.additionalInfo
        },

    },
    watch: {
        addressdeletemessage() {
            setTimeout(() => {
                this.addressdeletemessage = ''
            }, 2000);
        },

    },


    methods: {
        async changePayment() {
            try {
                const response = await api.put('/changepayment', {}, {
                    tokenRequired: true
                });
                console.log(response);
                this.refreshTempData();
            } catch (error) {
                console.log(error.message);
            }
        },
        disablePayment(type) {
            return this.cart.payment !== type && this.cart.payment !== null
        },
        async applypromocode() {
            try {
                await api.post('/test/promo', {
                    promocode: this.promocode,
                    type: this.paymentmethod
                }, {
                    tokenRequired: true
                });
                this.refreshTempData();


            } catch (error) {
                if (error.response) {
                    console.error("Error response data:", error.response.data);
                    console.error("Error response status:", error.response.status);
                } else if (error.request) {
                    console.error("Error request:", error.request);
                } else {
                    console.error("Error message:", error.message);
                }
            }
        },

        showpromocode() {
            this.promocodeinput = !this.promocodeinput
        },
        async fetchTempDataFromAPI() {
            try {
                const response = await api.get("get/temporder", { tokenRequired: true });
                const data = {
                    cart: response.data,
                    paymentmethod: response.data.payment,
                    promocode: response.data.promocode,
                    isload: true
                };
                window.sessionStorage.setItem('temporder', JSON.stringify(data));

                this.cart = response.data;
                this.paymentmethod = response.data.payment;
                this.promocode = response.data.promocode;
                this.isload = true;
                console.log("Data fetched from API");
            } catch (error) {
                console.log("Error fetching temporary order:", error);
            }
        },
        async getTemp() {
            const storedData = window.sessionStorage.getItem('temporder');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                this.cart = parsedData.cart;
                this.paymentmethod = parsedData.paymentmethod;
                this.promocode = parsedData.promocode;
                this.isload = parsedData.isload;
            } else {
                await this.fetchTempDataFromAPI();

            }
        },


        async deleteTemp() {
            try {
                await api.delete("delete/temporder", {
                    tokenRequired: true
                });
                window.sessionStorage.removeItem('temporder');

            } catch (error) {
                console.log("Error fetching temporary order:", error);
            }
        },
        async checkout() {
            const valid = validateInputFields(this, [
                { model: 'firstName', errorKey: 'firstNameError', message: 'აუცილებელია ველი' },
                { model: 'lastName', errorKey: 'lastNameError', message: 'აუცილებელია ველი' },
                { model: 'phone', errorKey: 'phoneError', message: 'აუცილებელია ველი' },
                { model: 'selectedAddress', errorKey: 'selectedAddressError', message: 'აუცილებელია ველი' },


            ]);

            if (!valid) return;
            try {
                const response = await api.post('checkout', {
                    firstname: this.firstName,
                    lastname: this.lastName,
                    phone: this.phone,
                    address_id: this.selectedAddress,
                    products: this.cart.orders
                }, {
                    tokenRequired: true
                });
                response
                window.sessionStorage.removeItem('temporder');
                this.deleteTemp();
            } catch (error) {
                if (error.response) {
                    console.error('Error Response:', error.response.data);
                    if (error.response.status === 403) {
                        this.verfifyerrormessage = error.response.data.message;
                        this.emitmessage();

                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    } else {
                        // alert(`Erroikor: ${error.response.status} - ${error.response.data.message}`);
                    }
                } else if (error.request) {
                    console.error('No Response:', error.request);
                    alert('No response received. Please check your network.');
                } else {
                    console.error('Error:', error.message);
                    alert('An error occurred: ' + error.message);
                }
            }
        },
        async refreshTempData() {
            try {
                window.sessionStorage.removeItem('temporder');
                console.log("Session data cleared");

                await this.getTemp();
            } catch (error) {
                console.log("Error refreshing data:", error);
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
        }

    },
    async mounted() {
        await Promise.all([this.getTemp(), this.getAddresses()]);
    },


    beforeRouteLeave(to, from, next) {
        this.deleteTemp();
        window.sessionStorage.removeItem('temporder');
        next();
    },

    beforeRouteUpdate(to, from, next) {
        this.deleteTemp();
        window.sessionStorage.removeItem('temporder');
        next();
    }


};
</script>


<style scoped>
.changepay {
    padding-top: 5px;
}

.changepayment {
    color: #888;
    text-decoration: underline;
    cursor: pointer;
}

.disabled {
    opacity: 0.8;
    pointer-events: none;
}

.promocode {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
}

.promocode.disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
}


.promocode-div {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.sub-title {
    color: #a3a0a0;
}

.input-with-button {
    position: relative;
    width: 60%;
}

.promocode-input {
    padding: 10px 50px 10px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
}

.promocode-button {
    position: absolute;
    right: 10px;
    top: 35%;
    transform: translateY(-50%);
    background-color: #7a1dff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    cursor: pointer;
}

.promocode-button:hover {
    color: black;
}


.title {
    font-size: 16px;
    font-family: 'Courier New', Courier, monospace;
}

.desc {
    font-size: 13px;
    color: #888;
}

.desc-info {
    width: 30%;
}

.up-section,
.down-section {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.up-section {
    border-bottom: 1px solid #dbd8d8;
}


.div {
    min-height: 300px;
    font-size: 14px;
    width: 60%;
}

.payment-button {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-top: 10px;
    gap: 10px;
}

.option {
    display: flex;
    align-items: center;
    border: 2px solid #916ac7;
    border-radius: 10px;
    padding: 10px;
    width: 35%;
    gap: 8px;
    cursor: pointer;
    color: #916ac7;
}

.option input {
    accent-color: #916ac7;
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.option label {
    cursor: pointer;
    margin: 0;
    font-size: 12px;
    padding: 0;
}

.option img {
    height: 30px;
    width: auto;
}


.input-error {
    border-color: #e74c3c;
}

.error-text {
    color: #e74c3c;
    font-size: 12px;

}

.info {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.sub-info {
    display: flex;
    align-items: center;
    flex-direction: row;
}

.additionalinfo {
    font-size: 10px;
    color: #888;
}

.checkout-container {
    display: flex;
    gap: 40px;
    padding: 40px;
    border-radius: 10px;
}

.left-section {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    background: white;
    padding: 20px;
    gap: 50px;
    border-radius: 8px;
}

.right-section {
    display: grid;
    width: 40%;
    gap: 20px;
    height: fit-content;
    background: white;
    padding: 20px;
    border-radius: 8px;
    font-size: 14px;
}

.grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.input-group {
    margin-bottom: 15px;
}

label {
    display: flex;
    font-weight: bold;
    margin-right: 10px;
    padding-bottom: 5px;
}

.required {
    color: red;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;

    background: #f5f5f5;
}

.order-items {
    margin-bottom: 10px;
}

.empty {
    display: flex;
    justify-content: center;
    font-size: 16px;
}

.order-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
}

.shipping-options {
    display: flex;
    gap: 15px;
    align-items: center;
    margin-top: 10px;
}

.button {
    width: 100%;
    background-color: #7a1dff;
    color: white;
    padding: 12px;
    justify-content: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
}

.button:hover {
    color: black;
}

.address-button {
    width: 100%;
    background-color: white;
    color: #916ac7;
    padding: 12px;
    justify-content: center;
    border: 2px solid #966bd3;
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
    padding-top: 5px;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.delete-button {
    font-size: 12px;
    color: rgb(221, 109, 109);
}


.slider {
    display: none;
}

@media (max-width: 768px) {
    .checkout-container {
        display: block;
        padding: 0;
        padding-top: 20px;
    }

    .address-button {
        font-size: 13px;
    }

    .grid-container {
        gap: 20px;
    }

    .button {
        display: none;
    }

    .slider {
        display: block;
    }

    * {
        font-size: 13px;
    }

    .up-section,
    .down-section {
        flex-direction: column;
        gap: 20px;
    }

    .desc-info {
        width: 100%;
    }

    .div {
        width: 100%;
    }

    .right-section {
        width: 100%;
        padding: 0;
        gap: 0;
    }

    .checkout {
        padding: 20px;
    }

    .promocode-div {
        justify-content: center;
        align-items: center;
        min-height: 100px;
    }

    .payment-button {
        flex-direction: column;
    }

    .option {
        width: auto;
        height: 30px;
    }
}
</style>
