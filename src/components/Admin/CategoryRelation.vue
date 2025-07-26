<template>
    <div>
        <table class="horizontal-table">
            <thead>
                <tr>
                    <th>კატეგორიის კავშირები</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="category in Categories" :key="category.id" @dragover.prevent
                    @drop="() => handleDrop(category)">
                    <td>{{ category.ka_name }}</td>
                    <td>
                        <div class="categories-container">
                            <div v-for="subCategory in category.subcategories" :key="subCategory.id"
                                class="category-item">
                                <span>{{ subCategory.ka_name }}</span>
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
            Categories: [],
            subcategories: [],
            searchName: '',
            draggedCategory: null,
        };
    },
    computed: {
        filteredCategories() {
            if (!this.searchName) return this.subcategories;
            return this.subcategories.filter(subCategory =>
                subCategory.name.toLowerCase().includes(this.searchName.toLowerCase())
            );
        },
    },
    methods: {
        async getCategory() {
            try {
                const response = await api.get('admin/categories/admin/category', {
                    tokenRequired: true
                });
                this.Categories = response.data;
            } catch (error) {
                console.error('Error fetching main categories:', error);
            }
        },
        async getSubCategory() {
            try {
                const response = await api.get('subcategory', {
                    tokenRequired: true
                });
                this.subcategories = response.data;
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            }
        },
        handleDragStart(category) {
            this.draggedCategory = category;
        },
        async handleDrop(mainCategory) {
            if (!this.draggedCategory) return;

            try {
                await api.post('admin/categories/assignCategoryRelation', {
                    category_id: mainCategory.id,
                    subcategory_id: this.draggedCategory.id,
                }, {
                    tokenRequired: true
                });

                const updatedMainCategory = this.Categories.find(cat => cat.id === mainCategory.id);
                if (!updatedMainCategory.subcategories) {
                    updatedMainCategory.subcategories = [];
                }

                const alreadyExists = updatedMainCategory.subcategories.some(
                    sub => sub.id === this.draggedCategory.id
                );

                if (!alreadyExists) {
                    updatedMainCategory.subcategories.push(this.draggedCategory);
                }

                this.draggedCategory = null;
            } catch (error) {
                console.error('Error assigning relation:', error);
            }
        },
        async remove(mainCategoryId, subcategoryId) {
            try {
                await api.post('admin/categories/deleteCategoryRelation', {
                    maincategory_id: mainCategoryId,
                    category_id: subcategoryId,
                }, {
                    tokenRequired: true
                });

                const mainCategory = this.Categories.find(cat => cat.id === mainCategoryId);
                if (mainCategory && mainCategory.subcategories) {
                    mainCategory.subcategories = mainCategory.subcategories.filter(
                        sub => sub.id !== subcategoryId
                    );
                }
            } catch (error) {
                console.error('Error deleting relation:', error);
            }
        },
    },
    mounted() {
        this.getCategory();
        this.getSubCategory();
    },
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
    flex-wrap: wrap;
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
    cursor: grab;
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
