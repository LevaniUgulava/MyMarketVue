<template lang="html">
    <div>
        <swiper :modules="[Autoplay, EffectFade]" :slides-per-view="1" :loop="true"
            :autoplay="{ delay: 3000, disableOnInteraction: false }" :pagination="{ clickable: false }"
            :navigation="false" :effect="'fade'">
            <swiper-slide v-for="(item, index) in texts" :key="index">
                <div class="slide-content">{{ item }}</div>
            </swiper-slide>

        </swiper>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
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
            EffectFade,
        };
    },
    data() {
        return {
            texts: [
                "ვებ-გვერდი არის სატესტო რეჟიმში adsasdasd",
                "მიიღე ფასდაკლება პრომო კოდით adasdasda"
            ],
        };
    },
    methods: {

    },
};
</script>

<style scoped>
.swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 100%;
}

.slide-content {
    z-index: 10;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
}

.swiper-slide-active .slide-content {
    opacity: 1;
}

.swiper-slide-next .slide-content,
.swiper-slide-prev .slide-content {
    opacity: 0;
}
</style>
