<template>
    <div class="container">
        <h1>Add Main Category</h1>
        <form @submit.prevent="createmaincategory" class="form">
            <input class="maincategoryinput" type="text" name="name" v-model="name" placeholder="Enter category name" />
            <button type="submit" class="add">Add</button>
        </form>

        <table class="category-table">
            <tr>
                <th>id</th>
                <th>Name</th>
                <th>Action</th>
            </tr>
            <tr v-for="category in maincategories" :key="category.id">
                <td>{{ category.id }}</td>
                <td>{{ category.name }}</td>
                <td>
                    <button @click="deleteCategory(category.id)" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'AddMainCategoryComponent',
    data() {
        return {
            name: '',
            maincategories: [],
        };
    },
    methods: {
        async createmaincategory() {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.post(
                    'http://127.0.0.1:8000/api/admin/categories/maincategory/create',
                    { name: this.name },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                console.log('Main category created successfully:', response.data);

                this.name = '';

                this.getmaincategory();
            } catch (error) {
                console.error('Error creating main category:', error.response ? error.response.data : error.message);
            }
        },

        async getmaincategory() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/maincategory');
                this.maincategories = response.data;
            } catch (error) {
                console.log(error);
            }
        },

        async deleteCategory(id) {
            const token = localStorage.getItem('token');

            try {
                const response = await axios.post(`http://127.0.0.1:8000/api/admin/categories/maincategory/delete/${id}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(response);
                this.maincategories = this.maincategories.filter(category => category.id !== id);

            } catch (error) {
                console.log(error);
            }
        }
    },

    mounted() {
        this.getmaincategory();
    },
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
