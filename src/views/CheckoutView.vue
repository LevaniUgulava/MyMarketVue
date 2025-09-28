<template>
    <div class="checkout-container new-ui">
        <Message v-if="addressdeletemessage" :message="addressdeletemessage" @close="addressdeletemessage = ''" />

        <!-- LEFT -->
        <div class="left-section panel">
            <!-- მიმღების ინფორმაცია -->
            <div class="up-section section">
                <div class="desc-info section-header">
                    <div>
                        <h4 class="title">მიმღების ინფორმაცია</h4>
                        <span class="desc">შეიყვანეთ მიმღების პერსონალური ინფორმაცია</span>
                    </div>
                    <span v-if="(firstNameError || lastNameError || phoneError || selectedAddressError)"
                        class="badge badge-danger" aria-live="polite">
                        გთხოვთ შეავსოთ სავალდებულო ველები
                    </span>
                </div>

                <div class="div section-body">
                    <!-- მისამართები -->
                    <div class="input-group">
                        <button class="address-button btn btn-outline"
                            :class="addresses.length == 0 && selectedAddressError ? 'radio-error' : null"
                            @click.prevent="addressmodal = !addressmodal" aria-label="მისამართის დამატება">
                            <i class="fa-solid fa-plus"></i>
                            <span>მისამართის დამატება</span>
                        </button>

                        <!-- მისამართების skeleton (როცა ჯერ იტვირთება temp/order და მისამართები) -->
                        <div v-if="!isload" class="address-skeleton-list">
                            <div class="address-skeleton"></div>
                            <div class="address-skeleton"></div>
                        </div>

                        <!-- მისამართები -->
                        <template v-else>
                            <div v-for="(option, index) in addresses" :key="index" class="radio-button address-card"
                                :class="selectedAddressError ? 'radio-error' : null" role="radio"
                                :aria-checked="selectedAddress === option.id" tabindex="0"
                                @keydown.enter.prevent="selectedAddress = option.id">
                                <input type="radio" class="radio" :id="'address-' + index" name="selectedAddress"
                                    :value="option.id" v-model="selectedAddress" />
                                <label class="address-label" :for="'address-' + index">
                                    <span class="address-line">
                                        <span class="town">{{ option.town }}</span>
                                        <span class="address-text">{{ option.address }}</span>
                                        <span v-if="option.additionalInfo" class="additional">{{ option.additionalInfo
                                            }}</span>
                                    </span>
                                </label>
                                <button class="delete-button link-danger" type="button"
                                    @click="deleteAddress(option.id)" title="მისამართის წაშლა">
                                    <i class="fa-regular fa-trash-can"></i> წაშლა
                                </button>
                            </div>

                            <div v-if="addresses.length === 0" class="address-empty">
                                <i class="fa-regular fa-map"></i>
                                <span>მისამართი ჯერ არ გაქვთ დამატებული</span>
                            </div>
                        </template>
                    </div>

                    <!-- სახელი / გვარი -->
                    <div class="grid-container">
                        <div class="input-group">
                            <label for="firstName">სახელი <span class="required">*</span></label>
                            <span v-if="firstNameError" class="error-text">{{ firstNameError }}</span>
                            <input :class="{ 'input-error': firstNameError }" id="firstName" type="text"
                                v-model="firstName" required placeholder="მაგ: გიორგი" />
                        </div>

                        <div class="input-group">
                            <label for="lastName">გვარი <span class="required">*</span></label>
                            <span v-if="lastNameError" class="error-text">{{ lastNameError }}</span>
                            <input :class="{ 'input-error': lastNameError }" id="lastName" type="text"
                                v-model="lastName" required placeholder="მაგ: პაპუნაშვილი" />
                        </div>
                    </div>

                    <!-- ტელეფონი -->
                    <div class="input-group">
                        <label for="phone">ტელეფონი <span class="required">*</span></label>
                        <span v-if="phoneError" class="error-text">{{ phoneError }}</span>
                        <input :class="{ 'input-error': phoneError }" id="phone" type="tel" v-model="phone" required
                            placeholder="მაგ: 555123456" />
                    </div>
                </div>
            </div>

            <!-- გადახდა -->
            <div class="down-section section">
                <div class="desc-info section-header">
                    <div>
                        <h4 class="title">გადახდის მეთოდი</h4>
                        <span class="desc">აირჩიეთ სასურველი გადახდის მეთოდი</span>
                    </div>
                    <span v-if="cart.payment !== null" class="badge badge-info">
                        არჩეულია: <strong class="ucase">{{ cart.payment }}</strong>
                    </span>
                </div>

                <div class="div section-body">
                    <div class="payment-button payment-grid" role="radiogroup" aria-label="გადახდის მეთოდები">
                        <!-- BOG -->
                        <label class="option pay-card"
                            :class="{ 'disabled': disablePayment('bog'), 'checked': paymentmethod === 'bog' }"
                            for="bog-pay" tabindex="0"
                            @keydown.enter.prevent="$refs['bog-input'] && $refs['bog-input'].click()">
                            <input ref="bog-input" id="bog-pay" type="radio" value="bog" v-model="paymentmethod"
                                class="visually-hidden" />
                            <span class="pay-icon">
                                <img src="../assets/svg/bog.svg" alt="BOG Bank" />
                            </span>
                            <span class="pay-label">საქართველოს ბანკი</span>
                            <span class="checkmark" aria-hidden="true"></span>
                        </label>

                        <!-- TBC -->
                        <label class="option pay-card"
                            :class="{ 'disabled': disablePayment('tbc'), 'checked': paymentmethod === 'tbc' }"
                            for="tbc-pay" tabindex="0"
                            @keydown.enter.prevent="$refs['tbc-input'] && $refs['tbc-input'].click()">
                            <input ref="tbc-input" id="tbc-pay" type="radio" value="tbc" v-model="paymentmethod"
                                class="visually-hidden" />
                            <span class="pay-icon">
                                <img src="../assets/svg/tbc.svg" alt="TBC Bank" />
                            </span>
                            <span class="pay-label">თიბისი ბანკი</span>
                            <span class="checkmark" aria-hidden="true"></span>
                        </label>

                        <!-- CASH -->
                        <label class="option pay-card"
                            :class="{ 'disabled': disablePayment('cash'), 'checked': paymentmethod === 'cash' }"
                            for="cash-pay" tabindex="0"
                            @keydown.enter.prevent="$refs['cash-input'] && $refs['cash-input'].click()">
                            <input ref="cash-input" id="cash-pay" type="radio" value="cash" v-model="paymentmethod"
                                class="visually-hidden" />
                            <span class="pay-icon cash">₾</span>
                            <span class="pay-label">კურიერთან გადახდა</span>
                            <span class="checkmark" aria-hidden="true"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <!-- RIGHT -->
        <div class="right-section">
            <div class="checkout card sticky">
                <!-- order skeleton სანამ isload არაა -->
                <div v-if="!isload" class="order-skeleton">
                    <div class="s-line"></div>
                    <div class="s-line"></div>
                    <div class="s-line"></div>
                </div>

                <div class="order-items" v-else-if="cart.orders.length > 0">
                    <div v-for="(item, index) in cart.orders" :key="index" class="order-item">
                        <div class="img">
                            <img :src="item.product.images">
                        </div>
                        <div class="order-main">
                            <span class="name" :title="item.name">
                                <div>{{ item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name }}</div>
                            </span>
                            <span class="sub">{{ item.color }} - {{ item.size }} ზომა</span>
                        </div>
                        <div class="order-qty">{{ item.retail_price }}₾ x {{ item.quantity }}</div>
                        <div class="order-total">სულ: <strong>{{ item.total_price }}₾ </strong>
                            <svg v-if="!item.isOriginal" xmlns="http://www.w3.org/2000/svg" height="20px"
                                viewBox="0 -960 960 960" width="20px" fill="gold">
                                <path
                                    d="M240-144v-624h366q8 0 16 3.5t13 10.5l133 178-133 178q-5 8-13 11t-16 3H312v240h-72Z" />
                            </svg>

                        </div>
                    </div>
                </div>

                <div class="empty" v-else>
                    <p>შეკვეთა ცარიელია</p>
                </div>

                <hr />

                <div class="info">
                    <div class="sub-info">
                        <span class="k">გადასახდელი თანხა</span>
                        <span class="v">{{ cart.total_price > 0 ? cart.total_price + " ₾" : "---" }}</span>
                    </div>
                    <div class="sub-info">
                        <span class="k">მიწოდების საფასური</span>
                        <span class="v">---</span>
                    </div>
                    <div class="sub-info address-line">
                        <span class="k">მისამართი</span>
                        <span class="v">
                            {{ visibleAddress }}
                        </span>
                    </div>
                </div>

                <hr />

                <p class="grand"><strong>სულ: {{ cart.total_price > 0 ? cart.total_price + " ₾" : "---" }}</strong></p>

                <button class="button btn-primary" @pointerdown.stop.prevent="checkout">განათავსეთ შეკვეთა</button>

                <div class="slider">
                    <SliderbuttonComponent @confirm="checkout" />
                </div>
            </div>

            <!-- Promo -->
            <div class="promocode-div card">
                <span :class="{ promocode: true, disabled: paymentmethod === null }"
                    @click.prevent="paymentmethod !== null && showpromocode()">
                    ფასდაკლების კოდის გამოყენება
                </span>
                <span v-if="paymentmethod === null" class="sub-title">აირჩიეთ გადახდის მეთოდი</span>

                <div v-if="promocodeinput" class="input-with-button">
                    <input v-model="promocode" type="text" class="promocode-input" placeholder="შეიყვანეთ კოდი" />
                    <button @click="applypromocode" class="promocode-button">
                        <i class="fa fa-check"></i>
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
                this.cart = response.data;
                this.paymentmethod = response.data.payment;
                this.promocode = response.data.promocode;
                this.isload = true;
                console.log("Data fetched from API");
            } catch (error) {
                console.log("Error fetching temporary order:", error);
            }
        },


        // async deleteTemp() {
        //     try {
        //         await api.delete("delete/temporder", {
        //             tokenRequired: true
        //         });
        //         window.sessionStorage.removeItem('temporder');

        //     } catch (error) {
        //         console.log("Error fetching temporary order:", error);
        //     }
        // },
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

                await this.fetchTempDataFromAPI();
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
        await Promise.all([this.fetchTempDataFromAPI(), this.getAddresses()]);
    },


    // beforeRouteLeave(to, from, next) {
    //     this.deleteTemp();
    //     window.sessionStorage.removeItem('temporder');
    //     next();
    // },

    // beforeRouteUpdate(to, from, next) {
    //     this.deleteTemp();
    //     window.sessionStorage.removeItem('temporder');
    //     next();
    // }


};
</script>
<style scoped>
/* ======= Design tokens ======= */
.checkout-container.new-ui {
    --bg: #f7f7fb;
    --card: #ffffff;
    --text: #222;
    --muted: #7a7f8a;
    --border: #e7e7ee;
    --primary: #7a1dff;
    --primary-600: #6a0fff;
    --accent: #916ac7;
    --accent-600: #7b53b3;
    --danger: #e74c3c;
    --success: #16a34a;
    --shadow: 0 8px 28px rgba(16, 24, 40, 0.08);
}

