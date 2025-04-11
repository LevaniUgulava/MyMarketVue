<template>
    <div class="cart-container" v-if="mycarts.length > 0">

        <div class="product-section">
            <div class="card" v-for="(item, index) in mycarts" :key="index">
                <div class="action">
                    <div>
                        <i @click.prevent="deleteCart(item.id, item.size)" class="fa-solid fa-trash outline-icon"></i>
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

                        <button class="quantitybtn" @click="updatequantity(item.id, 'decrement', item.size)">-</button>
                        <span class="quantity">{{ item.quantity }}</span>
                        <button class="quantitybtn" @click="updatequantity(item.id, 'increment', item.size)">+</button>
                    </div>

                    <div class="price">
                        <span>ფასი</span>
                        <div>
                            {{ item.price }}
                            <i class="fa-solid fa-lari-sign"></i>
                        </div>

                    </div>

                    <div class="size-select">
                        <span class="name">ზომა</span>
                        <select v-model="changedsize[item.id]" @change="updateSize(item.id)">
                            <option v-for="(colors, size) in item.availablesize" :value="size" :key="size">
                                {{ size }}
                            </option>
                        </select>
                    </div>

                    <div class="size-select">
                        <span class="name">ფერი</span>
                        <select v-model="selectedColor[item.id]" @change="updateSelectedColor(item.id)" class="color">
                            <option v-for="color in item.availablesize[changedsize[item.id]]" :value="color"
                                :key="color">
                                {{ color }}
                            </option>
                        </select>
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


    <div v-if="apiLoaded && this.mycarts.length === 0" class="empty-cart">
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
import { Carousel, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

export default {
    name: 'ShoppingCart',

    data() {
        return {
            mycarts: [],
            allprice: 0,
            verfifyerrormessage: '',
            changedsize: {},
            selectedColor: {},
            apiLoaded: false
        };
    },
    components: {
        Carousel,
        Slide
    },

    methods: {
        emitmessage() {
            this.$emit('verfifyerrormessage', this.verfifyerrormessage);
        },

        async checkout() {
            try {
                const guest_token = localStorage.getItem("guest_token") || crypto.randomUUID();
                if (!localStorage.getItem("guest_token")) {
                    localStorage.setItem("guest_token", guest_token);
                }

                const mappedcart = this.mycarts.map(item => ({
                    guest_token,
                    quantity: item.quantity || 1,
                    name: item.name,
                    product_id: item.id,
                    type: "cart",
                    color: this.selectedColor[item.id] || "Select...",
                    size: item.size,
                    retail_price: item.retail_price,
                    total_price: item.total_price
                }));

                await api.post("/temporder", { products: mappedcart }, {
                    tokenRequired: true
                });

                this.$router.push({ name: "checkout" });

            } catch (error) {
                console.error("Error during checkout:", error);
            }
        },

        async getCart() {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('Authentication required');
                return;
            }

            try {
                const response = await api.get('mycart', {
                    tokenRequired: true
                });

                this.mycarts = response.data.products;
                this.allprice = response.data.totalPrice;

                this.mycarts.forEach(item => {
                    this.changedsize[item.id] = item.size;
                    this.selectedColor[item.id] = item.color || "Select..."; // Ensure color selection is required
                });

            } catch (error) {
                console.error("Error fetching cart:", error);
            } finally {
                this.apiLoaded = true;
            }
        },

        async updateQuantity(id, action, size) {
            try {
                await api.post(`quantity/${id}/${action}`, { size }, {
                    tokenRequired: true
                });
                this.getCart();
            } catch (error) {
                console.error("Error updating quantity:", error);
            }
        },

        async updateSize(itemId) {
            const selectedSize = this.changedsize[itemId];
            const item = this.mycarts.find(i => i.id === itemId);
            if (!item) return;

            try {
                await api.post(`/size/${itemId}`, { size: item.size, newsize: selectedSize }, {
                    tokenRequired: true
                });

                this.updateSelectedColor(itemId);

            } catch (error) {
                console.error("Error updating size:", error);
            }
        },

        async updateSelectedColor(itemId) {
            const size = this.changedsize[itemId];
            const item = this.mycarts.find(i => i.id === itemId);
            if (!item) return;

            const color = this.selectedColor[itemId] || "Select...";

            try {
                await api.post(`/color/${itemId}`, { size, color }, {
                    tokenRequired: true
                });
            } catch (error) {
                console.error("Error updating color:", error);
            }
        },

        async deleteCart(id, size) {
            try {
                await api.post(`delete/${id}/cart`, {}, {
                    params: { size },
                    tokenRequired: true
                });
                this.getCart();
            } catch (error) {
                console.error("Error deleting cart item:", error);
            }
        }
    },

    mounted() {
        this.getCart();
    }
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
    gap: 10px;

}

.size-select .name {
    font-size: 13px;
}

.size-select select {
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ddd;
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
    /* იწყებს გაჩერებას 20px-დან */
    height: fit-content;
    /* ინარჩუნებს შიგთავსის ზომას */
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
</style>