<template>
    <div v-if="props.open" class="overlay" />

    <transition name="slide-like">
        <div v-show="openLike" class="drawer like-drawer">
            <h3 class="section-title">You may also like</h3>

            <div class="product-card">
                <img src="../../assets/image-test/1.webp" />
                <div class="info">
                    <p class="name">Samantha Activewear</p>
                    <span class="price">€65,00</span>
                </div>
            </div>

            <div class="product-card">
                <img src="../../assets/image-test/2.webp" />
                <div class="info">
                    <p class="name">Green Set</p>
                    <span class="price">€79,00</span>
                </div>
            </div>
        </div>
    </transition>

    <transition name="slide-cart">
        <div v-show="openCart" class="drawer cart-drawer">
            <div class="cart-header">
                <button class="close-btn" @click="close">✕</button>
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
    </transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])
const openLike = ref(false);
const openCart = ref(false);
watch(() => props.open, (val) => {
    if (val) {
        openCart.value = true;
        setTimeout(() => { openLike.value = true }, 300); // ⏳ like drawer opens later
    } else {
        openCart.value = false;
        openLike.value = false;
    }
});
function close() {
    emit('close');
}
</script>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(0.3px);
    z-index: 10;
    opacity: 1;
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
    padding: 20px;
    border-radius: 20px;
    background: #fff;
}

.like-drawer {
    right: 420px;
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
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #2a2a2a;
}

.product-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 14px;
    margin-bottom: 14px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s;
}

.product-card img {
    width: 200px;
    height: 250px;
    object-fit: cover;
    border-radius: 10px;
}

.info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
}

.name {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 4px;
    color: #1f1f1f;
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
    position: absolute;
    top: -32px;
    right: 6px;
    background: none;
    border: none;
    font-size: 20px;
    opacity: 0.5;
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
