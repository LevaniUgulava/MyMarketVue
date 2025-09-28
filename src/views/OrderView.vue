<template>
  <div class="container">
    <div class="toggle-buttons">
      <button :class="{ active: showPending }" @click="toggleSection('pending')">
        მიმდინარე შეკვეთები
      </button>
      <button :class="{ active: !showPending }" @click="toggleSection('completed')">
        შესრულებული შეკვეთები
      </button>
    </div>

    <div v-if="apiLoaded && showPending" class="order-section">

      <div v-if="OrderProducts.length > 0" class="order-box">
        <div v-for="order in OrderProducts" :key="order.order_id" class="order-card">
          <div class="left-section">
            <OrderComponent v-for="product in order.products" :key="product.id" :product="product"
              :order_status="order.order_status" />
          </div>
          <div class="right-section">
            <div class="order-desc">
              <h3 class="order-id">შეკვეთის ნომერი: #{{ order.order_id }}</h3>
              <h3 class="order-amount">გადახდილი თანხა: {{ order.order_amount }} <i class="fa-solid fa-lari-sign"></i>
              </h3>
              <h3 class="order-amount">მიმღები: {{ order.order_fullname }}</h3>
              <h3 class="order-amount">მისამართი : {{ order.address.town }}, {{ order.address.address }}</h3>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-order-message">
        <i class="fas fa-box-open"></i>
        <p>თქვენ არ გაქვთ შეკვეთა</p>
        <a href="/shop" class="shop-link">მთავარი გვერდი</a>
      </div>
    </div>


    <div v-if="apiLoaded && !showPending" class="order-section">
      <div v-if="CompletedProducts.length > 0" class="order-box">
        <div v-for="order in CompletedProducts" :key="order.order_id" class="order-card">
          <div class="products">
            <OrderComponent v-for="product in order.products" :key="product.id" :product="product"
              :order_status="order.order_status" />
          </div>
          <div class="right-section">
            <div class="order-desc">
              <h3 class="order-id">შეკვეთის ნომერი: #{{ order.order_id }}</h3>
              <h3 class="order-amount">გადახდილი თანხა: {{ order.order_amount }} <i class="fa-solid fa-lari-sign"></i>
              </h3>
              <h3 class="order-amount">მიმღები: {{ order.order_fullname }}
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-order-message ">
        <i class="fas fa-box-open"></i>
        <p>თქვენ არ გაქვთ შეკვეთების ისტორია</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '@/api';
import OrderComponent from '@/components/OrderComponent.vue';
import { useHead } from '@vueuse/head';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const OrderProducts = ref([]);
const CompletedProducts = ref([]);
const apiLoaded = ref(false);
// const loading = ref(true);
const route = useRoute();
const router = useRouter();

const showPending = computed(() => {
  return route.query.section === 'pending';
})

