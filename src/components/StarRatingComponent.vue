<template>
  <div>
    <div class="star-container">
      <div class="star">
        <div class="split-star">
          <div class="half" @click="setRating(0.5)"></div>
          <!-- Right half for 1 rating -->
          <div class="full" @click="setRating(1)"></div>

          <i :class="{
            'fa-solid fa-star': rating >= 1,
            'fa-solid fa-star-half-stroke': rating === 0.5,
            'fa-regular fa-star': rating < 0.5
          }"></i>
        </div>
      </div>

      <div class="star">
        <div class="split-star">
          <div class="half" @click="setRating(1.5)"></div>
          <div class="full" @click="setRating(2)"></div>

          <i :class="{
            'fa-solid fa-star': rating >= 2,
            'fa-solid fa-star-half-stroke': rating === 1.5,
            'fa-regular fa-star': rating < 1.5
          }"></i>
        </div>
      </div>

      <div class="star">
        <div class="split-star">
          <div class="half" @click="setRating(2.5)"></div>
          <div class="full" @click="setRating(3)"></div>

          <i :class="{
            'fa-solid fa-star': rating >= 3,
            'fa-solid fa-star-half-stroke': rating === 2.5,
            'fa-regular fa-star': rating < 2.5
          }"></i>
        </div>
      </div>

      <div class="star">
        <div class="split-star">
          <div class="half" @click="setRating(3.5)"></div>
          <div class="full" @click="setRating(4)"></div>

          <i :class="{
            'fa-solid fa-star': rating >= 4,
            'fa-solid fa-star-half-stroke': rating === 3.5,
            'fa-regular fa-star': rating < 3.5
          }"></i>
        </div>
      </div>

      <div class="star">
        <div class="split-star">
          <div class="half" @click="setRating(4.5)"></div>
          <div class="full" @click="setRating(5)"></div>

          <i :class="{
            'fa-solid fa-star': rating >= 5,
            'fa-solid fa-star-half-stroke': rating === 4.5,
            'fa-regular fa-star': rating < 4.5
          }"></i>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: {
    rate: {
      type: Number,
      required: true,
    },
    singleid: {
      type: Number,
      required: true
    },
    getproduct: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      rating: this.rate,
    };
  },
  methods: {
    async setRating(value) {
      if (value === 0 || this.rating === value) {
        this.rating = 0;

      } else {
        this.rating = value;
      }
      await this.SentRate(this.singleid)

      this.getproduct();
    },

    async SentRate(id) {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post(`product/rate/${id}`, { rate: this.rating }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Rating submitted successfully:', response.data);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 422) {
            console.error('Validation error:', error.response.data);
          } else {
            console.error('Error:', error.response.status, error.response.data);
          }
        } else {
          console.error('An unexpected error occurred:', error.message);
        }
      }
    }
  },
  watch: {
    rate(newRate) {
      this.rating = newRate;
    },
  },


};
</script>

<style scoped>
.star-container {
  display: flex;
}

.star {
  display: flex;
}

.split-star {
  position: relative;
  width: 30px;
  height: 30px;
  display: inline-block;
}

.split-star .half,
.split-star .full {
  position: absolute;
  height: 100%;
  width: 50%;
  top: 0;
  cursor: pointer;
}

.split-star .half {
  left: 0;
}

.split-star .full {
  right: 0;
}

.split-star i {
  font-size: 20px;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

@media (min-width:768px) {
  .star-container {
    margin-top: 15%;
    margin-left: 5%;
  }

  .split-star i {
    font-size: 1rem;
  }

  p {
    font-size: 0.6rem;
    margin-top: -3%;
    margin-left: 3%;
  }

  .star {
    margin: -3%;
  }
}
</style>
