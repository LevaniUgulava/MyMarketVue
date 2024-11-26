<template>
    <div>
        <!-- Main Categories -->
        <div v-if="!showMainCategory">
            <button @click="toggleMainCategory">Show Main Categories</button>
        </div>
        <div v-else>
            <button @click="toggleMainCategory">Close Main Categories</button>
        </div>

        <div class="container" v-if="showMainCategory">
            <h1>Add Main Category</h1>
            <form @submit.prevent="createMainCategory" class="form">
                <input
                    class="maincategoryinput"
                    type="text"
                    v-model="mainCategoryName"
                    placeholder="Enter main category name"
                />
                <button type="submit" class="add">Add</button>
            </form>

            <table class="category-table">
                <tr>
                    <th>Name</th>
                    <th>Action</th>
                </tr>
                <tr v-for="category in mainCategories" :key="category.id">
                    <td>{{ category.name }}</td>
                    <td>
                        <button @click="deleteMainCategory(category.id)" class="btn btn-danger">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Categories -->
        <div v-if="!showCategory">
            <button @click="toggleCategory">Show Categories</button>
        </div>
        <div v-else>
            <button @click="toggleCategory">Close Categories</button>
        </div>

        <div class="container" v-if="showCategory">
            <h1>Add Category</h1>
            <select v-model="selectedMainCategory" @change="filterCategories">
                <option value="">Select a main category...</option>
                <option v-for="category in mainCategories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
            <form @submit.prevent="createCategory" class="form">
                <input
                    class="maincategoryinput"
                    type="text"
                    v-model="categoryName"
                    placeholder="Enter category name"
                />
                <button type="submit" class="add">Add</button>
            </form>

            <table class="category-table">
                <tr>
                    <th>Name</th>
                    <th>Action</th>
                </tr>
                <tr v-if="filteredCategories.length === 0">
                    <td colspan="2">No categories available.</td>
                </tr>
                <tr v-for="category in filteredCategories" :key="category.id">
                    <td>{{ category.name }}</td>
                    <td>
                        <button @click="deleteCategory(category.id)" class="btn btn-danger">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Subcategories -->
        <div v-if="!showSubCategory">
            <button @click="toggleSubCategory">Show Subcategories</button>
        </div>
        <div v-else>
            <button @click="toggleSubCategory">Close Subcategories</button>
        </div>

        <div class="container" v-if="showSubCategory">
            <h1>Add Subcategory</h1>
            <select v-model="selectedMainCategoryForSub" @change="filterCategoriesForSub">
                <option value="">Select a main category...</option>
                <option v-for="category in mainCategories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
            <select v-model="selectedCategoryForSub" @change="filterSubCategories">
                <option value="">Select a category...</option>
                <option v-for="category in filteredCategories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
            <form @submit.prevent="createSubCategory" class="form">
                <input
                    class="maincategoryinput"
                    type="text"
                    v-model="subcategoryName"
                    placeholder="Enter subcategory name"
                />
                <button type="submit" class="add">Add</button>
            </form>

            <table class="category-table">
                <tr>
                    <th>Name</th>
                    <th>Action</th>
                </tr>
                <tr v-if="filteredSubcategories.length === 0">
                    <td colspan="2">No subcategories available.</td>
                </tr>
                <tr v-for="subcategory in filteredSubcategories" :key="subcategory.id">
                    <td>{{ subcategory.name }}</td>
                    <td>
                        <button @click="deleteSubCategory(subcategory.id)" class="btn btn-danger">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ManageCategoryComponent',
    data() {
        return {
            mainCategoryName: '',
            categoryName: '',
            subcategoryName: '',
            mainCategories: [],
            categories: [],
            filteredCategories: [],
            subcategories: [],
            filteredSubcategories: [],
            showCategory: false,
            showMainCategory: true,
            showSubCategory: false,
            selectedMainCategory: '',
            selectedMainCategoryForSub: '',
            selectedCategoryForSub: '',
        };
    },
    methods: {
        toggleMainCategory() {
            this.showMainCategory = !this.showMainCategory;
            if (this.showMainCategory) {
                this.getMainCategory();
            }
        },
        toggleCategory() {
            this.showCategory = !this.showCategory;
            if (this.showCategory) {
                this.getCategory();
            }
        },
        toggleSubCategory() {
            this.showSubCategory = !this.showSubCategory;
            if (this.showSubCategory) {
                this.getSubCategory();
            }
        },
        async createMainCategory() {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.post(
                    'admin/categories/maincategory/create',
                    { name: this.mainCategoryName },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                response
                this.mainCategoryName = '';
                this.getMainCategory();
            } catch (error) {
                console.error(error);
            }
        },
        async getMainCategory() {
            try {
                const response = await axios.get('maincategory');
                this.mainCategories = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        async deleteMainCategory(id) {
            const token = localStorage.getItem('token');
            try {
                await axios.post(`admin/categories/maincategory/delete/${id}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.mainCategories = this.mainCategories.filter(category => category.id !== id);
                this.categories = this.categories.filter(category => category.maincategory_id !== id);
                this.subcategories = this.subcategories.filter(subcategory => subcategory.maincategory_id !== id);
            } catch (error) {
                console.log(error);
            }
        },
        async createCategory() {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.post(
                    'admin/categories/category/create',
                    { name: this.categoryName, maincategory_id: this.selectedMainCategory },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                response
                this.categoryName = '';
                this.getCategory();
            } catch (error) {
                console.error(error);
            }
        },
        async getCategory() {
            try {
                const response = await axios.get('category');
                this.categories = response.data;
                this.filterCategories(); // Filter categories initially
            } catch (error) {
                console.log(error);
            }
        },
        async deleteCategory(id) {
            const token = localStorage.getItem('token');
            try {
                await axios.post(`admin/categories/category/delete/${id}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.categories = this.categories.filter(category => category.id !== id);
                this.filterCategories();
            } catch (error) {
                console.log(error);
            }
        },
        async createSubCategory() {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.post(
                    'admin/categories/subcategory/create',
                    { name: this.subcategoryName, maincategory_id: this.selectedMainCategoryForSub, category_id: this.selectedCategoryForSub },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                response
                this.subcategoryName = '';
                this.getSubCategory();
            } catch (error) {
                console.error(error);
            }
        },
        async getSubCategory() {
            try {
                const response = await axios.get('subcategory');
                this.subcategories = response.data;
                this.filterSubCategories(); // Filter subcategories initially
            } catch (error) {
                console.log(error);
            }
        },
        async deleteSubCategory(id) {
            const token = localStorage.getItem('token');
            try {
                await axios.post(`admin/categories/subcategory/delete/${id}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.subcategories = this.subcategories.filter(subcategory => subcategory.id !== id);
                this.filterSubCategories();
            } catch (error) {
                console.log(error);
            }
        },
        filterCategories() {
            if (this.selectedMainCategory) {
                this.filteredCategories = this.categories.filter(
                    category => category.maincategory_id === this.selectedMainCategory
                );
            } else {
                this.filteredCategories = this.categories; // Show all categories
            }
        },
        filterCategoriesForSub() {
            this.filteredCategories = this.categories.filter(
                category => category.maincategory_id === this.selectedMainCategoryForSub
            );
            this.selectedCategoryForSub = '';
            this.filterSubCategories(); // Reset subcategories
        },
        filterSubCategories() {
            if (this.selectedCategoryForSub) {
                this.filteredSubcategories = this.subcategories.filter(
                    subcategory => subcategory.category_id === this.selectedCategoryForSub
                );
            } else {
                this.filteredSubcategories = this.subcategories; // Show all subcategories
            }
        },
    },
    mounted() {
        this.getMainCategory();
        this.getCategory();
    },
};
</script>
<style scoped>
.container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
}

.form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}

.maincategoryinput {
    height: 40px;
    width: 100%;
    max-width: 600px;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}

.add {
    height: 40px;
    width: 100%;
    max-width: 600px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
    transition: background-color 0.3s;
}

.add:hover {
    background-color: #45a049;
}

.category-table {
    width: 100%;
    max-width: 800px;
    margin: 20px auto;
    border-collapse: collapse;
    background-color: #fdfdfd;
}

.category-table th, .category-table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
    font-size: 14px;
}

.category-table th {
    background-color: #f2f2f2;
    font-weight: bold;
    text-align: center;
    color: #555;
}

.category-table tr:nth-child(even) {
    background-color: #f9f9f9;
}

.category-table tr:hover {
    background-color: #f1f1f1;
}

.btn {
    padding: 5px 10px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
}

.btn-danger {
    background-color: #dc3545;
    color: white;
    transition: background-color 0.3s;
}

.btn-danger:hover {
    background-color: #c82333;
}

button {
    padding: 10px 20px;
    margin: 10px 0;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 16px;
}

button:hover {
    background-color: #0056b3;
}

select {
    width: 100%;
    max-width: 600px;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}
</style>
