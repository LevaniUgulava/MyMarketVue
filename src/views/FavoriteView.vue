<template>
  <div class="favorites-container">
    <div v-if="products.length > 0" class="products-grid-wrapper">
      <div :class="{ 'products-grid': isSidebarCollapsed, 'products-grid-collapsed': !isSidebarCollapsed }">
        <ProductCardComponent v-for="item in products" :key="item.id" :initialproduct="item"
          @cart-updated="handleCartUpdated" @liked-message="handleUnauthorizedLike"
          @cart-message="handleUnauthorizedCart" />
      </div>
    </div>

    <div v-if="apiLoaded && products.length === 0" class="empty-favorites">
      <i class="fa-solid fa-heart"></i>
      <p class="empty-text">თქვენ ჯერ არ მოგიწონებიათ პროდუქტი</p>
      <p class="empty-subtext">დამატეთ ყველა პროდუქტი, რაც თქვენ გაინტერესებთ</p>
      <div class="empty-actions">
        <a href="/" class="primary-btn">დაათვალიერეთ პროდუქტები</a>
        <a href="/" class="secondary-btn">მოინახულე ჩვენი მაღაზია</a>
      </div>
    </div>


  </div>
</template>

<script>
import ProductCardComponent from '../components/ProductCardComponent.vue';
import api from '@/api';

export default {
  name: 'FavoriteView',
  components: {
    ProductCardComponent,
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
      apiLoaded: false,
    };
  },
  methods: {
    async fetchFavorites() {
      try {
        const response = await api.get('likeproduct', {
          tokenRequired: true
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
.empty-favorites {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
  color: #333;
}



.empty-text {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.empty-subtext {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.empty-actions {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}

.primary-btn {
  display: flex;
  text-decoration: none;
  background-color: #7c317c;;
  align-items: center;
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.primary-btn:hover {
  background-color: #7e3ae3;
}

.secondary-btn {
  text-decoration: none;
  color: #9b51e0;
  font-size: 13px;
  padding: 10px 15px;
  font-weight: 600;
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
@media (max-width: 767px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .products-grid-collapsed {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .empty-text {
    font-weight: 100;
  }

  .secondary-btn,
  .primary-btn {
    font-size: 12px;
    font-weight: 100
  }
}
</style>
