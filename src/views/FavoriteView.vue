<template>
  <div class="favorites-container">
    <div v-if="products.length > 0" class="products-grid-wrapper">
      <div :class="{ 'products-grid': isSidebarCollapsed, 'products-grid-collapsed': !isSidebarCollapsed }">
        <ProductCardComponent v-for="item in products" :key="item.id" :initialproduct="item"
          @show-comments="showCommentsModal(item.id)" @cart-updated="handleCartUpdated"
          @liked-message="handleUnauthorizedLike" @cart-message="handleUnauthorizedCart" />
      </div>
    </div>

    <!-- Empty State (Now only shows if API confirms there are no products) -->
    <div v-if="apiLoaded && products.length === 0" class="empty-favorites">
      <i class="fas fa-heart-circle-plus empty-icon"></i>
      <p class="empty-text">{{ $t("favorite.message") }}</p>
      <p class="empty-subtext">დამატეთ ყველა პროდუქტი, რაც თქვენ გაინტერესებთ</p>
      <div class="empty-actions">
        <a href="/" class="primary-btn">{{ $t("favorite.btn") }}</a>
        <a href="/" class="secondary-btn">მოინახულე ჩვენი მაღაზია</a>
      </div>
    </div>

    <!-- Pagination -->
    <Bootstrap5Pagination v-if="apiLoaded && products.length > 0" :data="pagination"
      @pagination-change-page="changePage" />
  </div>
</template>

<script>
import ProductCardComponent from '../components/ProductCardComponent.vue';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import axios from 'axios';

export default {
  name: 'FavoriteView',
  components: {
    ProductCardComponent,
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
      pagination: {},
      apiLoaded: false, // New state to track when API is finished loading
    };
  },
  methods: {
    async fetchFavorites() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('likeproduct', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.products = response.data.data;
      } catch (error) {
        console.error(error);
      } finally {
        this.apiLoaded = true;
      }
    },
    changePage(page) {
      this.$router.push({ path: '/', query: { ...this.$route.query, page } });
    },
  },
  mounted() {
    this.fetchFavorites();
  },
};
</script>

<style>
.favorites-container {
  max-width: 1200px;
  padding: 20px;
}


/* Empty State */
.empty-favorites {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
  color: #333;
}

/* Empty State Icon */
.empty-icon {
  font-size: 4rem;
  color: #9b51e0;
  margin-bottom: 15px;
}

/* Empty State Text */
.empty-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.empty-subtext {
  font-size: 1rem;
  color: #666;
  margin-top: 5px;
}

/* Empty State Buttons */
.empty-actions {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}

/* Primary CTA Button */
.primary-btn {
  text-decoration: none;
  background-color: #9b51e0;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.primary-btn:hover {
  background-color: #7e3ae3;
}

/* Secondary CTA Button */
.secondary-btn {
  text-decoration: none;
  color: #9b51e0;
  font-size: 1rem;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  border: 2px solid #9b51e0;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.secondary-btn:hover {
  background-color: #9b51e0;
  color: white;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  width: 100%;
}

.products-grid-collapsed {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  width: 100%;
}

/* Pagination */
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
  color: #9b51e0;
  text-decoration: none;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

.page-item.active .page-link {
  background-color: #9b51e0;
  color: white;
  border-color: #9b51e0;
}

.page-link:hover,
.page-link:focus {
  background-color: #7e3ae3;
  color: white;
  border-color: #7e3ae3;
}

/* Responsive Grid */
@media (min-width: 390px) and (max-width: 574px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .products-grid-collapsed {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .empty-text {
    font-size: 1.3rem;
  }

  .empty-subtext {
    font-size: 0.9rem;
  }

  .primary-btn,
  .secondary-btn {
    font-size: 0.9rem;
    padding: 10px 20px;
  }
}
</style>
