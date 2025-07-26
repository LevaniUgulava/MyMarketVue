<template>
  <div class="product-page" v-if="singleproduct">

    <Message v-if="message" :message="message" @close="message = ''" />
    <Message v-if="errormessage" :message="errormessage" @close="errormessage = ''" />

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
                <div class="message-container">
                  <span>ზომები:</span>
                  <span v-if="messageofsize" class="message">{{ messageofsize }}</span>
                </div>
                <div class="size-container">
                  <div v-for="item in singleproduct.size" :class="['size-item', { active: selectedSize === item.size }]"
                    :key="item.size" @click="handleClick(item)">
                    {{ item.size }}
                  </div>
                </div>
              </li>
              <li>
                <div class="message-container">
                  <span>ფერი:</span>
                  <span v-if="messageofcolor" class="message">{{ messageofcolor }}</span>
                </div>
                <div class="color-container">
                  <div v-for="(item, index) in (selectedSize ? sizecolors : allcolors)" :key="index"
                    :class="['color-item', { active: selectedColor === item }]" @click="colorclick(item)">
                    {{ selectedSize ? item.color : item }}
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <p class="section-title">დამატებითი ინფორმაცია:</p>
          <ul class="additional-ul">
            <li v-for="(item, index) in additionalinfo" :key="index">
              <span v-for="([key, value], innerIndex) in Object.entries(item)" :key="innerIndex" class="dotted-line">
                <span class="key">{{ key }}</span>
                <span class="dots"></span>
                <span class="value">{{ value }}</span>
              </span>
            </li>
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
        <div class="quantity-control">
          <div class="increment-wrapper">
            <div v-if="quantitydemessage" class="popup-message">
              {{ quantitydemessage }}
              <div class="arrow-down"></div>
            </div>
          </div>
          <button class="quantitybtn" @click="updatequantity('decrement')">-</button>

          <span class="quantity">{{ quantity }}</span>

          <div class="increment-wrapper">
            <div v-if="quantitymessage" class="popup-message">
              {{ quantitymessage }}
              <div class="arrow-down"></div>
            </div>
            <button class="quantitybtn" @click="updatequantity('increment')">+</button>
          </div>
        </div>

        <button class="buy" @click="redirect()">ყიდვა</button>
        <button class="addbtn" @click="addToCart()">კალათაში დამატება</button>
      </div>
    </div>
    <hr class="custom-line" />
    <div class="similar">
      <div class="title">
        <span>მსგავსი პროდუქტები</span>

      </div>
      <div class="products-wrapper">
        <ProductCardComponent v-for="(item, index) in similarproduct" :key="index" :initialproduct="item"
          @cart-updated="handleCartUpdated" @liked-message="handleunauthorizedlike"
          @cart-message="handleunauthorizedcart" />
      </div>
    </div>

  </div>
</template>


<script>
import 'vue3-carousel/dist/carousel.css';
import Message from '@/components/Message/MessageComponent.vue';
import Breadcrumb from '@/components/BreadcrumbComponent.vue';
import api from '@/api';
import ProductCardComponent from '@/components/ProductCardComponent.vue';