/* ======= Layout refresh ======= */
.checkout-container.new-ui {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 480px;
    gap: 28px;
    padding: 28px;
    background: var(--bg);
}

.panel {
    background: var(--card);
    border-radius: 14px;
    box-shadow: var(--shadow);
}

.section {
    padding: 14px 18px 18px;
}

.section+.section {
    border-top: 1px solid var(--border);
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px dashed var(--border);
}

.section-body {
    padding-top: 14px;
}

/* RIGHT column */
.right-section {
    display: grid;
    gap: 16px;
    height: fit-content;
}

.card {
    background: var(--card);
    border-radius: 14px;
    box-shadow: var(--shadow);
    padding: 18px;
}

.sticky {
    position: sticky;
    top: 20px;
}

/* ======= Typography ======= */
.title {
    font-size: 16px;
    font-weight: 800;
    color: var(--text);
}

.desc {
    font-size: 13px;
    color: var(--muted);
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
}

.badge-danger {
    background: #fee2e2;
    color: #b91c1c;
}

.badge-info {
    background: #eef2ff;
    color: #3730a3;
}

.ucase {
    text-transform: uppercase;
}

/* ======= Inputs ======= */
label {
    display: flex;
    font-weight: 700;
    margin-right: 10px;
}

.required {
    color: red;
}

