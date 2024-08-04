<template>
  <div class="card-container">
    <div class="card">
     
          <!-- <img :src="initialproduct.image_urls" alt="Product Image" class="img" /> -->
    
     <carousel :items-to-show="1">
        <slide v-for="(image, index) in initialproduct.image_urls" :key="index">
          <img :src="image" alt="Product Image" class="img" />
        </slide>
        <template #addons>
          <navigation />
          <pagination />
        </template>
      </carousel>
      <h1>{{ initialproduct.name }}</h1>
      <p class="price" v-if="initialproduct.discount === 0">
        {{ initialproduct.price }} <i class="fa-solid fa-lari-sign"></i>
      </p>
      <p class="price" v-else>
        {{ initialproduct.discountprice }} <i class="fa-solid fa-lari-sign"></i>
        <span class="discount-square">-{{ initialproduct.discount }}%</span>
      </p>
      <p>{{ initialproduct.description }}</p>
      <div class="button-group">
        <div class="button-wrapper">
          <button class="likebtn" @click="toggleLike(initialproduct.id)">
            <i :class="isLiked ? 'fa-solid fa-heart fa-2x' : 'fa-regular fa-heart fa-2x'"></i>
            <span>{{ likecount }}</span>
          </button>
          <span v-if="!isLiked" class="subtext">Like</span>
          <span v-else class="subtext">Unlike</span>
        </div>
        <div class="button-wrapper">
          <button class="commentbtn" @click="showComments">
            <i class="fa-regular fa-comment fa-2x"></i>
            <span>{{ commentcount }}</span>
            <span class="subtext">Comment</span>
          </button>
        </div>
        <div class="button-wrapper">
          <button class="addbtn" @click="addToCart(initialproduct.id)">
            <i class="fa-solid fa-plus fa-2x"></i>
          </button>
          <span class="subtext">Add to Cart</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'


export default {
  name: 'ProductCardComponent',
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  props: {
    initialproduct: {
      type: Object,
      required: true,
    },
    islikedproduct: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      likecount: 0,
      commentcount: 0,
      isLiked: this.islikedproduct,
    };
  },
  watch: {
    initialproduct: {
      handler(newVal) {
        this.updateCounts(newVal.id);
        this.checkLikedStatus(newVal.id);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async addToCart(id) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$emit('cart-message', 'Not authorized');
        return;
      }
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/addcart/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.$emit('cart-updated', response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async toggleLike(id) {
      if (this.isLiked) {
        await this.unlike(id);
      } else {
        await this.like(id);
      }
    },
    async like(id) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$emit('liked-message', 'Not authorized');
          return;
        }
        await axios.post(
          `http://127.0.0.1:8000/api/like/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userid = localStorage.getItem('userid');
        if (!userid) {
          console.log('User ID not found');
          return;
        }

        let userLikes = JSON.parse(localStorage.getItem('userLikes')) || {};
        if (!userLikes[userid]) {
          userLikes[userid] = [];
        }

        if (!userLikes[userid].includes(id)) {
          userLikes[userid].push(id);
        }

        localStorage.setItem('userLikes', JSON.stringify(userLikes));
        this.isLiked = true;
        this.updateCounts(id);
      } catch (error) {
        console.log(error);
      }
    },
    async unlike(id) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('Not authorized');
          return;
        }
        await axios.post(
          `http://127.0.0.1:8000/api/unlike/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userid = localStorage.getItem('userid');
        if (!userid) {
          console.log('User ID not found');
          return;
        }

        let userLikes = JSON.parse(localStorage.getItem('userLikes')) || {};
        if (userLikes[userid]) {
          userLikes[userid] = userLikes[userid].filter((productId) => productId !== id);
          localStorage.setItem('userLikes', JSON.stringify(userLikes));
        }

        this.isLiked = false;
        this.updateCounts(id);
      } catch (error) {
        console.log(error);
      }
    },
    async updateCounts(id) {
      try {
        const countResponse = await axios.get(`http://127.0.0.1:8000/api/count/${id}`);
        this.likecount = countResponse.data.countlike;
        this.commentcount = countResponse.data.countcomment;
      } catch (error) {
        console.log(error);
      }
    },
    checkLikedStatus(id) {
      const userid = localStorage.getItem('userid');
      if (!userid) {
        console.log('User ID not found');
        return;
      }

      let userLikes = JSON.parse(localStorage.getItem('userLikes')) || {};
      this.isLiked = userLikes[userid] && userLikes[userid].includes(id);
    },
    showComments() {
      this.$emit('show-comments', this.initialproduct.id);
    },
  },
  mounted() {
    this.updateCounts(this.initialproduct.id);
    this.checkLikedStatus(this.initialproduct.id);
  },
};
</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  margin-top: 30px;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  width: 320px;
  margin: 5px;
  text-align: center;
  font-family: Arial, sans-serif;
  overflow: hidden;
  border-radius: 20px;
}

.price {
  color: grey;
  font-size: 22px;
}

.button-group {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
}

.button-wrapper {
  position: relative;
}

button {
  border: none;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.2s;
}

button:hover {
  transform: scale(1.1);
}

button i {
  margin-right: 5px;
}

.subtext {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 5px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
}

.button-wrapper:hover .subtext {
  opacity: 1;
}

.img {
  height: 200px;
  width: 100%;
  object-fit: cover;
}

.likebtn i {
  color: red;
}

.commentbtn i {
  color: #555;
}

.addbtn i {
  color: green;
}

.strikethrough {
  text-decoration: line-through;
  color: #999;
  margin-right: 10px;
}

.discount-square {
  display: inline-block;
  background-color: #f00;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  margin-left: 10px;
  font-weight: bold;
  font-size: 14px;
}
</style>