export default {
  props: ['id'],
  components: {
    Breadcrumb,
    Message,
    ProductCardComponent

  },
  data() {
    return {
      additionalinfo: [],
      singleproduct: null,
      similarproduct: [],
      message: null,
      quantitymessage: null,
      quantitydemessage: null,
      messageofcolor: null,
      messageofsize: null,
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
      cclick: false,
      allcolor: [],
    };
  },
  watch: {
    id() {
      this.getproduct();
    },
    message(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.message = null;
        }, 5000);
      }
    },
    singleproduct(newProduct) {
      if (newProduct && newProduct.image_urls.length > 0) {
        this.selectedImage = newProduct.image_urls[0];
      }
    },
    selectedColor() {
      this.quantity = 1;
    }

  },
  methods: {
    async redirect() {
      try {
        if (!this.selectedSize) {
          this.showMessage("აირჩიეთ ზომა", "messageofsize");
        }
        if (!this.selectedColor) {
          this.showMessage("აირჩიეთ ფერი", "messageofcolor");
        }
        if (!this.selectedSize || !this.selectedColor) {
          return;
        }

        const quantity = this.quantity || 1;
        const data = [{
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
        if (error.response?.status === 403) {
          this.message = `ელფოსტა არ არის ვერიფიცირებული, ვეირიფიკაციისთვის დაჭირეთ <a href='/profile' style="color:white" target='_blank'>აქ</a>`;
        }
      }

    },

    async updatequantity(action) {
      if (this.selectedColor && this.selectedSize) {

        switch (action) {
          case 'increment':
            if (this.selectedColorquantity === this.quantity) {
              await this.showMessage("მაქსიმალური რაოდენობა", "quantitymessage");
            } else {
              this.quantity++
            }

            break;
          case 'decrement':
            if (this.quantity < 2) {
              await this.showMessage("ნაკლები შეუძლებელია", "quantitydemessage");
            } else {
              this.quantity--
            }
            break;
          default:
            break;
        }
      } else {
        if (!this.selectedSize) {
          this.showMessage("აირჩიეთ ზომა", "messageofsize");
        }
        if (!this.selectedColor) {
          this.showMessage("აირჩიეთ ფერი", "messageofcolor");
        }
      }
    },
    async showMessage(message, messageType) {
      this[messageType] = message;
      await new Promise(resolve => setTimeout(resolve, 2000));
      this[messageType] = '';
    },

    handleClick(item) {
      if (this.selectedSize === item.size) {
        this.selectedSize = null;
        this.sizecolors = [];

      } else {
        this.selectedSize = item.size;
        this.sizecolors = item.details;
      }

    },
    colorclick(item) {
      if (this.selectedColor === item) {
        this.selectedColor = null;
        this.selectedColorquantity = null;
      } else {
        this.selectedColor = item;
        this.selectedColorquantity = item.quantity;
      }

    },

    async getproduct() {
      try {
        const response = await api.get(`display/${this.id}`, {
          tokenRequired: true
        });
        const res = await api.get(`/similar/${this.id}/products`, {
          tokenRequired: true
        });

        this.singleproduct = response.data.data;
        this.similarproduct = res.data.data;
        this.additionalinfo = JSON.parse(this.singleproduct.additionalinfo);


        this.allcolors = [
          ...new Set(
            this.singleproduct.size.flatMap(element =>
              element.details.map(item =>
                item.color
              )
            )
          )
        ];




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
.similar .title {
  display: flex;
  margin-top: 10px;
}

.similar span {
  font-size: 20px;
  font-weight: bolder;
  margin: 0 30px auto;
}

.products-wrapper {
  display: flex;
  margin-top: 20px;
  gap: 10px;
}

.message-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.message {
  font-size: 14px;
  color: #d9534f;
  margin-left: 10px;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.message-container .message {
  opacity: 1;
}

.additional-ul {
  width: 50%;
}

.increment-wrapper {
  position: relative;
  display: inline-block;
}

.popup-message {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  color: #333;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 13px;
  white-space: nowrap;
  z-index: 999;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.popup-message .arrow-down {
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #d1d1d1;
}

.increment-wrapper:first-child .popup-message {
  transform: translateX(-50%) translateY(-30%);
}

.increment-wrapper:first-child .arrow-down {
  margin-left: 5px;

}

.custom-line {
  border: none;
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;
  margin-top: 10%;
}

.dotted-line {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.key {
  margin-right: 10px;
  /* flex-grow: 1; */
  text-align: left;
  white-space: nowrap;
  /* Prevent text from wrapping */

}

.dots {
  flex-grow: 1;
  border-bottom: 1px dotted black;
  margin-right: 10px;
}

.value {
  text-align: left;
  white-space: nowrap;

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
  border: 1.5px solid #7a1dff;
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
  border: 1px solid #7a1dff;
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
  width: fit-content;
  color: #2b2731;
  margin: auto;
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
    width: fit-content;
    margin: auto;
  }

  .thumbnail-container {
    flex-direction: row;
  }
}
</style>
