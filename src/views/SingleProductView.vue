<template>
  <div class="product-page">
    <Message :message="message" @close="message = ''" :backgroundColor="'rgba(76, 175, 80, 0.25)'"
      :textColor="'#004d40'" />
    <Message :message="errormessage" @close="errormessage = ''" />

    <Breadcrumb :maincategory="singleproduct.MainCategory" :category="singleproduct.Category"
      :subcategory="singleproduct.SubCategory" :name="singleproduct.name" />

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

          <p class="price"
            v-if="singleproduct.discount === 0 && (!singleproduct.discountstatus || singleproduct.discountstatus.discount === 0)">
            {{ singleproduct.discountprice }} <i class="fa-solid fa-lari-sign"></i>
          </p>
          <p class="price" v-else>
            {{ singleproduct.discountprice }} <i class="fa-solid fa-lari-sign"></i>
            <span class="discount-square" :class="{
              'status-discount': singleproduct.discountstatus && singleproduct.discountstatus.discount > 0,
              'default-discount': (!singleproduct.discountstatus || singleproduct.discountstatus.discount === 0) && singleproduct.discount > 0
            }">
              -{{ singleproduct.discountstatus && singleproduct.discountstatus.discount > 0
                ? singleproduct.discountstatus.discount
                : singleproduct.discount }}%
            </span>
          </p>

          <p class="product-description">{{ singleproduct.description }}</p>

          <div class="size-container">
            <div v-for="item in letterbased" :key="item"
              :class="['size-item', { disabled: !availablesize.includes(item) }]"
              :disabled="!availablesize.includes(item)" @click="handleClick(item)">
              {{ item }}
            </div>
          </div>

          <h5 v-if="quantity && quantity < 5">remains: {{ quantity }}</h5>
          <h5 v-else-if="quantity && quantity > 5">on the stock</h5>

          <button class="addbtn" @click="addToCart()">Add To Cart</button>
        </div>
      </div>

      <StarRatingComponent :rate="rate" :singleid="singleproduct.id" :getproduct="getproduct" />
      <hr class="custom-line" />

      <div class="similar-products">
        <h2 class="section-title">Similar Products</h2>
        <div class="similar-products-scroll">
          <div class="product-card" v-for="(item, index) in products" :key="index">
            <ProductCardComponent :initialproduct="item" @show-comments="showCommentsModal(item.id)"
              @cart-updated="handleCartUpdated" @liked-message="handleunauthorizedlike"
              @cart-message="handleunauthorizedcart" />
          </div>
        </div>
      </div>
      <CommentModal v-if="showModal" :product="selectedProduct" :comments="selectedProductComments" @close="closeModal"
        @comment-submitted="refreshComments(selectedProduct.id)" />

      <a href="/" class="back">Back to shop</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CommentModal from '../components/CommentModal.vue';

