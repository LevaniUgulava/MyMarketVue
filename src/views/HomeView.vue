<template>
  <div>
    <HeaderComponent :maincategories="maincategories" @search="handleSearch" />
    <Message v-if="emitdata" closable class="message">{{ emitdata }}</Message>
    <Message v-if="emitlikemessage" closable class="message" severity="error">{{ emitlikemessage }}</Message>
    <Message v-if="emitcartmessage" closable class="message" severity="error">{{ emitcartmessage }}</Message>

    <div class="products-wrapper">
      <ProductCardComponent
        v-for="(item, index) in products"
        :key="index"
        :initialproduct="item"
        :islikedproduct="isLikedProduct(item.id)"
        @show-comments="showCommentsModal(item.id)"
        @cart-updated="handleCartUpdated"
        @liked-message="handleunauthorizedlike"
        @cart-message="handleunauthorizedcart"
      />
    </div>
    <div v-if="products.length === 0"></div>

    <!-- Modal for displaying comments -->
    <CommentModal
      v-if="showModal"
      :product="selectedProduct"
      :comments="selectedProductComments"
      @close="closeModal"
      @comment-submitted="refreshComments(selectedProduct.id)"
    />

    <Bootstrap5Pagination :data="pagination" @pagination-change-page="changePage" />
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import ProductCardComponent from '../components/ProductCardComponent.vue';
import CommentModal from '../components/CommentModal.vue';
import Message from 'primevue/message';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import axios from 'axios';

export default {
  name: 'HomeView',
  components: {
    HeaderComponent,
    ProductCardComponent,
    CommentModal,
    Message,
    Bootstrap5Pagination,
  },
  data() {
    return {
      products: [],
      likedProductIds: [],
      showModal: false,
      selectedProduct: null,
      selectedProductComments: [],
      searchname: '',
      maincategories: [],
      selectedCategory: null,
      emitdata: null,
      emitlikemessage: null,
      emitcartmessage: null,
      pagination: {},
    };
  },
  watch: {
    emitdata(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.emitdata = null;
        }, 3000);
      }
    },
    emitlikemessage(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.emitlikemessage = null;
        }, 3000);
      }
    },
    emitcartmessage(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.emitcartmessage = null;
        }, 3000);
      }
    },
    '$route.query': {
      handler: 'fetchProducts',
      immediate: true,
    },
  },
  methods: {
    async fetchProducts() {
      const queryParams = new URLSearchParams(this.$route.query);
      const page = parseInt(queryParams.get('page')) || 1;
      this.searchname = queryParams.get('searchname') || '';
      this.selectedCategory = queryParams.get('maincategory') || '';

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/display', {
          params: {
            searchname: this.searchname,
            maincategory: this.selectedCategory,
            page: page,
          },
        });

        this.products = response.data.data;
        this.pagination = {
          current_page: response.data.meta.current_page,
          last_page: response.data.meta.last_page,
          per_page: response.data.meta.per_page,
          total: response.data.meta.total,
          links: response.data.links,
        };
        this.fetchLikedProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    async fetchLikedProducts() {
      const token = localStorage.getItem('token');
      try {
        const { data } = await axios.get('http://127.0.0.1:8000/api/isliked', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.likedProductIds = data.map((product) => product.id);
      } catch (error) {
        console.error('Error fetching liked products:', error);
      }
    },
    async showCommentsModal(id) {
      try {
        const { data } = await axios.get(`http://127.0.0.1:8000/api/products/${id}/display`);
        this.selectedProductComments = data;
        this.selectedProduct = this.products.find((product) => product.id === id);
        this.showModal = true;
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    async refreshComments(productId) {
      try {
        const { data } = await axios.get(`http://127.0.0.1:8000/api/products/${productId}/display`);
        this.selectedProductComments = data;
      } catch (error) {
        console.error('Error refreshing comments:', error);
      }
    },
    async maincategory() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/maincategory');
        this.maincategories = response.data;
      } catch (error) {
        console.error('Error fetching main categories:', error);
      }
    },
    handleSearch(searchData) {
      this.$router.push({ path: '/', query: { searchname: searchData.searchname, maincategory: searchData.maincategory, page: 1 } });
    },
    closeModal() {
      this.showModal = false;
      this.selectedProduct = null;
      this.selectedProductComments = [];
    },
    isLikedProduct(productId) {
      return this.likedProductIds.includes(productId);
    },
    handleCartUpdated(cartData) {
      this.emitdata = cartData.message;
    },
    handleunauthorizedlike(likedmessage) {
      this.emitlikemessage = likedmessage;
    },
    handleunauthorizedcart(cartmessage) {
      this.emitcartmessage = cartmessage;
    },
    changePage(page) {
      this.$router.push({ path: '/', query: { ...this.$route.query, page } });
    },
  },
  mounted() {
    this.fetchLikedProducts();
    this.maincategory();
  },
};
</script>

<style>

.products-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 -10px;
}

.message {
  position: sticky;
  top: 70px;
  z-index: 999;
  width: 100%;
  margin-top: 10px;
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
