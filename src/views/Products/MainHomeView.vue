<template>
  <Message :message="emitdata" @close="emitdata = ''" :backgroundColor="'rgba(76, 175, 80, 0.25)'"
    :textColor="'#004d40'" :positionType="'fixed'" />
  <Message :message="emitlikemessage" @close="emitlikemessage = ''" />
  <Message :message="emitcartmessage" @close="emitcartmessage = ''" />
  <div>
    <ExclusiveComponent />

    <section class="section">
      <div class="section-header">
        <p>{{ $t('homemain.all') }}</p>
        <button @click="see('all')">{{ $t('homemain.seeall') }}</button>
      </div>

      <div class="product-grid">
        <ProductCardComponent class="product-card" v-for="(item, index) in allProducts" :key="index"
          :initialproduct="item" @show-comments="showCommentsModal(item.id)" @cart-updated="handleCartUpdated"
          @liked-message="handleunauthorizedlike" @cart-message="handleunauthorizedcart" />
      </div>

      <CommentModal v-if="showModal" :product="selectedProduct" :comments="selectedProductComments" @close="closeModal"
        @comment-submitted="refreshComments(selectedProduct.id)" />
    </section>
    <section class="section" v-if="Array.isArray(section1) && section1.length > 0">
      <section class="subsection">
        <router-link v-for="(section, index) in section1" :key="index"
          :to="{ name: 'productsinglecollection', params: { id: section.id } }" class="grid-item"
          :style="{ '--header-color': section.headerColor, '--image-url': `url(${section.media_urls})` }">
          <div class="grid-item-text">
            <h1>{{ section.title }}</h1>
            <p class="description">{{ section.description }}</p>
            <span v-if="section.discount" class="discount">-{{ section.discount }}%</span>
          </div>
          <div class="grid-item-image"></div>
        </router-link>
      </section>
    </section>


    <section class="section">
      <div class="section-header">
        <p>{{ $t('homemain.discount') }}</p>
        <button @click="see('discount')">{{ $t('homemain.seeall') }}</button>
      </div>

      <div class="product-grid">
        <ProductCardComponent class="product-card" v-for="(item, index) in discountProducts" :key="index"
          :initialproduct="item" @show-comments="showCommentsModal(item.id)" @cart-updated="handleCartUpdated"
          @liked-message="handleunauthorizedlike" @cart-message="handleunauthorizedcart" />
      </div>
      <CommentModal v-if="showModal" :product="selectedProduct" :comments="selectedProductComments" @close="closeModal"
        @comment-submitted="refreshComments(selectedProduct.id)" />
    </section>

    <section class="section" v-if="Array.isArray(section2) && section2.length > 0">
      <section class="subsection">
        <router-link v-for="(section, index) in section2" :key="index"
          :to="{ name: 'productsinglecollection', params: { id: section.id } }" class="grid-item"
          :style="{ '--header-color': section.headerColor, '--image-url': `url(${section.media_urls})` }">
          <div class="grid-item-text">
            <h1>{{ section.title }}</h1>
            <p class="description">{{ section.description }}</p>
            <span v-if="section.discount" class="discount">-{{ section.discount }}%</span>
          </div>
          <div class="grid-item-image"></div>
        </router-link>
      </section>
    </section>

    <section class="section">
      <div class="section-header">
        <p>{{ $t('homemain.highrate') }}</p>
        <button @click="see('highrate')">{{ $t('homemain.seeall') }}</button>
      </div>

      <div class="product-grid">
        <ProductCardComponent class="product-card" v-for="(item, index) in rateProducts" :key="index"
          :initialproduct="item" @show-comments="showCommentsModal(item.id)" @cart-updated="handleCartUpdated"
          @liked-message="handleunauthorizedlike" @cart-message="handleunauthorizedcart" />
      </div>
      <CommentModal v-if="showModal" :product="selectedProduct" :comments="selectedProductComments" @close="closeModal"
        @comment-submitted="refreshComments(selectedProduct.id)" />
    </section>
  </div>
</template>

