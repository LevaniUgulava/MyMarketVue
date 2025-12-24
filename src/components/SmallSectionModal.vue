<template>
    <teleport to="body">
        <transition name="overlay-fade">
            <div v-if="props.open" class="overlay" @click.self="close">
                <div class="nested-modal">
                    <div class="category">
                        <div v-for="(item, index) in categories" :key="index">
                            <h4 class="name">{{ item.name }}</h4>
                            <div v-for="(it, index) in item.sub" :key="index" class="subname">
                                {{ it }}
                            </div>

                        </div>
                    </div>
                    <div class="scroll-container">
                        <div class="scroll-images">
                            <!-- <div v-for="(item, index) in 5" :key="index">
                                <img src="https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg" alt="">
                            </div>
                            <div v-for="(item, index) in 5" :key="index">
                                <img src="https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg" alt="">
                            </div> -->
                            <img src="../../src/assets/image-test/1.jpg">
                            <img src="../../src/assets/image-test/2.jpg">
                            <img src="../../src/assets/image-test/3.jpg">
                            <img src="../../src/assets/image-test/4.jpg">
                            <img src="../../src/assets/image-test/5.jpg">

                            <img src="../../src/assets/image-test/1.jpg">
                            <img src="../../src/assets/image-test/2.jpg">
                            <img src="../../src/assets/image-test/3.jpg">
                            <img src="../../src/assets/image-test/4.jpg">
                            <img src="../../src/assets/image-test/5.jpg">


                        </div>
                    </div>


                </div>
            </div>
        </transition>
    </teleport>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    open: Boolean,
    category: Object
});
const categories = ref([
    {
        name: "ტანსაცმელი",
        sub: ['კაბა', 'შარვალი', 'მაისური', 'ცხარიუსი'],
    },
    {
        name: "ფეხსაცმელი",
        sub: ['კაბა', 'შარვალი', 'მაისური', 'ცხარიუსი'],
    },
    {
        name: "შარვალი",
        sub: ['კაბა', 'შარვალი', 'მაისური', 'ცხარიუსი'],
    },

]);
const emit = defineEmits(['update:open']);

function close() {
    emit('update:open', false);
}
</script>

<style scoped>
.overlay {
    position: fixed;
    top: var(--modal-top);
    left: 320px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    border-top: 1px solid #eaeaea;
}

.nested-modal {
    width: 1200px;
    height: 100vw;
    display: flex;
    justify-content: space-between;
    background: #fff;
    padding-left: 50px;
}

.category {
    display: flex;
    width: 600px;
    padding-top: 60px;
    justify-content: space-between;
}

.category .name {
    font-size: 20px;
}

.category .subname {
    font-size: 15px;
    line-height: 2;
}


.scroll-container {
    width: 400px;
    overflow: hidden;
    position: relative;
    justify-content: center;

}

.scroll-images {
    display: flex;
    flex-direction: column;
    animation: scrollUp 15s linear infinite;
}

.scroll-images img {
    width: 250px;
    margin-bottom: 10px;
}

/* Continuous scroll */
@keyframes scrollUp {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(-50%);
    }
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
    transition: opacity .22s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
    opacity: 0;
}
</style>
