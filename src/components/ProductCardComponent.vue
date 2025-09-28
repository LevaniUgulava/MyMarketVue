<template>
  <div @pointerdown="redirectproduct" class="card-container">
    <div class="card" @mouseover="isHovered = true" @mouseleave="isHovered = false">
      <div class="img-container">
        <div class="image-wrapper">
          <img :src="initialproduct.image_urls[0]" alt="Main Image" class="main-img" />
          <img :src="initialproduct.image_urls[1]" alt="Hover Image" class="hover-img" />
        </div>
        <span
          v-if="initialproduct.discount > 0 || (initialproduct.discountstatus && initialproduct.discountstatus.discount > 0)"
          :class="{
            'discount-badge': true,
            'discount-badge-status': initialproduct.discountstatus && initialproduct.discountstatus.discount > 0
          }">
          -{{ initialproduct.discountstatus && initialproduct.discountstatus.discount > 0 ?
            initialproduct.discountstatus.discount : initialproduct.discount }}%
        </span>
        <span v-if="initialproduct.isNew" class="new-badge"
          :style="{ top: (initialproduct.discount > 0 || (initialproduct.discountstatus && initialproduct.discountstatus.discount > 0)) ? '40px' : '10px' }">
          ახალი
        </span>

        <div>
          <div v-if="!isMobile">
            <button v-if="isHovered" class="likebtn" :aria-pressed="isLiked.toString()"
              @pointerdown.stop.prevent="toggleLike(initialproduct.id)"
              :title="isLiked ? 'მოწონების გაუქმება' : 'მოწონება'">
              <i :class="isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
            </button>

            <button
              @pointerdown.stop.prevent="addToCart(initialproduct.id, initialproduct.size[0].size, initialproduct.size[0].details[0].color)"
              v-if="isHovered && !isOpen" class="addbtn">
              <i class="fa-solid fa-cart-shopping outline-icon"></i>
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
          <div v-else>
            <button class="likebtn" :aria-pressed="isLiked.toString()"
              @pointerdown.stop.prevent="toggleLike(initialproduct.id)"
              :title="isLiked ? 'მოწონების გაუქმება' : 'მოწონება'">
              <i :class="isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
            </button>
            <button
              @pointerdown.stop.prevent="(initialproduct.id, initialproduct.size[0].size, initialproduct.size[0].details[0].color)"
              class="addbtn">
              <i class="fa-solid fa-cart-shopping outline-icon"></i>
            </button>
          </div>

        </div>


      </div>
      <div class="product-info">
        <span class="brand">{{ initialproduct.brand }}</span>


        <h3>{{ initialproduct.name }}</h3>
        <span class="brand">ზომა: {{ initialproduct.size[0].size }}, ფერი: {{ initialproduct.size[0].details[0].color
          }}</span>

        <div class="price">
          {{ initialproduct.discountprice }} <i class="fa-solid fa-lari-sign"></i>
          <div class="realprice" v-if="initialproduct.discountstatus && initialproduct.discountstatus.discount > 0">
            <s>{{
              initialproduct.price }}</s>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import api from '@/api';
import { authMixin } from '@/mixin/reuse';
import store from '@/store';

