<template>
    <div v-if="props.open" class="overlay" @pointerdown="close" />


    <transition name="slide-like">
        <!-- v-show="openLike"  -->
        <div v-show="openLike" class="drawer like-drawer">
            <h3 class="section-title">შენს გემოვნებაზე მორგებული</h3>

            <div class="carousel">
                <div v-show="buttonPervVisible" class="move move-up" @pointerdown="prevPage">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="#e3e3e3">
                        <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
                    </svg>
                </div>

                <div v-for="item in visible" :key="item.name" class="product-card">
                    <img :src="item.img" />
                    <div class="info">
                        <div class="name">{{ item.name }}</div>
                        <span class="price">{{ item.price }}</span>
                    </div>
                </div>

                <div v-show="buttonNextVisible" class="move move-down" @pointerdown="nextPage">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="#e3e3e3">
                        <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                    </svg>
                </div>
            </div>


        </div>
    </transition>

    <transition name="slide-cart">

        <div v-show="openCart" class="drawer cart-drawer">
            <div>
                <button @pointerdown="close" class="close-btn">

                    <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px"
                        fill="currentcolor">
                        <path
                            d="M256-227.69 227.69-256l224-224-224-224L256-732.31l224 224 224-224L732.31-704l-224 224 224 224L704-227.69l-224-224-224 224Z" />
                    </svg>

                </button>
            </div>
            <div v-if="!apiLoaded" class="skeleton">
                Loading carts...
            </div>
            <!-- v-show="openCart" -->
            <div v-if="apiLoaded && mycarts.length > 0" class="cart">
                <div class="cart-container" v-for="(item, index) in mycarts" :key="item.id ?? index">
                    <div class="image">
                        <img :src="item.image_urls[0]" alt="Product Image" class="img" />
                    </div>

                    <div class="cart-body">
                        <p class="title">{{ item.name }}</p>
                        <p class="info">ზომა - {{ item.size[0].size }}</p>
                        <p class="info">ფერი - {{ item.size[0].details[0].color }}</p>
                        <p class="price">
                            <span class="current">{{ item.price }} ₾</span>
                            <span v-if="item.old_price" class="old">{{ item.old_price }} ₾</span>
                            <span v-if="item.discount" class="discount">-{{ item.discount }}%</span>
                        </p>
                        <div class="quantity-control">
                            <div class="increment-wrapper">
                                <div v-if="quantitydemessage[item.pivot.id]" class="popup-message">
                                    {{ quantitydemessage[item.pivot.id] }}
                                    <div class="arrow-down"></div>
                                </div>
                            </div>
                            <button class="quantitybtn"
                                @pointerup.stop.prevent="updateQuantity(item.pivot.id, 'decrement')">-</button>
                            <span class="quantity">{{ item.pivot.quantity }}</span>
                            <div class="increment-wrapper">
                                <div v-if="quantitymessage[item.pivot.id]" class="popup-message">
                                    {{ quantitymessage[item.pivot.id] }}
                                    <div class="arrow-down"></div>
                                </div>
                            </div>
                            <button class="quantitybtn"
                                @pointerup.stop.prevent="updateQuantity(item.pivot.id, 'increment')">+</button>
                        </div>
                    </div>
                </div>
                <div class="checkout">
                    <!-- <h3 class="section-title">შეკვეთა</h3> -->
                    <div class="details-row">

                        <div class="detail">
                            <span>პროდუქტების რაოდენობა</span>
                            <span class="value">{{ cartQuantity }}</span>
                        </div>
                        <div class="detail">
                            <span>სულ თანხა</span>
                            <span class="value">{{ allprice }} ₾</span>
                        </div>
                    </div>

                    <button class="checkbtn" @pointerup.stop.prevent="checkout">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                            fill="#e3e3e3">
                            <path
                                d="m480-560-56-56 63-64H320v-80h167l-64-64 57-56 160 160-160 160ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z" />
                        </svg> ყიდვის გაგრძელება
                    </button>
                </div>
            </div>
            <div v-else>
                <div class="cart-header">
                    <h2>Your cart is empty</h2>
                    <p>If you don't know where to start, try these collections.</p>
                </div>

                <div class="collections">
                    <div class="collection">Activewear</div>
                    <div class="collection">Best Sellers</div>
                    <div class="collection">Dresses</div>
                    <div class="collection">Lingerie</div>
                    <div class="collection">New Arrivals</div>
                </div>
            </div>

        </div>
    </transition>
</template>

<script setup>
import api from '@/api';
import { computed, onMounted, ref, watch } from 'vue';
import { globalCartUpdateVariable } from '@/store/cart';

import img1 from "@/assets/image-test/1.webp"
import img2 from "@/assets/image-test/2.webp"
import img3 from "@/assets/image-test/3.jpg"
import img4 from "@/assets/image-test/4.jpg"
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';


