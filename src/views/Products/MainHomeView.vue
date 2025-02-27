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
          :initialproduct="item" @show-comments="showCommentsModal(item.id)" @cart-updated="handleCartUpdated"
          @liked-message="handleunauthorizedlike" @cart-message="handleunauthorizedcart" />
      </div>

      <CommentModal v-if="showModal" :product="selectedProduct" :comments="selectedProductComments" @close="closeModal"
        @comment-submitted="refreshComments(selectedProduct.id)" />
    </section>

    <section class="collection-section" v-if="sections.length > 0">
      <h2 class="collection-title">Collection</h2>
      <div class="collection-grid">
        <router-link v-for="(item, index) in sections.flat()" :key="index"
          :to="{ name: 'productsinglecollection', params: { id: item.id } }" class="grid-item"
          :style="{ '--header-color': item.headerColor, '--image-url': `url(${item.media_urls})` }">
          <div class="grid-item-image"></div>
          <div class="grid-item-text">
            <h1>{{ item.title }}</h1>
            <p class="description">{{ item.description }}</p>
            <span v-if="item.discount" class="discount">-{{ item.discount }}%</span>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import ProductCardComponent from '@/components/ProductCardComponent.vue';
import CommentModal from '@/components/CommentModal.vue';
import axios from 'axios';
import Message from '@/components/Message/MessageComponent.vue';
import SmallSections from '@/components/Status/SmallSections.vue';

export default {
  components: {
    ProductCardComponent,
    CommentModal,
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
        },
        en: {
          'AlreadyExist': "Product Already Exist",
          'AddSuccestocart': "Product Added Successfully"
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
          { key: 'all', title: 'homemain.all', products: productsResponse.data.all },
          { key: 'discount', title: 'homemain.discount', products: productsResponse.data.discount },
          { key: 'highrate', title: 'homemain.highrate', products: productsResponse.data.highrate },
        ];

        const sections = collectionResponse.data;
        const midpoint = Math.ceil(sections.length / 2);
        this.sections = [sections.slice(0, midpoint), sections.slice(midpoint)];

      } catch (error) {
        console.error('Error loading data:', error);
      }
    },

    async showCommentsModal(id) {
      try {
        const { data } = await axios.get(`products/${id}/display`);
        this.selectedProductComments = data;
        this.selectedProduct = this.categories.flatMap(cat => cat.products).find(product => product.id === id);
        this.showModal = true;
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },

    async refreshComments(productId) {
      try {
        const { data } = await axios.get(`/products/${productId}/display`);
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
  background-color: #fafafa;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.collection-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(45%, 1fr));
  gap: 20px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.grid-item:hover {
  transform: translateY(-5px);
}

.grid-item-image {
  height: 200px;
  background-image: var(--image-url);
  background-size: cover;
  background-position: center;
}

.grid-item-text {
  background-color: var(--header-color, #000);
  color: #fff;
  padding: 16px;
}

.grid-item-text h1 {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.grid-item-text .description {
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.grid-item-text .discount {
  background: #ff5555;
  color: #fff;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.8rem;
}
</style>
