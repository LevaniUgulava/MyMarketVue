<template>
  <div @pointerdown="redirectproduct" class="card-container" :style="{ '--cols': layout }">
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
          :style="{ top: (initialproduct.discount > 0 || (initialproduct.discountstatus && initialproduct.discountstatus.discount > 0)) ? '45px' : '15px' }">
          ახალი
        </span>

        <div>
          <div v-if="!isMobile">
            <button v-if="isHovered" class="likebtn" :aria-pressed="isLiked.toString()"
              @pointerdown.stop.prevent="toggleLike(initialproduct.id)"
              :title="isLiked ? 'მოწონების გაუქმება' : 'მოწონება'">
              <svg v-show="isLiked" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                width="24px" fill="#FFFFFF">
                <path
                  d="m480-173.85-30.31-27.38q-97.92-89.46-162-153.15-64.07-63.7-101.15-112.35-37.08-48.65-51.81-88.04Q120-594.15 120-634q0-76.31 51.85-128.15Q223.69-814 300-814q52.77 0 99 27t81 78.54Q514.77-760 561-787q46.23-27 99-27 76.31 0 128.15 51.85Q840-710.31 840-634q0 39.85-14.73 79.23-14.73 39.39-51.81 88.04-37.08 48.65-100.77 112.35Q609-290.69 510.31-201.23L480-173.85Z" />
              </svg>

              <svg v-show="!isLiked" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                width="24px" fill="currentcolor">
                <path
                  d="m480-173.85-30.31-27.38q-97.92-89.46-162-153.15-64.07-63.7-101.15-112.35-37.08-48.65-51.81-88.04Q120-594.15 120-634q0-76.31 51.85-128.15Q223.69-814 300-814q52.77 0 99 27t81 78.54Q514.77-760 561-787q46.23-27 99-27 76.31 0 128.15 51.85Q840-710.31 840-634q0 39.85-14.73 79.23-14.73 39.39-51.81 88.04-37.08 48.65-100.77 112.35Q609-290.69 510.31-201.23L480-173.85Zm0-54.15q96-86.77 158-148.65 62-61.89 98-107.39t50-80.61q14-35.12 14-69.35 0-60-40-100t-100-40q-47.77 0-88.15 27.27-40.39 27.27-72.31 82.11h-39.08q-32.69-55.61-72.69-82.5Q347.77-774 300-774q-59.23 0-99.62 40Q160-694 160-634q0 34.23 14 69.35 14 35.11 50 80.61t98 107q62 61.5 158 149.04Zm0-273Z" />
              </svg>
            </button>

            <button
              @pointerdown.stop.prevent="addToCart(initialproduct.id, initialproduct.size[0].size, initialproduct.size[0].details[0].color)"
              v-if="isHovered && !isOpen" class="addbtn">
              <svg class="icon" aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24"
                fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.9984 5C13.9984 4.46957 13.7877 3.96086 13.4126 3.58579C13.0375 3.21071 12.5288 3 11.9984 3C11.4679 3 10.9592 3.21071 10.5842 3.58579C10.2091 3.96086 9.99836 4.46957 9.99836 5M19.2584 9.696L20.6434 18.696C20.6872 18.9808 20.6689 19.2718 20.5898 19.5489C20.5107 19.8261 20.3726 20.0828 20.1851 20.3016C19.9975 20.5204 19.7649 20.6961 19.5031 20.8167C19.2413 20.9372 18.9566 20.9997 18.6684 21H5.32836C5.04 21 4.75503 20.9377 4.49301 20.8173C4.23098 20.6969 3.99809 20.5212 3.81031 20.3024C3.62253 20.0836 3.48429 19.8267 3.40507 19.5494C3.32585 19.2721 3.30753 18.981 3.35136 18.696L4.73636 9.696C4.80901 9.22359 5.04844 8.79282 5.41129 8.4817C5.77413 8.17059 6.2364 7.9997 6.71436 8H17.2824C17.7602 7.99994 18.2222 8.17094 18.5848 8.48203C18.9475 8.79312 19.1857 9.22376 19.2584 9.696Z"
                  stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
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


        <div class="price">
          <div style="display: flex; gap: 2px;">{{ initialproduct.discountprice }} <i class="fa-solid fa-lari-sign"></i>
            <div class="realprice" v-if="initialproduct.discountstatus && initialproduct.discountstatus.discount > 0">
              <s>{{
                initialproduct.price }}</s>
            </div>
          </div>

          <transition name="slide">
            <div v-if="isHovered">
              <span class="brand">
                ზომა: {{ initialproduct.size[0].size }}, ფერი: {{ initialproduct.size[0].details[0].color }}
              </span>
            </div>
          </transition>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import api from '@/api';
import { authMixin } from '@/mixin/reuse';
import store from '@/store';
import { updateCartStatus } from '@/store/cart';

export default {

  name: 'ProductCardComponent',
  mixins: [authMixin],
  props: {
    initialproduct: {
      type: Object,
      required: true,
    },
    layout: {
      type: Number,
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
      } finally {
        updateCartStatus();
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
        const isOriginal = this.initialproduct.discountstatus && this.initialproduct.discountstatus.discount > 0 ? false : true
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
      } finally {
        updateCartStatus();
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
  text-decoration: none;
}

.card {
  flex: 1 1 calc(100% / var(--cols) - 15px);
  border-radius: 12px;
  position: relative;
  overflow: visible;
  width: 100%;
  max-width: none;
  min-width: 0;
  transition: transform 0.2s ease-in-out;
}



.img-container {
  position: relative;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  aspect-ratio: 3/4;
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s ease;
}


.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.1s ease;
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
  display: flex;
  background: transparent;
  z-index: 3;
  border: none;
  cursor: pointer;
  background-color: aliceblue;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  padding: 5px;
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
  display: flex;
  cursor: pointer;
  background-color: aliceblue;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 15px;
  color: black;
}



.product-info {
  padding: 5px;
  margin: auto;
}

.product-info .brand {
  font-size: 12px;
  font-weight: normal;
  color: #6f6c6c;
  margin-right: 10px;
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
  justify-content: space-between;
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
    aspect-ratio: 3/4;
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
