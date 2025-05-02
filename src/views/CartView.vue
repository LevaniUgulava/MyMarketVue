<template>
    <div class="cart-container" v-if="apiLoaded && mycarts.length > 0">
        <Message v-if="message" :message="message" @close="message = ''" />

        <div class="product-section">
            <div class="card" v-for="(item, index) in mycarts" :key="index">
                <div class="action">
                    <div>
                        <i @click.prevent="deleteCart(item.pivot.id)" class="fa-solid fa-trash outline-icon"></i>
                    </div>
                    <div>
                        <i class="fa-solid fa-heart outline-icon"></i>
                    </div>
                </div>

                <div class="product-info">
                    <Carousel :items-to-show="1" class="custom-carousel">
                        <Slide v-for="(image, index) in item.image_urls" :key="index">
                            <img :src="image" alt="Product Image" class="img" />
                        </Slide>
                    </Carousel>
                </div>

                <div class="data">
                    <div class="product-name">
                        <span>დასახელება</span>
                        {{ item.name }}
                    </div>

                    <div class="quantity-control">
                        <div class="increment-wrapper">
                            <div v-if="quantitydemessage[item.pivot.id]" class="popup-message">
                                {{ quantitydemessage[item.pivot.id] }}
                                <div class="arrow-down"></div>
                            </div>
                        </div>
                        <button class="quantitybtn" @click="updateQuantity(item.pivot.id, 'decrement')">-</button>
                        <span class="quantity">{{ item.pivot.quantity }}</span>
                        <div class="increment-wrapper">
                            <div v-if="quantitymessage[item.pivot.id]" class="popup-message">
                                {{ quantitymessage[item.pivot.id] }}
                                <div class="arrow-down"></div>
                            </div>
                        </div>
                        <button class="quantitybtn" @click="updateQuantity(item.pivot.id, 'increment')">+</button>
                    </div>

                    <div class="price">
                        <span>ფასი</span>
                        <div>
                            {{ item.price }} <i class="fa-solid fa-lari-sign"></i>
                        </div>
                    </div>

                    <div class="size-select"
                        :class="{ 'size-select-error': emptyids[item.pivot.id]?.size && !changedsize[item.id] }">
                        <span class="name">ზომა</span>
                        <select v-model="changedsize[item.pivot.id]" @change="updateSize(item.pivot.id)">
                            <option value="" disabled>აირჩიეთ...</option>
                            <option v-for="(sizeObject, index) in item.size" :value="sizeObject.size" :key="index">
                                {{ sizeObject.size }}
                            </option>
                        </select>
                        <span v-if="messageofsize[item.pivot.id]" class="message">{{ messageofsize[item.pivot.id]
                        }}</span>
                    </div>

                    <div class="size-select"
                        :class="{ 'size-select-error': emptyids[item.pivot.id]?.color && !selectedColor[item.id] }">
                        <span class="name">ფერი</span>
                        <select v-model="selectedColor[item.pivot.id]" @change="updateSelectedColor(item.pivot.id)"
                            class="color">
                            <option value="" disabled selected>აირჩიეთ...</option>
                            <option v-for="(colorDetail, index) in (
                                changedsize[item.pivot.id]
                                    ? (item.size.find(sizeObj => String(sizeObj.size) === String(changedsize[item.pivot.id]))?.details || [])
                                    : []
                            )" :value="colorDetail.color" :key="index">
                                {{ colorDetail.color }}
                            </option>
                        </select>
                        <span v-if="messageofcolor[item.pivot.id]" class="message">{{ messageofcolor[item.pivot.id]
                        }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="payment-section">
            <div class="details">
                <span>თანხა:</span>
                <span>{{ allprice }} <i class="fa-solid fa-lari-sign"></i></span>
            </div>
            <button class="checkbtn" @click="checkout">გადახდა</button>
        </div>
    </div>

    <div v-if="apiLoaded && mycarts.length === 0" class="empty-cart">
        <i class="fa-solid fa-cart-shopping"></i>
        <p class="empty-text">თქვენ ჯერ არ დაგიმატებიან პროდუქტი</p>
        <p class="empty-subtext">დამატეთ ყველა პროდუქტი, რაც თქვენ გაინტერესებთ</p>
        <div class="empty-actions">
            <a href="/" class="primary-btn">დაათვალიერეთ პროდუქტები</a>
            <a href="/" class="secondary-btn">მოინახულე ჩვენი მაღაზია</a>
        </div>
    </div>
</template>

<script>
import api from '@/api';
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import { mapGetters } from 'vuex';
import Message from '@/components/Message/MessageComponent.vue';

export default {
    data() {
        return {
            mycarts: [],
            allprice: 0,
            message: '',
            changedsize: {},
            selectedColor: {},
            emptyids: {},
            quantitymessage: {},
            quantitydemessage: {},
            messageofcolor: {},
            messageofsize: {},
            maxquantity: 0,
            apiLoaded: false,
            loading: false,
        };
    },
    components: { Carousel, Slide, Message },
    computed: {
        ...mapGetters('auth', ['isAuthenticated']),
    },
    methods: {
        async showMessage(message, field, id) {
            this[field][id] = message;
            await new Promise(resolve => setTimeout(resolve, 4000));
            this[field][id] = '';
        },

        validateSelection(id) {
            const sizeValid = !!this.changedsize[id];
            const colorValid = !!this.selectedColor[id];

            if (!sizeValid || !colorValid) {
                this.emptyids[id] = {
                    size: !sizeValid,
                    color: !colorValid,
                };
            } else {
                delete this.emptyids[id];
            }

            return sizeValid && colorValid;
        },

        async updateQuantity(id, action) {
            const item = this.mycarts.find(i => i.pivot.id === id);
            if (!item || !this.validateSelection(id)) return;
            if (this.loading) return;
            this.loading = true;
            try {
                if (action === 'increment') {
                    if (item.pivot.quantity >= this.maxquantity) {
                        this.showMessage("მაქსიმალური რაოდენობა", "quantitymessage", id);
                        return;
                    }
                } else if (action === 'decrement') {
                    if (item.pivot.quantity <= 1) {
                        this.showMessage("ნაკლები რაოდენობა არ შეიძლება", "quantitydemessage", id);
                        return;
                    }
                }
                const response = await api.post(`quantity/${id}/${action}`, {}, { tokenRequired: true });
                item.pivot.quantity = response.data.quantity;
                item.pivot.total_price = response.data.total_price;
                this.allprice = response.data.cart_total_price

            } finally {
                this.loading = false;
            }
        },
        async updateSize(itemId) {
            const selectedSize = this.changedsize[itemId];
            const item = this.mycarts.find(i => i.pivot.id === itemId);
            if (!item || this.loading) return;
            this.loading = true;
            try {
                await api.patch(`/size/${itemId}`, { newsize: selectedSize }, { tokenRequired: true });
                this.getCart();
                this.updateSelectedColor(itemId);
            } catch (error) {
                console.error("Error updating size:", error);
            } finally {
                this.loading = false;
            }
        },
        async updateSelectedColor(itemId) {
            const item = this.mycarts.find(i => i.pivot.id === itemId);
            if (!item || this.loading) return;
            this.loading = true;
            try {
                await api.patch(`/color/${itemId}`, { color: this.selectedColor[itemId] }, { tokenRequired: true });
                this.getCart();
            } catch (error) {
                console.error("Error updating color:", error);
            } finally {
                this.loading = false;
            }
        },
        async getCart() {
            try {
                const response = await api.get('mycart', { tokenRequired: true });
                this.mycarts = response.data.products;
                this.allprice = response.data.totalPrice;
                this.mycarts.forEach(item => {
                    this.changedsize[item.pivot.id] = item.pivot.size || '';
                    this.selectedColor[item.pivot.id] = item.pivot.color || '';
                    this.checkmaxquantity(item);
                });
            } catch (error) {
                console.error("Error during getCart:", error);
            } finally {
                this.apiLoaded = true;
            }
        },
        async deleteCart(id) {
            try {
                await api.post(`delete/${id}/cart`, {}, { tokenRequired: true });
                this.getCart();
            } catch (error) {
                console.error("Error deleting cart item:", error);
            }
        },
        async checkout() {
            try {
                this.getGuestToken();
                const mappedcart = this.getMappedCart();
                console.log(mappedcart);
                await api.post("/temporder", { products: mappedcart }, { tokenRequired: true });
                this.$router.push({ name: "checkout" });
            } catch (error) {
                this.handleCheckoutError(error);
            }
        },
        getMappedCart() {
            return this.mycarts.map(item => this.mapCartItem(item)).filter(Boolean);
        },
        mapCartItem(item) {
            const color = this.selectedColor[item.pivot.id];
            const size = item.pivot.size;
            if (!color || !size) {
                this.emptyids[item.pivot.id] = {
                    size: !size,
                    color: !color,
                }
            }
            return {
                guest_token: this.getGuestToken(),
                quantity: item.pivot.quantity || 1,
                name: item.name,
                product_id: item.id,
                type: "cart",
                color,
                size,
                retail_price: item.pivot.retail_price,
                total_price: item.pivot.total_price,
            };
        },
        handleCheckoutError(error) {
            if (error.response?.status === 403) {
                this.message = `ელფოსტა არ არის ვერიფიცირებული, <a href='/profile' style="color:white" target='_blank'>დაადასტურეთ აქ</a>`;
            }
        },
        getGuestToken() {
            if (!this.isAuthenticated) {
                let guest_token = localStorage.getItem("guest_token") || crypto.randomUUID();
                if (!localStorage.getItem("guest_token")) {
                    localStorage.setItem("guest_token", guest_token);
                }
                return guest_token;
            }
            localStorage.removeItem("guest_token");
            return "";
        },
        async checkmaxquantity(item) {
            if (item.pivot.color != null) {
                const selectedColorObj = item.size
                    .map(size => size.details || [])
                    .flat()
                    .find(detail => detail.color === item.pivot.color);
                this.maxquantity = selectedColorObj ? selectedColorObj.quantity : 0;
            }
        },
    },
    mounted() {
        this.getCart();
    },
};
</script>


<style scoped>
.empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 80px 20px;
    color: #333;
}

