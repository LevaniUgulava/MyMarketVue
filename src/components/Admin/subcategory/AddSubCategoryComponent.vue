<template>
    <div class="container">
        <h1>Add Category</h1>
        <form @submit.prevent="createsubCategory" class="form">
            <select v-model="maincategory_id" class="select-dropdown">
                <option disabled value="">Select Main Category...</option>
                <option v-for="category in maincategories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
             <select v-model="category_id" class="select-dropdown">
                <option disabled value="">Select Category...</option>
                <option v-for="category in filteredcategory" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
            <input class="categoryinput" type="text" v-model="name" placeholder="Enter category name" />
            <button type="submit" class="add">Add</button>
        </form>

        <table class="category-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Main Category</th>
                    <th>Sub Category</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="category in subcategories" :key="category.id">
                    <td>{{ category.id }}</td>
                    <td>{{ category.name }}</td>
                    <td>{{ category.maincategory ? category.maincategory.name : 'N/A' }}</td>
                    <td>{{ category.category ? category.category.name : 'N/A' }}</td>
                    <td>
                        <button @click="deleteCategory(category.id)" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'AddSubCategoryComponent',
    data() {
        return {
            name: '',
            maincategory_id: '',
            category_id:'',
            categories: [],
            maincategories: [],
            subcategories:[],
        };
    },
    methods: {
        async createsubCategory() {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.post(
                    'http://127.0.0.1:8000/api/admin/categories/subcategory/create',
                    {
                        name: this.name,
                        maincategory_id: this.maincategory_id,
                        category_id: this.category_id
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
                console.log('Category created successfully:', response.data);
                this.name = '';
                this.getsubCategories();
            } catch (error) {
                console.error('Error creating category:', error.response ? error.response.data : error.message);
            }
        },
        async getMainCategories() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/maincategory');
                this.maincategories = response.data;
            } catch (error) {
                console.log('Error fetching main categories:', error);
            }
        },
        async getCategories() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/category');
                this.categories = response.data;
            } catch (error) {
                console.log('Error fetching categories:', error);
            }
        },
          async getsubCategories() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/subcategory');
                this.subcategories = response.data;
            } catch (error) {
                console.log('Error fetching categories:', error);
            }
        },
        async deleteCategory(id) {
            const token = localStorage.getItem('token');
            try {
                await axios.post(`http://127.0.0.1:8000/api/admin/categories/subcategory/delete/${id}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                this.subcategories = this.subcategories.filter(category => category.id !== id);
                console.log('Category deleted successfully');
            } catch (error) {
                console.log('Error deleting category:', error);
            }
        },
    },
    mounted() {
        this.getMainCategories();
        this.getCategories();
        this.getsubCategories();
    },
    computed:{
     filteredcategory() {
      return this.categories.filter(category => category.maincategory_id === this.maincategory_id)
    }
    }
};
</script>

<style scoped>
.container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

.form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.select-dropdown {
    height: 40px;
    width: 100%;
    max-width: 600px;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    background-color: #fff;
    color: #333;
}

.categoryinput {
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
}

.add:hover {
    background-color: #45a049;
}

.category-table {
    width: 100%;
    max-width: 800px;
    margin: 20px auto;
    border-collapse: collapse;
}

.category-table th, .category-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.category-table th {
    background-color: #f2f2f2;
    font-weight: bold;
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
}

.btn-danger {
    background-color: red;
    color: white;
}

.btn-danger:hover {
    background-color: darkred;
}
</style>
