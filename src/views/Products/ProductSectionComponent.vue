<script setup>
import ProductCardComponent from '@/components/ProductCardComponent.vue'
import SkeletonComponent from '@/components/SkeletonComponent.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['cart-updated', 'liked-message', 'cart-message'])

const props = defineProps({
    apiLoaded: { type: Boolean, required: true },
    products: { type: Array, required: true },
    sectionName: String,
    title: String
})

const page = ref(0)

// რამდენი გვერდი გვაქვს (4 პროდუქტი / 1 გვერდზე)
const slides = computed(() => Math.ceil(props.products.length / 4))
const maxPage = computed(() => slides.value - 1)

// ეს computed უკვე სწორ პროცენტზე ამოძრავებს grid-ს
const slideStyle = computed(() => ({
    transform: `translateX(-${page.value * (100 / slides.value)}%)`,
    transition: 'transform 0.5s ease-in-out',
    width: `${slides.value * 100}%`
}))

function nextPage() {
    if (page.value < maxPage.value) page.value++
}

function prevPage() {
    if (page.value > 0) page.value--
}

function handleCartUpdated(msg) {
    emit('cart-updated', msg)
}

function see(section) {
    router.push({ path: '/product', query: { section } })
}

function handleUnauthorizedLike(msg) {
    emit('liked-message', msg)
}

function handleUnauthorizedCart(msg) {
    emit('cart-message', msg)
}
</script>

<template>
    <div class="section-header" @pointerdown="see(props.sectionName)">
        <p>{{ props.title }}</p>
        <span class="arrow">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                fill="currentColor">
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </svg>
        </span>
    </div>

    <div class="main">
        <div class="move move-left" @pointerdown="prevPage">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="currentColor">
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
            </svg>
        </div>

        <div class="carousel-wrapper" style="overflow:hidden;width:100%">
            <div v-if="props.apiLoaded && props.products.length" class="product-grid" :style="slideStyle">

                <div class="slide" v-for="(s, i) in slides" :key="i">

                    <ProductCardComponent class="product-card"
                        v-for="(item, x) in props.products.slice(i * 4, i * 4 + 4)" :key="x" :initialproduct="item"
                        @cart-updated="handleCartUpdated" @liked-message="handleUnauthorizedLike"
                        @cart-message="handleUnauthorizedCart" />

                </div>

            </div>

            <div v-else class="product-grid">
                <SkeletonComponent :isMain="true" />
            </div>
        </div>

        <div class="move move-right" @pointerdown="nextPage">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="currentColor">
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </svg>
        </div>
    </div>
</template>

<style scoped>
.slide {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 5px;
}

.main {
    position: relative;
    width: 100%;
    padding: 0 40px;
    box-sizing: border-box;
}

.move {
    position: absolute;
    top: 40%;
    transform: translateY(-50%);
    z-index: 10;
    width: 42px;
    height: 42px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: #fff;
    color: #6a4a3a;
    border: 1px solid rgba(0, 0, 0, 0.07);
    transition: transform 0.25s ease;
}

.move-left {
    left: 35px;
}

.move-right {
    right: 35px;
}

.move:hover {
    transform: translateY(-50%) scale(1.1);
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 20px 0;
    cursor: pointer;
}

.section-header p {
    font-size: 20px;
    font-weight: 300;
    color: #6a4a3a;
    font-family: "Playfair Display", "Noto Serif Georgian", serif;
    letter-spacing: 0.8px;
    margin: 0;
    transition: color 0.3s ease;
}

.section-header:hover p {
    color: #8a5f3b;
}

.section-header:hover>span.arrow {
    transform: translateX(6px);
}

.section-header>span.arrow {
    display: flex;
    align-items: center;
    color: #6a4a3a;
    transition: transform 0.3s ease;
}

.product-grid {
    display: flex;
    width: 95%;
    margin: auto;
}

.product-card {
    width: calc(25% - 10px);
    flex-shrink: 0;
}
</style>
