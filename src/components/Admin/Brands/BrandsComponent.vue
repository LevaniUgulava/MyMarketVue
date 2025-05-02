<template lang="">
    <a href="/admin/brands/action">მოქმედებები</a>
    <div v-if="brands.length > 0 && !loading" class="brand-container">
        <div v-for="(item, index) in brands" :key="index" class="brand-item">
            <h3 class="brand-name">{{ item.name }}</h3>
            <img :src="item.media_url" alt="Brand Image" class="brand-image" v-show="item.isVisible">
            
            <div class="action-buttons">
                <button @click="deleteBrand(item.id)" class="delete-button"><i class="fa-solid fa-trash"></i></button>
                <button @click="toggleVisibility(item)" :class="['visibility-button', item.active ? 'active' : 'inactive']">
                    <i :class="item.active ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"></i>
                </button>
            </div>
        </div>
    </div>
    <div v-else-if="!loading" class="empty-state">
        <p>გთხოვთ, დაამატოთ ბრენდები!</p>
    </div>
</template>

<script>
import api from '@/api';

export default {
    data() {
        return {
            brands: [],
            loading: true, 
        }
    },
    methods: {
        async brandsdisplay() {
            try {
                const response = await api.get('admin/brand/display', {
                    tokenRequired: true
                });
                this.brands = response.data.map(brand => ({
                    ...brand,
                    isVisible: true
                }));
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false; // Set loading to false after data is fetched
            }
        },
        async deleteBrand(brandId) {
            try {
                await api.delete(`admin/brand/delete/${brandId}`, {
                    tokenRequired: true
                });
                this.brands = this.brands.filter(item => item.id !== brandId);
            } catch (error) {
                console.error(error);
            }
        },
        async active(id) {
            try {
                await api.post(`admin/brand/active/${id}`, {}, {
                    tokenRequired: true
                });
                const brand = this.brands.find(brand => brand.id === id);
                if (brand) {
                    brand.active = true;
                }
            } catch (error) {
                console.log(error);
            }
        },
        async notactive(id) {
            try {
                await api.post(`admin/brand/notactive/${id}`, {}, {
                    tokenRequired: true
                });
                const brand = this.brands.find(brand => brand.id === id);
                if (brand) {
                    brand.active = false;
                }
            } catch (error) {
                console.log(error);
            }
        },
        async toggleVisibility(item) {
            if (item.active) {
                this.notactive(item.id);
            } else {
                this.active(item.id);
            }
        }
    },
    mounted() {
        this.brandsdisplay();
    },
}
</script>

<style scoped>
.brand-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
    padding: 20px;
}

.brand-item {
    background-color: #f4f4f4;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.brand-name {
    font-size: 13px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
}

.brand-image {
    max-width: 100%;
    height: 100px;
    border-radius: 5px;
}

.action-buttons {
    display: flex;
    justify-content: center;
}

.visibility-button {
    padding: 5px 10px;
    margin: 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: #fff;

    font-size: 14px;
    transition: background-color 0.3s;
}

.visibility-button.active {
    background-color: #4caf50;
}

.visibility-button.inactive {
    background-color: #ff9800;
}

.delete-button {
    padding: 5px 10px;
    margin: 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    color: #fff;
    background-color: #f44336;
    transition: background-color 0.3s;
}

.delete-button:hover {
    background-color: #d32f2f;
}

.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    background-color: #f1f1f1;
    color: #888;
    font-size: 16px;
    border-radius: 10px;
    text-align: center;
}

.empty-state p {
    margin: 0;
    font-weight: bold;
}
</style>