useHead({
  title: "შეკვეთები - თქვენი მიმდინარე და შესრულებული შეკვეთები",
  meta: [
    {
      name: 'description',
      content: 'მოუსწრო ჩამორთმეული შეკვეთები, სადაც შეგიძლიათ შეამოწმოთ თქვენი ყველა მიმდინარე და დასრულებული შეკვეთა. მარტივი ინტერფეისით განიხილეთ დეტალები და სტატუსები.',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
    {
      property: 'og:title',
      content: 'შეკვეთები - თქვენი მიმდინარე და შესრულებული შეკვეთები',
    },
    {
      property: 'og:description',
      content: 'გადაამოწმეთ თქვენი შეკვეთები და შეიტყვეთ დეტალები, როგორიცაა შეკვეთის ნომერი, მიმღები და მისამართი. გააკეთეთ ნებისმიერი ცვლილება თქვენს შეკვეთაში მარტივად.',
    },
    {
      property: 'og:image',
      content: 'URL_TO_AN_IMAGE_IF_NEEDED',
    },
    {
      property: 'og:url',
      content: 'https://yourwebsite.com/orders?section=pending',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: 'შეკვეთები - თქვენი მიმდინარე და შესრულებული შეკვეთები',
    },
    {
      name: 'twitter:description',
      content: 'გადამოწმეთ თქვენი შეკვეთების სტატუსი, სასურველი დეტალები და მეტი ამ გვერდზე.',
    },
    {
      name: 'twitter:image',
      content: 'URL_TO_AN_IMAGE_IF_NEEDED',
    }
  ],
});

async function getOrders() {
  apiLoaded.value = false;
  try {
    const response = await api.get('orders', {
      tokenRequired: true
    });
    OrderProducts.value = response.data.Pending || [];
    CompletedProducts.value = response.data.Completed || [];
    apiLoaded.value = true;
  } catch (error) {
    console.error(error);
    apiLoaded.value = true;
  }
  //  finally {
  //   loading.value = false;
  // }
}
function toggleSection(section) {
  router.push({ query: { section } });
}
onMounted(() => {
  getOrders();
})

watch(route.query.section, (newSection) => {
  if (newSection === 'pending') {
    apiLoaded.value = true;
  }
})

</script>


<style scoped>
.container {
  margin: 20px auto;
  padding: 20px;
}

.toggle-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

.toggle-buttons button {
  background: none;
  border: none;
  font-size: 1rem;
  color: #777;
  cursor: pointer;
  padding: 8px 12px;
  position: relative;
  transition: color 0.3s ease;
}

.toggle-buttons button.active {
  color: #7c317c;
  ;
  font-weight: bold;
}

.toggle-buttons button::after {
  content: "";
  display: block;
  width: 0;
  height: 2px;
  background: #7c317c;
  transition: width 0.3s ease;
  position: absolute;
  left: 50%;
  bottom: -3px;
  transform: translateX(-50%);
}

.toggle-buttons button:hover::after,
.toggle-buttons button.active::after {
  width: 100%;
}

/* Order Sections */
.order-section {
  padding-top: 20px;
}

.section-header {
  font-size: 1.3rem;
  font-weight: bold;
  color: #4a148c;
  text-align: center;
  margin-bottom: 15px;
}

.order-card {
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 20px
}

.order-card:last-child {
  border-bottom: none;
}



.left-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 80%;

}

.right-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 30%;
  height: max-content;

}


.order-desc {
  background-color: #f8f8f8;
  border-radius: 10px;
  max-width: 100%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  padding: 30px 40px;
  margin: 30px auto;
  width: 300px;
  color: #111;
}

.order-id {
  color: #111;
  margin-bottom: 12px;
  border-bottom: 1px solid #ddd;

}

.order-amount {
  font-size: 18px;
}



.order-id,
.order-amount {
  margin-bottom: 12px;
  font-size: 15px;
  font-family: Arial, Helvetica, sans-serif;
  padding-bottom: 8px;
}

.order-address {
  font-weight: 400;
  font-family: Arial, Helvetica, sans-serif;
  margin-top: 15px;
}



.no-order-message {
  text-align: center;
  padding: 30px 20px;
  color: #555;
}

.no-order-message p {
  font-size: small;
}

.no-order-message i {
  font-size: 2rem;
  color: #7c317c;

  margin-bottom: 10px;
}

.full-empty-message {
  text-align: center;
  padding: 50px 20px;
  color: #555;
}

.full-empty-message i {
  font-size: 3rem;
  color: #9b51e0;
  margin-bottom: 10px;
}

.shop-link {
  display: inline-block;
  padding: 10px 15px;
  background-color: #7c317c;
  font-size: small;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
}

.shop-link:hover {
  background-color: #9a469a;
  ;
}




/* Mobile Adjustments */
@media (max-width: 768px) {
  .toggle-buttons {
    flex-direction: row;
    justify-content: center;
  }

  .toggle-buttons button {
    font-size: 12px;
  }

  .products {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 5px;
  }



  .order-card {
    flex-direction: column;
  }

  .left-section {
    width: 100%;
    gap: 30px;
  }

  .container {
    padding: 0;
    padding-top: 20px;
  }

  .right-section {
    margin: auto;
    width: 100%;

  }
}
</style>
