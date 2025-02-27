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

      <Bootstrap5Pagination :data="pagination" @pagination-change-page="changePage" />
    </div>
  </div>


  <CommentModal v-if="showModal" :product="selectedProduct" :comments="selectedProductComments" @close="closeModal"
    @comment-submitted="refreshComments(selectedProduct.id)" />
</template>

<script>
import ProductCardComponent from '../../components/ProductCardComponent.vue';
import CommentModal from '../../components/CommentModal.vue';
import { Bootstrap5Pagination } from 'laravel-vue-pagination';
import axios from 'axios';
import Message from '@/components/Message/MessageComponent.vue';
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue';
export default {
  name: 'HomeView',
  components: {
    ProductCardComponent,
    CommentModal,
    BreadcrumbComponent,
    Message,
    Bootstrap5Pagination,
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
          this.products = response.data.all;
        } else if (this.Section == "discount") {
          this.products = response.data.discount;
        } else if (this.Section == "highrate") {
          this.products = response.data.highrate;
        }


        this.pagination = {
          current_page: response.data.meta?.current_page || 1,
          last_page: response.data.meta?.last_page || 1,
          per_page: response.data.meta?.per_page || 10,
          total: response.data.meta?.total || 0,
          links: response.data.links || [],
        };

        await this.fetchCategoryNames();
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      console.log(this.products)
    },
    async fetchCategoryNames() {
      try {
        const requests = [];

        if (this.selectedmainCategory) {
          requests.push(axios.get(`maincategory/${this.selectedmainCategory}`));
        } else {
          this.maincategory = {}; // Reset if not selected
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
.products-wrapper-collapsed {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  width: 100%;
}

.bread {
  margin-top: 15px;
}

.pagination {
  display: flex;
  list-style-type: none;
  padding: 0;
  justify-content: center;
  margin: 20px 0;
}

.page-item {
  margin: 0 5px;
}

/* Pagination Links */
.page-link {
  display: block;
  padding: 10px 15px;
  color: #007bff;
  text-decoration: none;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

.page-item.active .page-link {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.page-link:hover,
.page-link:focus {
  background-color: #0056b3;
  color: white;
  border-color: #0056b3;
  text-decoration: none;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}

.page-link {
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.page-link:active {
  background-color: #004085;
  border-color: #004085;
  color: white;
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