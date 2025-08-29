<template>
  <Message v-if="emitdata" :message="emitdata" @close="emitdata = ''" />

  <div>
    <div v-if="getApiLoaded">
      <swipeCarousel />
      <HomeCategory />

      <section class="collection-section">
        <div :class="['collection-grid', { 'more-than-two': sections.length > 2 }]">
          <router-link v-for="(item, index) in sections.slice(0, 2)" :key="index"
            :to="{ name: 'productsinglecollection', params: { id: item.id } }" class="grid-item">
            <div class="grid-item-image" :style="{ backgroundImage: 'url(' + item.media_urls + ')' }">
            </div>
            <div class="product-availability">
              <p>იხილეთ მეტი →</p>
            </div>
          </router-link>
        </div>
      </section>

      <div @pointerdown="see('all')" class="section-header">
        <p>ყველა პროდუქტი</p>
      </div>
      <div class="product-grid">
        <ProductCardComponent class="product-card" v-for="(item, index) in allproducts" :key="index"
          :initialproduct="item" @cart-updated="handleCartUpdated" @liked-message="handleunauthorizedlike"
          @cart-message="handleunauthorizedcart" />
      </div>
      <PosterView />
      <swipeCarousel />

      <BrandComponent />


      <div @pointerdown="see('discount')" class="section-header">
        <p>ფასდაკლებული პროდუქტი</p>
      </div>
      <div class="product-grid">
        <ProductCardComponent class="product-card" v-for="(item, index) in getDiscountproducts" :key="index"
          :initialproduct="item" @cart-updated="handleCartUpdated" @liked-message="handleunauthorizedlike"
          @cart-message="handleunauthorizedcart" />
      </div>
      <section class="collection-section">
        <div :class="['collection-grid', { 'more-than-two': sections.length > 2 }]">
          <router-link v-for="(item, index) in sections.slice(2, 4)" :key="index"
            :to="{ name: 'productsinglecollection', params: { id: item.id } }" class="grid-item">
            <div class="grid-item-image" :style="{ backgroundImage: 'url(' + item.media_urls + ')' }">
            </div>
            <div class="product-availability">
              <p>იხილეთ მეტი →</p>
            </div>
          </router-link>
        </div>
      </section>
      <div @pointerdown="see('new')" class="section-header">
        <p>ახალი პროდუქტები</p>
      </div>
      <div class="product-grid">
        <ProductCardComponent class="product-card" v-for="(item, index) in newproducts" :key="index"
          :initialproduct="item" @cart-updated="handleCartUpdated" @liked-message="handleunauthorizedlike"
          @cart-message="handleunauthorizedcart" />
      </div>
      <LastComponent />

    </div>



    <div v-else>
      <section v-for="(category, idx) in 2" :key="idx" class="category-section">
        <section class="collection-section">
          <div class="collection-grid">
            <div class="grid-item-image-skeleton"></div>
            <div class="grid-item-image-skeleton"></div>
          </div>
        </section>

        <div @pointerdown="see(category.key)" class="section-header">
          <p>{{ category.title }}</p>
        </div>

        <div class="product-grid">
          <SkeletonComponent :isMain="true" />
        </div>
      </section>
    </div>


  </div>
</template>
<script>
import ProductCardComponent from '@/components/ProductCardComponent.vue';
import Message from '@/components/Message/MessageComponent.vue';
import SwipeCarousel from '@/components/SwipeCarousel.vue';
import BrandComponent from '@/components/BrandComponent.vue';
import SkeletonComponent from '@/components/SkeletonComponent.vue';

import { mapActions, mapGetters } from 'vuex';
import PosterView from '../PosterView.vue';
import HomeCategory from './HomeCategory.vue';
import LastComponent from '@/components/LastComponent.vue';

