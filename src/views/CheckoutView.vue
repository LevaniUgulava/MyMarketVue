<template>
    <div class="checkout-container">
        <!-- Left Section: User Information -->
        <div class="left-section">
            <h3>შეკვეთის დეტალები</h3>
            <form @submit.prevent="submitOrder">
                <div v-if="!isAuth">
                    <div class="input-group">
                        <label for="city">ელ.ფოსტა <span class="required">*</span></label>
                        <input id="city" type="text" v-model="user.city" :disabled="shippingCost === 5" required />
                    </div>
                    <div class="grid-container">
                        <div class="input-group">
                            <label for="firstName">სახელი <span class="required">*</span></label>
                            <input id="firstName" type="text" v-model="user.firstName" required />
                        </div>
                        <div class="input-group">
                            <label for="lastName">გვარი <span class="required">*</span></label>
                            <input id="lastName" type="text" v-model="user.lastName" required />
                        </div>
                    </div>
                </div>
                <div class="input-group">
                    <label for="city">ქალაქი <span class="required">*</span></label>
                    <input id="city" type="text" v-model="user.city" :disabled="shippingCost === 5" required />
                </div>
                <div class="input-group">
                    <label for="address">მისამართი <span class="required">*</span></label>
                    <input id="address" type="text" v-model="user.address" required />
                </div>
                <div class="input-group">
                    <label for="phone">ტელეფონი <span class="required">*</span></label>
                    <input id="phone" type="tel" v-model="user.phone" required />
                </div>
            </form>
        </div>

        <div class="right-section">
            <h3>თქვენი შეკვეთა</h3>
            <div class="order-items">
                <div v-for="(item, index) in cart" :key="index" class="order-item">
                    <span>{{ item.name }}</span>
                    <span>x {{ item.quantity }}</span>
                    <span>{{ item.total_price }}₾</span>
                </div>
            </div>
            <hr />
            <p><strong>სულ: {{ totalPrice }}₾</strong></p>
            <p>მიწოდება:</p>
            <div class="shipping-options">
                <label><input type="radio" v-model="shippingCost" :value="5" /> თბილისი: 5₾</label>
                <label><input type="radio" v-model="shippingCost" :value="10" /> რეგიონი: 10₾</label>
            </div>
            <hr />
            <p><strong>სულ: {{ totalWithShipping }}₾</strong></p>
            <button @click="checkout">განათავსეთ შეკვეთა</button>
        </div>
    </div>
</template>
<script>
import api from '@/api';


export default {
    data() {
        return {
            user: {
                firstName: "",
                lastName: "",
                city: "",
                address: "",
                phone: "",
            },
            cart: [],
            shippingCost: 0,
        };
    },
    computed: {
        totalPrice() {
            return Array.isArray(this.cart) ? this.cart.reduce((sum, item) => sum + (item.retail_price * item.quantity), 0) : 0;
        },
        totalWithShipping() {
            return this.totalPrice + (this.shippingCost || 0);
        },
        isAuth() {
            return !!localStorage.getItem('token');
        }
    },
    watch: {
        shippingCost(newCost) {
            if (newCost === 5) {
                this.user.city = "თბილისი";
            } else {
                this.user.city = "";
            }
        }
    },
    methods: {
        async getTemp() {
            try {
                const guest_token = localStorage.getItem("guest_token");

                const response = await api.get("get/temporder", {
                    headers: {
                        "Guest-Token": guest_token
                    },
                    tokenOptional: true
                });
                this.cart = response.data;

            } catch (error) {
                console.log("Error fetching temporary order:", error);
            }
        },

        async deleteTemp() {
            try {
                const guest_token = localStorage.getItem("guest_token");
                await api.delete("delete/temporder", {
                    headers: {
                        "Guest-Token": guest_token
                    },
                    tokenRequired: true
                });
            } catch (error) {
                console.log("Error fetching temporary order:", error);
            }
        },
        async checkout() {
            try {
                const response = await api.post('checkout', {
                    firstname: this.user.firstName,
                    lastname: this.user.lastName,
                    town: this.user.city,
                    products: this.cart,
                    address: this.user.address,
                    phone: this.user.phone,
                    shipping_cost: this.shippingCost
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    tokenRequired: true
                });
                response
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
                        alert(`Error: ${error.response.status} - ${error.response.data.message}`);
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

    },
    mounted() {
        this.getTemp();
    },
    beforeRouteLeave(to, from, next) {
        this.deleteTemp();
        next();
    }


};
</script>


<style scoped>
.checkout-container {
    display: flex;
    gap: 40px;
    padding: 40px;
    border-radius: 10px;
}

.left-section,
.right-section {
    flex: 1;
    background: white;
    padding: 20px;
    border-radius: 8px;
}

.grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.input-group {
    margin-bottom: 15px;
}

label {
    font-weight: bold;
    margin-right: 10px;
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

button {
    width: 100%;
    background-color: #7a1dff;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

button:hover {
    color: black;
}

@media (max-width: 768px) {
    .checkout-container {
        display: block;
    }
}
</style>