input {
    width: 100%;
    height: 40px;
    margin-top: 5px;
    text-indent: 10px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fafafa;
    transition: border .2s, background .2s, box-shadow .2s;
}

input:focus {
    background: #fff;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(122, 29, 255, 0.12);
}

.input-error {
    border-color: var(--danger) !important;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.15);
}

.error-text {
    color: var(--danger);
    font-size: 12px;
    margin-top: 6px;
    display: inline-block;
}

/* ======= Buttons & links ======= */
.btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    border: none;
    cursor: pointer;
}

.btn-primary {
    width: 100%;
    background: var(--primary);
    color: #fff;
    padding: 12px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
}

.btn-primary:hover {
    background: var(--primary-600);
    color: #fff;
}

.btn:disabled {
    opacity: .7;
    cursor: not-allowed;
}

.btn.btn-outline {
    width: 100%;
    background: #fff;
    color: var(--accent);
    border: 2px solid var(--accent);
    padding: 12px;
    border-radius: 10px;
}

.btn.btn-outline:hover {
    background: #faf7ff;
    border-color: var(--accent-600);
}

.link-danger {
    color: var(--danger);
    background: transparent;
    border: none;
    cursor: pointer;
}

.link-danger:hover {
    text-decoration: underline;
}

/* ======= Address Cards ======= */
.address-button {
    box-sizing: border-box;
    font-weight: 700;
}

