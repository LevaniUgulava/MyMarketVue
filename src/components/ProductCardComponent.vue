<template>
  <div class="card-container">
    <div class="card">    
     <carousel :items-to-show="1">
        <slide v-for="(image, index) in initialproduct.image_urls" :key="index">
          <img :src="image" alt="Product Image" class="img" />
         <button class="likebtn" @click="toggleLike(initialproduct.id)">
            <i :class="isLiked ? 'fa-solid fa-heart fa-2x' : 'fa-regular fa-heart fa-2x'"></i>
          </button>
        </slide>
        <template #addons>
          <navigation />
          <pagination />
        </template>
      </carousel>
       

      <h3>{{ initialproduct.name }}</h3>
      <span class="subtext">See More</span>
 <p class="price" v-if="initialproduct.discount === 0 && (!initialproduct.discountstatus || initialproduct.discountstatus.discount === 0)">
  {{ initialproduct.discountprice }} <i class="fa-solid fa-lari-sign"></i>
</p>
<p class="price" v-else>
  {{ initialproduct.discountprice }} <i class="fa-solid fa-lari-sign"></i>
  <span
    class="discount-square"
    :class="{
      'status-discount': initialproduct.discountstatus && initialproduct.discountstatus.discount > 0,
      'default-discount': (!initialproduct.discountstatus || initialproduct.discountstatus.discount === 0) && initialproduct.discount > 0
    }"
  >
    -{{ initialproduct.discountstatus && initialproduct.discountstatus.discount > 0 
      ? initialproduct.discountstatus.discount 
      : initialproduct.discount }}%
  </span>
</p>



      <p class="desc">{{ truncate(initialproduct.description) }}</p>

      <div class="button-group">

          <div class="button-wrapper">
            <div class="rate">
          {{ initialproduct.Rate }}
        </div>
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
      existsizes:[],
      randomSize:''

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

      this.initialproduct.size.forEach(element => {
          this.existsizes=element.size;
      });
      if (this.existsizes && this.existsizes.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.existsizes.length);
        this.randomSize = this.existsizes[randomIndex];
      }

      console.log(this.existsizes);
      if (!token) {
        this.$emit('cart-message', 'Not authorized');
        return;
      }
      try {
        const response = await axios.post(
          `addcart/${id}`,
          {size:this.randomSize},
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
          `like/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.isLiked=true;
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
          `unlike/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.isLiked=false;

      } catch (error) {
        console.log(error);
      }
    },
    async updateCounts(id) {
      try {
        const countResponse = await axios.get(`count/${id}`);
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
.rate {
  font-size: 0.9rem; 
  border-radius: 3px; 
  width: 100%; 
  padding: 5px; 
  text-align: center; 
  background-color: #f9f9f9; 
  color: #333; /* Text color */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
  transition: background-color 0.3s ease; 
}
.rate:hover {
  background-color: #e0e0e0; 
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 2%;
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

.img-container {
  position: relative;
}

.img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.likebtn {
  position: absolute;
  bottom: 10px;  /* Positioning it in the bottom-right corner */
  right: 10px;   /* Positioning it in the bottom-right corner */
  background-color: transparent;
  border: none;
  cursor: pointer;
  z-index: 2;
}

.likebtn i {
  color: red;
}

.price {
  color: grey;
  font-size: 1rem;
}

.desc {
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
  background-color: #ffffff00;
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
  color: #fff;
  padding: 3px 7px;
  border-radius: 4px;
  margin-left: 10px;
  font-weight: bold;
  font-size: 14px;
}

/* Red for default discount */
.default-discount {
  background-color: #f00;
}

/* Gold for status-based discount */
.status-discount {
  background-color: gold;
}

.singlepage {
  text-decoration: none;
  color: inherit;
  display: block;
  margin-bottom: 20px;
}

/* Responsive styles */
@media (min-width: 390px) and (max-width: 574px) {
  .card {
    width: 120px;
  }
  .subtext {
    display: none;
  }
  .price {
    color: grey;
    font-size: 0.5rem;
  }
  .desc {
    font-size: 0.5rem;
  }
  .discount-square {
    padding: 1px 3px;
    margin-left: 3px;
    font-size: 0.5rem;
  }
  h3 {
    font-size: 0.6rem;
  }
  .img {
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
  .button-group {
    padding: 2px;
  }
  .button-wrapper {
    margin: 1px;
  }
  button {
    font-size: 0.5rem;
    padding: 1px 2px;
  }
  button i {
    font-size: 1rem;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .card {
    width: 220px;
  }
  .price {
    color: grey;
    font-size: 1rem;
  }
  .desc {
    font-size: 1rem;
  }
  .discount-square {
    padding: 4px 6px;
    margin-left: 5px;
    font-size: 0.8rem;
  }
  h3 {
    font-size: 1.2rem;
  }
  .img {
    height: 50%;
    width: 100%;
    object-fit: cover;
  }
  .button-group {
    padding: 10px;
  }
  .button-wrapper {
    margin: 5px;
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





