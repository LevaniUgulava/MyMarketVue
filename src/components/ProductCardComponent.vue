<template>
  <div class="card-container">
    <div class="card">    
     <carousel :items-to-show="1">
        <slide v-for="(image, index) in initialproduct.image_urls" :key="index">
          <img :src="image" alt="Product Image" class="img" />
        </slide>
        <template #addons>
          <navigation />
          <pagination />
        </template>
      </carousel>

      <h3>{{ initialproduct.name }}</h3>
      <span class="subtext">See More</span>
      <p class="price" v-if="initialproduct.discount === 0">
        {{ initialproduct.price }} <i class="fa-solid fa-lari-sign"></i>
      </p>
      <p class="price" v-else>
        {{ initialproduct.discountprice }} <i class="fa-solid fa-lari-sign"></i>
        <span class="discount-square">-{{ initialproduct.discount }}%</span>
      </p>
      <p class="desc">{{ truncate(initialproduct.description) }}</p>

      <div class="button-group">
        <div class="button-wrapper">
          <button class="likebtn" @click="toggleLike(initialproduct.id)">
            <i :class="isLiked ? 'fa-solid fa-heart fa-2x' : 'fa-regular fa-heart fa-2x'"></i>
            <span>{{ likecount }}</span>
          </button>
          <span v-if="isLiked" class="subtext">Unlike</span>
          <span v-else class="subtext">Like</span>


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

        <div class="button-wrapper">
          <button>
          <router-link :to="{ name: 'single', params: { id: initialproduct.id } }">
            <i class="fa-solid fa-ellipsis fa-2x"></i>
          </router-link>
          </button>
          <span class="subtext">See More</span>
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
 
  },
  data() {
    return {
      likecount: 0,
      commentcount: 0,
      isLiked:this.initialproduct.isLiked,

    };
  },
  watch: {
    initialproduct: {
      handler(newVal) {
        this.updateCounts(newVal.id);

      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    truncate(text) {
      if (!text) {
        return ''; 
      }
      return text.slice(0, 30) + (text.length > 30 ? '...' : '');
    },
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
        this.isLiked=true;
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
        this.isLiked=false;

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
    showComments() {
      this.$emit('show-comments', this.initialproduct.id);
    },
  },
  mounted() {
    this.updateCounts(this.initialproduct.id);

  },
};
</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 30px;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  flex: 1 1 200px;
  width: 220px;
  margin: 5px;
  text-align: center;
  font-family: Arial, sans-serif;
  overflow: hidden;
  border-radius: 20px;
}

.price {
  color: grey;
  font-size: 1rem;
}
.desc{
  font-size: 1rem;
}

.button-group {
  display: flex;
  justify-content: space-around;
  
  align-items: center;
  padding: 5px;
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
  left: 45%;
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
  height: 150px;
  width: 100%;
  object-fit: cover;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
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
  padding: 3px 7px;
  border-radius: 4px;
  margin-left: 10px;
  font-weight: bold;
  font-size: 14px;
}

.singlepage {
  text-decoration: none;
  color: inherit;
  display: block;
  margin-bottom: 20px;
}



@media (min-width: 390px) and (max-width: 574px) {
  .card {
    width: 120px; /* Adjust card width */
  }
  .subtext{
    display: none;
  }
  .price {
    color: grey;
    font-size: 0.5rem; /* Smaller font size */
  }

  .desc {
    font-size: 0.5rem; /* Smaller font size */
  }

  .discount-square {
    padding: 1px 3px; 
    margin-left: 3px; 
    font-size: 0.5rem; /* Adjust font size */
  }
  
  h3 {
    font-size: 0.6rem; /* Adjust header font size */
  }

  .img {
    height: 100%; 
    object-fit: cover;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }

  .button-group {
    padding: 2px; /* Reduce padding */
  }

  .button-wrapper {
    margin: 1px; /* Reduce margin between buttons */
  }

  button {
    font-size: 0.5rem; /* Reduce button font size */
    padding: 1px 2px; /* Adjust padding */
  }

  button i {
    font-size: 1rem; /* Adjust icon size */
  }

}

/* Adjust for larger mobile devices */
@media (min-width: 576px) and (max-width: 767px) {
  .card {
    width: 220px; /* Adjust card width */
  }

  .price {
    color: grey;
    font-size: 1rem; /* Default font size */
  }

  .desc {
    font-size: 1rem; /* Default font size */
  }

  .discount-square {
    padding: 4px 6px; 
    margin-left: 5px; 
    font-size: 0.8rem; 
  }
  
  h3 {
    font-size: 1.2rem; /* Adjust header font size */
  }

  .img {
    height: 50%; 
    width: 100%; 
    object-fit: cover;
  }

  .button-group {
    padding: 10px; /* Adjust padding */
  }

  .button-wrapper {
    margin: 5px; /* Adjust margin */
  }

  button {
    font-size: 0.9rem; 
    padding: 4px 6px;
  }

  button i {
    font-size: 1.5rem; 
  }
}


</style>


