.increment-wrapper {
    position: relative;
    display: inline-block;
}

.popup-message {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-43%) translateY(-30%);
    background-color: #fff;
    color: #333;
    border: 1px solid #d1d1d1;
    border-radius: 4px;
    padding: 8px 10px;
    font-size: 13px;
    white-space: nowrap;
    z-index: 999;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.popup-message .arrow-down {
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #d1d1d1;
}

.increment-wrapper:first-child .popup-message {
    transform: translateX(-50%) translateY(-30%);
}

.increment-wrapper:first-child .arrow-down {
    margin-left: 5px;

}

.empty-text {
    font-size: 14px;
    font-weight: bold;
    color: #333;
}

.empty-subtext {
    font-size: 14px;
    color: #666;
    margin-top: 5px;
}

.empty-actions {
    margin-top: 20px;
    display: flex;
    gap: 15px;
}

.primary-btn {
    text-decoration: none;
    background-color: #9b51e0;
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    transition: background-color 0.3s ease;
}

.primary-btn:hover {
    background-color: #7e3ae3;
}

.secondary-btn {
    text-decoration: none;
    color: #9b51e0;
    font-size: 13px;
    padding: 10px 15px;
    font-weight: 600;
    border-radius: 8px;
    border: 2px solid #9b51e0;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.secondary-btn:hover {
    background-color: #9b51e0;
    color: white;
}

