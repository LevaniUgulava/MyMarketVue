<template>
  <Message v-if="emitdata" :message="emitdata" @close="emitdata = ''" />

  <div>
    <div>
      <swipeCarousel />

      <ProductSectionComponent @cart-updated="handleCartUpdated" @liked-message="handleunauthorizedlike"
        :apiLoaded="getApiLoaded" :products="newproducts" :sectionName="'new'" :title="'what\'s new'" />

      <HomeCategory />


      <collectionView />



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

      <ProductSectionComponent @cart-updated="handleCartUpdated" @liked-message="handleunauthorizedlike"
        :apiLoaded="getApiLoaded" :products="allproducts" :sectionName="'all'" :title="'სრული კოლექცია'" />


      <!-- <PosterView /> -->

      <BrandComponent />

      <ProductSectionComponent @cart-updated="handleCartUpdated" @liked-message="handleunauthorizedlike"
        :apiLoaded="getApiLoaded" :products="discountproducts" :sectionName="'discount'" :title="'ფასდკლებები/sale'" />

      <LastComponent />

    </div>


  </div>
</template>
<script>
import Message from '@/components/Message/MessageComponent.vue';
import SwipeCarousel from '@/components/SwipeCarousel.vue';
import BrandComponent from '@/components/BrandComponent.vue';
import collectionView from './CollectionView.vue'
import { mapActions, mapGetters } from 'vuex';
import HomeCategory from './HomeCategory.vue';
import LastComponent from '@/components/LastComponent.vue';
import ProductSectionComponent from './ProductSectionComponent.vue';

export default {
  components: {
    SwipeCarousel,
    Message,
    BrandComponent,
    collectionView,
    HomeCategory,
    LastComponent,
    ProductSectionComponent
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