export default {

  name: 'ProductCardComponent',
  mixins: [authMixin],
  props: {
    initialproduct: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLiked: this.initialproduct.isLiked,
      isHovered: false,
      isMobile: window.innerWidth <= 768,
      isOpen: !!(this.initialproduct && this.initialproduct.inCartQuantity),
      quantity: this.initialproduct ? this.initialproduct.inCartQuantity : 1,
      messageVar: [],

    };
  },
  watch: {
    'initialproduct.inCartQuantity'(val) {
      this.quantity = val || 1;
      this.isOpen = !!val;
    },
  },

  methods: {

    async redirectproduct() {
      this.$router.push({
        name: 'single',
        params: {
          id: this.initialproduct.id,
          maincategory: this.initialproduct.MainCategory.en_name,
          category: this.initialproduct.Category.en_name,
          subcategory: this.initialproduct.SubCategory.en_name,
          slug: this.initialproduct.slug
        }
      });

    },

    async updatequantity(action) {
      try {
        if (action === 'increment') {
          if (this.quantity >= this.initialproduct.size[0].details[0].quantity) {
            this.showMessage("მაქსიმალური რაოდენობა", "quantitymessage", this.initialproduct.id);
            return;
          } else {
            this.quantity++
            this.quick_update('increment');
          }
        } else if (action === 'decrement') {
          if (this.quantity <= 1) {
            this.showMessage("ნაკლები რაოდენობა არ შეიძლება", "quantitydemessage", this.initialproduct.id);
            return;
          } else {
            this.quantity--
            this.quick_update('decrement');
          }
        } else if (action === 'delete') {
          this.quick_update('delete');
          this.isOpen = false;

        }

      } catch (error) {
        console.log(error);
      }

    },
    async quick_update(action) {
      try {
        const response = await api.post("/quick_update", {
          id: this.initialproduct.id,
          size: this.initialproduct.size[0].size,
          color: this.initialproduct.size[0].details[0].color,
          action: action
        }, { tokenRequired: true });
        console.log(response);
      } catch (error) {
        return error;
      }

    },
    async showMessage(message, messageType) {
      this.messageVar[messageType] = message;
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.messageVar[messageType] = '';
    },
    async addToCart(id, size, color) {
      try {
        const isOriginal = this.initialproduct.discountstatus && this.initialproduct.discountstatus.discount > 0 || false
        const response = await api.post(
          `addcart/${id}`,
          { type: this.initialproduct.size_type, size: size, color: color, isOriginal: isOriginal },
          { tokenRequired: true }
        );
        this.$emit('cart-updated', response.data.message);
        this.isOpen = true;
        this.quantity = 1;

      } catch (error) {
        if (error.response.status === 403) {
          store.commit('modals/openmodal', 'loginmodal', { root: true });

        }
      }
    },
    async toggleLike(id) {
      if (!this.isAuth) {
        store.commit('modals/openmodal', 'loginmodal', { root: true });
        return;
      }
      const previousState = this.isLiked;
      this.isLiked = !this.isLiked;
      try {
        if (this.isLiked) {
          await this.like(id);
        } else {
          await this.unlike(id);
        }
      } catch (error) {
        console.log(error);
        this.isLiked = previousState;
      }
    },
    async like(id) {
      try {
        await api.post(`like/${id}`, {}, { tokenRequired: true });
        this.isLiked = true;
      } catch (error) {
        console.log(error);
      }
    },
    async unlike(id) {

      try {
        await api.post(`unlike/${id}`, {}, { tokenRequired: true });
        this.isLiked = false;
      } catch (error) {
        console.log(error);
      }
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    }

  },
  mounted() {
    window.addEventListener('resize', this.checkMobile);
  },
  unmounted() {
    window.removeEventListener('resize', this.checkMobile);
  },
};
</script>

<style scoped>
.panel {
  position: absolute;
  right: 20px;
  bottom: 10px;
  display: flex;
  background-color: aliceblue;
  border-radius: 20px;
  width: 80px;
  height: 20px;
  padding: 10px 10px;
  align-items: center;
  justify-content: center;
  z-index: 20;
  transform-origin: right center;
}

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


.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 10px;
  z-index: 3;
}

.quantitybtn {
  background-color: transparent;
  border: none;
  font-size: 18px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #666;
  padding: 0 10px;
}

.quantitybtn:hover {
  color: #000;
}

.quantitybtn:focus {
  outline: none;
}

.quantity {
  padding: 0 5px;
  font-size: 15px;
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
  font-size: 12px;
  border-radius: 6px;
  padding: 8px 10px;
  white-space: nowrap;
  z-index: 9999;
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

.size-div {
  display: flex;
  flex-direction: row;
}


.size {
  font-size: 12px;
  padding: 5px;
}

.size:hover {
  background-color: #7d23fc31;
  border-radius: 20px;
}

.outline-icon {
  color: transparent;
  -webkit-text-stroke: 1.4px rgb(59, 58, 58);
}

.card-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  overflow: visible;
  margin: 20px 0;
  text-decoration: none;
}

