<template>
    <div>
        <div class="buttons">
            <button @click="toggleMainCategory" :class="{ active: showMainCategory }">
                მთავარი კატეგორია
            </button>

            <button @click="toggleCategory" :class="{ active: showCategory }">
                კატეგორია
            </button>

            <button @click="toggleSubCategory" :class="{ active: showSubCategory }">
                ქვეკატეგორია
            </button>
            <button @click="redirectmain">
                მთავარი კატეგოორიის კავშირები
            </button>
            <button @click="redirectcat">
                კატეგოორიის კავშირები
            </button>
        </div>

        <div class="container" v-if="showMainCategory">
            <h1>Add Main Category</h1>
            <form @submit.prevent="createMainCategory" class="form">
                <input class="maincategoryinput" type="text" v-model="mainCategoryName"
                    placeholder="Enter main category name" />
                <button type="submit" class="add">დამატება</button>
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


        <div class="container" v-if="showCategory">
            <h1>Add Category</h1>
            <form @submit.prevent="createCategory" class="form">
                <input class="maincategoryinput" type="text" v-model="categoryName" placeholder="Enter category name" />
                <button type="submit" class="add">დამატება</button>
            </form>

            <table class="category-table">
                <tr>
                    <th>Name</th>
                    <th>Action</th>
                </tr>
                <tr v-if="categories.length === 0">
                    <td colspan="2">No categories available.</td>
                </tr>
                <tr v-for="category in categories" :key="category.id">
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


        <div class="container" v-if="showSubCategory">
            <h1>Add Subcategory</h1>
            <form @submit.prevent="createSubCategory" class="form">
                <input class="maincategoryinput" type="text" v-model="subcategoryName"
                    placeholder="Enter subcategory name" />
                <button type="submit" class="add">დამატება</button>
            </form>

            <table class="category-table">
                <tr>
                    <th>Name</th>
                    <th>Action</th>
                </tr>
                <tr v-if="subcategories.length === 0">
                    <td colspan="2">No subcategories available.</td>
                </tr>
                <tr v-for="subcategory in subcategories" :key="subcategory.id">
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
            showMainCategory: false,
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
            this.showCategory = false;
            this.showSubCategory = false;
        },
        toggleCategory() {
            this.showCategory = !this.showCategory;
            if (this.showCategory) {
                this.getCategory();
            }
            this.showMainCategory = false;
            this.showSubCategory = false;
        },
        toggleSubCategory() {
            this.showSubCategory = !this.showSubCategory;
            if (this.showSubCategory) {
                this.getSubCategory();
            }
            this.showMainCategory = false;
            this.showCategory = false;
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
                    { name: this.categoryName },
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
            } catch (error) {
                console.log(error);
            }
        },
        async createSubCategory() {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.post(
                    'admin/categories/subcategory/create',
                    { name: this.subcategoryName },
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
            } catch (error) {
                console.log(error);
            }
        },

        redirectmain() {
            this.$router.push('/admin/mainrelation');
        },
        redirectcat() {
            this.$router.push('/admin/categoryrelation');

        }
    },
    mounted() {
        this.getMainCategory();
        this.getCategory();
        this.getSubCategory();
    },
};
</script>
<style scoped>
.buttons {
    display: flex;
    gap: 10px;
}

.container {
    padding: 20px;
    margin: 0 auto;
    border-radius: 10px;
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

.buttons button.active {
    background-color: #000000;
    color: white;

    border: none;
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
    background-color: #010101;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
    transition: background-color 0.3s;
}



.category-table {
    width: 100%;
    max-width: 800px;
    margin: 20px auto;
    border-collapse: collapse;
    background-color: #fdfdfd;
}

.category-table th,
.category-table td {
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
    background-color: white;
    border: 1.5px solid #ddd;
    color: #3b3838;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 16px;
}

button:hover {
    border: 1.5px solid #767373;

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
