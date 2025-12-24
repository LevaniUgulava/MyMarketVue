<template>
  <Message v-if="emitcartmessage" :message="emitcartmessage" @close="emitcartmessage = ''" />
  <Message v-if="emitdata" :message="emitdata" @close="emitdata = ''" />
  <div class="container">

    <div class="category-container">
      <ProductViewCategory @maincategories="handlemain" @categories="handlecat" @subcategories="handlesub"
        class="category-modal" ref="productviewcategory" />
    </div>
    <div class="products-container">

      <div>
        <div class="head">
          <BreadcrumbComponent :maincategory="emitselectedmainCategory" :category="emitselectedCategory"
            :subcategory="emitselectedsubCategory" class="bread" @item-removed="handleremoved" />
          <div class="search-input" v-if="searchname">
            <input v-model="searchname" @input="performLocalSearch" type="text" placeholder="რას ეძებ?">
            <button @pointerdown="performSearch" class="search-btn"><svg data-v-5c833af0=""
                xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                fill="currentcolor">
                <path data-v-5c833af0=""
                  d="M779.38-153.85 528.92-404.31q-30 25.54-69 39.54t-78.38 14q-96.1 0-162.67-66.53-66.56-66.53-66.56-162.57 0-96.05 66.53-162.71 66.53-66.65 162.57-66.65 96.05 0 162.71 66.56Q610.77-676.1 610.77-580q0 41.69-14.77 80.69t-38.77 66.69l250.46 250.47-28.31 28.3ZM381.54-390.77q79.61 0 134.42-54.81 54.81-54.8 54.81-134.42 0-79.62-54.81-134.42-54.81-54.81-134.42-54.81-79.62 0-134.42 54.81-54.81 54.8-54.81 134.42 0 79.62 54.81 134.42 54.8 54.81 134.42 54.81Z">
                </path>
              </svg> ძიება</button>
          </div>
        </div>

        <div class="main-content">

          <div class="products-wrapper-collapsed" v-if="products.length > 0 && isloaded">
            <ProductCardComponent v-for="(item, index) in products" :key="index" :initialproduct="item"
              @cart-updated="handleCartUpdated" @liked-message="handleunauthorizedlike"
              @cart-message="handleunauthorizedcart" />
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
          <CustomPagination v-if="products.length > 0 && pagination.total > 1" :currentPage="pagination.current_page"
            :totalPages="pagination.total" class="pagination" />
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import ProductCardComponent from '../../components/ProductCardComponent.vue';
import Message from '@/components/Message/MessageComponent.vue';
import BreadcrumbComponent from '@/components/BreadcrumbComponent.vue';
import CustomPagination from '@/components/CustomPagination.vue';
import ProductViewCategory from './ProductViewCategory.vue';
import SkeletonComponent from '@/components/SkeletonComponent.vue';
import api from '@/api';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';

const route = useRoute()

const productviewcategory = ref(null);

const products = ref([]);
const isloaded = ref(false);
const selectmin = ref(0);
const selectmax = ref(0);
const searchname = ref('');
const selectedmainCategory = ref([]);
const selectedColors = ref([]);
const selectedSizes = ref([]);
const selectedBrands = ref([]);
const emitselectedmainCategory = ref([]);
const selectedCategory = ref([]);
const emitselectedCategory = ref([]);
const selectedsubCategory = ref([]);
const emitselectedsubCategory = ref([]);
const emitdata = ref(null);
const emitlikemessage = ref(null);
const emitcartmessage = ref(null);
const Section = ref(null);
const pagination = ref({});
const title = ref(null)


function formatSection(section) {
  switch (section) {
    case "all":
      title.value = "ყველა პროდუქტი";
      break;
    case "discount":
      title.value = "ფასდაკლებული პროდუქტი";
      break;
    case "new":
      title.value = "ახალი პროდუქტი";
      break;
    default:
      title.value = section;
      break;
  }

}
function formatTitle() {
  const storedCategories = sessionStorage.getItem('categories');
  const parsedCategories = JSON.parse(storedCategories);
  const mainCategories = parsedCategories.mainCategories;

  const filteredCategories = selectedmainCategory.value
    .split(',')
    .map(id => {
      return mainCategories.filter(category => category.id === parseInt(id));
    })
    .flat();

  if (filteredCategories.length === 0) {
    return '';
  }

  const categoryNames = filteredCategories.map(category => { return `${category.ka_name}ს` });

  return `${categoryNames.join(', ')} |`;
}

watch(emitdata, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      emitdata.value = null;
    }, 5000);
  }
})
watch(emitlikemessage, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      emitlikemessage.value = null;
    }, 5000);
  }
})
watch(emitcartmessage, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      emitcartmessage.value = null;
    }, 5000);
  }
})
watch(
  () => route.query,
  () => {
    fetchProducts()
  },
  { immediate: true }
)


