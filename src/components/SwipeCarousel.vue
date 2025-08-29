<template>
    <div v-if="getApiLoaded" class="carousel-container">
        <swiper :modules="[Autoplay, Navigation, EffectFade]" :slides-per-view="1" :loop="true"
            :autoplay="{ delay: 5000, disableOnInteraction: false }" :pagination="{ clickable: true }"
            :navigation="true" :effect="'fade'" class="carousel">
            <swiper-slide v-for="(image, index) in getBanners" :key="index">
                <a :href="image.url" target="_blank" rel="noopener noreferrer">
                    <img :src="[isMobile ? image.media_mobile : image.media_desktop]" class="carousel-image"
                        alt="carousel slide" />
                </a>
            </swiper-slide>
        </swiper>
    </div>
    <div v-else class="carousel-container">

        <div class="carousel-skeleton">
            <div class="skeleton-image"></div>

        </div>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { mapGetters } from 'vuex';

export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    setup() {
        return {
            Autoplay,
            Navigation,
            EffectFade,
        };
    },
    data() {
        return {
            isMobile: window.innerWidth <= 768,

        };
    },
    methods: {
        handleResize() {
            this.isMobile = window.innerWidth <= 768;
        }
    },
    computed: {
        ...mapGetters('product', ["getBanners", "getApiLoaded"]),

    },

    mounted() {
        window.addEventListener('resize', this.handleResize);

    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkScreenSize);
    },
};
</script>


<style scoped>
.carousel-skeleton {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

.skeleton-image {
    width: 100%;
    height: 300px;
    background-color: #ddd;
    border-radius: 10px;
    animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
    0% {
        background-color: #f0f0f0;
    }

    50% {
        background-color: #e0e0e0;
    }

    100% {
        background-color: #f0f0f0;
    }
}

.carousel-container {
    width: auto;
    padding: 10px;
    padding-top: 30px;
    overflow: hidden;
}

.carousel {
    width: auto;
    height: 100%;
}

.carousel-image {
    display: block;
    width: 100%;
    height: 100%;
    margin: auto;
    object-fit: contain;
}



.swiper-button-prev,
.swiper-button-next {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
}

.swiper-button-prev::after,
.swiper-button-next::after {
    padding: 15px 20px;
    font-size: 20px;
    border-radius: 25px;
    color: black;
    transition: background-color 0.3s ease, color 0.3s ease;
}



.swiper-button-prev::after {
    margin-left: 20px;
}

.swiper-button-next::after {
    margin-right: 20px;
}

.swiper-button-prev:hover::after,
.swiper-button-next:hover::after {
    display: block;
    background-color: black;
    color: white;
}

@media (max-width: 768px) {

    .swiper-button-prev::after,
    .swiper-button-next::after {
        padding: 8px 10px;
        font-size: 13px;
    }

    .carousel-container {
        padding-top: 0px;

    }


    .swiper-button-prev,
    .swiper-button-next {
        width: 5px;
    }
}
</style>
