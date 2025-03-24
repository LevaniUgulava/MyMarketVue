<template>
    <div class="carousel-container">
        <swiper :modules="[Autoplay, Navigation, Pagination, EffectFade]" :slides-per-view="1" :loop="true"
            :autoplay="{ delay: 30000, disableOnInteraction: false }" :pagination="{ clickable: true }"
            :navigation="true" :effect="'fade'" class="carousel">
            <swiper-slide v-for="(image, index) in images" :key="index">
                <img :src="image" class="carousel-image" alt="carousel slide" />
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    setup() {
        return {
            Autoplay,
            Navigation,
            Pagination,
            EffectFade,
        };
    },
    data() {
        return {
            images: [
                "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=1080&fit=max",
                "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1080&fit=max",
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1080&fit=max",
                "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080&fit=max",
                "https://images.unsplash.com/photo-1557683316-973673baf926?w=1080&fit=max"
            ]

        };
    },
};
</script>

<style>
.carousel-container {
    padding: 0;
    margin: 0;
    width: 100%;
    max-width: 100%;
    height: 60vh;
    overflow: hidden;
}

.carousel {
    width: 100%;
    height: 95%;
    margin-top: 30px;
}

.carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.swiper-button-prev,
.swiper-button-next {
    display: none;
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
    display: none;

    background-color: #fff;
    padding: 15px 20px;
    font-size: 15px;
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
    .carousel-container {
        height: 40vh;
    }
}
</style>
