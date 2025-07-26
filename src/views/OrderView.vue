<template>
  <div class="container">
    <div class="toggle-buttons">
      <button :class="{ active: showPending }" @click="toggleSection('pending')">
        მიმდინარე შეკვეთები
      </button>
      <button :class="{ active: !showPending }" @click="toggleSection('completed')">
        შესრულებული შეკვეთები
      </button>
    </div>

    <div v-if="apiLoaded && showPending" class="order-section">
      <div v-if="OrderProducts.length > 0" class="order-box">
        <div v-for="order in OrderProducts" :key="order.order_id" class="order-card">
          <div class="left-section">
            <OrderComponent v-for="product in order.products" :key="product.id" :product="product"
              :order_status="order.order_status" />
          </div>
          <div class="right-section">
            <div class="order-desc">
              <h3 class="order-id">შეკვეთის ნომერი: #{{ order.order_id }}</h3>
              <h3 class="order-amount">გადახდილი თანხა: {{ order.order_amount }} <i class="fa-solid fa-lari-sign"></i>
              </h3>
              <h3 class="order-amount">მიმღები: {{ order.order_fullname }}
              </h3>
              <h3 class="order-amount">მისამართი : {{ order.address.town }}, {{ order.address.address }}
              </h3>
            </div>
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
          <div class="products">
            <OrderComponent v-for="product in order.products" :key="product.id" :product="product"
              :order_status="order.order_status" />
          </div>
          <div class="right-section">
            <div class="order-desc">
              <h3 class="order-id">შეკვეთის ნომერი: #{{ order.order_id }}</h3>
              <h3 class="order-amount">გადახდილი თანხა: {{ order.order_amount }} <i class="fa-solid fa-lari-sign"></i>
              </h3>
              <h3 class="order-amount">მიმღები: {{ order.order_fullname }}
              </h3>
            </div>
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
      apiLoaded: false
    };
  },
  computed: {
    showPending() {
      return this.$route.query.section === 'pending';
    },
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
        this.apiLoaded = true;
      } catch (error) {
        console.error(error);
        this.apiLoaded = true;
      }
    },
    toggleSection(section) {
      this.$router.push({ query: { section } });
    }
  },
  mounted() {
    this.getOrders();
  },
  watch: {
    '$route.query.section': function (newSection) {
      if (newSection === 'pending') {
        this.apiLoaded = true;
      }
    }
  }
};
</script>


<style scoped>
.container {
  margin: 20px auto;
  padding: 20px;
}

.toggle-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  border-bottom: 2px solid #ddd;
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

.toggle-buttons button.active {
  color: #9b51e0;
  font-weight: bold;
}

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

.toggle-buttons button:hover::after,
.toggle-buttons button.active::after {
  width: 100%;
}

/* Order Sections */
.order-section {
  padding-top: 20px;
}

.section-header {
  font-size: 1.3rem;
  font-weight: bold;
  color: #4a148c;
  text-align: center;
  margin-bottom: 15px;
}

.order-card {
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 20px
}

.order-card:last-child {
  border-bottom: none;
}



.left-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 80%;

}

.right-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 30%;
  height: max-content;

}


.order-desc {
  background-color: #f8f8f8;
  border-radius: 10px;
  max-width: 100%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  padding: 30px 40px;
  margin: 30px auto;
  width: 300px;
  color: #111;
}

.order-id {
  color: #111;
  margin-bottom: 12px;
  border-bottom: 1px solid #ddd;

}

.order-amount {
  font-size: 18px;
}



.order-id,
.order-amount {
  margin-bottom: 12px;
  font-size: 15px;
  font-family: Arial, Helvetica, sans-serif;
  padding-bottom: 8px;
}

.order-address {
  font-weight: 400;
  font-family: Arial, Helvetica, sans-serif;
  margin-top: 15px;
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
    font-size: 12px;
  }

  .products {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 5px;
  }



  .order-card {
    flex-direction: column;
  }

  .left-section {
    width: 100%;
    gap: 30px;
  }

  .container {
    padding: 0;
    padding-top: 20px;
  }

  .right-section {
    margin: auto;
    width: 100%;

  }
}
</style>