.radio-error {
    border-color: var(--danger) !important;
}

.address-card {
    display: grid;
    grid-template-columns: 22px 1fr auto;
    align-items: center;
    gap: 12px;
    border: 2px solid var(--accent);
    border-radius: 10px;
    padding: 12px;
    font-size: 13px;
    margin-top: 10px;
    background: #fff;
    transition: border-color .2s, background .2s, transform .08s;
}

.address-card:hover {
    border-color: var(--primary);
    background: #faf7ff;
}

.address-card:active {
    transform: translateY(1px);
}

.radio {
    margin: 0;
    width: 15px;
    height: 15px;
    accent-color: var(--accent);
    cursor: pointer;
}

.address-label {
    cursor: pointer;
    display: block;
}

.address-line {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.town {
    font-weight: 800;
    color: var(--accent);
}

.address-text {
    color: var(--accent);
}

.additional {
    color: var(--muted);
    font-size: 12px;
}

.address-empty {
    display: flex;
    gap: 8px;
    align-items: center;
    color: var(--muted);
    font-size: 13px;
    padding: 8px 0;
}

/* skeleton */
.address-skeleton-list {
    display: grid;
    gap: 8px;
    margin-top: 10px;
}

.address-skeleton {
    height: 56px;
    border-radius: 10px;
    background: linear-gradient(90deg, #eee, #f7f7f7, #eee);
    background-size: 200% 100%;
    animation: shimmer 1.1s linear infinite;
}

@keyframes shimmer {
    to {
        background-position: -200% 0;
    }
}



.input-group {
    padding: 10px;
}

/* ======= Payment grid/cards ======= */
.payment-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.option.pay-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    border: 2px solid var(--accent);
    border-radius: 12px;
    padding: 6px;
    color: var(--accent);
    cursor: pointer;
    transition: background .2s, border-color .2s, transform .08s;
}

.option.pay-card:hover {
    background: #faf7ff;
    border-color: var(--primary);
}

.option.pay-card.checked {
    border-color: var(--primary);
    background: #f5f0ff;
}

.option.pay-card.disabled {
    opacity: .6;
    pointer-events: none;
}

.visually-hidden {
    position: absolute;
    opacity: 0;
    inset: 0;
    pointer-events: none;
}

.pay-icon {
    width: 30px;
    height: 30px;
    display: inline-grid;
    place-items: center;
}

.pay-icon img {
    width: 28px;
    height: 28px;
    object-fit: contain;
}

.pay-icon.cash {
    background: #f1eaff;
    border-radius: 8px;
    font-weight: 900;
    color: var(--primary);
}

.checkmark::after {
    content: "✓";
    position: absolute;
    right: 10px;
    top: 10px;
    font-weight: 900;
    opacity: 0;
    transform: scale(.8);
    transition: .2s;
    color: var(--primary);
}

.option.pay-card.checked .checkmark::after {
    opacity: 1;
    transform: scale(1);
}

/* ======= Summary ======= */
.checkout h3 {
    margin: 0 0 10px;
}

.order-skeleton .s-line {
    height: 14px;
    border-radius: 6px;
    margin: 8px 0;
    background: linear-gradient(90deg, #eee, #f7f7f7, #eee);
    background-size: 200% 100%;
    animation: shimmer 1.1s linear infinite;
}

.order-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;
}

.order-item {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: 8px;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px dashed var(--border);
}

.order-item:last-child {
    border-bottom: none;
}

.order-main .name {
    font-weight: 500;
    font-size: 14px;
    display: block;
    white-space: wrap;
}

img {
    width: 80px;
}

.order-main .sub {
    color: var(--muted);
    font-size: 12px;
}

.order-qty {
    color: var(--muted);
    font-size: 13px;
}

.order-total {
    font-size: 13px;
    display: flex;
}

.order-qty,
.order-total {
    margin-bottom: 15px;
}

.order-total strong {
    font-weight: 800;
}

.info {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.sub-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.sub-info .k {
    color: var(--muted);
}

.sub-info .v {
    font-weight: 700;
}

.address-line .v {
    max-width: 65%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.additionalinfo {
    font-size: 12px;
    color: var(--muted);
    padding-left: 4px;
}

.grand {
    font-size: 16px;
}

/* ======= Promo ======= */
.promocode-div {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.promocode {
    color: #2563eb;
    text-decoration: underline;
    cursor: pointer;
    font-weight: 700;
}

.promocode.disabled {
    pointer-events: none;
    opacity: .55;
    cursor: not-allowed;
}

.sub-title {
    color: #a3a0a0;
}

.input-with-button {
    position: relative;
    width: 100%;
    max-width: 360px;
}

.promocode-input {
    font-size: 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    width: 100%;
    background: #fafafa;
}

.promocode-input:focus {
    border-color: var(--primary);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(122, 29, 255, 0.12);
}

.promocode-button {
    position: absolute;
    right: 2px;
    top: 15%;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
}

.promocode-button:hover {
    background: var(--primary-600);
    color: #fff;
}

.changepay {
    padding-top: 6px;
}

.changepayment {
    color: #666;
    text-decoration: underline;
    cursor: pointer;
}

/* ======= Old classes kept (compatibility) ======= */
.up-section {
    border-bottom: none;
}

.option {
    color: var(--accent);
}

.option img {
    height: 25px;
    width: auto;
}

/* ======= Mobile ======= */
.slider {
    display: none;
}


@media (max-width: 992px) {
    .checkout-container.new-ui {
        grid-template-columns: 1fr;
        padding: 16px;
        gap: 18px;
    }

    .sticky {
        position: static;
    }
}

@media (max-width: 768px) {
    .grid-container {
        gap: 20px;
        grid-template-columns: 1fr;
    }

    .payment-grid {
        grid-template-columns: 1fr;
    }

    .button {
        display: none;
    }

    /* მობილურზე ვტოვებთ მხოლოდ slider-ს */
    .slider {
        display: block;
        margin-top: 10px;
    }

    .checkout.card {
        padding: 16px;
    }

    .order-item {
        grid-template-columns: 1fr auto;
    }

    .order-qty {
        display: none;
    }
}
</style>