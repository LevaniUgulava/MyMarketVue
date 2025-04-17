<template>
    <div class="smallsection-container">
        <div @click="handle(item.id)" v-for="(item, index) in brands" :key="index" class="section">
            <div class="seperate-section">
                <img class="image" :src="item.media_url" alt="brand logo" />
            </div>
            <span class="name">{{ item.name }}</span>
        </div>
    </div>
</template>


<script>
import api from '@/api';

export default {
    data() {
        return {
            brands: []
        }
    },
    methods: {
        async display() {
            try {
                const response = await api.get("/brand/display");

                this.brands = response.data;

            } catch (error) {
                console.log(error.response)
            }

        },
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
    mounted() {
        this.display();
    },
}
</script>

<style scoped>
.image {
    width: 60px;
    transition: width 0.5s ease, height 0.5s ease;
}

.name {
    display: flex;
    justify-content: center;
    transition: color 0.3s ease;
}

.seperate-section {
    display: flex;
    align-items: center;
    align-items: center;
    padding: 5px 5px;
    border-radius: 10px;
    background-color: transparent;
    border: 1.5px solid #e0e0e0;
    width: auto;
    height: 70px;
    width: 70px;
    justify-content: center;
    transition: background-color 0.8s ease, border 0.8s ease;
}

.seperate-section:hover {
    background-color: #fff;
    border: 1.5px solid #cac9c9;
}

.seperate-section:hover .image {
    width: 63px;
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
        width: 50px;
    }

    .smallsection-container {
        gap: 5px;
        font-size: 11px;

    }
}
</style>
