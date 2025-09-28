<template>
  <div class="product-page" v-if="singleproduct">

    <Message v-if="message" :message="message" @close="message = ''" />
    <Message v-if="errormessage" :message="errormessage" @close="errormessage = ''" />

    <Breadcrumb class="bread" :maincategory="singleproduct.MainCategory" :category="singleproduct.Category"
      :subcategory="singleproduct.SubCategory" :name="singleproduct.name" />

    <div class="product-container">
      <div class="product-content">
        <div class="thumbnail-container">
          <div v-for="(image, index) in allImage" :key="index" class="thumbnail-item"
            :class="{ active: image === selectedImage }" @click="selectedImage = image" tabindex="0"
            @keydown.enter.prevent="selectedImage = image" aria-label="აირჩიეთ სურათი">
            <img :src="image" alt="Thumbnail" class="thumbnail-image" />
          </div>
        </div>

        <div class="product-main-image" @pointerup.stop.prevent="openimagemodal" aria-label="სურათის გადიდება">
          <img :src="selectedImage" alt="Product Image" class="product-image" />
        </div>

        <div class="product-info">

          <span class="sku">კოდი: {{ sku }}</span>

          <div class="info">
            <h1 class="product-name">{{ singleproduct.name }}</h1>

            <div class="brand">
              <img :src="singleproduct.brand.image">
            </div>
          </div>

          <p class="section-title">მოკლე აღწერა:</p>
          <p class="product-description">&nbsp; {{ singleproduct.description }}</p>

          <!-- <p class="section-title">დეტალები:</p> -->
          <div>
            <ul>
              <li>
                <div class="message-container">
                  <span>ზომები:</span>
                  <span v-if="messageVar.messageofsize" class="message">{{ messageVar.messageofsize }}</span>
                </div>
                <div class="size-container" role="listbox" aria-label="აირჩიეთ ზომა">
                  <div v-for="item in size" :class="['size-item', { active: selectedSize === item }]" :key="item"
                    @click="handleClick(item)" tabindex="0" @keydown.enter.prevent="handleClick(item)"
                    :aria-pressed="selectedSize === item">
                    {{ item }}
                  </div>
                </div>
              </li>

              <li>
                <div class="message-container">
                  <span>ფერი:</span>
                  <span v-if="messageVar.messageofcolor" class="message">{{ messageVar.messageofcolor }}</span>
                </div>
                <div class="color-container" role="listbox" aria-label="აირჩიეთ ფერი">
                  <div v-for="(item, index) in (selectedSize ? variantColors : allcolors)" :key="index"
                    :class="['color-item', { active: selectedColor === item.color }]" @click="colorclick(item)"
                    tabindex="0" @keydown.enter.prevent="colorclick(item)"
                    :style="{ background: (typeof item === 'string' ? item : item.hex) }"
                    :aria-pressed="selectedColor === item.color" />
                </div>
              </li>
            </ul>
            <div>
              <div>
                <div class="price">
                  <div class="discount"
                    v-if="!seeOriginal && singleproduct.discountprice && singleproduct.discountprice < singleproduct.price">
                    <span style="font-size: 20px; gap: 5px;">{{ singleproduct.discountprice }} <i
                        class="fa-solid fa-lari-sign"></i></span>
                    <span class="original-price">
                      <s>{{ singleproduct.price }} <i class="fa-solid fa-lari-sign"></i></s>
                    </span>
                  </div>

                  <div v-else>
                    {{ singleproduct.price }} <i class="fa-solid fa-lari-sign"></i>
                  </div>

                  <span
                    v-if="!seeOriginal && singleproduct.discountprice && singleproduct.discountprice < singleproduct.price"
                    class="discount-square status-discount">
                    -{{ Math.round(((singleproduct.price - singleproduct.discountprice) / singleproduct.price) * 100)
                    }}%
                  </span>
                </div>

                <div class="price" v-if="singleproduct.discountstatus">
                  <div ref="priceRef">
                    <div v-if="seeMore" class="price-popup">
                      &nbsp; ეს გულისხმობს რომ თქვენ გაქვთ სტატუსი მინიჭებული, რომელიც შეგიძლიათ იხილოთ <router-link
                        :to="{ name: 'status-info' }">სტატუსის გვერდზე</router-link>

                      თქვენ გეძლევათ არჩევნის საშუალება, თუ არ გსურთ თქვენი კუთვნილი ლიმიტს გამოყენება, სხვა მიზენების
                      გამოყენება
                      შეგიძლიათ შეიძნოთ საწყისი ფასით (რომელიც გავლენას არ იქონიებს ლიმიტზე) და დააგროვოთ ქულები თქვენს
                      ანგარიშზე
                      <div class="arrow-down"></div>
                    </div>
                    <div @pointerdown.stop.prevent="seeMorefn" class="more">
                      <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px"
                        fill="currentcolor">
                        <path
                          d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                      </svg>
                    </div>
                  </div>

                  <span style="font-size: 14px;">
                    ორიგინალი ფასით შეძენა :
                  </span>
                  <label class="toggle-switch">
                    <input type="checkbox" v-model="seeOriginal" />
                    <span class="slider"></span>
                  </label>
                </div>

              </div>

              <div class="buttons">
                <button class="buy" @pointerdown.stop.prevent="redirect"><svg xmlns="http://www.w3.org/2000/svg"
                    height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
                    <path
                      d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z" />
                  </svg> ყიდვა</button>
                <button class="small-btn" @pointerdown.stop.prevent="toggleLike">
                  <div v-if="!isLiked">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                      fill="currentcolor">
                      <path
                        d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                    </svg>
                  </div>
                  <div v-else>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                      fill="currentcolor">
                      <path
                        d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
                    </svg>
                  </div>

                </button>

                <button @pointerdown.stop.prevent="addToCart" v-if="!isOpen" class="small-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="currentcolor">
                    <path
                      d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
                  </svg>
                </button>

                <transition name="grow">
                  <div v-if="isOpen" class="panel">
                    <div class="quantity-control" role="group" aria-label="რაოდენობა">
                      <div class="increment-wrapper">
                        <div v-if="quantity !== 1">
                          <div v-if="messageVar.quantitydemessage" class="popup-message">
                            {{ messageVar.quantitydemessage }}
                            <div class="arrow-down"></div>
                          </div>
                          <button class="quantitybtn" @pointerdown.stop.prevent="updatequantity('decrement')"
                            aria-label="მ შემცირება">-</button>
                        </div>
                        <div v-else>
                          <button class="quantitybtn" @pointerdown.stop.prevent="updatequantity('delete')">
                            <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px"
                              fill="currentcolor">
                              <path
                                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                            </svg></button>
                        </div>
                      </div>
                      <span class="quantity" aria-live="polite">{{ quantity }}</span>
                      <div class="increment-wrapper">
                        <div v-if="messageVar.quantitymessage" class="popup-message">
                          {{ messageVar.quantitymessage }}
                          <div class="arrow-down"></div>
                        </div>
                        <button class="quantitybtn" @pointerdown.stop.prevent="updatequantity('increment')"
                          aria-label="მ გაზრდა">+</button>
                      </div>
                    </div>
                  </div>
                </transition>

              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
    <hr class="custom-line" />
    <div class="down-section">
      <div class="detail-info">
        <p class="section-title">პროდუქტის შესახებ:</p>
        <ul class="additional-ul">
          <li v-for="(item, index) in additionalinfo" :key="index">
            <span v-for="([key, value], innerIndex) in Object.entries(item)" :key="innerIndex" class="dotted-line">
              <span class="key">{{ key }}</span>
              <span class="dots"></span>
              <span class="value">{{ value }}</span>
            </span>
          </li>
        </ul>
      </div>
      <div class="information">
        <div class="info-card">
          <div class="card-body">
            <p> მიტანის სერვისი უფასოა 200 ლარზე მეტი შეკვეთისას</p>
            <p> ინფორმაცია გადახდის მეთოდების შესახებ</p>
            <p> დაბრუნების პოლიტიკა გთავაზობთ უკეთესს ვიდრე სხვები</p>
            <p> დაზიანების შემთხვევაში</p>
          </div>
        </div>
      </div>

    </div>


    <ImageComponent :open="openImage" :selectedImage="selectedImage" :images="allImage"
      @update:open="openImage = false" />

    <hr class="custom-line" />
  </div>
