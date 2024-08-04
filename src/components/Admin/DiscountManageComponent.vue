<template>
  <div>
    <input type="number" v-model="discountValue" placeholder="Enter discount value">
    <button @click="applyDiscount">Set</button>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Discount</th>
          <th>Discount Price</th>
          <th>Main Category</th>
          <th>Category</th>
          <th>Subcategory</th>
          <th>Number</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td><input type="checkbox" :value="product.id" v-model="selectedProducts"></td>   
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>{{ product.price }} <i class="fa-solid fa-lari-sign"></i></td>
          <td>{{ product.discount }} %</td>
          <td>{{ product.discountprice }} <i class="fa-solid fa-lari-sign"></i></td>
          <td>{{ product.MainCategory }}</td>
          <td>{{ product.Category }}</td>
          <td>{{ product.SubCategory }}</td>
          <td>{{ product.Contacts[0] }}</td>
          <td>
            <img :src="product.image_urls" class="img">
          </td>
        </tr>
      </tbody>
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
  name: "DiscountManageComponent",
  components: {
    Bootstrap5Pagination
  },
  data() {
    return {
      products: [],
      selectedProducts: [],
      discountValue: null,
      pagination: {},
      message: ''
    };
  },
  methods: {
    async fetchProductData(page = 1) {
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
        } else {
          console.error('Unexpected API response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    },
    async applyDiscount() {
      if (this.selectedProducts.length === 0) {
        this.message = 'Please select at least one product.';
        return;
      }
      if (!this.discountValue) {
        this.message = 'Please enter a discount value.';
        return;
      }

      const payload = {
        id: this.selectedProducts,
        discount: this.discountValue
      };
      console.log('Payload:', JSON.stringify(payload, null, 2));
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/discount', payload);
        console.log('Discount applied:', response.data);
        this.message = 'Discount successfully applied!';
        this.fetchProductData();
      } catch (error) {
        console.error('Error applying discount:', error);
        if (error.response) {
          console.error('Server responded with:', error.response.data);
          this.message = `Error: ${error.response.data.message}`;
        } else {
          this.message = 'An error occurred while applying the discount.';
        }
      }
    }
  },
  created() {
    this.fetchProductData();
  }
}
</script>

<style>
table {
  border-collapse: collapse;
  width: 80%;
  margin: 20px auto;
  font-size: 0.9em;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #808080;
  color: #ffffff;
  text-transform: uppercase;
  font-weight: bold;
}

tr {
  border-bottom: 1px solid #dddddd;
}

tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

tr:last-of-type {
  border-bottom: 2px solid #808080;
}

tr:hover {
  background-color: #f1f1f1;
}

.img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 5px;
  transition: transform 0.3s;
}

.img:hover {
  transform: scale(1.2);
}

.fa-lari-sign {
  margin-left: 5px;
}

.message {
  text-align: center;
  margin-top: 20px;
  font-size: 1em;
  color: #ff0000;
}

/* Pagination Container */
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