const router = useRouter();
const store = useStore();
const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])
const openLike = ref(false);
const openCart = ref(false);
const mycarts = ref([]);
const apiLoaded = ref(false);
const allprice = ref(0);
const quantitymessage = ref({});
const message = ref('');
const quantitydemessage = ref({});
const index = ref(0)
function nextPage() {

    if (index.value < products.value.length - 1) {
        index.value++
    } else {
        index.value = 0;
    }
}
const products = ref([
    { img: img1, name: "Samantha Activewear", price: "€65,00" },
    { img: img2, name: "Green Set", price: "€79,00" },
    { img: img3, name: "Black Hoodie", price: "€55,00" },
    { img: img4, name: "Sport Pants", price: "€49,00" }
])
function prevPage() {

    if (index.value > 0) {
        index.value--
    } else {
        index.value = products.value.length - 1
    }
}
const buttonPervVisible = computed(() => {
    return index.value !== 0
})

const buttonNextVisible = computed(() => {
    return index.value < products.value.length - 1
})


const visible = computed(() => {
    return [
        products.value[index.value],
        products.value[(index.value + 1) % products.value.length]
    ]
})




watch(() => props.open, (val) => {
    if (val) {
        openCart.value = true;
        setTimeout(() => { openLike.value = true }, 300);
    } else {
        openCart.value = false;
        openLike.value = false;
    }
});
let cursorTimer = null

watch(() => props.open, (isOpen) => {
    clearTimeout(cursorTimer)

    if (!isOpen) {
        document.querySelector('.overlay')?.style.removeProperty('cursor')
        return
    }

    cursorTimer = setTimeout(() => {
        const overlay = document.querySelector('.overlay')
        if (!overlay) return

        overlay.style.cursor =
            `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 -960 960 960'><path fill='white' d='m336-316 144-144 144 144 20-20-144-144 144-144-20-20-144 144-144-144-20 20 144 144-144 144 20 20Zm144.17 184q-72.17 0-135.73-27.39-63.56-27.39-110.57-74.35-47.02-46.96-74.44-110.43Q132-407.65 132-479.83q0-72.17 27.39-135.73 27.39-63.56 74.35-110.57 46.96-47.02 110.43-74.44Q407.65-828 479.83-828q72.17 0 135.73 27.39 63.56 27.39 110.57 74.35 47.02 46.96 74.44 110.43Q828-552.35 828-480.17q0 72.17-27.39 135.73-27.39 63.56-74.35 110.57-46.96 47.02-110.43 74.44Q552.35-132 480.17-132Z'/></svg>"), auto`
    }, 180)
})
function close() {
    emit('close');
}
async function getCart() {
    try {
        const response = await api.get('mycart', { tokenRequired: true });
        mycarts.value = response.data.products;
        allprice.value = response.data.totalPrice;
    } catch (error) {
        console.error("Error during getCart:", error);
    } finally {
        apiLoaded.value = true;
    }
}

async function checkout() {
    try {
        const mappedcart = getMappedCart();
        console.log(mappedcart);
        await api.post("/temporder", { products: mappedcart }, { tokenRequired: true });
        router.push({ name: "checkout" });
        await store.dispatch('auth/dashboardInfo', null, { root: true });
        close();
    } catch (error) {
        handleCheckoutError(error);
    }
}
function handleCheckoutError(error) {
    console.log(error);
    if (error.response?.status === 403) {
        message.value = `ელფოსტა არ არის ვერიფიცირებული, <a href='/profile' style="color:white" target='_blank'>დაადასტურეთ აქ</a>`;
    }
}
function getMappedCart() {
    return mycarts.value.map(item => mapCartItem(item)).filter(Boolean);
}
function mapCartItem(item) {
    return {
        quantity: item.pivot.quantity || 1,
        name: item.name,
        product_id: item.id,
        type: "cart",
        seeOriginal: item.pivot.isOriginal,
        color: item.pivot.color,
        size: item.pivot.size,
        retail_price: item.pivot.retail_price,
        total_price: item.pivot.total_price,
    };
}


watch(globalCartUpdateVariable, () => {
    getCart()
})
async function showMessage(message, field, id) {
    field.value[id] = message;
    await new Promise(resolve => setTimeout(resolve, 4000));
    field.value[id] = '';
}
async function updateQuantity(id, action) {

    const item = mycarts.value.find(i => i.pivot.id === id);
    if (!item) return;
    try {
        if (action === 'increment') {
            if (item.pivot.quantity >= item.size[0].details[0].quantity) {
                showMessage("მაქსიმალური რაოდენობა", quantitymessage, id);
                return;
            }
        } else if (action === 'decrement') {
            if (item.pivot.quantity <= 1) {
                showMessage("ნაკლები რაოდენობა არ შეიძლება", quantitydemessage, id);
                return;
            }
        }
        const response = await api.post(`quantity/${id}/${action}`, {}, { tokenRequired: true });
        item.pivot.quantity = response.data.quantity;
        item.pivot.total_price = response.data.total_price;
        allprice.value = response.data.cart_total_price

    } catch (error) {
        console.log(error);
    }
}

onMounted(() => {
    getCart();
})

</script>

<style scoped>
.carousel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    gap: 5px;
    padding-top: 20px;

}

