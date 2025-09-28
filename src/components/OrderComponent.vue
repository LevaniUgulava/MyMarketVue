<template>
  <div class="order-card-component">
    <carousel v-if="isimageshown" :items-to-show="1" class="custom-carousel">
      <slide v-for="(image, index) in product.image_urls" :key="index">
        <img :src="image" alt="Product Image" class="product-img" />
      </slide>
      <template #addons>
        <navigation />
      </template>
    </carousel>

    <div class="order-details">
      <div class="product-title">
        <span>დასახელება</span>
        <div>{{ product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name }}</div>
      </div>

      <div class="product-title">
        <span>ზომა</span>
        {{ product.size }}
      </div>
      <div class="product-title">
        <span>საცალო ფასი</span>
        <div>
          {{ product.retail_price }} <i class="fa-solid fa-lari-sign"></i>
        </div>
      </div>
      <div class="product-title">
        <span>რაოდენობა</span>
        {{ product.quantity }}
      </div>
      <div class="product-title">
        <span>სულ</span>
        <div>
          {{ product.total_price }} <i class="fa-solid fa-lari-sign"></i>
        </div>
      </div>

      <div class="product-title">
        <span>სტატუსი</span>
        {{ statusClass }}
      </div>
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
        case 'completed': return 'შესრულებულია'
        case 'pending': return 'მოლოდინის რეჟიმში'
        case 'canceled': return 'გაუქმებულია'
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
.order-card-component {
  display: flex;
  gap: 20px;

}

.product-img {
  max-width: 100%;
  border-radius: 10px;
}

.custom-carousel {
  width: 20%;

}

.product-title {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  font-size: 13px;
  font-weight: bold;
  color: #333;
}

.order-details {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 80%;
  align-items: center;
  justify-content: space-between;
}

span {
  color: #888;
}

@media (max-width: 768px) {
  .order-card-component {
    gap: 0px;

  }

  .order-details {
    flex-direction: column;
    gap: 5px;
    margin: auto;
    width: 40%;
  }

  .product-title {
    font-size: 12px;
    flex-direction: row;
  }

  .custom-carousel {
    width: 50%;
  }
}
</style>