<script>
import ProductCardComponent from '@/components/ProductCardComponent.vue';
import CommentModal from '@/components/CommentModal.vue';
import axios from 'axios';
import Message from '@/components/Message/MessageComponent.vue';
import ExclusiveComponent from '@/components/Status/ExclusiveCollection.vue';
export default {

  components: {
    ProductCardComponent,
    CommentModal,
    ExclusiveComponent,
    Message,

  },
  data() {
    return {
      currentLanguage: localStorage.getItem('selectedLanguage'),
      allProducts: [],
      discountProducts: [],
      rateProducts: [],
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
          'AddSuccestocart': "Product Added Succesfully"
        }
      },
      showModal: false,
      sections: [],
      section1: [],
      section2: [],


    };
  },
  methods: {
    async getcollection() {
      try {
        const response = await axios.get('collection/display');
        this.sections = response.data;
        if (this.sections.length % 2 === 0) {
          this.section1 = this.sections.slice(0, this.sections.length / 2);
          this.section2 = this.sections.slice(this.sections.length / 2);
        } else {
          const midpoint = Math.ceil(this.sections.length / 2);
          this.section1 = this.sections.slice(0, midpoint);
          this.section2 = this.sections.slice(midpoint);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async fetchall() {
      const lang = this.$router.currentRoute.value.params.lang;
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('display', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            lang: lang,
            section: ['all', 'discount', 'highrate']
          }
        });

        this.allProducts = response.data.all;
        this.discountProducts = response.data.discount;
        this.rateProducts = response.data.highrate;

      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },

    async showCommentsModal(id) {
      try {
        const { data } = await axios.get(`products/${id}/display`);
        this.selectedProductComments = data;
        this.selectedProduct = this.allProducts.find((product) => product.id === id) || this.discountProducts.find((product) => product.id === id);
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
      if (category === 'all') {
        this.$router.push({ path: `/${this.$route.params.lang}/product`, query: { section: 'all' } });
      } else if (category === 'discount') {
        this.$router.push({ path: `/${this.$route.params.lang}/product`, query: { section: 'discount' } });
      } else if (category === 'highrate') {
        this.$router.push({ path: `/${this.$route.params.lang}/product`, query: { section: 'highrate' } });
      }
    },

    handleunauthorizedlike(message) {
      const key = message;

      this.emitlikemessage = this.message[this.currentLanguage][key.message];
    },

    handleunauthorizedcart(message) {
      const key = message;
      this.emitcartmessage = this.message[this.currentLanguage][key.message];
    },

    handleCartUpdated(message) {
      const key = message;
      this.emitdata = this.message[this.currentLanguage][key.message];
    },
  },
  mounted() {
    this.fetchall();
    this.getcollection();
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Raleway:wght@400;500;700&display=swap');


.section {
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #ffffff, #f2f2f2);
  border-radius: 10px;
  margin-top: 2%;
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 5px;
  width: 100%;
  transition: box-shadow 0.3s;
}

.section:hover {
  box-shadow: 4px 6px 16px rgba(0, 0, 0, 0.15);
}

.subsection {
  display: grid;
  height: 200px;
  align-items: center;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  max-width: 1100px;
  margin: 0 auto;
}

.grid-item {
  display: flex;
  width: 400px;
  height: 150px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.grid-item-text {
  width: 50%;
  background-color: var(--header-color, #ffffff);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #ffffff;
  text-align: center;
}

.grid-item-text h1 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 10px;
  color: #fff;
  font-family: 'Arial', sans-serif;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.description {
  font-size: 0.8rem;
  margin: 5px 0;
  color: #f0f0f0;
  opacity: 0.9;
}

.discount {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 3px 7px;
  border-radius: 5px;
  font-size: 0.8em;
  font-weight: bold;
  margin-top: 10px;
  color: #ffffff;
}

.grid-item-image {
  width: 50%;
  background-image: var(--image-url);
  background-size: cover;
  background-position: center;
}


.product-grid {
  display: grid;
  gap: 15px;
  grid-auto-flow: column;
  overflow-x: auto;
  padding-bottom: 10px;
  scroll-snap-type: x mandatory;
  height: 420px;
  -webkit-overflow-scrolling: touch;

}

.product-card {
  min-width: 220px;
  max-width: 220px;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.section-header p {
  font-family: 'Merriweather', serif;
  font-weight: 700;
  color: #333;
}

button {
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  background-color: #eaeaea;
  color: #333;
  font-family: 'Raleway', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

button:hover {
  background-color: #d3d3d3;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

@media (min-width: 375px) and (max-width: 430px) {
  .section {
    margin-top: none;

  }

  .section-header p {
    font-size: 0.5rem;
  }

  button {
    border-radius: 3px;
    padding: 4px 8px;
    font-size: 0.5rem;

  }

  .product-card {
    min-width: 100px;
    max-width: 100px;
    transition: none;
  }

  .product-card:hover {
    transform: none;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    height: 255px;
  }

  .grid-item {
    width: 100px;
    height: 100px;
  }

  .grid-item-text h1 {
    font-size: 0.5rem;
  }

  .description {
    font-size: 0.5rem;
  }

  .discount {
    font-size: 0.4rem;
    margin-top: 5px;
  }

  .subsection {
    height: 110px;
    gap: 10px;
  }

}
</style>