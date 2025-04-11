<template>
    <div class="carousel-container">
        <swiper :modules="[Autoplay, Navigation, EffectFade]" :slides-per-view="1" :loop="true"
            :autoplay="{ delay: 5000, disableOnInteraction: false }" :pagination="{ clickable: true }"
            :navigation="true" :effect="'fade'" class="carousel">
            <swiper-slide v-for="(image, index) in images" :key="index">
                <a :href="image.url" target="_blank" rel="noopener noreferrer">
                    <img :src="image.media_url" class="carousel-image" alt="carousel slide" />
                </a>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import api from "@/api";

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
            images: [],
        };
    },
    methods: {
        async getbanner() {
            try {
                const response = await api.get('/banner/display');
                this.images = response.data;
                console.log(this.images);

            } catch (error) {
                console.log(error);
            }
        },
    },
    mounted() {
        this.getbanner();
    },
};
</script>


<style>
.carousel-container {
    padding: 10px;
    margin-top: 20px;
    width: 100%;
    overflow: hidden;
}

.carousel {
    width: 100%;
    height: 100%;
}

.carousel-image {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    object-fit: cover;
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


    .swiper-button-prev,
    .swiper-button-next {
        width: 5px;       
    }
}
</style>