</template>

<script setup>
import 'vue3-carousel/dist/carousel.css';
import Message from '@/components/Message/MessageComponent.vue';
import Breadcrumb from '@/components/BreadcrumbComponent.vue';
import api from '@/api';
import ImageComponent from './ImageComponent.vue';
import { watch, ref, reactive, computed, onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useHead } from '@vueuse/head';
import store from '@/store';
import { useAuth } from '@/mixin/reuse'
const router = useRouter();
const props = defineProps({
  id: {
    type: Number,
    required: true
  }
});
const { isAuth } = useAuth()

const priceRef = ref(null);

const openImage = ref(false);
const additionalinfo = ref([]);
const singleproduct = ref(null);
const message = ref(null);
const seeOriginal = ref(false);
const errormessage = ref(null);
const isOpen = ref(false);
const selectedSize = ref(null);
const selectedColor = ref(null);
const selectedImage = ref(null);
const allImage = ref([]);
const selectedColorquantity = ref(1);
const allcolors = ref([]);
const size = ref([]);
const quantity = ref(1);
const sku = ref();
const isLiked = ref(false);
const messageVar = reactive([]);
const seeMore = ref(false);
watch(
  () => props.id,
  async () => {
    await getproduct();
  },
  { immediate: true }
);


const activeVariant = computed(() => {
  const variant = singleproduct.value?.variants.find(v => v.id == props.id)
  return variant ? reactive(variant) : null
})



