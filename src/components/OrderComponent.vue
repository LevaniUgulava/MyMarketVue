<template>
  <div class="order-card">
    <!-- Product Image Carousel (Only Show if Allowed) -->
    <carousel v-if="isimageshown" :items-to-show="1" class="custom-carousel">
      <slide v-for="(image, index) in product.image_urls" :key="index">
        <img :src="image" alt="Product Image" class="product-img" />
      </slide>
      <template #addons>
        <navigation />
      </template>
    </carousel>

    <!-- Product Details -->
    <div class="order-details">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>

      <div class="order-info">
        <p><i class="fas fa-ruler"></i> {{ $t('order.size') }}: <strong>{{ product.size }}</strong></p>
        <p><i class="fas fa-cubes"></i> {{ $t('order.quantity') }}: <strong>{{ product.quantity }}</strong></p>
        <p><i class="fa-solid fa-lari-sign"></i> {{ $t('order.total') }}: <strong>{{ product.total_price }}</strong> <i
            class="fa-solid fa-lari-sign"></i></p>
      </div>

      <!-- Order Status Badge -->
      <p :class="['order-status', statusClass]">
        {{ $t('order.status') }}: <strong>{{ order_status }}</strong>
      </p>
    </div>
  </div>
</template>

<script>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'

export default {
  components: {
    Carousel,
    Slide,
    Navigation,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    order_status: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      isimageshown: true
    }
  },
  computed: {
    statusClass() {
      switch (this.order_status.toLowerCase()) {
        case 'pending': return 'status-pending'
        case 'shipped': return 'status-shipped'
        case 'delivered': return 'status-delivered'
        case 'canceled': return 'status-canceled'
        default: return 'status-default'
      }
    }
  },
  mounted() {
    if (this.$route.path === '/admin/orders') {
      this.isimageshown = false;
    }
  }
}
</script>


<style scoped>
.order-card {
  display: flex;
  flex-direction: column;
  width: 230px;
  background: #ffffff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

/* Image Carousel */
.custom-carousel {
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 12px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
}

.product-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
  border-radius: 10px;
}

/* Order Details */
.order-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 0;
}

.product-name {
  font-size: 1rem;
  font-weight: bold;
  color: #4a148c;
  margin-bottom: 5px;
}

.product-description {
  font-size: 0.85rem;
  color: #666;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

/* Order Info */
.order-info p {
  font-size: 0.9rem;
  color: #333;
  margin: 2px 0;
}

.order-info p i {
  color: #9b51e0;
  margin-right: 5px;
}

/* Order Status */
.order-status {
  font-weight: bold;
  border-radius: 6px;
  padding: 5px 10px;
  display: inline-block;
  font-size: 0.85rem;
  text-align: center;
}

/* Different Status Colors */
.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-shipped {
  background-color: #cce5ff;
  color: #004085;
}

.status-delivered {
  background-color: #d4edda;
  color: #155724;
}

.status-canceled {
  background-color: #f8d7da;
  color: #721c24;
}

.status-default {
  background-color: #e2e3e5;
  color: #383d41;
}

/* Mobile Responsive */
@media (max-width: 430px) {
  .order-card {
    width: 150px;
  }

  .custom-carousel {
    height: 140px;
  }

  .product-name {
    font-size: 0.85rem;
  }

  .product-description {
    font-size: 0.7rem;
  }

  .order-info p {
    font-size: 0.75rem;
  }

  .order-status {
    font-size: 0.75rem;
    padding: 3px 6px;
  }
}
</style>