import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import StarRatingComponent from "@/components/StarRatingComponent.vue";
import Message from '@/components/Message/MessageComponent.vue';
import ProductCardComponent from '@/components/ProductCardComponent.vue';
import Breadcrumb from '@/components/BreadcrumbComponent.vue';
export default {
  props: ['id'],
  components: {
    Carousel,
    CommentModal,
    Slide,
    Breadcrumb,
    Message,
    ProductCardComponent,
    StarRatingComponent,
    Pagination,
    Navigation,
  },
  data() {
    return {
      singleproduct: {},
      products: [],
      getsizes: [],
      selectedProductComments: [],
      availablesize: [],
      message: null,
      errormessage: null,
      showModal: false,
      quantity: null,
      size: null,
      rate: 0,
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
            this.quantity = element.quantity;
            this.size = element.size;
          }
        });
      }
    },
    async getproduct() {
      const token = localStorage.getItem('token');
      try {
        const response1 = await axios.get(`display/${this.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.singleproduct = response1.data.data;
        this.rate = response1.data.data.MyRate;
        this.availablesize = this.singleproduct.size.map(element => element.size);

        const response2 = await axios.get(`similar/${this.id}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.products = response2.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async showCommentsModal(id) {
      try {
        const { data } = await axios.get(`products/${id}/display`);
        this.selectedProductComments = data;
        this.selectedProduct = this.products.find((product) => product.id === id);
        this.showModal = true;
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    async refreshComments(productId) {
      try {
        const { data } = await axios.get(`products/${productId}/display`);
        this.selectedProductComments = data;
      } catch (error) {
        console.error('Error refreshing comments:', error);
      }
    },
    closeModal() {
      this.showModal = false;
      this.selectedProduct = null;
      this.selectedProductComments = [];
    },

    async addToCart() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.errormessage = 'Not authorized';
      }
      try {
        const response = await axios.post(
          `addcart/${this.id}`,
          { size: this.size },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.message = response.data.message;
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    },

    async Getsize() {
      try {
        const response = await axios.get('getSizes');
        this.letterbased = response.data.letterbased;
        this.numericbased = response.data.numericbased;
      } catch (error) {
        console.log(error);
      }
    },
    handleCartUpdated(cartData) {
      this.emitdata = cartData.message;
    },
    handleunauthorizedlike(likedmessage) {
      this.emitlikemessage = likedmessage;
    },
    handleunauthorizedcart(cartmessage) {
      this.emitcartmessage = cartmessage;
    },

    async comparesize() {
      const filteredSizes = this.getsizes.filter(x => x.singleproduct === this.singleproduct);
      return filteredSizes;
    },
  },

  mounted() {
    this.getproduct();
    this.Getsize();
  },
};
</script>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
  color: #333;
}

.product-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.product-container {
  width: 100%;
  padding: 25px;
  border-radius: 10px;
}

.product-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 40px;
  gap: 50px;
}

.product-carousel {
  width: 45%;
  max-width: 600px;
}

.product-image {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.product-info {
  flex: 1;
  padding: 15px;
}

.product-name {
  font-size: 2rem;
  font-weight: bold;
  color: #222;
}

.price {
  font-size: 1.6rem;
  font-weight: bold;
  color: #555;
  margin: 15px 0;
}

.discount-square {
  display: inline-block;
  color: #fff;
  padding: 5px 7px;
  border-radius: 4px;
  margin-left: 10px;
  font-weight: bold;
  font-size: 14px;
}

.default-discount {
  background-color: #f00;
}

.status-discount {
  background-color: #e67e22;
}

.size-container {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.size-item {
  padding: 8px 15px;
  background: #e0e0e0;
  border: 1px solid #b0b0b0;
  border-radius: 5px;
  cursor: pointer;
}

.size-item.disabled {
  background: #f0f0f0;
  color: #aaa;
  cursor: not-allowed;
}

.addbtn {
  background-color: #444;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
}

.similar-products {
  margin-top: 200px;

}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.similar-products-scroll {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.similar-products-scroll::-webkit-scrollbar {
  height: 8px;
}

.similar-products-scroll::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.similar-products-scroll::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.product-card {
  flex: 0 0 auto;
  width: 220px;
  border-radius: 8px;
}

.back {
  display: block;
  margin-top: 20px;
  text-decoration: none;
  color: #666;
}

@media (min-width: 390px) and (max-width: 574px) {
  .product-page {
    padding: 15px;
  }

  .product-container {
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }

  .product-content {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .product-carousel {
    width: 100%;
  }

  .product-image {
    width: 100%;
    border-radius: 6px;
  }

  .product-info {
    padding: 10px;
  }

  .product-name {
    font-size: 1.5rem;
    text-align: center;
  }

  .price {
    font-size: 1.4rem;
    text-align: center;
  }

  .size-container {
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .size-item {
    padding: 6px 12px;
    font-size: 0.9rem;
  }

  .addbtn {
    width: 100%;
    padding: 8px 0;
    font-size: 1rem;
    border-radius: 4px;
  }

  .similar-products {
    margin-top: 30px;
  }

  .section-title {
    font-size: 1.5rem;
    text-align: center;
  }

  .similar-products-scroll {
    gap: 10px;
  }

  .product-card {
    width: 180px;
  }

  .back {
    margin-top: 15px;
    font-size: 0.9rem;
    text-align: center;
  }
}
</style>