const variantColors = computed(() => {
  if (!singleproduct.value) return [];
  const allDetails = singleproduct.value.variants.filter(v => v.size[0].size === selectedSize.value).flatMap(v => v.size[0].details) || [];
  return allDetails;
});

function seeMorefn() {
  seeMore.value = !seeMore.value
}
function handleClickOutside(event) {
  if (priceRef.value && !priceRef.value.contains(event.target)) {
    seeMore.value = false;
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

async function toggleLike() {
  if (!isAuth.value) {
    store.commit('modals/openmodal', 'loginmodal', { root: true });
    return;
  }
  const previousState = isLiked.value;
  isLiked.value = !isLiked.value;
  try {
    if (isLiked.value) {
      await like(activeVariant.value.id);
    } else {
      await unlike(activeVariant.value.id);
    }
  } catch (error) {
    console.log(error);
    isLiked.value = previousState;
  }
}
async function like(id) {
  try {
    await api.post(`like/${id}`, {}, { tokenRequired: true });
    isLiked.value = true;
  } catch (error) {
    console.log(error);
  }
}
async function unlike(id) {

  try {
    await api.post(`unlike/${id}`, {}, { tokenRequired: true });
    isLiked.value = false;
  } catch (error) {
    console.log(error);
  }
}


watch(
  () => singleproduct.value,
  () => {
    if (!activeVariant.value) return;
    sku.value = activeVariant.value.sku
    isLiked.value = activeVariant.value.isLiked
    quantity.value = activeVariant.value.inCartQuantity || 1
    isOpen.value = !!activeVariant.value.inCartQuantity
    selectedImage.value = activeVariant.value.image_urls[0]
    allImage.value = activeVariant.value.image_urls;
    selectedSize.value = activeVariant.value.size[0]?.size || null;
    selectedColor.value = activeVariant.value.size[0]?.details[0].color || null
  }
);
watch([selectedSize, selectedColor],
  ([size, color]) => {
    if (!size || !color) {
      return;
    }
    const detail = singleproduct.value.variants.find(v => v.size[0].size === size && v.size[0].details[0].color === color)
    if (!detail) return;
    router.replace({
      name: 'single',
      params: {
        id: detail.id,
        slug: detail.slug,
      }
    });
  }
);

watch(openImage, (newVal) => {
  document.body.style.overflow = newVal ? 'hidden' : '';
})

async function openimagemodal() {
  openImage.value = !openImage.value;
}

async function redirect() {
  try {
    if (!selectedSize.value) showMessage("აირჩიეთ ზომა", "messageofsize");
    if (!selectedColor.value) showMessage("აირჩიეთ ფერი", "messageofcolor");
    if (!selectedSize.value || !selectedColor.value) return;

    const qty = quantity.value || 1;
    const data = [{
      quantity: qty,
      name: singleproduct.value.name,
      product_id: props.id,
      size: selectedSize.value,
      type: "direct",
      color: selectedColor.value,
      seeOriginal: seeOriginal.value,
    }];


    await api.post("/temporder", { products: data }, { tokenRequired: true });
    router.push({ name: "checkout" });
  } catch (error) {
    if (error?.response?.status === 403) {
      message.value = `ელფოსტა არ არის ვერიფიცირებული, ვეირიფიკაციისთვის დაჭირეთ <a href='/profile' style="color:white" target='_blank'>აქ</a>`;
    }
  }
}
async function updatequantity(action) {
  try {
    if (action === 'increment') {
      if (quantity.value >= activeVariant.value.size[0].details[0].quantity) {
        this.showMessage("მაქსიმალური რაოდენობა", "quantitymessage", props.id);
        return;
      } else {
        quantity.value++
        quick_update('increment');
      }
    } else if (action === 'decrement') {
      if (quantity.value <= 1) {
        this.showMessage("ნაკლები რაოდენობა არ შეიძლება", "quantitydemessage", props.id);
        return;
      } else {
        quantity.value--
        quick_update('decrement');
      }
    } else if (action === 'delete') {
      quick_update('delete');
      isOpen.value = false;

    }

  } catch (error) {
    console.log(error);
  }

}

async function quick_update(action) {
  try {
    await api.post("/quick_update", {
      id: props.id,
      size: selectedSize.value,
      color: selectedColor.value,
      action: action
    }, { tokenRequired: true });
  } catch (error) {
    return error;
  }
}

async function showMessage(message, messageType) {
  messageVar[messageType] = message;
  await new Promise(resolve => setTimeout(resolve, 2000));
  messageVar[messageType] = '';
}

function handleClick(item) {
  if (selectedSize.value === item) {
    selectedSize.value = null;
  } else {
    selectedSize.value = item;
  }
}


function colorclick(item) {
  if (selectedColor.value === item.color) {
    selectedColor.value = null;
    selectedColorquantity.value = null;
    isOpen.value = false;
  } else {
    selectedColor.value = item.color;
    selectedColorquantity.value = item.quantity;
  }
}


async function getproduct() {
  try {
    const response = await api.get(`display/${props.id}`, { tokenRequired: true });
    singleproduct.value = response.data.data;
    useHead({
      title: `${singleproduct.value.name} - lemale`,
      meta: [
        { name: 'description', content: singleproduct.value?.description || 'Default description' },
        { name: 'robots', content: 'index, follow' },
        { name: 'og:type', content: "product" },
        { property: "og:title", content: singleproduct.value.name },
        { property: "og:description", content: singleproduct.value.description },
        { property: "og:url", content: `http://localhost:8080/product/${singleproduct.value.MainCategory.en_name}/${singleproduct.value.Category.en_name}/${singleproduct.value.SubCategory.en_name}/${singleproduct.value.name}/${singleproduct.value.id}` },
        { property: "og:image", content: singleproduct.value.variants[0].image_urls[0] }

      ]
    });


    try {
      additionalinfo.value = JSON.parse(singleproduct.value.additionalinfo || '[]') || [];
    } catch {
      additionalinfo.value = [];
    }


    size.value = new Set(
      singleproduct.value.variants?.flatMap(variant =>
        variant.size.flatMap(s => s.size) || []
      ) || []
    );



    const hexes = (() => {
      if (!singleproduct.value) return [];

      const allDetails = singleproduct.value.variants?.flatMap(variant =>
        variant.size?.flatMap(size => size.details) || []
      ) || [];

      const uniqueMap = new Map();
      allDetails.forEach(d => {
        if (!uniqueMap.has(d.color)) uniqueMap.set(d.color, d);
      });

      return Array.from(uniqueMap.values());
    })();

    allcolors.value = hexes;



  } catch (error) {
    errormessage.value = "An error occurred while loading the data.";
    console.error(error);
  }
}

async function addToCart() {
  if (!selectedSize.value) showMessage("აირჩიეთ ზომა", "messageofsize");
  if (!selectedColor.value) showMessage("აირჩიეთ ფერი", "messageofcolor");
  if (!selectedSize.value || !selectedColor.value) return;
  try {
    const response = await api.post(
      `addcart/${props.id}`,
      { type: singleproduct.value.size_type, size: selectedSize.value, color: selectedColor.value, isOriginal: seeOriginal.value },
      { tokenRequired: true }
    );
    if (response.status === 200) {
      isOpen.value = true;
    }
    message.value = response.data.message;
  } catch (error) {
    if (error.response.status === 403) {
      store.commit('modals/openmodal', 'loginmodal', { root: true });

    }
  }
}


</script>

<style scoped>
.product-page {
  --brand: #5e14cc;
  --brand-600: #5e14cc;
  --text: #2b2731;
  --muted: #6b6b6b;
  --border: #e6e6e6;
  --bg: #ffffff;
  --surface: #fafafa;
  --danger: #d9534f;
}

.info-card {
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  margin: 20px 0;
  padding: 20px;
  max-width: 600px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  bottom: 4px;
  cursor: pointer;
  background-color: #ccc;
  border-radius: 34px;
  width: 90%;
  height: 70%;
  transition: background-color 0.3s;
}

.slider::before {
  content: "";
  position: absolute;
  height: 15px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.toggle-switch input:checked+.slider {
  background-color: var(--brand);
}

.toggle-switch input:checked+.slider::before {
  transform: translateX(26px);
}


.card-body {
  font-size: 16px;
  line-height: 1.5;
  color: #555;
}

.card-body p {
  position: relative;
  padding-left: 25px;
  margin-bottom: 10px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: color 0.2s ease;
}

.card-body p::before {
  content: '➤';
  position: absolute;
  left: 0;
  top: 0;
  color: var(--brand);
  font-size: 16px;
  transition: transform 0.2s ease, color 0.2s ease;
}

/* Hover ეფექტი */
.card-body p:hover {
  color: var(--brand);
  text-decoration: underline;

}

.card-body p:hover::before {
  transform: translateX(5px);
  color: var(--brand);
}



.card-body a {
  color: #6633cc;
  text-decoration: none;
}

.card-body a:hover {
  text-decoration: underline;
}

.sku {
  color: #666464;
  font-size: 12px;
}

.down-section {
  display: flex;
  flex-direction: row;
}

.detail-info {
  width: 70%;
}

.information {
  width: 30%;
}

/* ============ BASE ============ */
.product-page {
  display: flex;
  flex-direction: column;
  margin: auto;
  padding: 30px;
}

.bread {
  margin-bottom: 8px;
}

span {
  font-size: 13px;
}

.product-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 15px;
  gap: 30px;
  align-items: flex-start;
}

.product-content {
  display: flex;
  width: 100%;
  gap: 16px;
}

.thumbnail-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-main-image {
  flex: 0 0 350px;
  height: 600px;
  /* higher for better presentation */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
}

.product-info {
  flex: 1;
  margin-left: 50px;
  min-width: 300px;
}


.brand {
  display: flex;
  align-items: center;
}

.brand img {
  width: 50px;
}

.thumbnail-item {
  width: 100px;
  height: 130px;
  border: 1.5px solid transparent;
  cursor: pointer;
  overflow: hidden;
  background: #fff;
  transition: border-color .2s, transform .2s;
}

.thumbnail-item:hover {
  transform: translateY(-1px);
}

.thumbnail-item.active {
  border-color: var(--brand);
}

.custom-line {
  border: none;
  height: 1px;
  background-color: var(--border);
  margin: 40px 0 0;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ============ MAIN IMAGE ============ */
.product-image {
  max-height: 600px;
  width: 480px;
  object-fit: contain;
  cursor: zoom-in;
  border-radius: 12px;

}

/* ============ TEXT ============ */
.product-name {
  font-size: 18px;
  color: #000;
  margin-bottom: 6px;
}

.info {
  display: flex;
  gap: 40px;
}

.section-title {
  font-size: 18px;
  color: var(--text);
  font-weight: 700;
}

.product-description {
  font-size: 14px;
  max-width: 500px;
  line-height: 1.5;
  color: #000;
}

/* ============ VARIANTS ============ */
.message-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.message {
  font-size: 12px;
  color: var(--danger);
  margin-left: 10px;
  transition: opacity 0.3s ease;
  opacity: 1;
}

.color-container,
.size-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
}

.size-item {
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--brand);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--brand);
  cursor: pointer;
  background: transparent;
}

