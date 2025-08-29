<template>
  <div class="main-content">
    <Message v-if="emitdata" closable class="message">{{ emitdata }}</Message>
    <Message v-if="emitlikemessage" closable class="message" severity="error">{{ emitlikemessage }}</Message>
    <Message v-if="emitcartmessage" closable class="message" severity="error">{{ emitcartmessage }}</Message>

  </div>

  <div>
    <div class="products-wrapper" v-if="isAuth">
      <ProductCardComponent v-for="(item) in products" :key="item.id" :initialproduct="item"
        @show-comments="showCommentsModal(item.id)" @cart-updated="handleCartUpdated"
        @liked-message="handleunauthorizedlike" @cart-message="handleunauthorizedcart" />
    </div>
    <div class="no-auth" v-else>
      ეს არის გვერდი სადაც იხილავთ შემოთავაზებულ პრდუქციას პასდაკლებით მაგრამ აქ არის საჭირო სტატუსიკო
    </div>
  </div>


</template>

<script>
import ProductCardComponent from '@/components/ProductCardComponent.vue';
import api from '@/api';
import { authMixin } from '@/mixin/reuse';

export default {
  name: 'ExclusivePage',
  mixins: [authMixin],
  components: {
    ProductCardComponent,
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
      bool: false,
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
        this.getExclusive();
      },
      immediate: false,
    },
  },
  methods: {

    async getExclusive() {
      try {
        const productsResponse = await api.get('/exlusive', {
          tokenRequired: true
        });

        this.products = productsResponse.data.products;

      } catch (error) {
        console.error('Error fetching data:', error);
      }
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
    if (this.isAuth) {
      this.getExclusive();

    }
  },
};
</script>

<style>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.no-auth {
  margin-top: 50px;
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
  width: 100%;
  margin-bottom: 2%;
}

.message {
  position: sticky;
  top: 70px;
  z-index: 999;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.pagination {
  display: flex;
  list-style-type: none;
  padding: 0;
  justify-content: center;
  margin: 25px 0;
}

.page-item {
  margin: 0 5px;
}

.page-link {
  display: block;
  padding: 8px 14px;
  color: #007bff;
  font-weight: 500;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-item.active .page-link {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.page-link:hover,
.page-link:focus {
  background-color: #0056b3;
  color: #fff;
  border-color: #0056b3;
  text-decoration: none;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}

@media (max-width: 490px) {
  .products-wrapper {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    margin-top: 20px;
  }
}
</style>
