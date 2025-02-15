<template>
  <div class="product-card">
    <carousel :items-to-show="1" class="custom-carousel" v-if="isimageshown">
      <slide v-for="(image, index) in product.image_urls" :key="index">
        <img :src="image" alt="Product Image" class="img" />
      </slide>
      <template #addons>
        <navigation />
        <!-- <pagination /> -->
      </template>
    </carousel>
    <div class="product-details">
      <p class="product-name">{{ product.name }}</p>
      <p class="product-description">{{ product.description }}</p>
      <p class="product-size">
        <i class="fas fa-ruler"></i> {{$t('order.size')}}: {{ product.size }}
      </p>
      <p class="product-price">
        <i class="fas fa-tags"></i> {{$t('order.discount')}}: {{ product.discountprice }} <i class="fa-solid fa-lari-sign"></i>
      </p>
      <p class="product-quantity">
        <i class="fas fa-cubes"></i> {{$t('order.quantity')}}: {{ product.quantity }}
      </p>
      <p class="product-total">
        <i class="fa-solid fa-lari-sign"></i> {{$t('order.total')}}:{{ product.total_price }} <i class="fa-solid fa-lari-sign"></i>
      </p>
      <p class="product-status">{{$t('order.status')}}: {{ order_status }}</p>
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
  data() {
    return {
     isimageshown:true
    }
  },
 props: {
    product: {
      type: Object,
      required: true,
    },
    order_status:{
      type: String,
      required: true,
    }
  },

  mounted() {
    if(this.$route.path === '/admin/orders'){
      this.isimageshown=false;
    }
  },



}
</script>

<style scoped>
.product-card {
  width: 200px; 
  height: auto;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden; 
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.custom-carousel {
  border-radius: 12px; /* Rounded corners for the carousel */
  overflow: hidden; /* Ensure images stay within the carousel */
  margin-bottom: 15px;
  width: 100%; /* Full width of the card */
  height: 250px; /* Adjusted height for proportional image display */
  display: flex; /* Center image horizontally and vertically */
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0; /* Add a background color for empty spaces */
}

.img {
  max-width: 100%; /* Prevent image from exceeding container width */
  max-height: 100%; /* Prevent image from exceeding container height */
  object-fit: contain; /* Ensure the entire image is visible */
  display: block;
  border-radius: 12px; /* Match the carousel's rounded corners */
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1; /* Ensure the details section expands */
  overflow: hidden; /* Prevent text overflow */
}

.product-details p {
  margin: 0;
  font-size: 0.9rem; /* Slightly larger font for better readability */
  color: #333;
  text-overflow: ellipsis; /* Truncate long text */
  white-space: nowrap; /* Prevent wrapping */
  overflow: hidden; /* Hide overflowing text */
}

.product-status {
  font-weight: bold;
  color: #28a745;
  background-color: #eaffea;
  border-radius: 5px;
  padding: 3px 8px;
  display: inline-block;
  font-size: 0.85rem; /* Adjust size for consistency */
}
.checkbox-container {
  margin-top: 10px;
}

.checkbox-container input {
  margin-right: 5px;
}
@media (min-width: 375px) and (max-width: 430px) {
  .custom-carousel{
     width: 100%; /* Full width of the card */
     height: 150px;
  }
  .product-card{
      width: 135px; 
  }
  .product-details p{
    font-size: 0.6rem;
  }

}

</style>
