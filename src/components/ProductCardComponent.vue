<template>
  <router-link :to="{ name: 'single', params: { id: initialproduct.id } }" class="card-container">
    <div class="card">
      <div class="img-container">
        <img :src="initialproduct.image_urls[0]" alt="Product Image" class="img" />
        <span
          v-if="initialproduct.discount > 0 || (initialproduct.discountstatus && initialproduct.discountstatus.discount > 0)"
          :class="{
            'discount-badge': true,
            'discount-badge-status': initialproduct.discountstatus && initialproduct.discountstatus.discount > 0
          }">
          -{{ initialproduct.discountstatus && initialproduct.discountstatus.discount > 0 ?
            initialproduct.discountstatus.discount : initialproduct.discount }}%
        </span>
        <button class="likebtn" @click.prevent="toggleLike(initialproduct.id)"
          :title="isLiked ? (currentLanguage === 'ka' ? 'მოწონების გაუქმება' : 'Unlike') : (currentLanguage === 'ka' ? 'მოწონება' : 'Like')">
          <i :class="isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
        </button>
      </div>

      <div class="product-info">
        <h3>{{ initialproduct.name }}</h3>
        <p class="price">
          {{ initialproduct.discountprice }} <i class="fa-solid fa-lari-sign"></i>
        </p>
      </div>

      <div class="button-group">
        <button class="add-btn" @click.prevent="addToCart(initialproduct.id)">
          <i class="fa-solid fa-cart-plus"></i> დამატება
        </button>
      </div>
    </div>
  </router-link>
</template>

<script>
import api from '@/api';

export default {
  name: 'ProductCardComponent',
  props: {
    initialproduct: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLiked: this.initialproduct.isLiked,
      currentLanguage: localStorage.getItem('selectedLanguage'),
    };
  },
  methods: {
    async addToCart(id) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$emit('cart-message', { ka: "არ არის ავტორიზირებული", en: "Not Authorized" });
        return;
      }
      try {
        const response = await api.post(
          `addcart/${id}`,
          { type: this.initialproduct.size_type },
          { tokenRequired: true }
        );
        this.$emit('cart-updated', response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async toggleLike(id) {
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
        const token = localStorage.getItem('token');
        if (!token) {
          this.$emit('liked-message', { ka: "არ არის ავტორიზირებული", en: "Not Authorized" });
          return;
        }
        await api.post(`like/${id}`, {}, { tokenRequired: true });
        this.isLiked = true;
      } catch (error) {
        console.log(error);
      }
    },
    async unlike(id) {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
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
.card-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin: 20px 0;
  text-decoration: none;
}

.card {
  width: 250px;
  border-radius: 12px;
  overflow: hidden;
  text-align: center;
  position: relative;
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: scale(1.03);
}

.img-container {
  position: relative;
}

.img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
}

.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ff5555;
  color: #fff;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 0.8rem;
}

.discount-badge-status {
  background: gold;
}

.likebtn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
  color: #ff0000;
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
  padding: 10px;
  border-radius: 8px;
  background-color: #7a1dff1a;
  width: 200px;
  margin: 0 auto;
}


button {
  border: none;
  background: transparent;
  font-family: 'Noto Sans Georgian', sans-serif;
  cursor: pointer;
  font-size: 12px;
  color: #7a1dff;
  transition: color 0.2s ease-in-out;
}

button:hover {
  color: #62389c;
}

@media (max-width: 576px) {
  .card {
    width: 100%;
  }

  .button-group {
    width: 150px;
    margin: 0 auto;
  }

  .img {
    height: 200px;
  }
}
</style>
