<template>
  <div>
    <div class="container">

      <div class="category-container">
        <ProductViewCategory @maincategories="handlemain" @categories="handlecat" @subcategories="handlesub"
          class="category-modal" ref="productviewcategory" />
      </div>

      <div class="product-container">
        <Breadcrumb class="bread" :maincategory="[]" :category="[]" :subcategory="[]" :name="title" />

        <div v-if="products.length > 0 && isloaded">
          <div class=" products-wrapper">
            <ProductCardComponent v-for="(item) in products" :key="item.id" :initialproduct="item"
              @cart-updated="handleCartUpdated" @liked-message="handleunauthorizedlike"
              @cart-message="handleunauthorizedcart" />
          </div>
        </div>
        <div v-else-if="!isloaded">
          <SkeletonComponent />
        </div>

        <div v-else-if="isloaded">
          <div class="empty">
            <i class="fa-solid fa-magnifying-glass emptyicon"></i>
            <p>პროდუქტი ვერ მოიძებნა</p>

          </div>
        </div>
      </div>
    </div>



  </div>


</template>

<script>
import ProductCardComponent from '../components/ProductCardComponent.vue';
import api from '@/api';
import Breadcrumb from '@/components/BreadcrumbComponent.vue';
import ProductViewCategory from '@/views/Products/ProductViewCategory.vue';
import SkeletonComponent from './SkeletonComponent.vue';
export default {
  name: 'FavoriteView',
  components: {
    ProductCardComponent,
    Breadcrumb,
    ProductViewCategory,
    SkeletonComponent
  },
  props: ["id"],
  data() {
    return {
      products: [],
      isloaded: false,
      showModal: false,
      selectedProduct: null,
      selectedProductComments: [],
      emitdata: null,
      emitlikemessage: null,
      emitcartmessage: null,
      pagination: {},
      title: "",
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
      handler() {
        this.getcollection();
      },
      immediate: true,
    },
  },
  methods: {
    async getcollection() {
      const queryParams = new URLSearchParams(this.$route.query);
      const page = parseInt(queryParams.get('page')) || 1;
      let selectedmainCategory = queryParams.get('maincategory') || '';
      let selectedCategory = queryParams.get('category') || '';
      let selectedsubCategory = queryParams.get('subcategory') || '';
      let Section = queryParams.get('section') || '';
      let selectmin = queryParams.get('min') || '';
      let selectmax = queryParams.get('max') || '';
      let selectedColors = queryParams.get('colors') || '';
      let selectedSizes = queryParams.get('sizes') || ''
      let selectedBrands = queryParams.get('brand') || ''
      try {
        const response = await api.get(`product/collection/${this.id}`, {
          tokenRequired: true,
          params: {
            maincategory: selectedmainCategory,
            category: selectedCategory,
            subcategory: selectedsubCategory,
            brands: selectedBrands,
            section: Section,
            min: selectmin,
            max: selectmax,
            sizes: selectedSizes,
            colors: selectedColors,
            page: page,
          },
        });
        this.products = response.data.collection.products;
        this.title = response.data.collection.title;
        // this.pagination = response.data.pagination;


      } catch (error) {
        console.log(error);
      } finally {
        this.isloaded = true;
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
      this.$router.push({ path: '/', query: { ...this.$route.query, page } });
    },

  },
  mounted() {
    this.getcollection();
  },
};
</script>

<style scoped>
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  flex-direction: column;
  text-align: center;
  width: 1100px;
}

.emptyicon {
  font-size: 35px;
  color: #ccc;
}

.empty p {
  color: #ccc;
  font-size: 14px;
}


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

.bread {
  margin-top: 15px;
}

.products-container {
  flex: 3;
  padding: 10px;
}

.loading-spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #007bff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 40px auto;
  margin-top: 20%;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  text-align: center;
  font-size: 1.1rem;
  color: #333;
  margin-top: 10px;
}

.no-products-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #f9fafb;
  padding: 40px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  color: #555;
  margin-top: 10%;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.no-products-message p {
  font-size: 1.2rem;
  font-weight: 500;
  color: #444;
  margin-bottom: 15px;
}

.no-products-message .fas {
  margin-right: 8px;
  color: #ff6b6b;
  font-size: 1.5rem;
}

.explore-link {
  text-decoration: none;
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  font-weight: 500;
}

.explore-link:hover {
  background-color: #0056b3;
}

.no-products-message:hover {
  transform: scale(1.05);
}

.products-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  width: 100%;
}

.message {
  position: sticky;
  top: 70px;
  z-index: 999;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.pagination {
  display: flex;
  list-style-type: none;
  padding: 0;
  justify-content: center;
  margin: 25px 0;
}

.page-item {
  margin: 0 5px;
}

.page-link {
  display: block;
  padding: 8px 14px;
  color: #007bff;
  font-weight: 500;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-item.active .page-link {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.page-link:hover,
.page-link:focus {
  background-color: #0056b3;
  color: #fff;
  border-color: #0056b3;
  text-decoration: none;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}


@media (max-width: 767px) {
  .category-modal {
    display: none;
  }

  .category-container {
    display: none;
  }

  .products-wrapper {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    margin-top: 20px;
  }
}
</style>