.product-card {
    max-width: 100%;
    border-radius: 18px;
    transform: translateY(0);
    transition: transform 0.6s ease-in-out;
}

.product-card img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 14px;
}

/* .product-card .info {
    margin-top: 6px;
    text-align: center;
} */

.product-card .name {
    font-size: 15px;
    font-weight: 600;
    color: #222;
    margin-bottom: 2px;
}

.product-card .price {
    font-size: 14px;
    font-weight: 500;
    color: #6a4a3a;
}

/* ARROW BUTTONS */
.move {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    width: 44px;
    height: 44px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s ease;
}

.move-up {
    top: -20px;
}

.move-down {
    bottom: -30px;
}

.move:hover {
    transform: translateX(-50%) scale(1.1);
}




.checkout {
    position: absolute;
    bottom: 0;
    background: #fff;
    border-radius: 16px;
    padding-bottom: 16px;
    width: 100%;
    max-width: 360px;
}



.details-row {
    display: grid;
    gap: 8px;
    margin-bottom: 14px;
}

.detail {
    display: flex;
    justify-content: space-between;
    background: #f8f8f8;

    padding: 10px 12px;
    border-radius: 10px;
    font-size: 14px;
    color: #444;
}


.detail .value {
    font-weight: 700;
    color: #000;
}

.checkbtn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    background: #162e63;
    border: none;
    padding: 12px;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    border-radius: 12px;
    cursor: pointer;
    transition: 0.2s;
}

.checkbtn:hover {
    opacity: 0.88;
}

.quantity-control {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 8px;
    width: fit-content;
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

.cart-body {
    margin-bottom: 30px;
}

.cart-body .title {
    font-size: 14px;
    color: #3b3933;
    margin-top: 0;
    margin-bottom: 6px;
    font-weight: 500;
}

.cart-body .info {
    font-size: 14px;
    color: #3b3933cc;
    font-weight: 400;
    margin: 2px 0;
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
}

.price {
    margin-top: 8px;
    font-size: 15px;
}

.price .current {
    font-size: 16px;
    color: #3b3933cc;
    font-weight: 700;
}

.price .old {
    text-decoration: line-through;
    color: #888;
    margin-left: 6px;
}

.price .discount {
    background: #e5f8e7;
    color: #2d7a32;
    font-weight: 600;
    margin-left: 8px;
    padding: 2px 6px;
    border-radius: 6px;
    font-size: 13px;
}

.cart {
    height: 60vh;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    margin-top: 50px;
}


.cart-container {
    display: flex;
    gap: 12px;
    padding: 10px;
    border-radius: 12px;
    background: #fff;
    margin-bottom: 10px;
    align-items: center;
}

.image img {
    width: 150px;
    aspect-ratio: 3/4;
    object-fit: cover;
    border-radius: 8px;
}

.skeleton {
    padding: 20px;
    text-align: center;
    color: #666;
}

.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(0.3px);
    z-index: 10;
    opacity: 1;
    will-change: cursor;

    animation: fadeIn 0.25s ease forwards;


}



@keyframes fadeIn {
    to {
        opacity: 1;
    }
}

.drawer {
    position: fixed;
    top: 20px;
    bottom: 20px;
    background: #fafafa;
    z-index: 30;
}

.cart-drawer {
    right: 20px;
    width: 380px;
    border-radius: 20px;
    background: #fff;
}

.like-drawer {
    right: 380px;
    width: 250px;
    padding: 20px 40px 20px 20px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    background: #fafafa;
}

/* CART: width + right(20px) => სრულად რომ გავიდეს */
.slide-cart-enter-active,
.slide-cart-leave-active {
    transition: transform 0.5s ease;
}

.slide-cart-enter-from,
.slide-cart-leave-to {
    transform: translateX(calc(100% + 20px));
}

.slide-cart-enter-to,
.slide-cart-leave-from {
    transform: translateX(0);
}

.slide-like-enter-active,
.slide-like-leave-active {
    transition: transform 0.5s ease;
}

.slide-like-enter-from,
.slide-like-leave-to {
    transform: translateX(calc(100% + 420px));
}

.slide-like-enter-to,
.slide-like-leave-from {
    transform: translateX(0);
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
    color: #2a2a2a;
}


.price {
    font-size: 14px;
    opacity: 0.6;
    color: #000;
}

.cart-header {
    text-align: center;
    margin-top: 40px;
    position: relative;
}

.cart-header h2 {
    font-size: 24px;
    font-weight: 700;
    color: #111;
    margin-bottom: 6px;
}

.cart-header p {
    font-size: 13px;
    opacity: 0.6;
    margin-bottom: 22px;
}



.close-btn {
    right: 30px;
    opacity: 0.5;
    position: absolute;
    background: none;
    border: none;
    z-index: 50;
    top: 30px;
    font-size: 20px;
    cursor: pointer;
    transition: opacity 0.2s;

}



.collections {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.collection {
    background: #fafafa;
    padding: 14px 16px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    color: #222;
    cursor: pointer;
    transition: background 0.2s;
}
</style>
