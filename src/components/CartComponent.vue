<template lang="">
  <div>
    <h3>Shopping Cart</h3>
    <div class="card" v-for="(item, index) in mycarts" :key="index">
    <carousel :items-to-show="1" class="custom-carousel">
        <slide v-for="(image, index) in item.image_urls" :key="index">
          <img :src="image" alt="Product Image" class="img" />
        </slide>
        <template #addons>
          <navigation />
          <pagination />
        </template>
      </carousel> 
           <div class="data">

        <p>{{item.name}}</p>
    <div class="col quantity-control">
            <button class="quantitybtn" v-if="item.quantity > 1" @click="updatequantity(item.id, 'decrement',item.size)">-</button>
            <span class="quantity">{{ item.quantity }}</span>
            <button class="quantitybtn" @click="updatequantity(item.id, 'increment',item.size)">+</button>
          </div>
          <p>{{item.discountprice}}</p>
        <p>{{item.size}}</p>
           <span class="close" @click="deletecart(item.id,item.size)">&times;</span>

           <p>see details</p>
      </div>
    </div>
   <div class="back-to-shop">
          <a href="/">&leftarrow; </a><span class="text-muted">Back to shop</span>
    </div>   
    <div class="checkout">
      <div>
      <h3>Summary: {{allprice}}</h3>
      </div>

      <div class="checkout-item">
        <label for="shipping">Shipping:</label>
        <input type="text" id="shipping" placeholder="Enter shipping details" />
      </div>
      <div class="checkout-item">
        <label for="promocode">Promocode:</label>
        <input type="text" id="promocode" placeholder="Enter promo code" />
      </div>
    </div>
  <div class="button-container">
      <button class="checkbtn" @click="checkout">Checkout</button>
    </div>  </div>
</template>
<script>
import axios from 'axios';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

export default {
  name: 'ShoppingCart',
  data() {
    return {
      mycarts: [],
      allprice: 0
    };
  },
    components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  methods: {
      async checkout(){
        const token=localStorage.getItem('token');
      try{
        const response = await axios.get('http://127.0.0.1:8000/api/checkout',{
            headers:{
            'Authorization': `Bearer ${token}`
            }
        });

        console.log(response);

      }catch(error){
       console.log(error);
      }
      },

    async getCart() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Need auth');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/mycart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

         console.log(response.data)
        this.mycarts = response.data.products;
        this.allprice = response.data.totalPrice;

      } catch (error) {
        console.log(error);
      }
    },

    async updatequantity(id, action, size) {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/quantity/${id}/${action}`,{
                params: { size: size },

          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        response;
        this.getCart(); 
      } catch (error) {
        console.log(error);
      }
    },

    async deletecart(id,size) {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(`http://127.0.0.1:8000/api/delete/${id}/cart`, {}, {
          params: { size: size },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        response;
        this.getCart(); 
      } catch (error) {
        console.log(error);
      }
    }
  },
  mounted() {
    this.getCart();
  }
}
</script>


<style scoped>
.card {
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
  background-color:blue;
  padding: 1vh; 
  border: 1px solid #ddd; 
  background-color: #f9f9f9; 
  border-radius: 5px; 
  margin: 1vh 0; 
  gap: 1vh; 
}


.checkout {
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  margin-top: 3%;
  padding: 20px;
  width: 100%;
}

.checkout-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.checkout-item label {
  margin-bottom: 5px;
  font-weight: bold;
}

.checkout-item input {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
}
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.checkbtn {
  padding: 10px 20px;
  background-color: black;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 40%;

}

.checkbtn:hover {
  color: #ccc;
}
.back-to-shop {
  margin-top: 4rem;
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
.quantitybtn{
  border:1px solid black;
  border-radius:5px;
  cursor:pointer;
}
.quantitybtn:hover{
  background-color: rgba(255,255,255,255);
}
</style>
