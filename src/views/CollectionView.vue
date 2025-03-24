<template>
    <div>
        <section class="collection-section" v-if="sections.length > 0">
            <div class="collection-grid">
                <router-link v-for="(item, index) in sections" :key="index"
                    :to="{ name: 'productsinglecollection', params: { id: item.id } }" class="grid-item">
                    <div class="grid-item-image" :style="{ backgroundImage: 'url(' + item.media_urls + ')' }">
                        <div class="grid-item-text">
                            <label>{{ item.title }}</label>
                            <p class="description">{{ item.description }}</p>
                            <span v-if="item.discount" class="discount">{{ item.discount }}%</span>
                        </div>
                    </div>
                    <div class="product-availability">
                        <p>იხილეთ მეტი →</p>
                    </div>
                </router-link>
            </div>
        </section>
    </div>
</template>
<script>
import api from '@/api';


export default {
    data() {
        return {
            sections: []
        }
    },
    methods: {
        async loadData() {
            try {
                const response = await api.get('collection/display');
                const sections = response.data;
                console.log(sections);
                this.sections = sections;

            } catch (error) {
                console.error('Error loading data:', error);
            }
        },
    },
    mounted() {
        this.loadData();
    }
}
</script>
<style scoped>
.collection-section {
    margin-top: 20px;
    padding: 20px;
    border-radius: 12px;
}

.collection-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    font-weight: 700;
    border-bottom: 1px solid #ddd;
}

.collection-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* Show two items per row */
    gap: 20px;
    position: relative;
    width: 100%;
}

.grid-item {
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;
    text-decoration: none;
    transition: transform 0.3s;
    height: 280px;
    width: 680px;
    position: relative;
}

.grid-item:hover {
    transform: translateY(-5px);
}

.grid-item-image {
    flex: 1;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.grid-item-text {
    position: absolute;
    color: #fff;
    padding: 20px;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: left;
}

.grid-item-text .description {
    font-size: 0.8rem;
    line-height: 1.5;
    flex-grow: 1;
}

.grid-item-text .discount {
    background: #ff5555;
    color: white;
    border-radius: 4px;
    padding: 5px 8px;
    font-size: 0.7rem;
    align-self: flex-start;
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

.show-all-collections {
    position: absolute;
    bottom: 0px;
    right: 0px;
    text-align: center;
    z-index: 1;
}

.show-all-button {
    padding: 10px 20px;
    font-size: 1rem;
    border: solid 1px black;
    color: black;
    width: 680px;
    height: 50px;
    border-radius: 25px;
    cursor: pointer;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
}


.show-all-button:hover {
    color: white;
    background-color: black;
}
</style>