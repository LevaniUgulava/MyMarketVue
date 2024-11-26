<template>
  <div>
    <Message :message="message" @close="message=''"  :backgroundColor="'rgba(76, 175, 80, 0.25)'" 
  :textColor="'#004d40'" />
     <Message :message="errormessage" @close="errormessage=''" />
    <div class="product-container">
      <div class="product-content">
        <carousel :items-to-show="1" class="product-carousel">
          <slide v-for="(image, index) in singleproduct.image_urls" :key="index">
            <img :src="image" alt="Product Image" class="product-image" />
          </slide>
          <template #addons>
            <navigation />
            <pagination />
          </template>
        </carousel> 

        <div class="product-info">
          <h1 class="product-name">{{ singleproduct.name }}</h1>


<p class="price" v-if="singleproduct.discount === 0 && (!singleproduct.discountstatus || singleproduct.discountstatus.discount === 0)">
  {{ singleproduct.discountprice }} <i class="fa-solid fa-lari-sign"></i>
</p>
<p class="price" v-else>
  {{ singleproduct.discountprice }} <i class="fa-solid fa-lari-sign"></i>
  <span
    class="discount-square"
    :class="{
      'status-discount': singleproduct.discountstatus && singleproduct.discountstatus.discount > 0,
      'default-discount': (!singleproduct.discountstatus || singleproduct.discountstatus.discount === 0) && singleproduct.discount > 0
    }"
  >
    -{{ singleproduct.discountstatus && singleproduct.discountstatus.discount > 0 
      ? singleproduct.discountstatus.discount 
      : singleproduct.discount }}%
  </span>
</p>


          <p class="product-description">{{ singleproduct.description }}</p>

<div class="size-container">
  <div 
    v-for="item in getsizes" 
    :key="item" 
    :class="['size-item', { disabled: !availablesize.includes(item) }]" 
    :disabled="!availablesize.includes(item)"
    @click="handleClick(item)"
  >
    {{ item }}
  </div>
</div>




<h5 v-if="quantity">on the stock:{{ quantity }}</h5>
          <button class="addbtn" @click="addToCart()" >Add To Cart</button>

        </div>
        <a href="/" class="back">Back to shop</a>
      </div>
      <StarRatingComponent 
      :rate="rate" 
      :singleid="this.singleproduct.id"
      :getproduct="getproduct"
      />
      
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import StarRatingComponent from "@/components/StarRatingComponent.vue"
import Message from '@/components/Message/MessageComponent.vue';

export default {
  props: ['id'],
  components: {
    Carousel,
    Slide,
    Message,
    StarRatingComponent,
    Pagination,
    Navigation,
  },
  data() {
    return {
      singleproduct: {},
      getsizes:[],
      availablesize:[],
      message:null,
      errormessage:null,
      quantity:null,
      size:null,
      rate:0
    };
  },
    watch: {
    message(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.message = null;
        }, 3000);
      }
    },
    },
  methods: {
 handleClick(item) {
  if (this.availablesize.includes(item)) {
    this.singleproduct.size.forEach(element => {
      if (element.size.includes(item)) {
        this.quantity=element.quantity;
        this.size=element.size;
      }
    });
  }
},
    async getproduct() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`display/${this.id}`,{
          headers:{
            'Authorization':`Bearer ${token}`
          }
        });

        this.singleproduct = response.data.data[0];
        this.rate=response.data.data[0].MyRate;
        console.log(this.rate);
        this.availablesize = this.singleproduct.size.map(element => element.size);

      } catch (error) {
        console.log(error);
      }
    },
    
    async addToCart() {
      const token = localStorage.getItem('token');
      if (!token) {
       this.errormessage='Not authorized';
      }
      try {
         const response=await axios.post(
          `addcart/${this.id}`,
          {size:this.size},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.message = response.data.message
        console.log(response.data)
      } catch (error) {
        console.log(error);
      }
    },
    async Getsize(){
      try{
        const response=await axios.get('getSizes');
        this.getsizes=response.data.sizes;

      }catch(error){
         console.log(error);
      }
    },

    async comparesize(){
    const filteredSizes = this.getsizes.filter(x => x.singleproduct === this.singleproduct);
    return filteredSizes;   
     }
  },
  
  mounted() {
    this.getproduct();
    this.Getsize();
  },
};
</script>

<style scoped>
.back{
  text-decoration: none;
  margin-right: 2%;
  
}
.size-item.disabled {
  background-color: #f0f0f0;
  color: #ccc;
  cursor: not-allowed;
}

.addbtn{
  border: solid black 1px;
  width: 60%;
  height: 40px;
  background-color: #000;
  color: white;
  border-radius: 5px;
  margin-top: 10%;
}
.product-container {
  width: 100%;
  margin: 20px auto;
  margin-top: 2%;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-content {
  display: flex;
  align-items: flex-start;
}

.product-carousel {
  width: 30%;
  margin-right: 5%;
}

.product-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
}

.product-info {
  width: 65%;
  text-align: left;
  margin-top:10% ;
}

.product-name {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 15px;
}

.product-pricing {
  margin: 20px 0;
}

.price {
  font-size: 24px;
  font-weight: 700;
  color: #000;
}

.discount-price {
  font-size: 20px;
  color: grey;
  text-decoration: line-through;
  margin-left: 15px;
}

.discount {
  font-size: 20px;
  color: #27ae60;
  margin-left: 15px;
}

.product-description {
  font-size: 18px;
  line-height: 1.6;
  color: #555;
  margin-top: 20px;
}
.discount-square {
  display: inline-block;
  color: #fff;
  padding: 3px 7px;
  border-radius: 4px;
  margin-left: 10px;
  font-weight: bold;
  font-size: 15px;
}

/* Red for default discount */
.default-discount {
  background-color: #f00;
}

/* Gold for status-based discount */
.status-discount {
  background-color: gold;
}
.size-container {
  display: flex;

}

.size-item {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  background-color: #f9f9f9;
  transition: background-color 0.3s ease;
}

.size-item:hover {
  background-color: #e0e0e0;
}


</style>
