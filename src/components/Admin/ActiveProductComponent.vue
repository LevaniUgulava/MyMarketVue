<template lang="">
    <div>
        <table>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>MainCategory</th>
                <th>Category</th>
                <th>SubCategory</th>
                <th>Number</th>
                <th>Image</th>
                <th>Actions</th>
            </tr>
            <tr v-for="product in products" :key="product.id">
                <td>{{ product.id }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.description }}</td>
                <td>{{ product.price }} lari</td>
                <td>{{ product.MainCategory }}</td>
                <td>{{ product.Category }}</td>
                <td>{{ product.SubCategory }}</td>
                <td>{{ product.Contacts[0] }}</td>
                <td>
                    <img :src="product.image_urls" class="img">
                </td>
                <td>
                    <div v-if="product.active">
                        <form @click.prevent="notactive(product.id)">
                            <button class="btnsuccess"><i class="fa-regular fa-eye"></i></button>
                        </form>
                    </div>
                    <div v-else>
                        <form @click.prevent="active(product.id)">
                            <button class="btnwarning"><i class="fa-regular fa-eye-slash"></i></button>
                        </form>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: "ActiveProductComponent",
    data() {
        return {
            products: [],
        }
    },
    methods: {
        
        async fetchProductData() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admindisplay');
                if (response.data && response.data.data) {
                    this.products = response.data.data;
                    console.log(response.data);
                } else {
                    console.error('Unexpected API response structure:', response.data);
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        },
        async notactive(id) {
            try {
                const response = await axios.post(`http://127.0.0.1:8000/api/notactive/${id}`);
                const product = this.products.find(product => product.id === id);
                if (product) {
                    product.active = false;
                }
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        },
        async active(id) {
            try {
                const response = await axios.post(`http://127.0.0.1:8000/api/active/${id}`);
                const product = this.products.find(product => product.id === id);
                if (product) {
                    product.active = true;
                }
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }
    },
    created() {
        this.fetchProductData();
    },
}
</script>

<style scoped>

table {
    border-collapse: collapse;
    width: 100%;
}

th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}


.img {
    width: 40px;
}
.btnsuccess, .btnwarning {
    border: none;
    border-radius: 5px;
    width: 30px;
    height: 30px; /* Corrected to px */
    cursor: pointer;
    color: white;
}

.btnsuccess {
    background-color: #28a745;
}

.btnsuccess:hover {
    background-color: #218838; /* Hover color for success button */
}

.btnwarning {
    background-color: #ffc107;
}

.btnwarning:hover {
    background-color: #e0a800; /* Hover color for warning button */
}
</style>
