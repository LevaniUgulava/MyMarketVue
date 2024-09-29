<template lang="">  
    <div class="card-container">
        <div class="data">
    <carousel :items-to-show="1" class="custom-carousel">
        <slide v-for="(image, index) in product.image_urls" :key="index">
          <img :src="image" alt="Product Image" class="img" />
        </slide>
        <template #addons>
          <navigation />
          <pagination />
        </template>
      </carousel>
             <p>{{product.name}}</p>
             <p>{{product.description}}</p>
             <p>{{product.size}}</p>
             <p>{{product.discountprice}}</p>
             <p>{{product.quantity}}</p>
             <p>{{product.total_price}}</p>
             <p>asdasd</p>

        </div>
    </div>


</template>
<script>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

export default {
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
 props: {
    product: {
      type: Object,
      required: true,
    },
 
  },    



}
</script>
<style scoped>
    .card-container {
    display: flex;
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    margin-top: 3%;
    box-shadow: 2px 4px 10px 0 rgba(0, 0, 0, 0.2);
    padding: 20px;
    width: 100%;
}

.data {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%; 
    align-items: center; 
}

.custom-carousel {
    width: 15%; 
    max-width: 400px;
    margin-right: 20px;
}

.img {
    width: 50%;
    height: auto;
    border-radius: 8px;
    object-fit: cover; 
}

    
</style>