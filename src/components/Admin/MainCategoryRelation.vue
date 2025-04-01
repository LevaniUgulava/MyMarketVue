<template>
    <div>
        <table class="horizontal-table">
            <thead>
                <tr>
                    <th>მთავარი კატეგოორიის კავშირები</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="category in mainCategories" :key="category.id" @dragover.prevent
                    @drop="handleDrop(category)">
                    <td>{{ category.name }}</td>
                    <td>
                        <div class="categories-container">
                            <div v-for="subCategory in category.categories" :key="subCategory.id" class="category-item">
                                <span>{{ subCategory.name }}</span>
                                <i @click.prevent="remove(category.id, subCategory.id)"
                                    class="fa-solid fa-xmark remove"></i>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="categories-heap">
            <input type="text" v-model="searchName" class="search-bar" placeholder="Search categories by name..." />
            <div class="heap-container">
                <div v-for="category in filteredCategories" :key="category.id" class="category-item" draggable="true"
                    @dragstart="handleDragStart(category)">
                    <span>{{ category.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api';
import axios from 'axios';

export default {
    data() {
        return {
            mainCategories: [],
            categories: [],
            searchName: '',
            draggedCategory: null,
        };
    },
    computed: {
        filteredCategories() {
            if (!this.searchName) {
                return this.categories;
            }
            return this.categories.filter(subCategory =>
                subCategory.name.toLowerCase().includes(this.searchName.toLowerCase())
            );
        }
    },
    methods: {
        async getMainCategory() {
            try {
                const response = await axios.get('maincategory');
                this.mainCategories = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        async getCategory() {
            try {
                const response = await axios.get('category');
                this.categories = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        handleDragStart(category) {
            this.draggedCategory = category;
        },
        async handleDrop(mainCategory) {
            try {
                const response = await axios.post('admin/categories/assignRelation', { maincategory_id: mainCategory.id, category_id: this.draggedCategory.id }, { tokenRequired: true }
                );
                console.log(response);

                const updatedMainCategory = this.mainCategories.find(cat => cat.id === mainCategory.id);
                updatedMainCategory.categories.push(this.draggedCategory); // Assuming `categories` is an array of subcategories
            } catch (error) {
                console.log(error);
            }
        },
        async remove(categoryid, subcategoryid) {
            try {
                const response = await api.post(
                    'admin/categories/deleteRelation',
                    { maincategory_id: categoryid, category_id: subcategoryid },
                    { tokenRequired: true }
                );
                console.log(response);

                const mainCategory = this.mainCategories.find(cat => cat.id === categoryid);
                mainCategory.categories = mainCategory.categories.filter(subCategory => subCategory.id !== subcategoryid);
            } catch (error) {
                console.log(error);
            }
        }
    },
    mounted() {
        this.getMainCategory();
        this.getCategory();
    }
};
</script>

<style scoped>
.remove:hover {
    color: black;
}

.horizontal-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.horizontal-table th,
.horizontal-table td {
    padding: 12px;
    font-size: 13px;
    border: 1px solid #ddd;
    text-align: left;
}

.horizontal-table th {
    background-color: #f2f2f2;
}

.horizontal-table tbody tr {
    display: flex;
    justify-content: space-between;
}

.horizontal-table tbody td {
    flex: 1;
    text-align: left;
}

.categories-container {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.category-item {
    display: flex;
    align-items: center;
    background-color: #f1f3f3;
    padding: 5px 10px;
    border-radius: 50px;
    color: #00796b;
    font-size: 13px;
    cursor: pointer;
}

.category-item span {
    margin-right: 10px;
}

.search-bar {
    padding: 10px;
    width: 100%;
    max-width: 300px;
    margin: 20px auto;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.heap-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
</style>
