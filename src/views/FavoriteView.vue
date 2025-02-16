<template>
  <div class="main-content">
    <Message v-if="emitdata" closable class="message">{{ emitdata }}</Message>
    <Message v-if="emitlikemessage" closable class="message" severity="error">{{ emitlikemessage }}</Message>
    <Message v-if="emitcartmessage" closable class="message" severity="error">{{ emitcartmessage }}</Message>

    <div v-if="isLoading" class="loading-message">
      <p>Hold on! We're gathering your favorite products. This won't take long...</p>
    </div>

    <div v-if="products.length > 0 && !isLoading">
      <div :class="{ 'products-wrapper': isSidebarCollapsed, 'products-wrapper-collapsed': !isSidebarCollapsed }">
        <ProductCardComponent v-for="(item) in products" :key="item.id" :initialproduct="item"
          @show-comments="showCommentsModal(item.id)" @cart-updated="handleCartUpdated"
          @liked-message="handleunauthorizedlike" @cart-message="handleunauthorizedcart" />
      </div>
    </div>

    <div v-else-if="!isLoading && products.length === 0" class="no-products-message">
      <p><i class="fas fa-heart-broken"></i>{{ $t("favorite.message") }}</p>
      <a href="/" class="explore-link">{{ $t("favorite.btn") }}</a>
    </div>

    <Bootstrap5Pagination :data="pagination" @pagination-change-page="changePage" />
  </div>

  <CommentModal v-if="showModal" :product="selectedProduct" :comments="selectedProductComments" @close="closeModal"
    @comment-submitted="refreshComments(selectedProduct.id)" />
</template>

<script>
import ProductCardComponent from '../components/ProductCardComponent.vue';
import CommentModal from '../components/CommentModal.vue';
import Message from 'primevue/message';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import axios from 'axios';

export default {
  name: 'FavoriteView',
  components: {
    ProductCardComponent,
    CommentModal,
    Message,
    Bootstrap5Pagination,
  },
  props: {
    isSidebarCollapsed: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      products: [],
      showModal: false,
      selectedProduct: null,
      selectedProductComments: [],
      emitdata: null,
      emitlikemessage: null,
      emitcartmessage: null,
      pagination: {},
      isLoading: true,
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
      handler() {
        this.fetchfavorite();
      },
      immediate: true,
    },
  },
  methods: {
    async fetchfavorite() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('likeproduct', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.products = response.data.data;
        console.log(this.products)
        this.isLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async showCommentsModal(id) {
      try {
        const { data } = await axios.get(`products/${id}/display`);
        this.selectedProductComments = data;
        this.selectedProduct = this.products.find((product) => product.id === id);
        this.showModal = true;
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    async refreshComments(productId) {
      try {
        const { data } = await axios.get(`products/${productId}/display`);
        this.selectedProductComments = data;
      } catch (error) {
        console.error('Error refreshing comments:', error);
      }
    },
    closeModal() {
      this.showModal = false;
      this.selectedProduct = null;
      this.selectedProductComments = [];
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
    setTimeout(() => {
      this.fetchfavorite();
      this.isLoading = false;
    }, 500);
  },
};
</script>

<style>
.loading-message {
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  color: #444;
  padding-top: 20px;
}

.no-products-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
  border-radius: 12px;
  color: #555;
  margin-top: 10%;
  transition: transform 0.3s ease;
}

.no-products-message p {
  font-size: 1.2rem;
  font-weight: 500;
  color: #444;
  margin-bottom: 15px;
}

.no-products-message .fas {
  margin-right: 8px;
  color: #ff6b6b;
  font-size: 1.5rem;
}

.explore-link {
  text-decoration: none;
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  font-weight: 500;
}

.explore-link:hover {
  background-color: #0056b3;
}

.no-products-message:hover {
  transform: scale(1.05);
}

.products-wrapper {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  width: 100%;
}

.products-wrapper-collapsed {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  width: 100%;
}

.pagination {
  display: flex;
  list-style-type: none;
  padding: 0;
  justify-content: center;
  margin: 20px 0;
}

.page-item {
  margin: 0 5px;
}

.page-link {
  display: block;
  padding: 10px 15px;
  color: #007bff;
  text-decoration: none;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

.page-item.active .page-link {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.page-link:hover,
.page-link:focus {
  background-color: #0056b3;
  color: white;
  border-color: #0056b3;
  text-decoration: none;
}

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

@media (min-width: 390px) and (max-width: 574px) {
  .products-wrapper {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .products-wrapper-collapsed {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}
</style>
