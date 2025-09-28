<template>
    <div @pointerdown.stop.prevent="goToStatusPage">
        <!-- <swiper v-if="isAuth" :modules="[Autoplay, EffectFade]" :slidesPerView="1" :loop="false"
            :autoplay="{ delay: 10000, disableOnInteraction: false }" :pagination="{ clickable: false }"
            :navigation="false"> -->

        <!-- <swiper-slide> -->
        <div class="swiperbtn">
            სტატუსის მიხედვით
        </div>
        <!-- </swiper-slide> -->

        <!-- <swiper-slide>
                <CountDownComponent v-if="status && status.userstatus_time && status.end_time" class="swiperbtn"
                    :startTime="new Date()" :endTime="new Date(status.end_time)" />

            </swiper-slide> -->
        <!-- </swiper> -->

        <!-- <div v-else class="swiperbtn">
            სტატუსის მიხედვით
        </div> -->

    </div>

</template>

<script>
import api from '@/api';
// import CountDownComponent from '../CountDownComponent.vue';

// import { Swiper, SwiperSlide } from "swiper/vue";
// import { Autoplay, EffectFade } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/effect-fade";
import { authMixin } from '@/mixin/reuse';
export default {
    mixins: [authMixin],
    components: {
        // CountDownComponent,
        // Swiper,
        // SwiperSlide,
    },
    data() {
        return {
            status: null,
        };
    },
    // setup() {
    //     return {
    //         Autoplay,
    //         EffectFade,
    //     };
    // },
    methods: {
        async goToStatusPage() {
            this.$router.push('/exclusive')
        },
        async getExclusive() {
            try {
                const statusResponse = await api.get('/current/status', {
                    tokenRequired: true,
                });

                this.status = statusResponse.data.status;


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
    },
    mounted() {
        if (this.isAuth) {
            this.getExclusive();
        }

    },
};
</script>

<style scoped>
.swiperbtn {
    font-weight: 600;
    text-align: center;
    z-index: 10;
    opacity: 1;
    color: white;
    font-size: 13px;
    padding: 5px 10px;
    transition: opacity 1s ease-in-out;
}

.swiper-slide-active .swiperbtn {
    opacity: 1;
}

.swiper-slide-next .swiperbtn,
.swiper-slide-prev .swiperbtn {
    opacity: 0;
}

@media (max-width: 768px) {
    .swiperbtn {
        font-size: 11px;
    }
}
</style>
