<template>
    <div v-if="getApiLoaded" class="smallsection-container">
        <div @click="handle(item.id)" v-for="(item, index) in getBrands" :key="index" class="section">
            <div class="seperate-section">
                <img class="image" :src="item.media_url" alt="brand logo" />
            </div>
        </div>
    </div>
    <div v-else class="smallsection-container">
        <div @click="handle(item.id)" v-for="(item, index) in placeholderArray" :key="index" class="section">
            <div class="seperate-section-skeleton">
                <div class="skeleton-image"></div>
            </div>
        </div>
    </div>
</template>


<script>
import { mapGetters } from 'vuex';

export default {

    computed: {
        ...mapGetters('product', ["getBrands", "getApiLoaded"]),
        placeholderArray() {
            return Array(5).fill(null);
        }
    },
    methods: {

        handle(id) {
            const currentQuery = { ...this.$route.query };

            this.$router.push({
                path: `/product`,
                query: {
                    section: currentQuery.section || 'all',
                    brand: id || '',
                    page: 1,
                },
            });
        },
    },
}
</script>

<style scoped>
.skeleton-image {
    width: 100px;
    background-color: #ddd;
    border-radius: 10px;
}

.seperate-section-skeleton {
    background-color: #333;
    height: 100px;
    width: 100px;
    margin-top: 20px;
    border-radius: 100px;
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

.image {
    width: 100px;
    transition: width 0.5s ease, height 0.5s ease;
}

/* .name {
    display: flex;
    justify-content: center;
    transition: color 0.3s ease;
} */

.seperate-section {
    display: flex;
    align-items: center;
    align-items: center;
    padding: 5px 5px;
    background-color: transparent;
    width: auto;
    height: 100px;
    width: 100px;
    justify-content: center;
    transition: background-color 0.8s ease, border 0.8s ease;
}



.seperate-section:hover .image {
    width: 90px;
}

.seperate-section:hover .name {
    color: #333;
}

.smallsection-container {
    display: flex;
    gap: 15px;
    margin-top: 5px;
    overflow-x: auto;
    white-space: nowrap;
    max-width: 90%;
    margin: auto;
    align-items: center;
    scroll-behavior: smooth;
    font-size: 13px;
}

.section {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    justify-content: center;
    font-weight: 500;
    color: #333;
    transition: color 0.3s ease;
}

@media (max-width: 768px) {
    .image {
        width: 80px;
    }

    .smallsection-container {
        gap: 5px;
        font-size: 11px;

    }
}
</style>
