<template lang="">
  <div>
    <h3>{{$t("cart.shoppingcart")}}</h3>
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
          <p>{{item.price}}</p>
        <p>{{item.size}}</p>
           <span class="close" @click="deletecart(item.id,item.size)">&times;</span>

           <p>see details</p>
      </div>
    </div>
   <div class="back-to-shop">
          <a href="/">&leftarrow; </a><span class="text-muted">{{$t("cart.backtoshop")}}</span>
    </div>   
    <div class="checkout">
      <div>
      <h3>{{$t("cart.summary")}}: {{allprice}}</h3>
      </div>

      <div class="checkout-item">
        <label for="shipping">{{$t("cart.shipping")}}:</label>
        <input type="text" id="shipping" :placeholder="$t('cart.shippinplaceholder')" v-model="data.address" />
      </div>
      <div class="checkout-item">
        <label for="phone">{{$t("cart.phone")}}:</label>
        <input type="number" id="phone" :placeholder="$t('cart.phoneplaceholder')" v-model="data.phone" />
      </div>
    </div>
  <div class="button-container">
      <button class="checkbtn" @click="checkout">{{$t("cart.checkout")}}</button>
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
      allprice: 0,
      verfifyerrormessage:'',
      data:{
        address:null,
        phone:null
      }
    };
  },
    components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  methods: {
  emitmessage() {
  this.$emit('verfifyerrormessage', this.verfifyerrormessage);
},
async checkout() {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('checkout', {
          params: {
                address: this.data.address,
                phone: this.data.phone
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(response.data); 
    } catch (error) {
        if (error.response) {
            console.error('Error Response:', error.response.data);
            if (error.response.status === 403) {
                this.verfifyerrormessage=error.response.data.message; 
                this.emitmessage(); 
                
  window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
            } else {
                alert(`Error: ${error.response.status} - ${error.response.data.message}`);
            }
        } else if (error.request) {
            console.error('No Response:', error.request);
            alert('No response received. Please check your network.');
        } else {
            console.error('Error:', error.message);
            alert('An error occurred: ' + error.message);
        }
    }
},

    async getCart() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Need auth');
        return;
      }

      try {
        const response = await axios.get('mycart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

         console.log(response.data.products)
        this.mycarts = response.data.products;
        this.allprice = response.data.totalPrice;

      } catch (error) {
        console.log(error);
      }
    },

    async updatequantity(id, action, size) {
         console.log(size)
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`quantity/${id}/${action}`,{
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
        const response = await axios.post(`delete/${id}/cart`, {}, {
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
  background-color: #fff;
  border-radius: 12px;
  margin-top: 3%;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
}

.data {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  background-color: #f0f2f5;
  padding: 1rem; 
  border: 1px solid #e0e0e0; 
  border-radius: 8px; 
  margin: 1rem 0; 
  gap: 1rem; 
}

.checkout {
  background-color: #fff;
  border-radius: 12px;
  margin-top: 3%;
  padding: 20px;
  width: 100%;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.checkout-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.checkout-item label {
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
}

.checkout-item input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
  font-size: 0.9rem;
  color: #555;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.checkbtn {
  padding: 12px 24px;
  background-color: #1e90ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.checkbtn:hover {
  background-color: #1c7ed6;
  color: #fff;
}

.back-to-shop {
  margin-top: 4rem;
  font-size: 0.9rem;
  color: #1e90ff;
}

.custom-carousel {
  width: 20%; 
  max-width: 400px;
  margin-right: 20px;
}

.img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover; 
}

.quantitybtn {
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.quantitybtn:hover {
  background-color: #f0f2f5;
  color: #333;
}

.quantity {
  font-weight: bold;
  font-size: 1.1rem;
}

</style>