.size-item:hover,
.size-item.active {
  background: var(--brand);
  color: white;
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}

.color-item {
  display: flex;
  height: 32px;
  width: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid #d9d9d9;
  transition: box-shadow .2s, transform .2s, outline-color .2s;
}

.color-item:hover {
  transform: translateY(-1px);
}

.color-item.active {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}

/* ============ ADDITIONAL INFO ============ */
.additional-ul {
  width: 80%;
}

.dotted-line {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.key {
  margin-right: 10px;
  font-size: 15px;
  white-space: nowrap;
  width: 200px;
}

.dots {
  flex-grow: 0;
  border-bottom: 1px dashed #2b27314d;
  width: 80%;
  margin-right: 10px;
}

.value {
  white-space: nowrap;
  font-size: 15px;
  width: 200px;
  justify-content: end;

}

/* ============ ASIDE (UNCHANGED STRUCTURE) ============ */
.discount {
  display: flex;
  gap: 10px;
}

.price {
  position: relative;
  display: inline-block;
  font-size: 20px;
  font-weight: 500;
  color: #000;
  display: flex;
  align-items: center;
  padding-left: 20px;
  gap: 8px;
  margin: 0 0 0;
}

.price-popup {
  position: absolute;
  bottom: 110%;
  line-height: 2;
  left: 33%;
  transform: translateX(-50%);
  background-color: #fff;
  color: #333;
  border: 1px solid #d1d1d1;
  border-radius: 6px;
  padding: 15px;
  font-size: 13px;
  white-space: wrap;
  z-index: 9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.price .more {
  font-size: 13px;
  display: flex;
  align-items: center;
  color: var(--brand);
  cursor: pointer;
}

.original-price {
  font-size: 17px;
  color: var(--muted);
}

.discount-square {
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  padding: 4px 6px;
  border-radius: 4px;
}

.status-discount {
  background: gold;
}

.default-discount {
  background: #e60000;
}

/* ============ QUANTITY ============ */

.grow-enter-from,
.grow-leave-to {
  transform: scaleX(0);
  opacity: 0;
}

.grow-enter-to,
.grow-leave-from {
  transform: scaleX(1);
  opacity: 1;
}

.grow-enter-active,
.grow-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.panel {
  transform-origin: left center;
}

.small-btn {
  padding: 14px;
  border: 1px solid transparent;
  border-radius: 10px;
  height: 50px;
  cursor: pointer;

}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 13px;
  height: max-content;
  background-color: #fff;
  gap: 4px;
}

.small-btn:hover {
  background-color: #fff;
  border: 1px solid var(--border);

}



.quantitybtn {
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  padding: 0 12px;
}

.quantitybtn:hover {
  color: #000;
}

.quantitybtn:focus {
  outline: none;
}

.quantity {
  font-size: 15px;
  padding: 0 10px;
  min-width: 32px;
  justify-content: center;
  text-align: center;
}

.increment-wrapper {
  position: relative;
  display: inline-block;
}

.popup-message {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  color: #333;
  border: 1px solid #d1d1d1;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 13px;
  white-space: nowrap;
  z-index: 9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.popup-message .arrow-down {
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #d1d1d1;
}

.price-popup .arrow-down {
  position: absolute;
  top: 100%;
  left: 5%;
  height: 10px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #d1d1d1;
}

.buttons {
  display: flex;
  gap: 10px;
  padding-top: 20px;
}

.buy {
  display: flex;
  justify-content: center;
  gap: 6px;
  align-items: center;
  padding: 14px 20px;
  border-radius: 10px;
  width: 50%;
  height: auto;
  height: 50px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  text-align: center;
  transition: .2s;
}






.buy {
  background-color: var(--brand);
  color: #fff;
  border: none;
}

.buy:hover {
  background-color: var(--brand-600);
}


/* ============ MISC ============ */
.custom-line {
  border: none;
  height: 1px;
  background-color: var(--border);
  margin: 40px 0 0;
}

/* ============ RESPONSIVE (UNCHANGED STRUCTURE) ============ */
@media (max-width: 1024px) {
  .left-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .product-container {
    flex-direction: column;
  }

  .product-content,
  .left-section {
    width: 100%;
    margin: auto;
    display: table-column;
  }

  .quantity-control {
    justify-content: center;
    width: fit-content;
    margin: auto;
  }

  .thumbnail-container {
    flex-direction: row;
  }

  .product-main-image {
    height: 360px;
  }
}
</style>
