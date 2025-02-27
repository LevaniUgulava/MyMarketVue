<template>
  <div class="container">
    <!-- Toggle Buttons -->
    <div class="toggle-buttons">
      <button :class="{ active: showPending }" @click="toggleSection('pending')">
        {{ $t('order.pending') }}
      </button>
      <button :class="{ active: !showPending }" @click="toggleSection('completed')">
        {{ $t('order.completed') }}
      </button>
    </div>

    <!-- Pending Orders Section -->
    <div v-if="showPending" class="order-section">
      <div class="section-header">
        <h2>{{ $t('order.pending') }}</h2>
      </div>

      <div v-if="OrderProducts.length > 0">
        <div class="order-box">
          <div v-for="order in OrderProducts" :key="order.order_id" class="order-card">
            <div class="card-header">
              <h3 class="order-id">{{ $t('order.order') }} #{{ order.order_id }}</h3>
              <h3 class="order-amount">{{ $t('order.paid') }}: {{ order.order_amount }} <i
                  class="fa-solid fa-lari-sign"></i></h3>
            </div>
            <div class="products">
              <OrderComponent v-for="product in order.products" :key="product.id" :product="product"
                :order_status="order.order_status" />
            </div>
          </div>
        </div>
      </div>

      <!-- Message when there are no Pending orders -->
      <div v-else class="no-order-message">
        <i class="fas fa-box-open"></i>
        <p>{{ $t("order.no_pending") }}</p>
      </div>
    </div>

    <!-- Completed Orders Section -->
    <div v-if="!showPending" class="order-section">
      <div class="section-header">
        <h2>{{ $t('order.completed') }}</h2>
      </div>

      <div v-if="CompletedProducts.length > 0">
        <div class="order-box">
          <div v-for="order in CompletedProducts" :key="order.order_id" class="order-card">
            <div class="card-header">
              <h3 class="order-id">{{ $t('order.order') }} #{{ order.order_id }}</h3>
              <h3 class="order-amount">{{ $t('order.paid') }}: {{ order.order_amount }} <i
                  class="fa-solid fa-lari-sign"></i></h3>
            </div>
            <div class="products">
              <OrderComponent v-for="product in order.products" :key="product.id" :product="product"
                :order_status="order.order_status" />
            </div>
          </div>
        </div>
      </div>

      <!-- Message when there are no Completed orders -->
      <div v-else class="no-order-message">
        <i class="fas fa-box-open"></i>
        <p>{{ $t("order.no_completed") }}</p>
      </div>
    </div>

    <!-- Show full empty message only if there are no orders at all -->
    <div v-if="OrderProducts.length === 0 && CompletedProducts.length === 0" class="full-empty-message">
      <i class="fas fa-box-open"></i>
      <p>{{ $t("order.no_orders") }}</p>
      <a href="/" class="shop-link">{{ $t("order.shop_now") }}</a>
    </div>
  </div>
</template>

<script>
import OrderComponent from '@/components/OrderComponent.vue';
import axios from 'axios';

export default {
  components: {
    OrderComponent
  },
  data() {
    return {
      OrderProducts: [],
      CompletedProducts: [],
      showPending: true,
    };
  },
  methods: {
    async getOrders() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.OrderProducts = response.data.Pending || [];
        this.CompletedProducts = response.data.Completed || [];
      } catch (error) {
        console.error(error);
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
  max-width: 1200px;
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

/* Product Grid - More Flexible */
.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
}

/* No Orders Messages */
.no-order-message {
  text-align: center;
  padding: 30px 20px;
  color: #555;
}

.no-order-message i {
  font-size: 2rem;
  color: #9b51e0;
  margin-bottom: 10px;
}

/* Full Empty State */
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
  margin-top: 20px;
  padding: 12px 20px;
  background-color: #9b51e0;
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
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

@media (max-width: 430px) {
  .toggle-buttons {
    flex-direction: row;
    font-size: 0.85rem;
  }

  .section-header {
    font-size: 1.1rem;
  }

  .products {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
