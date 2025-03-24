<template>
  <div class="cart-container" v-if="mycarts.length > 0">
    <div class="product-section">
      <h3>კალათა</h3>
      <div class="card" v-for="(item, index) in mycarts" :key="index">
        <div class="action-buttons">
          <span class="close" @click="deleteCart(item.id, item.size)">
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
          <div class="product-name">{{ item.name }}</div>


          <div class="quantity-control">
            <button class="quantitybtn" @click="updatequantity(item.id, 'decrement', item.size)">-</button>
            <span class="quantity">{{ item.quantity }}</span>
            <button class="quantitybtn" @click="updatequantity(item.id, 'increment', item.size)">+</button>
          </div>

          <div class="price">{{ item.price }} <i class="fa-solid fa-lari-sign"></i></div>

          <div class="size-select">
            <select v-model="changedsize[item.id]" @change="updateSize(item.id)">
              <option v-for="(colors, size) in item.availablesize" :value="size" :key="size">
                {{ size }}
              </option>
            </select>
          </div>

          <div class="size-select">
            <select v-model="selectedColor[item.id]" @change="updateSelectedColor(item.id)">
              <option v-for="color in item.availablesize[changedsize[item.id]]" :value="color" :key="color">
                {{ color }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="payment-section">
      <div class="checkout">
        <h3>სულ: {{ allprice }} <i class="fa-solid fa-lari-sign"></i></h3>
        <button class="checkbtn" @click="checkout">გადახდა</button>
      </div>
    </div>
  </div>

  <div v-if="apiLoaded && this.mycarts.length === 0">
    <div class="cart-container-empty">
      <div class="cart-icon">
        <i class="fa-solid fa-cart-shopping outline-icon"></i>
        <span class="cart-count">0</span>
      </div>
      <p class="message">შეიყვანეთ კალათში ნივთები, შესაძენად</p>
      <div class="cart-buttons">
        <a href="/ka/product?section=discount" class="btn-primary">ფასდაკლებები</a>
        <a href="/" class="btn-secondary">მთავარი ვებსაიტი</a>
      </div>
    </div>
  </div>
</template>

<script>
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';
import api from '@/api';

export default {
  name: 'ShoppingCart',

  data() {
    return {
      mycarts: [],
      allprice: 0,
      verfifyerrormessage: '',
      currentLanguage: localStorage.getItem('selectedLanguage'),
      changedsize: {},
      selectedColor: {},
      apiLoaded: false
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
      try {
        const guest_token = localStorage.getItem("guest_token") || crypto.randomUUID();
        if (!localStorage.getItem("guest_token")) {
          localStorage.setItem("guest_token", guest_token);
        }

        const mappedcart = this.mycarts.map(item => ({
          guest_token,
          quantity: item.quantity || 1,
          name: item.name,
          product_id: item.id,
          type: "cart",
          color: this.selectedColor[item.id] || "Select...",
          size: item.size,
          retail_price: item.retail_price,
          total_price: item.total_price
        }));

        await api.post("/temporder", { products: mappedcart }, {
          tokenRequired: true
        });

        this.$router.push({ name: "checkout" });

      } catch (error) {
        console.error("Error during checkout:", error);
      }
    },

    async getCart() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Authentication required');
        return;
      }

      try {
        const response = await api.get('mycart', {
          tokenRequired: true
        });

        this.mycarts = response.data.products;
        this.allprice = response.data.totalPrice;

        this.mycarts.forEach(item => {
          this.changedsize[item.id] = item.size;
          this.selectedColor[item.id] = item.color || "Select..."; // Ensure color selection is required
        });

      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        this.apiLoaded = true;
      }
    },

    async updateQuantity(id, action, size) {
      try {
        await api.post(`quantity/${id}/${action}`, { size }, {
          tokenRequired: true
        });
        this.getCart();
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    },

    async updateSize(itemId) {
      const selectedSize = this.changedsize[itemId];
      const item = this.mycarts.find(i => i.id === itemId);
      if (!item) return;

      try {
        await api.post(`/size/${itemId}`, { size: item.size, newsize: selectedSize }, {
          tokenRequired: true
        });

        this.updateSelectedColor(itemId);

      } catch (error) {
        console.error("Error updating size:", error);
      }
    },

    async updateSelectedColor(itemId) {
      const size = this.changedsize[itemId];
      const item = this.mycarts.find(i => i.id === itemId);
      if (!item) return;

      const color = this.selectedColor[itemId] || "Select...";

      try {
        await api.post(`/color/${itemId}`, { size, color }, {
          tokenRequired: true
        });
      } catch (error) {
        console.error("Error updating color:", error);
      }
    },

    async deleteCart(id, size) {
      try {
        await api.post(`delete/${id}/cart`, {}, {
          params: { size },
          tokenRequired: true
        });
        this.getCart();
      } catch (error) {
        console.error("Error deleting cart item:", error);
      }
    }
  },

  mounted() {
    this.getCart();
  }
};
</script>


<style scoped>
.cart-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px;
}

.product-section,
.payment-section {
  width: 100%;
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
  width: 80%;
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

.checkout {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.checkbtn {
  padding: 12px 24px;
  background-color: #7a1dff;
  width: 30%;
  height: 50px;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.checkbtn:hover {
  background-color: #1c7ed6;
}

.cart-container-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
  color: #333;
}

.cart-icon {
  position: relative;
  margin-bottom: 20px;
}

.outline-icon {
  color: #9b51e0;
  font-size: 4rem;
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
  font-size: 16px;
  font-weight: 500;
  color: #555;
  margin-bottom: 20px;
}

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
  font-size: 16px;
  font-weight: 700;
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

@media (max-width: 768px) {
  .cart-container {
    flex-direction: column;
  }

  .product-section,
  .payment-section {
    width: 100%;
  }

  .data {
    flex-direction: column;
  }
}
</style>
