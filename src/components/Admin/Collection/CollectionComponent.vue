<template>
    <div>
        <h1>Collections:</h1>
        <router-link :to="{ name: 'collectioncreate' }">Create New Collection</router-link>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Header Color</th>
                    <th>Description</th>
                    <th>Discount</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="collection in collections" :key="collection.id">
                    <td>{{ collection.id }}</td>
                    <td>{{ collection.title }}</td>
                    <td :style="{ backgroundColor: collection.headerColor }">{{ collection.headerColor }}</td>
                    <td>{{ collection.description }}</td>
                    <td>{{ collection.discount }}%</td>
                    <td class="action-buttons">
                        <button @click="deletecollection(collection.id)" class="action-btn delete-btn">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                        <router-link :to="{ name: 'singlecollection', params: { id: collection.id } }" class="action-btn view-btn">
                            <i class="fa-solid fa-eye"></i> View
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: "CollectionComponent",
    data() {
        return {
            collections: [],
        }
    },
    methods: {
        async getcollection() {
            try {
                const response = await axios.get('collection/display');
                this.collections = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        async deletecollection(id) {
            const token = localStorage.getItem('token');
            try {
                await axios.post(`admin/collection/delete/${id}`, {}, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                this.collections = this.collections.filter(collection => collection.id !== id);
            } catch (error) {
                console.log(error);
            }
        }
    },
    mounted() {
        this.getcollection();
    },
}
</script>

<style scoped>


/* Table styling */
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th, td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
    font-weight: bold;
}

tbody tr:nth-child(even) {
    background-color: #f9f9f9;
}

/* Action buttons styling */
.action-buttons {
    display: flex;
    gap: 10px;
}

.action-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
}

.action-btn:hover {
    transform: translateY(-2px);
}

.delete-btn {
    background-color: #e74c3c;
}

.delete-btn:hover {
    background-color: #c0392b;
}

.view-btn {
    background-color: #3498db;
    text-decoration: none;
}

.view-btn:hover {
    background-color: #2980b9;
}
</style>
