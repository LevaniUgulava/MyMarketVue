<template>
  <Message v-if="emitdata" :message="emitdata" @close="emitdata = ''" />

  <div>
    <SwipeCarousel />
    <BrandComponent />
    <section v-for="(category, idx) in categories" :key="idx" class="category-section">

      <section class="collection-section" v-if="sections.length > 0">
        <div :class="['collection-grid', { 'more-than-two': sections.length > 4 }]">
          <router-link v-for="(item, index) in sections.slice(idx * 2, (idx + 1) * 2)" :key="index"
            :to="{ name: 'productsinglecollection', params: { id: item.id } }" class="grid-item"
            :class="{ 'reduce-height': sections.length > 4 && index === 1 }">
            <div class="grid-item-image" :style="{ backgroundImage: 'url(' + item.media_urls + ')' }">
              <div class="grid-item-text">
                <label class="collection-label">{{ item.title }}</label>
                <p class="description">{{ item.description }}</p>
                <span v-if="item.discount" class="discount">{{ item.discount }}%</span>
              </div>
            </div>
            <div class="product-availability">
              <p>იხილეთ მეტი →</p>
            </div>
          </router-link>

          <div v-if="sections.length > 4" class="show-all-collections">
            <router-link to="/collection" class="show-all-button">იხილეთ მეტი კოლექცია →</router-link>
          </div>
        </div>
      </section>

      <div @click="see(category.key)" class="section-header">
        <p>{{ category.title }}</p>
      </div>

      <div class="product-grid">
        <ProductCardComponent class="product-card" v-for="(item, index) in category.products" :key="index"
          :initialproduct="item" @cart-updated="handleCartUpdated" @liked-message="handleunauthorizedlike"
          @cart-message="handleunauthorizedcart" />
      </div>

    </section>
  </div>
</template>

<script>
import ProductCardComponent from '@/components/ProductCardComponent.vue';
import Message from '@/components/Message/MessageComponent.vue';
import SwipeCarousel from '@/components/SwipeCarousel.vue';
import api from '@/api';
import BrandComponent from '@/components/BrandComponent.vue';
export default {
  components: {
    ProductCardComponent,
    SwipeCarousel,
    Message,
    BrandComponent
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
      categories: [],
    };
  },
  methods: {
    async loadData() {
      try {
        const [productsResponse, collectionResponse] = await Promise.all([
          api.get('display', {
            tokenOptional: true,
            params: { section: ['all', 'discount'] }
          }),
          api.get('collection/display')
        ]);

        this.categories = [
          { key: 'all', title: 'ყველა პროდუქტი', products: productsResponse.data.all.data },
          { key: 'discount', title: 'ფასდაკლებული პროდუქტი', products: productsResponse.data.discount.data },
        ]
        const sections = collectionResponse.data;
        this.sections = sections;

      } catch (error) {
        console.error('Error loading data:', error);
      }
    },

    see(category) {
      this.$router.push({ path: `/product`, query: { section: category } });
    },



    handleCartUpdated(message) {
      this.emitdata = message.message;
    },
  },
  mounted() {
    this.loadData();
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
  border-radius: 12px;
}

.collection-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-weight: 700;
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
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.3s;
  height: 280px;
  width: 100%;
  position: relative;
}

.grid-item.reduce-height {
  height: 220px;
}

.grid-item:hover {
  transform: translateY(-5px);
}

.grid-item-image {
  flex: 1;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.grid-item-text {
  position: absolute;
  color: #fff;
  padding: 20px;
  font-size: 1.2rem;
  font-weight: 900;
  text-transform: uppercase;
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  text-align: left;
}

.grid-item-text .description {
  font-size: 0.8rem;
  line-height: 1.5;
  flex-grow: 1;
}

.grid-item-text .discount {
  background: #ff5555;
  color: white;
  border-radius: 4px;
  padding: 5px 8px;
  font-size: 0.7rem;
  align-self: flex-start;
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

.show-all-collections {
  position: absolute;
  bottom: 0px;
  right: 0px;
  text-align: center;
  z-index: 1;
}

.show-all-button {
  padding: 10px 20px;
  font-size: 1rem;
  border: solid 1px black;
  color: black;
  width: 680px;
  height: 50px;
  border-radius: 25px;
  cursor: pointer;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}


.show-all-button:hover {
  color: white;
  background-color: black;
}

@media (max-width: 768px) {
  .collection-label{
    font-size: 13px;
  }
  .product-availability {
    font-size: 0.7rem;
  }

  .show-all-button {
    width: 150px;
    font-size: 0.8rem;
  }

  .grid-item {
    flex-direction: column;
  }

  .grid-item-image {
    width: 100%;
    height: 150px;
  }

  .grid-item-text {
    text-align: center;
    padding: 20px;
  }
}
</style>
