<template lang="">
    <div>
    <div class="action-container">
  
      <div class="search-category">
        <button @click="isModalVisible=true">Search by category</button>
      </div>
    <div class="searchbtn">
    <input type="text" v-model="Searchname" placeholder="Search...">
    <button @click="performSearch">Search</button>
    </div>
      </div>


    <CategoryModalVue
    :isModalVisible="isModalVisible"
    @close-modal="closeModal"
    @search-category="searchCategory"
     />
      
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
import CategoryModalVue from '../CategoryModal.vue';
export default {
    name: "ActiveProductComponent",
     components: {
    Bootstrap5Pagination,
    CategoryModalVue

  },
    data() {
        return {
      products: [],
      isModalVisible:false,
      selectedProducts: [],
      pagination: {},
      message: '',
      Searchname:'',
      selectedmainCategory:null,
      selectedCategory:null,
      selectedsubCategory:null,

        }
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
      this.selectedCategory=data.category;
      this.selectedsubCategory=data.subcategory;

    },
      openModal(){
       this.isModalVisible= true
    },
      closeModal(){
       this.isModalVisible= false
    },
      changePage(page) {
      this.$router.push({ path: '/admin/actions', query: { ...this.$route.query, page } });
    },
performSearch() {
  const currentQuery = { ...this.$route.query };
      this.$router.push({
        path: '/admin/actions',
        query: {
          ...currentQuery,
          searchname: this.Searchname,        
          maincategory: this.selectedmainCategory, 
          category: this.selectedCategory,
          subcategory: this.selectedsubCategory,
          page: 1                             
        }
      });
},
    async fetchProductData() {
      const token=localStorage.getItem('token');
         const queryParams = new URLSearchParams(this.$route.query);
    const page = parseInt(queryParams.get('page')) || 1;
      try {
        const response = await axios.get(`admindisplay`,{
            headers: {
        Authorization: `Bearer ${token}` 
                 },
         params:{
              page:page,
              searchname:this.Searchname,
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
        async notactive(id) {
                const token=localStorage.getItem('token');

            try {
                const response = await axios.post(`notactive/${id}`,{},{
                   headers: {
        Authorization: `Bearer ${token}` 
                 },
                });
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
                const token=localStorage.getItem('token');

            try {
                const response = await axios.post(`active/${id}`,{},{
                   headers: {
        Authorization: `Bearer ${token}` 
                 },
                });
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
  width: 200px; /* Adjust width as needed */
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
