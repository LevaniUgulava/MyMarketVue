<template>
  <div>
    <div class="action-container">
      <div class="discountbtn">
        <input type="number" v-model="discountValue" placeholder="Enter discount value">
        <button @click="applyDiscount">Set</button>
      </div>
      <div class="search-category">
        <button @click="isModalVisible = true">Search by category</button>
      </div>
      <div class="searchbtn">
        <input type="text" v-model="Searchname" placeholder="Search...">
        <button @click="performSearch">Search</button>
      </div>
    </div>


    <CategoryModalVue :isModalVisible="isModalVisible" @close-modal="closeModal" @search-category="searchCategory" />



    <table>
      <thead>
        <tr>
          <th></th>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Discount</th>
          <th>DiscountPrice</th>
          <th>MainCategory</th>
          <th>Category</th>
          <th>Subcategory</th>
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
          <td>{{ product.MainCategory.name }}</td>
          <td>{{ product.Category.name }}</td>
          <td>{{ product.SubCategory.name }}</td>
          <td>
            <img :src="product.image_urls" class="img">
          </td>
        </tr>
      </tbody>
    </table>


    <Bootstrap5Pagination :data="pagination" @pagination-change-page="changePage" />



  </div>
</template>

<script>
import { Bootstrap5Pagination } from "laravel-vue-pagination";
import CategoryModalVue from '../CategoryModal.vue';
import api from '@/api';
export default {
  name: "DiscountManageComponent",
  components: {
    Bootstrap5Pagination,
    CategoryModalVue
  },
  data() {
    return {
      products: [],
      isModalVisible: false,
      selectedProducts: [],
      discountValue: null,
      pagination: {},
      message: '',
      Searchname: '',
      selectedmainCategory: null,
      selectedCategory: null,
      selectedsubCategory: null,
    };
  },
  watch: {
    '$route.query': {
      handler() {
        this.fetchProductData();
      },
      immediate: true
    }
  },
  methods: {
    searchCategory(data) {
      this.selectedmainCategory = data.maincategory;
      this.selectedCategory = data.category;
      this.selectedsubCategory = data.subcategory;

    },
    async fetchProductData() {
      const queryParams = new URLSearchParams(this.$route.query);
      const page = parseInt(queryParams.get('page')) || 1;
      try {
        const response = await api.get(`admindisplay`, {
          tokenRequired: true,

          params: {
            page: page,
            searchname: this.Searchname,
            maincategory: this.selectedmainCategory,
            category: this.selectedCategory,
            subcategory: this.selectedsubCategory,
          }

        });
        if (response.data && response.data.data) {
          this.products = response.data.data;
          this.pagination = {
            current_page: response.data.meta.current_page,
            last_page: response.data.meta.last_page,
            per_page: response.data.meta.per_page,
            total: response.data.meta.total,
            links: response.data.links
          };

          console.log(response.data)
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
      try {
        const response = await api.post('discount', payload, {
          tokenRequired: true

        });
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

}
</script>

<style>
.action-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.discountbtn,
.searchbtn,
.search-category {
  display: flex;
  align-items: center;
}

.discountbtn input,
.searchbtn input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
  /* Adjust width as needed */
}

.discountbtn button,
.searchbtn button,
.search-category button {
  margin-left: 8px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.discountbtn button:hover,
.searchbtn button:hover,
.search-category button:hover {
  background-color: #0056b3;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}


.img {
  width: 40px;
}

.btnsuccess,
.btnwarning {
  border: none;
  border-radius: 5px;
  width: 30px;
  height: 30px;
  /* Corrected to px */
  cursor: pointer;
  color: white;
}

.btnsuccess {
  background-color: #28a745;
}

.btnsuccess:hover {
  background-color: #218838;
  /* Hover color for success button */
}

.btnwarning {
  background-color: #ffc107;
}

.btnwarning:hover {
  background-color: #e0a800;
  /* Hover color for warning button */
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
.page-link:hover,
.page-link:focus {
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