async function fetchProducts() {
  const queryParams = new URLSearchParams(route.query);
  const page = parseInt(queryParams.get('page')) || 1;
  searchname.value = queryParams.get('searchname') || '';
  selectedmainCategory.value = queryParams.get('maincategory') || '';
  selectedCategory.value = queryParams.get('category') || '';
  selectedsubCategory.value = queryParams.get('subcategory') || '';
  Section.value = queryParams.get('section') || '';
  selectmin.value = queryParams.get('min') || '';
  selectmax.value = queryParams.get('max') || '';
  selectedColors.value = queryParams.get('colors') || '';
  selectedSizes.value = queryParams.get('sizes') || ''
  selectedBrands.value = queryParams.get('brand') || ''

  try {
    const response = await api.get('display', {
      tokenOptional: true,
      params: {
        searchname: searchname.value,
        maincategory: selectedmainCategory.value,
        category: selectedCategory.value,
        subcategory: selectedsubCategory.value,
        brands: selectedBrands.value,
        section: Section.value,
        min: selectmin.value,
        max: selectmax.value,
        sizes: selectedSizes.value,
        colors: selectedColors.value,
        page: page,
      },
    },);



    const titleCategory = formatTitle();

    formatSection(Section.value);

    useHead({
      title: `${titleCategory} ტანსაცმელი, ფეხსაცმელი და აქსესუარები - ${title.value}`,
      meta: [
        { name: 'description', content: `${titleCategory} ტანსაცმელი, ფეხსაცმელი და აქსესუარები. ყიდვა საუკეთესო ფასებში.` },
        { property: 'og:title', content: `${titleCategory} ტანსაცმელი, ფეხსაცმელი და აქსესუარები - ${title.value}` },
        { property: 'og:description', content: `${titleCategory} ტანსაცმელი, ფეხსაცმელი და აქსესუარები. ყიდვა საუკეთესო ფასებში.` },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'URL_TO_YOUR_IMAGE' }
      ]
    })


    if (Section.value == "all") {
      products.value = response.data.all.data;
      pagination.value = {
        current_page: response.data.all.meta.current_page || 1,
        total: response.data.all.meta.last_page
      };

    } else if (Section.value == "discount") {
      products.value = response.data.discount.data;
      pagination.value = {
        current_page: response.data.discount.meta.current_page || 1,
        total: response.data.discount.meta.last_page
      };
    } else if (Section.value == "new") {
      products.value = response.data.new.data;
      pagination.value = {
        current_page: response.data.discount.meta.current_page || 1,
        total: response.data.new.meta.last_page
      };
    }


  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    isloaded.value = true;
  }
}
function handlemain(maincategory) {
  if (maincategory.length) {
    emitselectedmainCategory.value = maincategory;

  } else {
    emitselectedmainCategory.value = [];
  }
}
function handlecat(category) {
  if (category) {
    emitselectedCategory.value = category;

  } else {
    emitselectedCategory.value = [];
  }
}
function handlesub(subcategory) {
  emitselectedsubCategory.value = subcategory
}

function handleremoved(data) {
  const categoryArray = productviewcategory.value[data.category];

  if (categoryArray && data.index >= 0 && data.index < categoryArray.length) {
    categoryArray.splice(data.index, 1);
    productviewcategory.value.performSearch();
  } else {
    console.error('Invalid index or category array not found.');
  }
}


function handleCartUpdated(cartData) {
  emitdata.value = cartData;
}
function handleunauthorizedlike(message) {
  emitdata.value = message.message;

}
function handleunauthorizedcart(cartmessage) {
  emitcartmessage.value = cartmessage;
}
// function changePage(page) {
//   $router.push({ path: '/product/all', query: { ...$route.query, page } });
// }
</script>
<style scoped>
.search-input {
  display: flex;
  gap: 10px;
}

.search-input input {
  width: 100%;
  padding: 10px 24px;
  font-size: 15px;
  border-radius: 10px;
  background-color: transparent;
  border: 1px solid #dcdcdc;
}

.search-btn {
  display: flex;
  align-items: center;
  font-size: 12px;
  border-radius: 10px;
  border: none;
  background-color: #102556;
  color: white;
  gap: 5px;
  width: auto;
  justify-content: center;
  min-width: 100px;
  cursor: pointer;
  padding: 5px 15px;
}

.search-btn:hover {
  background-color: #162E63;

}

.search-input input:focus {
  columns: black;
}


.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  flex-direction: column;
  text-align: center;
}

.emptyicon {
  font-size: 35px;
  color: transparent;
  color: #ccc;
}

.empty p {
  color: #ccc;
  font-size: 14px;
}

.container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.category-container {
  flex: 1;
  max-width: 230px;
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

.head {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 20px;
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

/* .bread {
  margin-top: 15px;
} */

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  background: white;
  margin-top: auto;
  /* Forces pagination to bottom */
}

@media (max-width: 767px) {
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

@media (min-width: 768px) and (max-width: 1024px) {
  .products-wrapper-collapsed {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    display: grid;
    width: 100%;
  }
}
</style>