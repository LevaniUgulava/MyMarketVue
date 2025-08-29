<template>
    <div class="categories">
        <div class="category-list">
            <div class="category-card">
                <div class="card-content">
                    <img class="cat" src="../../assets/svg/menu.svg">
                    <span>ყველა კატეგორია</span>
                </div>
            </div>

            <div v-for="category in categories" :key="category.id" class="category-card-1">
                <div class="card-content">
                    <img class="category" :src="category.image_url">
                    <span>{{ category.ka_name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api';

export default {
    data() {
        return {
            categories: [],
        };
    },
    methods: {
        async getCategory() {
            try {
                const response = await api.get('/category');
                this.categories = response.data;

            } catch (err) {
                console.log(err.message);
            }
        }
    },
    mounted() {
        this.getCategory();
    },
};
</script>

<style>
.categories {
    width: 100%;
    padding: 20px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.category-list {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    width: 100%;
}

.cat {
    width: 40px;
}

.category {
    width: 150px;
}

.category-card {
    width: 100px;
    height: 160px;
    border-radius: 10px;
    background-color: #7c317c17;
    display: flex;
    justify-content: center;
    align-items: center;
}

.category-card-1 {
    width: 150px;
    height: 150px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card-content {
    text-align: center;
}

.card-content i {
    font-size: 40px;
    color: #7c317c;
    margin-bottom: 10px;
}

.card-content span {
    font-size: 14px;
    color: #333;
    align-items: center;
    justify-content: center;
}
</style>
