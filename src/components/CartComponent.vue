<template lang="">
  <div class="cart-container" v-if="mycarts.length >0">
    <div class="product-section">
      <h3>{{$t("cart.shoppingcart")}}</h3>
      <div class="card" v-for="(item, index) in mycarts" :key="index">
        <div class="action-buttons">
          <span class="close" @click="deletecart(item.id, item.size)">
            <i class="fas fa-trash-alt"></i>
          </span>
          <router-link :to="{ path: `/${currentLanguage}/product/${item.id}` }" class="product-link">
            <i class="fas fa-info-circle"></i> <span class="details-link"></span>
          </router-link>
        </div>

        <div class="product-info">
          <carousel :items-to-show="1" class="custom-carousel">
            <slide v-for="(image, index) in item.image_urls" :key="index">
              <img :src="image" alt="Product Image" class="img" />
            </slide>
          </carousel>
        </div>
        
        <div class="data">
          <div class="product-name">{{item.name}}</div>
          
          <div class="quantity-control">
            <button class="quantitybtn" @click="updatequantity(item.id, 'decrement', item.size)">-</button>
            <span class="quantity">{{ item.quantity }}</span>
            <button class="quantitybtn" @click="updatequantity(item.id, 'increment', item.size)">+</button>
          </div>

          <div class="price">{{item.price}}</div>

          <!-- Size Selection Dropdown -->
          <div class="size-select">
            <select v-model="changedsize[item.id]" @change="updatesize(item.id, item.size, changedsize[item.id])">
              <option v-for="(size, index) in item.availablesize" :value="size" :key="index">
                {{ size }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="payment-section">
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
  </div>
  <div v-else>
    <div class="cart-container-empty">
      <div class="cart-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="64" height="64">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l3.6 7.2M5 13h12m-3 5h-3m5-5h-3m0 0a3 3 0 100 6 3 3 0 000-6zM5 3l1.2 4M4 15h3a6 6 0 116 0h3" />
        </svg>
        <span class="cart-count">0</span>
      </div>

      <p class="message">შეიყვანეთ კალათში ნივთები, შესაძენად</p>

      <div class="cart-buttons">
        <a href="/" class="btn-primary">ფასდაკლებები</a>
        <a href="/" class="btn-secondary">მთავარი ვებსაიტი</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide } from 'vue3-carousel'

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
    Slide
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
.cart-container-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  color: #333;
}

/* Shopping Cart Icon */
.cart-icon {
  position: relative;
  margin-bottom: 20px;
}

.cart-icon svg {
  color: #9b51e0;
  width: 72px;
  height: 72px;
}

/* Cart Count (0) */
.cart-count {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: red;
  color: white;
  font-size: 14px;
  font-weight: bold;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

/* Empty Message */
.message {
  font-size: 1.2rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 20px;
}

/* Buttons Wrapper */
.cart-buttons {
  display: flex;
  gap: 15px;
}

/* Primary Button */
.btn-primary {
  text-decoration: none;
  background-color: #9b51e0;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #7e3ae3;
}

/* Secondary Button */
.btn-secondary {
  text-decoration: none;
  color: #9b51e0;
  font-size: 1rem;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  border: 2px solid #9b51e0;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #9b51e0;
  color: white;
}


.message {
  font-size: 16px;
  color: #333;
  margin-top: 20px;
}

.btn,
.btn-second {
  background-color: #6c5ce7;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
}

.btn:hover,
.btn-second:hover {
  background-color: #4e4ac7;
}

.cart-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  padding: 20px;
}

.product-section {
  width: 70%;
}

.payment-section {
  width: 30%;
}

.card {
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
  border-radius: 12px;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
  position: relative;
}

.product-info {
  width: 20%;
  margin-right: 15px;
}

.custom-carousel {
  width: 100%;
}

.img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

.data {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 80%;
}

.product-name {
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 10px;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px;
  background-color: #fff;
}

.quantitybtn {
  background-color: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #888;
  padding: 0 10px;
}

.quantitybtn:hover {
  color: black;

}

.quantitybtn:focus {
  outline: none;
}

.quantity {
  font-size: 15px;
  padding: 0 10px;
  min-width: 30px;
  text-align: center;
}

.price {
  font-size: 1rem;
  margin: 5px 0;
}

.size-select select {
  padding: 5px;
  font-size: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  color: #333;
  outline: none;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.size-select select:focus {
  border-color: rgba(76, 175, 80, 0.25);
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Action buttons positioned at the top right corner */
.action-buttons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.close {
  cursor: pointer;
}

.product-link {
  text-decoration: none;
  color: #1e90ff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.details-link {
  font-weight: bold;
}

.checkout {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
}

.checkout-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.input-container {
  position: relative;
  margin-bottom: 6px;
}

input {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
  font-size: 0.9rem;
}

label {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: #aaa;
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
}

.checkbtn:hover {
  background-color: #1c7ed6;
}

@media (max-width: 768px) {
  .cart-container {
    flex-direction: column;
  }

  .product-section {
    width: 100%;
  }

  .payment-section {
    width: 100%;
  }

  .data {
    flex-direction: column;
  }
}
</style>
