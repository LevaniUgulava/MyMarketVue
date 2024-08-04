<template>
  <div class="container custom-card">
    <div class="row">
      <div class="col-md-8 cart">
        <div class="title">
          <div class="row">
            <div class="col"><h4><b>Shopping Cart</b></h4></div>
            <div class="col align-self-center text-right text-muted">{{ mycarts.length }} items</div>
          </div>
        </div>
        <div v-for="item in mycarts" :key="item.id" class="row border-top border-bottom product">
          <div class="col-2">
            <img class="img-fluid" :src="item.image_urls" alt="Product Image">
          </div>
          <div class="col">
            <div class="row text-muted">{{ item.category }}</div>
            <div class="row">{{ item.name }}</div>
          </div>
          <div class="col quantity-control">
            <button class="quantitybtn" v-if="item.pivot.quantity > 1" @click="updatequantity(item.id, 'decrement')">-</button>
            <span class="quantity">{{ item.pivot.quantity }}</span>
            <button class="quantitybtn" @click="updatequantity(item.id, 'increment')">+</button>
          </div>
          <div class="col price-label">
            {{ item.discountprice }} <i class="fa-solid fa-lari-sign"></i>        <span class="close" @click="deletecart(item.id)">&times;</span>
          </div>
        </div>
        <div class="back-to-shop">
          <a href="/">&leftarrow;</a><span class="text-muted">Back to shop</span>
        </div>
      </div>
      <div class="col-md-4 summary" v-if="mycarts.length > 0">
        <div><h5><b>Summary</b></h5></div>
        <hr>
        <div class="row">
          <div class="col" style="padding-left:0;">ITEMS {{ mycarts.length }}</div>
          <div class="col text-right">{{ allprice }} <i class="fa-solid fa-lari-sign"></i></div>
        </div>
        <form>
          <p>SHIPPING</p>
          <select><option class="text-muted">Standard-Delivery-5.00</option></select>
          <p>GIVE CODE</p>
          <input id="code" placeholder="Enter your code">
        </form>
        <div class="row" style="border-top: 1px solid rgba(0,0,0,.1); padding: 2vh 0;">
          <div class="col">TOTAL PRICE</div>
          <div class="col text-right">{{ allprice + 5 }} <i class="fa-solid fa-lari-sign"></i></div>
        </div>
        <button class="btn">CHECKOUT</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ShoppingCart',
  data() {
    return {
      mycarts: [],
      allprice: 0
    };
  },
  methods: {
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

        this.mycarts = response.data.product;
        this.allprice = response.data.allprice;

      } catch (error) {
        console.log(error);
      }
    },

    async updatequantity(id, action) {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/quantity/${id}/${action}`, {
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

    async deletecart(id) {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(`http://127.0.0.1:8000/api/delete/${id}/cart`, {}, {
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
.custom-card {
  font-family: 'Your Custom Font', sans-serif !important;
  font-size: 16px !important;
  margin: auto;
  max-width: 1200px;
  width: 90%;
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
@media (max-width: 767px) {
  .custom-card {
    margin: 3vh auto;
  }
}
.cart {
  background-color: #fff;
  padding: 4vh 5vh;
  border-bottom-left-radius: 1rem;
  border-top-left-radius: 1rem;
}
@media (max-width: 767px) {
  .cart {
    padding: 4vh;
    border-bottom-left-radius: unset;
    border-top-right-radius: 1rem;
  }
}
.summary {
  background-color: #f7f7f7;
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
  padding: 4vh;
  color: rgb(65, 65, 65);
}
@media (max-width: 767px) {
  .summary {
    border-top-right-radius: unset;
    border-bottom-left-radius: 1rem;
  }
}
.row {
  margin: 0;
}
.title b {
  font-size: 1.5rem;
}
.product {
  margin: 0;
  padding: 2vh 0;
  display: flex;
  align-items: center;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.col-2, .col {
  padding: 0 1vh;
}
a {
  padding: 0 1vh;
  cursor: pointer;
}
.close {
  margin-left: auto;
  font-size: 1.5rem;
  cursor: pointer;
  color: red;
}
img {
  width: 4rem;
  height: auto;
}
.back-to-shop {
  margin-top: 4.5rem;
}
h5 {
  margin-top: 4vh;
}
hr {
  margin-top: 1.25rem;
}
form {
  padding: 2vh 0;
}
select {
  border: 1px solid rgba(0, 0, 0, 0.137);
  padding: 1.5vh 1vh;
  margin-bottom: 4vh;
  outline: none;
  width: 100%;
  background-color: rgb(247, 247, 247);
}
input {
  border: 1px solid rgba(0, 0, 0, 0.137);
  padding: 1vh;
  margin-bottom: 4vh;
  outline: none;
  width: 100%;
  background-color: rgb(247, 247, 247);
}
input:focus::-webkit-input-placeholder {
  color: transparent;
}
.btn {
  background-color: #000;
  border-color: #000;
  color: white;
  width: 100%;
  font-size: 0.9rem;
  margin-top: 4vh;
  padding: 1vh;
  border-radius: 0;
}
.btn:focus {
  box-shadow: none;
  outline: none;
  color: white;
  -webkit-user-select: none;
  transition: none;
}
.btn:hover {
  color: white;
}
a {
  color: black;
}
a:hover {
  color: black;
  text-decoration: none;
}
.price-label {
  font-weight: bold;
}
.quantity-control {
  display: flex;
  align-items: center;
}
.quantitybtn {
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  padding: 5px 10px;
  cursor: pointer;
  margin: 0 5px;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.quantitybtn:hover {
  background-color: #ddd;
}
.quantity {
  font-size: 16px;
}
#code {
  background-image: linear-gradient(to left, rgba(255, 255, 255, 0.253), rgba(255, 255, 255, 0.185)), url("https://img.icons8.com/small/16/000000/long-arrow-right.png");
  background-repeat: no-repeat;
  background-position-x: 95%;
  background-position-y: center;
}
</style>
