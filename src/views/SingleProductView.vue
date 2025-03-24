<template>
  <div class="product-page" v-if="singleproduct">
    <Message :message="message" @close="message = ''" :backgroundColor="'rgba(76, 175, 80, 0.25)'"
      :textColor="'#004d40'" />
    <Message :message="errormessage" @close="errormessage = ''" />

    <Breadcrumb class="bread" :maincategory="singleproduct.MainCategory" :category="singleproduct.Category"
      :subcategory="singleproduct.SubCategory" :name="singleproduct.name" />

    <div class="product-container">
      <div class="product-content">
        <div class="thumbnail-container">
          <div v-for="(image, index) in singleproduct.image_urls" :key="index" class="thumbnail-item"
            :class="{ active: image === selectedImage }" @click="selectedImage = image">
            <img :src="image" alt="Thumbnail" class="thumbnail-image" />
          </div>
        </div>

        <div class="product-main-image">
          <img :src="selectedImage" alt="Product Image" class="product-image" />
        </div>

        <div class="product-info">
          <h1 class="product-name">{{ singleproduct.name }}</h1>
          <p class="section-title">მოკლე აღწერა:</p>
          <p class="product-description">{{ singleproduct.description }}</p>
          <p class="section-title">დეტალები:</p>
          <div>
            <ul>
              <li>
                ზომები:
                <div class="size-container">
                  <div v-for="item in singleproduct.size"
                    :class="['size-item', { active: clicked && selectedSize === item.size }]" :key="item.size"
                    @click="handleClick(item)">
                    {{ item.size }}
                  </div>
                </div>
              </li>
              <li>
                ფერი:

                <div class="color-container">
                  <div v-for="(item, index) in (clicked ? sizecolors : allcolors)" :key="index"
                    :class="['color-item', { active: cclick && selectedColor === item }]" @click="colorclick(item)">
                    {{ item.color }}
                  </div>
                </div>

              </li>
            </ul>
          </div>
          <p class="section-title">დამატებითი ინფორმაცია:</p>
          <ul>
            <li>მასალა:</li>
            <li>მომწოდებელი:</li>
            <li>მწარმოებელი:</li>
          </ul>
        </div>
      </div>

      <div class="left-section">
        <p class="price">
          {{ singleproduct.discountprice }} <i class="fa-solid fa-lari-sign"></i>
          <span class="original-price" v-if="singleproduct.discountstatus || singleproduct.discount">
            <s>{{ singleproduct.price }}</s>
          </span>
          <span v-if="singleproduct.discountstatus" class="discount-square status-discount">-{{
            singleproduct.discountstatus.discount
            }}%</span>

          <span v-else-if="singleproduct.discount" class="discount-square default-discount">-{{ singleproduct.discount
          }}%</span>
        </p>
        <p class="delivery-info">
          <i class="fa-solid fa-truck"></i> საქართველოს ფოსტის გარანტია
        </p>
        <div class="quantity-control">
          <button class="quantitybtn" @click="updatequantity('decrement')">-</button>
          <span class="quantity">{{ quantity }}</span>
          <button class="quantitybtn" @click="updatequantity('increment')">+</button>
        </div>
        <button class="buy" @click="redirect">ყიდვა</button>
        <button class="addbtn" @click="addToCart()">კალათაში დამატება</button>

      </div>
    </div>
    <!-- <StarRatingComponent class="star" :rate="rate" :singleid="singleproduct.id" :getproduct="getproduct" /> -->
    <hr class="custom-line" />
  </div>
</template>


<script>
import 'vue3-carousel/dist/carousel.css';
import Message from '@/components/Message/MessageComponent.vue';
import Breadcrumb from '@/components/BreadcrumbComponent.vue';
import api from '@/api';

