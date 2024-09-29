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
          <div class="pagination-container">
      <div class="pagination">
        <Bootstrap5Pagination
          :data="pagination"
          @pagination-change-page="fetchProductData"
        />   
      </div>
    </div>
    
    </div>
</template>

<script>
import axios from 'axios';
import { Bootstrap5Pagination } from "laravel-vue-pagination";

export default {
    name: "ActiveProductComponent",
     components: {
    Bootstrap5Pagination
  },
    data() {
        return {
            products: [],
                  pagination: {},

        }
    },
    methods: {
        
        async fetchProductData(page=1) {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/admindisplay?page=${page}`);
                if (response.data && response.data.data) {
                    this.products = response.data.data;
            this.pagination = {
                current_page: response.data.meta.current_page,
                last_page: response.data.meta.last_page,
                per_page: response.data.meta.per_page,
                total: response.data.meta.total,
                links: response.data.links 
          };
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

<style >

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
.pagination {
  display: flex;
  list-style-type: none;
  padding: 0;
  justify-content: center;
  margin: 20px 0;
}

/* Pagination Items */
.page-item {
  margin: 0 5px;
}

/* Pagination Links */
.page-link {
  display: block;
  padding: 10px 15px;
  color: #007bff;
  text-decoration: none;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

/* Active Pagination Link */
.page-item.active .page-link {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

/* Hover and Focus States */
.page-link:hover, .page-link:focus {
  background-color: #0056b3;
  color: white;
  border-color: #0056b3;
  text-decoration: none;
}

/* Disabled State */
.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}

/* Additional styling for a more solid look */
.page-link {
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.page-link:active {
  background-color: #004085;
  border-color: #004085;
  color: white;
}

</style>
