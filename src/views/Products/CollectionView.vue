<template>
    <div>
        <section v-if="getApiLoaded" class="collection-section">
            <div :class="['collection-grid', { 'more-than-two': sections.length > 2 }]">
                <router-link v-for="(item, index) in sections.slice(0, 2)" :key="index"
                    :to="{ name: 'productsinglecollection', params: { id: item.id } }" class="grid-item">
                    <img :src="item.media_urls">
                    <div class="product-availability">
                        <p>იხილეთ მეტი →</p>
                    </div>
                </router-link>
            </div>
        </section>
        <section v-else class="collection-section">
            <div class="collection-grid">
                <div class="grid-item-image-skeleton"></div>
                <div class="grid-item-image-skeleton"></div>
            </div>
        </section>
    </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const sections = ref([]);

const getSections = computed(() => store.getters['product/getSections']);
const getApiLoaded = computed(() => store.getters['product/getApiLoaded']);
watch([getApiLoaded, getSections], ([newApiLoaded, newSections]) => {
    if (newApiLoaded) {
        sections.value = newSections;
    }
});

</script>
<style scoped>
.collection-section {
    padding: 20px;
}

.collection-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    font-weight: 500;
    border-bottom: 1px solid #ddd;
}

.collection-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    position: relative;
    width: 100%;
}


.grid-item {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    text-decoration: none;
    transition: transform 0.3s;
    height: 70vh;
    width: 100%;
    position: relative;
}
.grid-item img {
    width: 100%;
    height: 100%;
    object-fit: fill;
    transition: transform 0.3s ease;
}


.grid-item:hover {
    transform: translateY(-5px);
}

.grid-item-image-skeleton {
    width: 100%;
    height: 460px;
    background-color: #e0e0e0;
    animation: skeleton-loading 1.5s infinite linear;
}

@keyframes skeleton-loading {
    0% {
        background-color: #e0e0e0;
    }

    50% {
        background-color: #d0d0d0;
    }

    100% {
        background-color: #e0e0e0;
    }
}

.grid-item-image {
    flex: 1;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    transition: all 0.3s ease;
}



.product-availability {
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: white;
    padding: 10px 20px;
    font-size: 0.9rem;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.grid-item:hover .product-availability {
    opacity: 1;
    visibility: visible;
}
</style>