.card {
  width: 260px;
  border-radius: 12px;
  position: relative;
  overflow: visible;
  transition: transform 0.2s ease-in-out;
}



.img-container {
  position: relative;
}

.image-wrapper {
  position: relative;
  width: 250px;
  height: 250px;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.8s ease;
}

.main-img {
  z-index: 1;
  opacity: 1;
}

.hover-img {
  z-index: 2;
  opacity: 0;
}

.image-wrapper:hover .main-img {
  opacity: 0;
}

.image-wrapper:hover .hover-img {
  opacity: 1;
}



.discount-badge {
  position: absolute;
  top: 10px;
  left: 0px;
  background: #ff5555;
  color: #fff;
  z-index: 3;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  padding: 5px 4px;
  font-size: 11px;
  font-weight: 400;
}

.new-badge {
  position: absolute;
  left: 0px;
  background: #62389c;
  color: #fff;
  z-index: 3;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  padding: 5px 4px;
  font-size: 11px;
  font-weight: 400;
}

.discount-badge-status {
  background: gold;
}

.likebtn {
  position: absolute;
  top: 10px;
  right: 20px;
  background: transparent;
  z-index: 3;
  border: none;
  cursor: pointer;
  background-color: aliceblue;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  padding: 10px;
  color: black;
}

.addbtn {
  position: absolute;
  bottom: 10px;
  right: 20px;
  display: flex;
  background: transparent;
  z-index: 3;
  border: none;
  cursor: pointer;
  background-color: aliceblue;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 20px;
  color: black;
}



.product-info {
  padding: 5px;
  margin: auto;
}

.product-info .brand {
  font-size: 12px;
  color: #6f6c6c;
}


h3 {
  color: #000000;
  font-size: 14px;
  font-weight: 500;
  margin: 5px 0;
  height: 35px;
  white-space: wrap;
  overflow: hidden;
}


.price {
  color: #2b2731;
  font-size: 13px;
  margin-top: 5px;
  display: flex;
  margin-bottom: 5px;
  font-weight: bold;
}

.price .realprice {
  display: flex;
  margin-left: 5px;
  font-size: 12px;
  align-items: anchor-center;

}


.button-group {
  display: flex;
  justify-content: center;
  border-radius: 8px;
  background-color: #7e23fc1a;
  width: 200px;
  height: 40px;
  margin: 0 auto;
  overflow: hidden;
}


.add-btn {
  border: none;
  background: transparent;
  font-family: 'Noto Sans Georgian', sans-serif;
  cursor: pointer;
  font-size: 13px;
  color: #751bf2;
  transition: color 0.2s ease-in-out;
}

.add-btn:hover {
  color: #62389c;
}


.likebtn:hover {
  color: rgb(68, 67, 67);
}

@media (max-width: 767px) {

  .add-btn:hover {
    pointer-events: none;

  }

  .add-btn {
    font-size: 11px;
  }


  .likebtn:hover {
    pointer-events: none;
  }

  .card {
    width: 100%;
  }

  .image-wrapper {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }

  .button-group {
    margin: 0 auto;
    height: 35px;
    width: 90%;
  }


  .likebtn {
    padding: 5px;
  }

  .new-badge {
    font-size: 9px;
  }

  .discount-badge {
    font-size: 9px;

  }

}

@media (min-width: 768px) and (max-width: 1024px) {
  .card {
    width: 100%;
  }

  .add-btn:hover {
    pointer-events: none;
  }

  .likebtn:hover {
    pointer-events: none;
  }

  .button-group {
    width: 200px;

    margin: 0 auto;
  }

  .image-wrapper {
    height: 220px;
    width: 200px;
  }

  button:hover {
    color: none;
  }

  .card:hover {
    transform: 0;
  }
}
</style>
