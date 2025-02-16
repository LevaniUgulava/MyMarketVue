<template>
  <div v-if="isLoading" class="loading-message">
    <p>Hold on! We're gathering your favorite products. This won't take long...</p>
  </div>
  <div class="container">

    <div v-if="!isLoading" class="toggle-buttons">
      <button :class="{ active: showPending }" @click="toggleSection('pending')">
        {{ $t('order.pending') }}
      </button>
      <button :class="{ active: !showPending }" @click="toggleSection('completed')">
        {{ $t('order.completed') }}
      </button>
    </div>

    <!-- Pending Orders Section -->
    <div v-if="showPending && OrderProducts.length > 0 && !isLoading" class="order-section">
      <div class="section-header">
        <h2>{{ $t('order.pending') }}</h2>
      </div>
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

    <div v-if="!showPending && CompletedProducts.length > 0 && !isLoading" class="order-section">
      <div class="section-header">
        <h2>{{ $t('order.completed') }}</h2>
      </div>
      <div class="order-box">
        <div v-for="order in CompletedProducts" :key="order.order_id" class="order-card">
          <div class="card-header">
            <h3 class="order-id">Order #{{ order.order_id }}</h3>
            <h3 class="order-amount">Paid: ${{ order.order_amount }}</h3>
          </div>
          <div class="products">
            <OrderComponent v-for="product in order.products" :key="product.id" :product="product"
              :order_status="order.order_status" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!isLoading && OrderProducts.length === 0 && CompletedProducts.length === 0"
      class="no-order-message">
      <i class="fas fa-box-open"></i>
      <p>You have no orders yet!</p>
      <a href="/" class="shop-link">Go Shopping</a>
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
      isLoading: true,
      showPending: true,
    };
  },
  methods: {
    async getorder() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.isLoading = false;
        this.OrderProducts = response.data.Pending || [];
        this.CompletedProducts = response.data.Completed || [];
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    toggleSection(section) {
      this.showPending = section === 'pending';
    }
  },
  mounted() {
    this.getorder();

  }
};
</script>
<style scoped>
.loading-message {
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  color: #444;
  padding-top: 20px;
}

.container {
  margin: 20px auto;
  padding: 20px;
  max-width: 1200px;
  border-radius: 16px;
}

/* Toggle Buttons */
.toggle-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.toggle-buttons button {
  padding: 10px 20px;
  margin: 0 10px;
  font-size: 1rem;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  transition: background-color 0.3s ease;
}

.toggle-buttons button.active {
  background-color: rgb(103, 181, 105);
  color: white;
  border-color: rgba(76, 175, 80, 0.25);
}

.toggle-buttons button:hover {
  background-color: rgba(0, 0, 0, 0.25);
  color: white;
  border-color: rgba(76, 175, 80, 0.25);
}

/* Section Header */
.section-header {
  border: 1px solid #ddd;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px 8px 0 0;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  text-align: center;
}

/* Order Box */
.order-box {
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  background-color: #ffffff;
  padding: 20px;
}

/* Cards */
.order-card {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 20px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.order-card:hover {
  transform: scale(1.01);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
}

/* No Orders */
.no-order-message {
  text-align: center;
  padding: 50px 20px;
  color: #555;
}

.no-order-message i {
  font-size: 3rem;
  color: #007bff;
  margin-bottom: 10px;
}

.shop-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  text-decoration: none;
}

.shop-link:hover {
  background-color: #0056b3;
}

@media (min-width: 375px) and (max-width: 430px) {
  .toggle-buttons button {
    font-size: 0.8rem;
    background-color: white;
  }

  .toggle-buttons button.active {
    font-size: 0.5rem;
    background-color: rgba(76, 175, 80, 0.25);
    color: black;
  }

  .no-order-message i {
    font-size: 2rem;
  }

  p {
    font-size: 0.6rem;
  }

  .shop-link {
    margin-top: 10px;
    padding: 5px 10px;
    font-size: 0.6rem;
  }

  .section-header h2 {
    font-size: 0.6rem;
  }

  .card-header h3 {
    font-size: 0.6rem;
  }

  .order-box {
    padding: 10px;
  }

  .products {
    grid-template-columns: repeat(auto-fill, minmax(120px, 2fr));
    gap: 10px;
    justify-items: center;
  }

  .container {
    padding: 0px;
  }
}
</style>
