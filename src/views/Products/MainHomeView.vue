<template>
  <Message v-if="emitdata" :message="emitdata" @close="emitdata = ''" />

  <div>
    <div>
      <swipeCarousel />
      <HomeCategory />


      <collectionView />

      <div @pointerdown="see('all')" class="section-header">
        <p>იხილეთ პროდუქტები</p>
      </div>
      <div v-if="getApiLoaded" class="product-grid">
        <ProductCardComponent class="product-card" v-for="(item, index) in allproducts" :key="index"
          :initialproduct="item" @cart-updated="handleCartUpdated" @liked-message="handleunauthorizedlike"
          @cart-message="handleunauthorizedcart" />
      </div>
      <div v-else class="product-grid">
        <SkeletonComponent :isMain="true" />
      </div>

      <!-- <PosterView /> -->

      <BrandComponent />


      <div @pointerdown="see('discount')" class="section-header">
        <p>შეთავაზებები</p>
      </div>
      <div v-if="getApiLoaded" class="product-grid">
        <ProductCardComponent class="product-card" v-for="(item, index) in getDiscountproducts" :key="index"
          :initialproduct="item" @cart-updated="handleCartUpdated" @liked-message="handleunauthorizedlike"
          @cart-message="handleunauthorizedcart" />
      </div>
      <div v-else class="product-grid">
        <SkeletonComponent :isMain="true" />
      </div>


      <section class="collection-section">
        <div :class="['collection-grid', { 'more-than-two': sections.length > 3 }]">
          <router-link v-for="(item, index) in sections.slice(3, 4)" :key="index"
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
        <p>ახალი კოლექცია</p>
      </div>
      <div v-if="getApiLoaded" class="product-grid">
        <ProductCardComponent class="product-card" v-for="(item, index) in newproducts" :key="index"
          :initialproduct="item" @cart-updated="handleCartUpdated" @liked-message="handleunauthorizedlike"
          @cart-message="handleunauthorizedcart" />
      </div>
      <div v-else class="product-grid">
        <SkeletonComponent :isMain="true" />
      </div>
      <LastComponent />

    </div>


  </div>
</template>
<script>
import ProductCardComponent from '@/components/ProductCardComponent.vue';
import Message from '@/components/Message/MessageComponent.vue';
import SwipeCarousel from '@/components/SwipeCarousel.vue';
import BrandComponent from '@/components/BrandComponent.vue';
import collectionView from './CollectionView.vue'
import { mapActions, mapGetters } from 'vuex';
import HomeCategory from './HomeCategory.vue';
import LastComponent from '@/components/LastComponent.vue';
import SkeletonComponent from '@/components/SkeletonComponent.vue';

export default {
  components: {
    ProductCardComponent,
    SwipeCarousel,
    Message,
    BrandComponent,
    SkeletonComponent,
    collectionView,
    HomeCategory,
    LastComponent,
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
    ...mapGetters('product', ["getAllproducts", "getAllCategory", "getDiscountproducts", 'getNewproducts', "getCategories", "getSections", "getApiLoaded"])
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

    },
    emitdata() {
      setTimeout(() => {
        this.emitdata = ''
      }, 3000);

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





@media (max-width: 767px) {
  .collection-label {
    font-size: 12px;
    line-height: normal;
  }



  .section-header p {
    margin-left: 0px;
    font-size: 13px;
  }

  .product-card {
    width: 48%;
    flex-shrink: 0;
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
