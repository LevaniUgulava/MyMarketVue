<template>
  <Message v-if="emitcartmessage" :message="emitcartmessage" @close="emitcartmessage = ''" />
  <Message v-if="emitdata" :message="emitdata" @close="emitdata = ''" />

  <div class="container">

    <div class="category-container">
      <ProductViewCategory @maincategories="handlemain" @categories="handlecat" @subcategories="handlesub"
        class="category-modal" ref="productviewcategory" />
    </div>
    <div class="products-container">
      <div v-if="products.length > 0">
        <BreadcrumbComponent :maincategory="emitselectedmainCategory" :category="emitselectedCategory"
          :subcategory="emitselectedsubCategory" class="bread" @item-removed="handleremoved" />

        <div class="main-content">

          <div class="'products-wrapper products-wrapper-collapsed">
            <ProductCardComponent v-for="(item, index) in products" :key="index" :initialproduct="item"
              @cart-updated="handleCartUpdated" @liked-message="handleunauthorizedlike"
              @cart-message="handleunauthorizedcart" />
          </div>
          <CustomPagination v-if="products.length > 0 && pagination.total > 1" :currentPage="pagination.current_page"
            :totalPages="pagination.total" class="pagination" />
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import ProductCardComponent from '../../components/ProductCardComponent.vue';
import Message from '@/components/Message/MessageComponent.vue';
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue';
import CustomPagination from '@/components/CustomPagination.vue';
import ProductViewCategory from './ProductViewCategory.vue';
import api from '@/api';
export default {
  name: 'HomeView',
  components: {
    ProductCardComponent,
    BreadcrumbComponent,
    Message,
    CustomPagination,
    ProductViewCategory
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
      selectedmainCategory: [],
      selectedColors: [],
      selectedSizes: [],
      selectedBrands: [],
      emitselectedmainCategory: [],
      selectedCategory: [],
      emitselectedCategory: [],
      selectedsubCategory: [],
      emitselectedsubCategory: [],
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
        }, 500000000);
      }
    },
    emitlikemessage(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.emitlikemessage = null;
        }, 5000);
      }
    },
    emitcartmessage(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.emitcartmessage = null;
        }, 5000);
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
      this.selectmin = queryParams.get('min') || '';
      this.selectmax = queryParams.get('max') || '';
      this.selectedColors = queryParams.get('colors') || '';
      this.selectedSizes = queryParams.get('sizes') || ''
      this.selectedBrands = queryParams.get('brand') || ''

      try {
        const response = await api.get('display', {

          params: {
            searchname: this.searchname,
            maincategory: this.selectedmainCategory,
            category: this.selectedCategory,
            subcategory: this.selectedsubCategory,
            brands: this.selectedBrands,
            section: this.Section,
            min: this.selectmin,
            max: this.selectmax,
            sizes: this.selectedSizes,
            colors: this.selectedColors,
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
        }


      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    handlemain(maincategory) {
      if (maincategory.length) {
        this.emitselectedmainCategory = maincategory;

      } else {
        this.emitselectedmainCategory = [];
      }
    },
    handlecat(category) {
      if (category) {
        this.emitselectedCategory = category;

      } else {
        this.emitselectedCategory = [];
      }
    },
    handlesub(subcategory) {
      this.emitselectedsubCategory = subcategory
    },

    handleremoved(data) {
      const categoryArray = this.$refs.productviewcategory[data.category];

      if (categoryArray && data.index >= 0 && data.index < categoryArray.length) {
        categoryArray.splice(data.index, 1);
        this.$refs.productviewcategory.performSearch();
      } else {
        console.error('Invalid index or category array not found.');
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
    changePage(page) {
      this.$router.push({ path: '/product/all', query: { ...this.$route.query, page } });
    },
  },
};
</script>
<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  padding: 15px;
  gap: 20px;
}

.category-container {
  flex: 1;
  max-width: 250px;
  margin-top: 15px;
  padding: 10px;
  overflow-y: auto;
}

.products-container {
  flex: 3;
  padding: 10px;
}

.main-content {
  overflow: hidden;
}

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 80vh;
}

.content-wrapper {
  flex-grow: 1;
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
  .category-modal {
    display: none;
  }

  .category-container {
    display: none;
  }

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