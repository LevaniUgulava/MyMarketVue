<template>
  <div @pointerup="redirectproduct" class="card-container">
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

        <button v-show="isHovered" class="likebtn" :aria-pressed="isLiked.toString()"
          @pointerup.stop.prevent="toggleLike(initialproduct.id)" :title="isLiked ? 'მოწონების გაუქმება' : 'მოწონება'">
          <i :class="isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
        </button>
      </div>

      <div class="product-info">
        <h3>{{ initialproduct.name }}</h3>
        <p class="price">
          {{ initialproduct.discountprice }} <i class="fa-solid fa-lari-sign"></i>
        </p>
      </div>

      <div @pointerup.stop.prevent="addToCart(initialproduct.id)" class="button-group">
        <button class="add-btn">
          <div v-if="!isHovered"><i class="fa-solid fa-cart-plus"></i> დამატება</div>
          <div v-else class="size-div">
            <div v-for="(item, index) in initialproduct.size" :key="index" class="size">
              <div @pointerup.stop.prevent="addToCart(initialproduct.id, item.size)">{{ item.size }}</div>
            </div>
          </div>

        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import { authMixin } from '@/mixin/reuse';

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
      isHovered: false
    };
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
    async addToCart(id, size) {
      try {
        const response = await api.post(
          `addcart/${id}`,
          { type: this.initialproduct.size_type, size: size },
          { tokenRequired: true }
        );
        this.$emit('cart-updated', response.data.message);
      } catch (error) {
        if (error.response.status === 403) {
          this.$emit('cart-updated', "ავტორიზაცია აუცილებელია");

        }
      }
    },
    async toggleLike(id) {
      if (!this.isAuth) {
        this.$emit('liked-message', { message: "ავტორიზაცია აუცილებელია" });
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
  },
};
</script>

<style scoped>
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

.card-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin: 20px 0;
  text-decoration: none;
}

.card {
  width: 260px;
  border-radius: 12px;
  overflow: hidden;
  text-align: center;
  position: relative;
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: scale(1.005);
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
  font-size: 14px;
  color: black;
}

.product-info {
  padding: 5px;
}


h3 {
  color: #000000;
  font-size: 14px;
  font-weight: 500;
  margin: 5px 0;
  white-space: nowrap;
  overflow: hidden;
}


.price {
  color: #2b2731;
  font-size: 16px;
  font-weight: bold;
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

@media (max-width: 576px) {
  .card {
    width: 100%;
  }

  .button-group {
    width: 150px;
    margin: 0 auto;
  }

  .image-wrapper {
    height: 200px;
    width: 170px;
  }

}

@media (min-width: 768px) and (max-width: 1024px) {
  .card {
    width: 100%;
  }


  .button-group {
    width: 200px;
    margin: 0 auto;
  }

  .image-wrapper {
    height: 200px;
    width: 170px;
  }

  button:hover {
    color: none;
  }

  .card:hover {
    transform: 0;
  }
}
</style>