.action {
    display: flex;
    gap: 10px;
    position: absolute;
    right: 10px;
}

.outline-icon {
    color: transparent;
    cursor: pointer;
    -webkit-text-stroke: 1.3px #bcb9b9;
}

.outline-icon:hover {
    -webkit-text-stroke: 2px #bcb9b9;

}

.cart-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px;
    width: 95%;
    margin: auto;
    gap: 30px;
    margin-top: 40px;
}

.product-section {
    flex: 3;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.card {
    display: flex;
    padding: 5px;
    border-bottom: 1px solid #ccc;
    position: relative;
}

.action-buttons {
    display: flex;
    justify-content: space-between;
}

.product-info {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
}

.custom-carousel {
    width: 50%;
    max-width: 300px;
    margin: 0 auto;
}

.custom-carousel .img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
}


.data {
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-items: end;
    width: 80%;
    margin: auto;
}

.product-name {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 13px;
    font-weight: bold;
    color: #333;
}

.quantity-control {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 8px;
    background-color: #fff;
}

.quantitybtn {
    background-color: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #888;
    padding: 0 10px;
}

.product-section span {
    color: #888;
}

.price span {
    font-size: 13px;
}

.price {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #0e0e0e;
}

.size-select {
    display: flex;
    flex-direction: column;

}

.size-select .message {
    font-size: 10px;
    color: red;
}

.size-select .name {
    font-size: 13px;
}

.size-select select {
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ddd;
}


.size-select-error select {
    border: 1px solid #f50202;
    box-shadow: 0 0 5px rgba(245, 2, 2, 0.6);

}


.size-select select.color {
    width: 100px;
}


.payment-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 20px;
    height: fit-content;
}

.payment-section .details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.checkbtn {
    background: #7a1dff;
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 13px;
}

@media (max-width:767px) {

    .secondary-btn,
    .primary-btn {
        font-size: 12px;
        font-weight: 100
    }

    .empty-text {
        font-weight: 100
    }
}
</style>