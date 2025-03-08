<template>
  <Message :message="emitdata" @close="emitdata = ''" :backgroundColor="'rgba(76, 175, 80, 0.25)'"
    :textColor="'#004d40'" :positionType="'fixed'" />
  <Message :message="emitlikemessage" @close="emitlikemessage = ''" />
  <Message :message="emitcartmessage" @close="emitcartmessage = ''" />
  <div>
    <SmallSections />

    <section class="section" v-for="(category, idx) in categories" :key="idx">
      <div class="section-header">
        <p>{{ $t(category.title) }}</p>
        <button @click="see(category.key)">{{ $t('homemain.seeall') }}</button>
      </div>

      <div class="product-grid">
        <ProductCardComponent class="product-card" v-for="(item, index) in category.products" :key="index"
          :initialproduct="item" @cart-updated="handleCartUpdated" @liked-message="handleunauthorizedlike"
          @cart-message="handleunauthorizedcart" />
      </div>

    </section>

    <section class="collection-section" v-if="sections.length > 0">
      <p class="collection-title">კოლექციები</p>
      <div class="collection-grid">
        <router-link v-for="(item, index) in sections.flat()" :key="index"
          :to="{ name: 'productsinglecollection', params: { id: item.id } }" class="grid-item">

          <div class="grid-item-text">
            <label>{{ item.title }}</label>
            <p class="description">{{ item.description }}</p>
            <span v-if="item.discount" class="discount">{{ item.discount }}%</span>
          </div>

          <div class="grid-item-image" :style="{ backgroundImage: `url(${item.media_urls})` }"></div>
        </router-link>
      </div>
    </section>


  </div>
</template>

<script>
import ProductCardComponent from '@/components/ProductCardComponent.vue';
import axios from 'axios';
import Message from '@/components/Message/MessageComponent.vue';
import SmallSections from '@/components/Status/SmallSections.vue';

export default {
  components: {
    ProductCardComponent,
    SmallSections,
    Message,
  },
  data() {
    return {
      currentLanguage: localStorage.getItem('selectedLanguage'),
      categories: [],
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
    };
  },
  methods: {
    async loadData() {
      try {
        const lang = this.$router.currentRoute.value.params.lang;
        const token = localStorage.getItem('token');
        const [productsResponse, collectionResponse] = await Promise.all([
          axios.get('display', {
            headers: { Authorization: `Bearer ${token}` },
            params: { lang, section: ['all', 'discount', 'highrate'] }
          }),
          axios.get('collection/display')
        ]);

        this.categories = [
          { key: 'all', title: 'homemain.all', products: productsResponse.data.all.data },
          { key: 'discount', title: 'homemain.discount', products: productsResponse.data.discount.data },
          { key: 'highrate', title: 'homemain.highrate', products: productsResponse.data.highrate.data },
        ];

        const sections = collectionResponse.data;
        const midpoint = Math.ceil(sections.length / 2);
        this.sections = [sections.slice(0, midpoint), sections.slice(midpoint)];

      } catch (error) {
        console.error('Error loading data:', error);
      }
    },

    see(category) {
      this.$router.push({ path: `/${this.$route.params.lang}/product`, query: { section: category } });
    },

    handleunauthorizedlike(message) {
      this.emitlikemessage = this.message[this.currentLanguage][message.message];
    },

    handleunauthorizedcart(message) {
      this.emitcartmessage = this.message[this.currentLanguage][message.message];
    },

    handleCartUpdated(message) {
      this.emitdata = this.message[this.currentLanguage][message.message];
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
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.section-header p {
  font-weight: 700;
}

button {
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  background-color: #f5f5f5;
  cursor: pointer;
}

button:hover {
  background-color: #e0e0e0;
}

.product-grid {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.product-card {
  scroll-snap-align: start;
}

.collection-section {
  margin-top: 40px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #fafafa;
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
}

.grid-item {
  display: flex;
  align-items: stretch;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 250px;
}

.grid-item:hover {
  transform: translateY(-5px);
}

.grid-item-text {
  flex: 1;
  padding: 40px;
  color: black;
  background: linear-gradient(135deg, #7a1dff 30%, #7a1dff1a 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.grid-item-text {
  font-size: 1.5rem;
  font-weight: bold;
}

.grid-item-text .description {
  font-size: 1.1rem;
  line-height: 1.5;
  flex-grow: 1;
  word-break: break-word;
}

.grid-item-text .discount {
  background: #ff5555;
  color: white;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 1rem;
  font-weight: bold;
  align-self: flex-start;
}

.grid-item-image {
  flex: 1;
  height: 100%;
  background-size: cover;
  background-position: center;
  min-width: 300px;
}

/* Responsive */
@media (max-width: 768px) {
  .grid-item {
    flex-direction: column;
    height: auto;
  }

  .grid-item-image {
    width: 100%;
    height: 250px;
  }

  .grid-item-text {
    text-align: center;
    padding: 20px;
  }
}
</style>
