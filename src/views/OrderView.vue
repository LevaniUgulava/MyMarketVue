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
        <div v-for="order in OrderProducts" :key="order.order_id" class="order-card"
          @mouseenter="showinfo(order.order_id)" @mouseleave="popshowinfo(order.order_id)">
          <div class="info" v-if="showinfoId[order.order_id] || orderinfo[order.order_id]"
            @pointerdown="openinfo(order.order_id)">
            ინფორმაცია შეკვეთის შესახებ
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px"
              fill="currentcolor">
              <path
                d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
            </svg>

            <div v-if="orderinfo[order.order_id]" class="order-modal">
              <div class="arrow-up"></div>

              <div class="order-desc">
                <div class="order-id">შეკვეთის ნომერი: #{{ order.order_id }}</div>
                <div class="order-amount">გადახდილი თანხა: {{ order.order_amount }} <i
                    class="fa-solid fa-lari-sign"></i>
                </div>
                <div class="order-amount">მიმღები: {{ order.order_fullname }}</div>
                <div class="order-amount">მისამართი : {{ order.address.town }}, {{ order.address.address }}</div>
              </div>
            </div>
          </div>

          <div class="left-section">
            <OrderComponent v-for="product in order.products" :key="product.id" :product="product"
              :order_status="order.order_status" />
          </div>
        </div>
      </div>

      <div v-else class="no-order-message">
        <img src="../assets/image copy.png">
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
              <div class="order-id">შეკვეთის ნომერი: #{{ order.order_id }}</div>
              <div class="order-amount">გადახდილი თანხა: {{ order.order_amount }} <i class="fa-solid fa-lari-sign"></i>
              </div>
              <div class="order-amount">მიმღები: {{ order.order_fullname }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-order-message ">
        <img src="../assets/image copy.png">
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
const orderinfo = ref({});
const showinfoId = ref({});
const showPending = computed(() => {
  return route.query.section === 'pending';
})

const openinfo = (order_id) => {
  const selectedOrder = OrderProducts.value.find(order => order.order_id === order_id).order_id;
  if (selectedOrder) {
    if (orderinfo.value[order_id]) {
      orderinfo.value[order_id] = null;

    } else {
      orderinfo.value[order_id] = selectedOrder;
    }
  }
};
const showinfo = (order_id) => {
  const selectedOrder = OrderProducts.value.find(order => order.order_id === order_id).order_id;
  if (selectedOrder) {
    showinfoId.value[order_id] = selectedOrder;
  }
};
const popshowinfo = (order_id) => {
  showinfoId.value[order_id] = null;
}

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
  color: #162e63;
  ;
  font-weight: bold;
}

.toggle-buttons button::after {
  content: "";
  display: block;
  width: 0;
  height: 2px;
  background: #162e63;
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
  position: relative;
  border-bottom: 1px solid #ddd;
  display: flex;
}

.order-card .info {
  position: absolute;
  right: 0;
  top: 5%;
  font-size: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #888;
}



.order-card .info:hover {
  color: #414141;

}

.order-card:last-child {
  border-bottom: none;
}



.left-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

}




.order-modal {
  position: absolute;
  top: 30px;
  right: 0;
  padding: 15px;
  line-height: 2;
  min-width: 250px;
  color: #111111;
  background-color: white;
  gap: 5px;
  border-radius: 5px;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}


.order-modal .arrow-up {
  position: absolute;
  top: -5px;
  right: 5px;
  margin-left: -5px;
  width: 0;
  height: 0;
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  border-bottom: 5px solid white;

}




.no-order-message {
  text-align: center;
  padding: 30px 20px;
  color: #555;
}

.no-order-message p {
  font-size: small;
}

.no-order-message img {
  width: 200px;
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
