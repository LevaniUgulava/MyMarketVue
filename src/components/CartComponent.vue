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
    <button class="quantitybtn" v-if="item.quantity > 1"
      @click="updatequantity(item.id, 'decrement',item.size)">-</button>
    <span class="quantity">{{ item.quantity }}</span>
    <button class="quantitybtn" @click="updatequantity(item.id, 'increment',item.size)">+</button>
  </div>
  <p>{{item.price}}</p>
  <p>
    <select v-model="changedsize[item.id]" @change="updatesize(item.id, item.size, changedsize[item.id])">
      <option v-for="(size, index) in item.availablesize" :value="size" :key="index">
        {{ size }}
      </option>
    </select>
  </p>


  <span class="close" @click="deletecart(item.id, item.size)"
    :title="currentLanguage==='ka' ? 'პროდუქტის წაშლა' : 'Remove product'">
    <i class="fas fa-trash-alt"></i>
  </span>
  <router-link :to="{ path: `/${currentLanguage}/product/${item.id}` }" class="product-link"
    :title="currentLanguage==='ka' ? 'პროდუქტის დეტალების ნახვა' : 'View product details'">
    <i class="fas fa-info-circle"></i> <span class="details-link">Details</span>
  </router-link>


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
    <div class="input-container">
      <input type="text" id="shipping" placeholder=" " v-model="data.address" />
      <label for="shipping">{{$t("cart.shippinplaceholder")}}</label>
    </div>
  </div>
  <div class="checkout-item">
    <div class="input-container">
      <input type="number" id="phone" placeholder=" " v-model="data.phone" />
      <label for="phone">{{$t("cart.phoneplaceholder")}}</label>
    </div>
  </div>
  <div class="button-container">
    <button class="checkbtn" @click="checkout">{{$t("cart.checkout")}}</button>
  </div>

</div>
</div>

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
      verfifyerrormessage: '',
      data: {
        address: null,
        phone: null
      },
      currentLanguage: localStorage.getItem('selectedLanguage'),
      changedsize: {},
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
            this.verfifyerrormessage = error.response.data.message;
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

        this.mycarts = response.data.products;
        this.allprice = response.data.totalPrice;
        this.mycarts.forEach(Element => {
          this.changedsize[Element.id] = Element.size;
        });

      } catch (error) {
        console.log(error);
      }
    },

    async updatequantity(id, action, size) {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`quantity/${id}/${action}`, {
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
    async updatesize(id, oldsize, newsize) {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(`size/${id}`, { size: oldsize, newsize: newsize }, {
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

    async deletecart(id, size) {
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
p {
  margin: 10px 0;
}

select {
  padding: 10px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  color: #333;
  outline: none;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  position: relative;
}

select::after {
  content: '▼';
  font-size: 12px;
  color: #555;
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

select:focus,
select:hover {
  border-color: rgba(76, 175, 80, 0.25);
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

option {
  padding: 10px;
  font-size: 16px;
  background-color: #fff;
  color: #333;
}

option:checked {
  background-color: rgba(76, 175, 80, 0.25);
  color: #fff;
}

option:disabled {
  color: #aaa;
  background-color: #f5f5f5;
}

.product-link {
  text-decoration: none;
  color: #1e90ff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.product-link:hover {
  color: #1c7ed6;
  background-color: #a5cdf0;
  box-shadow: 0 0 8px rgba(76, 128, 240, 0.533);

}

.details-link {
  font-weight: bold;
  cursor: pointer;
}

.fas.fa-info-circle {
  font-size: 1rem;
}

.close {
  color: #ff5252;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  border-radius: 8px;
  transition: color 0.3s;
}

.close:hover {
  background-color: #f69191;
  box-shadow: 0 0 8px rgba(255, 82, 82, 0.5);
}

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

.input-container {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 6px;
}

input {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
  font-size: 0.9rem;
  color: #555;
  outline: none;
  transition: all 0.3s ease;
  background: none;
}

input::placeholder {
  color: transparent;
}

label {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: #aaa;
  transition: all 0.3s ease;
  pointer-events: none;
}

input:focus+label,
input:not(:placeholder-shown)+label {
  top: -10px;
  font-size: 0.8rem;
  color: #333;
  background: white;
  padding: 0 5px;
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
  padding: 0.3rem 0.5rem;
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

@media (min-width: 375px) and (max-width: 430px) {
  h3 {
    font-size: 0.7rem;
  }

  .close {
    font-size: 0.9rem;
  }

  .product-link {
    margin-top: 10px;
    gap: 0.5rem;
    font-size: 0.7rem;

  }

  .back-to-shop {
    margin-top: 3rem;
    font-size: 0.6rem;
  }

  .checkout {
    padding: 10px;
  }

  .checkout-item input {
    padding: 10px;
    width: 90%;
    font-size: 0.6rem;
  }

  .checkout-item label {
    font-size: 0.6rem
  }

  .checkbtn {
    padding: 6px 8px;
    border-radius: 5px;
    font-size: 0.6rem;
    transition: background-color 0.3s ease;
  }

  .data {
    display: inline;
    flex-direction: row;
    width: 50%;
    align-items: center;
    background-color: #f0f2f5;
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
  }

  p {
    font-size: 0.6rem
  }

  .quantity {
    font-size: 0.6rem
  }

  .quantitybtn {
    padding: 0.3rem 0.5rem
  }

  .card {
    padding: 10px;
  }

  .custom-carousel {
    width: 50%;
  }

}
</style>
