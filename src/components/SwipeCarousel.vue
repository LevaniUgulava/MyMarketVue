<template>
    <div v-if="getApiLoaded" class="carousel-container">
        <div v-for="(item, index) in getBanners" :key="index">
            <img v-if="index === activeIndex" :src="item.media_desktop" class="carousel-image">


            <div v-if="index === activeIndex" class="overlay">
                <div class="container">
                    <button class="overlay-button">გაგაგრძელე</button>
                </div>
            </div>
        </div>

        <div class="custom-pagination">
            <span v-for="(image, index) in getBanners" :key="index" :class="{ 'active': activeIndex === index }"
                @click="goToSlide(index)" class="bullet"></span>
        </div>

    </div>

    <div v-else class="carousel-container">

        <div class="carousel-skeleton">
            <div class="skeleton-image"></div>

        </div>
    </div>
</template>

<script setup>

import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from 'vuex'
const store = useStore()
const activeIndex = ref(0);
const timer = 10000;
const isMobile = ref(window.innerWidth <= 768);

function handleResize() {
    isMobile.value = window.innerWidth <= 768;
}
function startAutoplay() {
    autoplayInterval = setInterval(goToNextSlide, timer);
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
}
function goToSlide(index) {
    activeIndex.value = index;
    stopAutoplay();
    startAutoplay();
}

const getBanners = computed(() => {
    return store.getters['product/getBanners']
})
const getApiLoaded = computed(() => {
    return store.getters['product/getApiLoaded']
})
function goToNextSlide() {
    activeIndex.value = (activeIndex.value + 1) % getBanners.value.length;

}

let autoplayInterval = null;


onMounted(() => {
    window.addEventListener('resize', handleResize);
    autoplayInterval = setInterval(goToNextSlide, timer);
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    clearInterval(autoplayInterval);
});


</script>


<style scoped>
:global(body) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


.custom-pagination {
    display: flex;
    margin-top: 15px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px;
    gap: 5px;
}

.bullet {
    height: 10px;
    width: 10px;
    background-color: #ccc;
    border-radius: 100%;
}

.custom-pagination .active {
    width: 25px;
    height: 8px;
    border-radius: 10px;
    background-color: blue;
}

.carousel-skeleton {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

.skeleton-image {
    width: 100%;
    height: 450px;
    border-radius: 15px;
    background-color: #ccc;
    animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
    0% {
        background-color: #ccc;
    }

    50% {
        background-color: #e0e0e0;
    }

    100% {
        background-color: #ccc;
    }
}

.carousel-container {
    width: 98%;
    height: 450px;
    margin: auto;
    padding-top: 10px;
    border-radius: 10px;
    overflow: hidden;
}

.carousel-image {
    position: relative;
    width: 98%;
    height: 450px;

}

.overlay {
    position: absolute;
    top: 120px;
    left: 50px;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
}

.container {
    text-align: center;
    color: white;
}

.overlay-text {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
}

.overlay-button {
    background-color: #162e63;
    border: none;
    color: white;
    font-size: 14px;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.overlay-button:hover {
    background-color: #d04b1f;
}


.carousel-container img {

    display: block;
    object-position: top;
    border-radius: 15px;
    margin: auto;
    transition: opacity 1s ease-in-out;
    object-fit: cover;
}



@media (max-width: 768px) {
    .carousel-container {
        padding-top: 0px;

    }
}
</style>
