<template>
    <div @pointerdown.stop.prevent="goToStatusPage">
  
        <div class="swiperbtn">
            სტატუსის მიხედვით
        </div>


    </div>

</template>

<script>
import api from '@/api';
import { authMixin } from '@/mixin/reuse';
export default {
    mixins: [authMixin],

    data() {
        return {
            status: null,
        };
    },
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