export default {
  props: ['id'],
  components: {
    Breadcrumb,
    Message,

  },
  data() {
    return {
      singleproduct: null,
      message: null,
      errormessage: null,
      quantity: 1,
      size: null,
      rate: 0,
      selectedSize: null,
      selectedColor: null,
      selectedImage: null,
      selectedColorquantity: 1,
      allcolors: [],
      sizecolors: [],
      clicked: false,
      cclick: false
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
    singleproduct(newProduct) {
      if (newProduct && newProduct.image_urls.length > 0) {
        this.selectedImage = newProduct.image_urls[0];
      }
    },
  },
  methods: {
    async redirect() {
      try {
        const guest_token = localStorage.getItem("guest_token") || crypto.randomUUID();

        if (!localStorage.getItem("guest_token")) {
          localStorage.setItem("guest_token", guest_token);
        }
        const quantity = this.quantity || 1;
        const data = [{
          guest_token: guest_token,
          quantity: quantity,
          name: this.singleproduct.name,
          product_id: this.id,
          size: this.selectedSize,
          type: "direct",
          color: this.selectedColor.color,
          retail_price: this.singleproduct.discountprice,
          total_price: quantity * this.singleproduct.discountprice,
        }];
        await api.post("/temporder", { products: data }, {
          tokenRequired: true
        });

        this.$router.push({ name: "checkout" });

      } catch (error) {
        console.error("Error during redirection or API request:", error);
      }

    },

    async updatequantity(action) {
      switch (action) {
        case 'increment':
          if (this.selectedColorquantity === this.quantity) {
            this.quantity;
          } else {
            this.quantity++
          }
          break;
        case 'decrement':
          if (this.quantity < 1) {
            this.quantity;
          } else {
            this.quantity--

          }
          break;
        default:
          break;
      }
    },
    handleClick(item) {
      this.selectedSize = item.size;
      this.sizecolors = item.details;
      this.clicked = true;
    },
    colorclick(item) {
      this.selectedColor = item;
      this.selectedColorquantity = item.quantity;
      this.cclick = true;
    },
    async getproduct() {
      try {
        const response = await api.get(`display/${this.id}`, {
          tokenRequired: true
        });
        this.singleproduct = response.data.data;
        this.rate = response.data.data.MyRate;

        this.allcolors = this.singleproduct.size.flatMap(element =>
          element.details
        );
        console.log(this.allcolors);

      } catch (error) {
        this.errormessage = "An error occurred while loading the data.";
        console.error(error);
      }
    },
    async addToCart() {

      try {
        const response = await api.post(
          `addcart/${this.id}`,
          { size: this.size, type: this.singleproduct.size_type, quantity: this.quantity },
          { tokenRequired: true }
        );
        this.message = response.data.message;
      } catch (error) {
        this.errormessage = "Failed to add to cart.";
        console.log(error);
      }
    },
  },
  mounted() {
    this.getproduct();
  },
};
</script>
<style scoped>
.custom-line {
  border: none;
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;
  margin-top: 10%;
}


.color-container,
.size-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
}

.color-item,
.size-item {
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #7a1dff;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  color: #7a1dff;
  cursor: pointer;
  transition: 0.3s;
  text-transform: uppercase;
}

.color-item.active,
.size-item.active {
  background-color: #7a1dff;
  color: white;
  border: 2px solid #5e14cc;
}

.left-section {
  display: flex;
  flex-direction: column;
  border: 1px solid #d1d1d1;
  align-items: center;
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  height: fit-content;
  width: 100%;
  max-width: 300px;
}

.product-name {
  font-size: 20px;
  color: black;
}

ul li {
  font-size: 13px;
}

.product-description {
  font-size: 13px;

}

.section-title {
  font-size: 15px;
  color: #2b2731;
  font-weight: 700;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
}

.discount-square {
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 6px;
}

.status-discount {
  background: gold;

}

.default-discount {
  background: #e60000;
}

.addbtn,
.buy {
  padding: 14px 20px;
  border-radius: 8px;
  width: 100%;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  margin-top: 10px;
  transition: 0.3s;
}

.buy {
  background-color: #7a1dff;
  color: #fff;
  border: none;
}

.buy:hover {
  background-color: #5e14cc;
}

.addbtn {
  background-color: #fff;
  color: #7a1dff;
  border: 1px solid #7a1dff;
}

.addbtn:hover {
  background-color: #f3e8ff;
}

.contact {
  display: flex;
  align-items: center;
  background: #f7f7f7;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.contact i {
  color: #007aff;
  margin-right: 8px;
}


.product-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: auto;
  padding: 30px;
}

.product-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 3%;
  gap: 30px;
}

.product-content {
  display: flex;
  width: 100%;
  gap: 10px;
}

.thumbnail-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-right: 20px;
}

.thumbnail-item {
  width: 50px;
  height: 50px;
  border: 1.5px solid transparent;
  cursor: pointer;
}

.thumbnail-item.active {
  border-color: #7a1dff;
  border-radius: 8px;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}


.product-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 30px;
  align-items: flex-start;
  /* Ensure alignment is stable */
}

.product-main-image {
  flex: 0 0 350px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-info {
  flex: 1;
  min-width: 300px;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: #2b2731;
  margin-bottom: 15px;
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


@media (max-width: 768px) {
  .product-container {
    flex-direction: column;
  }

  .star {
    margin-top: 15%;
  }

  .product-content,
  .left-section {
    width: 100%;
    margin: auto;
    display: table-column;
  }

  .quantity-control {
    justify-content: center;
    width: auto;
  }

  .thumbnail-container {
    flex-direction: row;
  }
}
</style>
