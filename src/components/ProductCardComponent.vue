<template>
  <div class="card-container">
    <div class="card">
      <img :src="initialproduct.image_urls[0]" alt="Product Image" class="img" />
      <button class="likebtn" @click="toggleLike(initialproduct.id)"
        :title="isLiked ? (currentLanguage === 'ka' ? 'მოწონების გაუქმება' : 'Unlike') : (currentLanguage === 'ka' ? 'მოწონება' : 'Like')">
        <i :class="isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
      </button>

      <div class="product-info">
        <h3>{{ initialproduct.name }}</h3>
        <div class="rate">Rating: {{ initialproduct.Rate }}</div>
        <p class="price">
          {{ initialproduct.discountprice }} <i class="fa-solid fa-lari-sign"></i>
          <span
            v-if="initialproduct.discount > 0 || (initialproduct.discountstatus && initialproduct.discountstatus.discount > 0)"
            class="discount-square">
            -{{ initialproduct.discountstatus && initialproduct.discountstatus.discount > 0
              ? initialproduct.discountstatus.discount
              : initialproduct.discount }}%
          </span>
        </p>
      </div>

      <div class="button-group">
        <button class="comment-btn" @click="showComments" :title="currentLanguage === 'ka' ? 'კომენტარი' : 'Comment'">
          <i class="fa-regular fa-comment"></i>
        </button>
        <button class="add-btn" @click="addToCart(initialproduct.id)"
          :title="currentLanguage === 'ka' ? 'კალათაში დამატება' : 'Add to Cart'">
          <i class="fa-solid fa-cart-plus"></i>
        </button>
        <router-link :to="{ name: 'single', params: { id: initialproduct.id } }" class="details-btn"
          :title="currentLanguage === 'ka' ? 'დეტალების ნახვა' : 'See Details'">
          <i class="fa-solid fa-info-circle"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

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
        const response = await axios.post(
          `addcart/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
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
        await axios.post(`like/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
        this.isLiked = true;
      } catch (error) {
        console.log(error);
      }
    },
    async unlike(id) {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        await axios.post(`unlike/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
        this.isLiked = false;
      } catch (error) {
        console.log(error);
      }
    },
    showComments() {
      this.$emit('show-comments', this.initialproduct.id);
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
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 20px;
  text-align: center;
  position: relative;
}

.img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

.likebtn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.product-info {
  margin-bottom: 15px;
}

h3 {
  font-size: 1.2rem;
  margin: 10px 0;
}

.rate {
  font-size: 1rem;
  color: #555;
  margin-bottom: 10px;
}

.price {
  color: #333;
  font-size: 1rem;
  font-weight: bold;
}

.discount-square {
  background: #ff5555;
  color: #fff;
  border-radius: 4px;
  padding: 5px 5px;
  font-size: 0.7rem;
  margin-left: 5px;
}

.button-group {
  display: flex;
  justify-content: space-around;
  gap: 10px;
}

button,
.details-btn {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 3px 7px;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  color: #333;
  display: flex;
  align-items: center;
}

button:hover,
.details-btn:hover {
  background: #49535d;
  color: #fff;
}

@media (min-width: 390px) and (max-width: 574px) {
  .card-container {
    margin: 10px 0;
    gap: 10px;
  }

  .card {
    width: 100%;
    /* Adjust card width to fit smaller screens */
    padding: 10px;
    /* Reduce padding */
    height: 225px;
  }

  .img {
    height: 100px;
    /* Adjust image height */
    object-fit: cover;
  }

  h3 {
    font-size: 0.6rem;
    /* Smaller font for product title */
    margin: 5px 0;
  }

  .rate {
    font-size: 0.6rem;
    /* Smaller font for rating text */
    margin-bottom: 8px;
  }

  .price {
    font-size: 0.6rem;
    /* Adjust font size for price */
    color: #333;
  }

  .discount-square {
    font-size: 0.4rem;
    /* Smaller font size for discount text */
    padding: 2px 2px;
    /* Reduce padding */
    border-radius: 3px;
  }

  .button-group {
    display: flex;
    /* Keep buttons side by side */
    justify-content: space-between;
    /* Add spacing between buttons */
    gap: 5px;
    /* Minimal gap between buttons */
    flex-wrap: wrap;
  }

  .button-group button,
  .details-btn {
    padding: 3px;
    font-size: 0.6rem;
    text-align: center;
    max-width: 32%;
  }

  .likebtn {
    top: 5px;
    right: 5px;
    font-size: 0.6rem;
  }

  .likebtn:hover {
    background-color: transparent;
    color: inherit;
    cursor: default;
  }

}
</style>
