<template>
    <div>
        <h2>Collection Name: {{ collection.title }}</h2>
        <p><strong>Description:</strong> {{ collection.description }}</p>
        <p><strong>Header Color:</strong> <span :style="{ backgroundColor: collection.headerColor, padding: '5px' }">{{ collection.headerColor }}</span></p>
        <p><strong>Discount:</strong> {{ collection.discount }}%</p>

        <h3>Added Product List</h3>
        <table v-if="collection.products && collection.products.length">
            <thead>
                <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Discounted Price</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in collection.products" :key="product.id">
                    <td>{{ product.id }}</td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.description }}</td>
                    <td>{{ product.price }}</td>
                    <td>{{ product.discountprice }}</td>
                </tr>
            </tbody>
        </table>
        <p v-else>No products found in this collection.</p>

        <!-- All Products List -->
        <h3>All Products List</h3>
        <table v-if="allProducts.length">
            <thead>
                <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Add to Collection</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in allProducts" :key="product.id">
                    <td>{{ product.id }}</td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.description }}</td>
                    <td>{{ product.price }}</td>
                    <td>
                        <button @click="addProductToCollection(product.id)">Add</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <p v-else>No other products found.</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'SingleCollectionView',
    props: ['id'],
    data() {
        return {
            collection: {}, // Store collection data here
            allProducts: [] // Store all products here
        };
    },
    methods: {
        async getsinglecollection() {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`/admin/collection/${this.id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                this.collection = response.data.collection;
            } catch (error) {
                console.error("Error fetching collection data:", error);
            }
        },
        async getAllProducts() {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('display', {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    params:{
                        section:"all"
                    }
                });

                this.allProducts = response.data.all.filter(product => 
                    !this.collection.products.some(p => p.id === product.id)
                );
            } catch (error) {
                console.error("Error fetching all products:", error);
            }
        },

        async addProductToCollection(productid){
                        const token = localStorage.getItem('token');

            try{
                const response=await axios.post(`admin/collection/addtocollection/${this.id}/product/${productid}`,{},{
                    headers:{
                        'Authorization':`Bearer ${token}`
                    }
                });
                this.getsinglecollection();
                this.getAllProducts();
                console.log(response)
            }catch(error){
                console.log(error);
            }

        }
     
    },
    mounted() {
        this.getsinglecollection(); // Fetch collection data
        this.getAllProducts(); // Fetch all products
    }
};
</script>

<style scoped>
/* Basic styling */
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
    font-weight: bold;
}

tbody tr:nth-child(even) {
    background-color: #f9f9f9;
}

h2 {
    color: #2c3e50;
}

h3 {
    margin-top: 20px;
}

p {
    margin: 5px 0;
}
</style>
