<template>
  <div class="container">
    <div class="toggle-buttons">
      <button :class="{ active: showPending }" @click="toggleSection('pending')">
        მიმდინარე შეკვეთები </button>
      <button :class="{ active: !showPending }" @click="toggleSection('completed')">
        შესრულებული შეკვეთები </button>
    </div>

    <div v-if="apiLoaded && showPending" class="order-section">
      <div v-if="OrderProducts.length > 0" class="order-box">
        <div v-for="order in OrderProducts" :key="order.order_id" class="order-card">
          <div class="card-header">
            <h3 class="order-id">ID #{{ order.order_id }}</h3>
            <h3 class="order-amount">გადახდილი: {{ order.order_amount }} <i class="fa-solid fa-lari-sign"></i></h3>
          </div>
          <div class="products">
            <OrderComponent v-for="product in order.products" :key="product.id" :product="product"
              :order_status="order.order_status" />
          </div>
        </div>
      </div>
      <div v-else class="no-order-message ">
        <i class="fas fa-box-open"></i>
        <p>თქვენ არ გაქვთ შეკვეთა</p>
        <a href="/shop" class="shop-link">მთავარი გვერდი</a>
      </div>
    </div>

    <div v-if="apiLoaded && !showPending" class="order-section">
      <div v-if="CompletedProducts.length > 0" class="order-box">
        <div v-for="order in CompletedProducts" :key="order.order_id" class="order-card">
          <div class="card-header">
            <h3 class="order-id">შეკვეთა #{{ order.order_id }}</h3>
            <h3 class="order-amount">გადახდილი: {{ order.order_amount }} <i class="fa-solid fa-lari-sign"></i></h3>
          </div>
          <div class="products">
            <OrderComponent v-for="product in order.products" :key="product.id" :product="product"
              :order_status="order.order_status" />
          </div>
        </div>
      </div>
      <div v-else class="no-order-message ">
        <i class="fas fa-box-open"></i>
        <p>თქვენ არ გაქვთ შეკვეთების ისტორია</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import OrderComponent from '@/components/OrderComponent.vue';

export default {
  components: {
    OrderComponent
  },
  data() {
    return {
      OrderProducts: [],
      CompletedProducts: [],
      showPending: true,
      apiLoaded: false
    };
  },
  computed: {
    ordersReady() {
      return this.apiLoaded && (this.OrderProducts.length > 0 || this.CompletedProducts.length > 0);
    }
  },
  methods: {
    async getOrders() {
      this.apiLoaded = false;
      try {
        const response = await api.get('orders', {
          tokenRequired: true
        });
        this.OrderProducts = response.data.Pending || [];
        this.CompletedProducts = response.data.Completed || [];
        this.$nextTick(() => {
          this.apiLoaded = true;
        });
      } catch (error) {
        console.error(error);
        this.apiLoaded = true;
      }
    },
    toggleSection(section) {
      this.showPending = section === 'pending';
    }
  },
  mounted() {
    this.getOrders();
  }
};
</script>

<style scoped>
/* Container */
.container {
  margin: 20px auto;
  padding: 20px;
}

/* Toggle Buttons (Now Styled as Minimalist Tabs) */
.toggle-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  border-bottom: 2px solid #ddd;
  /* Subtle separator line */
  padding-bottom: 10px;
}

.toggle-buttons button {
  background: none;
  border: none;
  font-size: 1rem;
  color: #777;
  cursor: pointer;
  padding: 8px 12px;
  position: relative;
  transition: color 0.3s ease;
}

/* Active State */
.toggle-buttons button.active {
  color: #9b51e0;
  /* Strong purple */
  font-weight: bold;
}

/* Underline Effect */
.toggle-buttons button::after {
  content: "";
  display: block;
  width: 0;
  height: 2px;
  background: #9b51e0;
  transition: width 0.3s ease;
  position: absolute;
  left: 50%;
  bottom: -3px;
  transform: translateX(-50%);
}

/* Expand Underline on Hover & Active */
.toggle-buttons button:hover::after,
.toggle-buttons button.active::after {
  width: 100%;
}

/* Order Sections */
.order-section {
  padding-top: 20px;
}

/* Order Header - No Box, Just Clean Title */
.section-header {
  font-size: 1.3rem;
  font-weight: bold;
  color: #4a148c;
  text-align: center;
  margin-bottom: 15px;
}

/* Order Cards - No Background, Only Separation */
.order-card {
  border-bottom: 1px solid #ddd;
}

/* Last Order No Border */
.order-card:last-child {
  border-bottom: none;
}

/* Card Header - Better Spacing */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  color: #4a148c;
  margin-bottom: 10px;
}

.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
}

.no-order-message {
  text-align: center;
  padding: 30px 20px;
  color: #555;
}

.no-order-message p {
  font-size: small;
}

.no-order-message i {
  font-size: 2rem;
  color: #9b51e0;
  margin-bottom: 10px;
}

.full-empty-message {
  text-align: center;
  padding: 50px 20px;
  color: #555;
}

.full-empty-message i {
  font-size: 3rem;
  color: #9b51e0;
  margin-bottom: 10px;
}

.shop-link {
  display: inline-block;
  padding: 10px 15px;
  background-color: #9b51e0;
  font-size: small;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
}

.shop-link:hover {
  background-color: #7e3ae3;
}




/* Mobile Adjustments */
@media (max-width: 768px) {
  .toggle-buttons {
    flex-direction: row;
    justify-content: center;
  }

  .toggle-buttons button {
    font-size: 0.9rem;
  }

  .products {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 5px;
  }

  h2 {
    font-size: 1.3rem;
  }

  .card-header {
    font-size: 0.7rem;
  }
}
</style>
