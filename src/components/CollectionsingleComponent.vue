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

<script setup>
import ProductCardComponent from '../components/ProductCardComponent.vue';
import api from '@/api';
import Breadcrumb from '@/components/BreadcrumbComponent.vue';
import ProductViewCategory from '@/views/Products/ProductViewCategory.vue';
import SkeletonComponent from './SkeletonComponent.vue';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';
const route = useRoute();
// const router = useRouter();
const props = defineProps({
  id: {
    type: Number,
    required: true
  }
});

const products = ref([]);
const isloaded = ref(false);
const emitdata = ref(null);
const emitlikemessage = ref(null)
const emitcartmessage = ref(null)
// const pagination = ref({})
const title = ref("")



watch(emitdata, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      emitdata.value = null;
    }, 3000);
  }
})
watch(emitlikemessage, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      emitlikemessage.value = null;
    }, 3000);
  }
})
watch(emitcartmessage, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      emitcartmessage.value = null;
    }, 3000);
  }
})
watch(
  () => route.query,
  () => {
    getcollection();
  },
  { immediate: true }
);

async function getcollection() {
  const queryParams = new URLSearchParams(route.query);
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
    const response = await api.get(`product/collection/${props.id}`, {
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
    products.value = response.data.collection.products;
    title.value = response.data.collection.title;
    // this.pagination = response.data.pagination;

    useHead({
      title: `${title.value} | ${products.value.length} პროდუქტი`,
      meta: [
        { name: "description", content: `ჩვენ გვაქვს ${products.value.length} პროდუქტი თქვენს არჩევანში.` },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: `${title.value} კოლექცია` },
        { property: "og:description", content: `შეიძინეთ ${products.value.length} პროდუქტი ${title.value}-დან` },
        { property: "og:image", content: response.data.collection.media_url },
        { property: "og:url", content: window.location.href }

      ]
    });


  } catch (error) {
    console.log(error);
  } finally {
    isloaded.value = true;
  }
}

function handleCartUpdated(cartData) {
  emitdata.value = cartData.message;
}
function handleunauthorizedlike(likedmessage) {
  emitlikemessage.value = likedmessage;
}
function handleunauthorizedcart(cartmessage) {
  emitcartmessage.value = cartmessage;
}
// function changePage(page) {
//   router.push({ path: '/', query: { ...route.query, page } });
// }

onMounted(() => {
  getcollection()
})

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