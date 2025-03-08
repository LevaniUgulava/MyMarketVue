<template>
  <message :message="emitcartmessage" @close="emitcartmessage = ''" />
  <Message :message="emitdata" @close="emitdata = ''" :backgroundColor="'rgba(76, 175, 80, 0.25)'"
    :textColor="'#004d40'" :positionType="'fixed'" />
  <message :message="emitlikemessage" @close="emitlikemessage = ''" />
  <BreadcrumbComponent :maincategory="maincategory" :category="category" :subcategory="subcategory" class="bread" />
  <div v-if="products.length > 0">
    <div class="main-content">

      <div :class="{ 'products-wrapper': isSidebarCollapsed, 'products-wrapper-collapsed': !isSidebarCollapsed }">
        <ProductCardComponent v-for="(item, index) in products" :key="index" :initialproduct="item"
          @show-comments="showCommentsModal(item.id)" @cart-updated="handleCartUpdated"
          @liked-message="handleunauthorizedlike" @cart-message="handleunauthorizedcart" />
      </div>
      <CustomPagination v-if="products.length > 0 && pagination.total > 1" :currentPage="pagination.current_page"
        :totalPages="pagination.total" class="pagination" />
    </div>
  </div>



</template>

<script>
import ProductCardComponent from '../../components/ProductCardComponent.vue';
import axios from 'axios';
import Message from '@/components/Message/MessageComponent.vue';
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue';
import CustomPagination from '@/components/CustomPagination.vue';
export default {
  name: 'HomeView',
  components: {
    ProductCardComponent,
    BreadcrumbComponent,
    Message,
    CustomPagination

  },
  props: {
    isSidebarCollapsed: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      products: [],
      showModal: false,
      selectedProduct: null,
      selectedProductComments: [],
      selectmin: 0,
      selectmax: 0,
      searchname: '',
      maincategories: [],
      selectedmainCategory: null,
      selectedCategory: null,
      selectedsubCategory: null,
      emitdata: null,
      emitlikemessage: null,
      emitcartmessage: null,
      Section: null,
      pagination: {},
      maincategory: {},
      category: {},
      subcategory: {},
    };
  },
  watch: {
    emitdata(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.emitdata = null;
        }, 3000);
      }
    },
    emitlikemessage(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.emitlikemessage = null;
        }, 3000);
      }
    },
    emitcartmessage(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.emitcartmessage = null;
        }, 3000);
      }
    },
    '$route.query': {
      handler: 'fetchProducts',
      immediate: true,
    },
  },
  methods: {
    async fetchProducts() {
      const queryParams = new URLSearchParams(this.$route.query);
      const page = parseInt(queryParams.get('page')) || 1;
      this.searchname = queryParams.get('searchname') || '';
      this.selectedmainCategory = queryParams.get('maincategory') || '';
      this.selectedCategory = queryParams.get('category') || '';
      this.selectedsubCategory = queryParams.get('subcategory') || '';
      this.Section = queryParams.get('section') || '';
      this.selectmin = queryParams.get('min');
      this.selectmax = queryParams.get('max');


      const token = localStorage.getItem('token');
      const lang = this.$router.currentRoute.value.params.lang;
      try {

        const response = await axios.get('display', {

          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            lang: lang,
            searchname: this.searchname,
            maincategory: this.selectedmainCategory,
            category: this.selectedCategory,
            subcategory: this.selectedsubCategory,
            section: this.Section,
            min: this.selectmin,
            max: this.selectmax,
            page: page,
          },
        });

        if (this.Section == "all") {
          this.products = response.data.all.data;
          this.pagination = {
            current_page: response.data.all.meta.current_page || 1,
            total: response.data.all.meta.last_page
          };
        } else if (this.Section == "discount") {
          this.products = response.data.discount.data;
          this.pagination = {
            current_page: response.data.discount.meta.current_page || 1,
            total: response.data.discount.meta.last_page
          };
        } else if (this.Section == "highrate") {
          this.products = response.data.highrate.data;
          this.pagination = {
            current_page: response.data.highrate.meta.current_page || 1,
            total: response.data.highrate.meta.last_page
          };
        }

        await this.fetchCategoryNames();
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    async fetchCategoryNames() {
      try {
        const requests = [];

        if (this.selectedmainCategory) {
          requests.push(axios.get(`maincategory/${this.selectedmainCategory}`));
        } else {
          this.maincategory = {};
        }

        if (this.selectedCategory) {
          requests.push(axios.get(`category/${this.selectedCategory}`));
        } else {
          this.category = {};
        }

        if (this.selectedsubCategory) {
          requests.push(axios.get(`subcategory/${this.selectedsubCategory}`));
        } else {
          this.subcategory = {};
        }

        const [mainResponse, categoryResponse, subcategoryResponse] = await Promise.all(requests);

        if (this.selectedmainCategory) this.maincategory = mainResponse?.data || {};
        if (this.selectedCategory) this.category = categoryResponse?.data || {};
        if (this.selectedsubCategory) this.subcategory = subcategoryResponse?.data || {};

      } catch (error) {
        console.error("Error fetching category names:", error);
      }
    },


    handleCartUpdated(cartData) {
      console.log('Cart updated:', cartData.message);
      this.emitdata = cartData.message;
    },
    handleunauthorizedlike(likedmessage) {
      this.emitlikemessage = likedmessage;
    },
    handleunauthorizedcart(cartmessage) {
      this.emitcartmessage = cartmessage;
    },
    changePage(page) {
      this.$router.push({ path: '/product/all', query: { ...this.$route.query, page } });
    },

  },


};
</script>
<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  /* Ensures enough height */
}

.content-wrapper {
  flex-grow: 1;
  /* Pushes pagination to the bottom */
}

.products-wrapper-collapsed {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  width: 100%;
}

.bread {
  margin-top: 15px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  background: white;
  margin-top: auto;
  /* Forces pagination to bottom */
}

@media (min-width: 390px) and (max-width: 574px) {
  .products-wrapper {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 10px;
  }

  .products-wrapper-collapsed {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    display: grid;
    width: 100%;
  }
}
</style>