export default {
  components: {
    ProductCardComponent,
    SwipeCarousel,
    Message,
    BrandComponent,
    SkeletonComponent,
    PosterView,
    HomeCategory,
    LastComponent
  },
  data() {
    return {
      selectedProduct: null,
      selectedProductComments: [],
      emitdata: '',
      emitlikemessage: '',
      emitcartmessage: '',
      message: {
        ka: {
          'AlreadyExist': "პროდუქტი უკვე დამატებულია",
          'AddSuccestocart': "პროდუქტი წარმატებით დაემატა"
        }
      },
      showModal: false,
      sections: [],
      allproducts: [],
      discountproducts: [],
      newproducts: [],
      categories: [],
    };
  },
  methods: {
    ...mapActions("product", {
      displayAction: 'loadData',
    }),
    see(category) {
      this.$router.push({ path: `/product`, query: { section: category } });
    },

    handleunauthorizedlike(message) {
      this.emitdata = message.message;

    },
    handleCartUpdated(message) {
      this.emitdata = message;
    },
  },
  computed: {
    ...mapGetters('product', ["getAllproducts", "getDiscountproducts", 'getNewproducts', "getCategories", "getSections", "getApiLoaded"])
  },
  watch: {
    getCategories(newCategories) {
      this.categories = newCategories;
    },
    getSections(newSections) {
      this.sections = newSections;
    },
    getAllproducts(newProduct) {
      this.allproducts = newProduct;
    },
    getDiscountproducts(newProduct) {
      this.discountproducts = newProduct;

    },
    getNewproducts(newProduct) {
      this.newproducts = newProduct;

    }
  },
  async mounted() {
    await this.displayAction();
    this.categories = this.getCategories;
    this.sections = this.getSections;

  },
};
</script>


<style scoped>
.section {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  margin-bottom: 2%;
  padding: 20px;
  width: 100%;
}


.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  margin: 0 auto;
  transition: transform 0.3s ease;
  /* Smooth transition for transform */
}

.section-header:hover {
  cursor: pointer;
  transform: translateY(-5px);
  /* Pull up effect on hover */
}


.section-header p {
  font-weight: 900;
  text-transform: uppercase;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  margin-left: 40px;

}

.section-header p:hover {
  font-weight: 700;
}

button {
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  margin-right: 40px;
  background-color: #f5f5f5;
  cursor: pointer;
}

button:hover {
  background-color: #e0e0e0;
}

.product-grid {
  display: flex;
  gap: 15px;
  margin: 0 auto;
  width: 95%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.product-grid::-webkit-scrollbar {
  display: none;
}

.product-grid {
  -webkit-overflow-scrolling: touch;
}

.product-card {
  scroll-snap-align: start;
}

.collection-section {
  padding: 20px;
}

.collection-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-weight: 500;
  border-bottom: 1px solid #ddd;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  position: relative;
  width: 100%;
}


.grid-item {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.3s;
  height: 60vh;
  width: 100%;
  position: relative;
}

.grid-item:hover {
  transform: translateY(-5px);
}

.grid-item-image-skeleton {
  width: 100%;
  height: 280px;
  background-color: #e0e0e0;
  border-radius: 10px;
  animation: skeleton-loading 1.5s infinite linear;
}

@keyframes skeleton-loading {
  0% {
    background-color: #e0e0e0;
  }

  50% {
    background-color: #d0d0d0;
  }

  100% {
    background-color: #e0e0e0;
  }
}

.grid-item-image {
  flex: 1;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  transition: all 0.3s ease;
}



.product-availability {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: white;
  padding: 10px 20px;
  font-size: 0.9rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.grid-item:hover .product-availability {
  opacity: 1;
  visibility: visible;
}




@media (max-width: 768px) {
  .collection-label {
    font-size: 12px;
    line-height: normal;
  }

  .product-availability {
    padding: 5px 10px;
    font-size: 10px;
  }

  .section-header p {
    margin-left: 0px;
    font-size: 13px;
  }




  .grid-item {
    flex-direction: column;
    height: 150px;
  }

  .grid-item-image {
    width: 100%;
    height: 150px;
  }

  .grid-item-text .discount {
    padding: 4px 6px;
    font-size: 10px;
  }

  .grid-item-text .description {
    font-size: 12px;
  }

  .grid-item-text {
    padding: 20px;
    font-size: 10px;
    line-height: 0.5;
  }
}
</style>
