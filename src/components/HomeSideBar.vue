<template>
  <transition name="fade-slide">
    <div v-if="showTopButton" class="top-button">
      <button @click="isModalVisible = true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 12" width="18" height="18">
          <path
            d="M11.875 0.00252339C10.6504 0.0538113 9.58015 0.844859 9.17187 2.00049H1C0.44772 2.00049 0 2.44819 0 3.00045C0 3.55271 0.44772 4.00041 1 4.00041H9.17383C9.59734 5.19822 10.7295 5.99937 12 6.00033C13.2698 5.99855 14.401 5.19754 14.8242 4.00041H17C17.5523 4.00041 18 3.55271 18 3.00045C18 2.44819 17.5523 2.00049 17 2.00049H14.8262C14.3875 0.759062 13.1906 -0.0512544 11.875 0.00252339ZM12 2.00049C12.5523 2.00049 13 2.44819 13 3.00045C13 3.55271 12.5523 4.00041 12 4.00041C11.4477 4.00041 11 3.55271 11 3.00045C11 2.44819 11.4477 2.00049 12 2.00049ZM5.87499 8.00219C4.65039 8.05348 3.58015 8.84453 3.17187 10.0002H1C0.44772 10.0002 0 10.4479 0 11.0001C0 11.5524 0.44772 12.0001 1 12.0001H3.17383C3.59734 13.1979 4.72948 13.999 6 14C7.2698 13.9982 8.40095 13.1972 8.82422 12.0001H17C17.5523 12.0001 18 11.5524 18 11.0001C18 10.4479 17.5523 10.0002 17 10.0002H8.82617C8.38751 8.75873 7.19059 7.94842 5.87499 8.00219ZM5.99999 10.0002C6.55227 10.0002 6.99999 10.4479 6.99999 11.0001C6.99999 11.5524 6.55227 12.0001 5.99999 12.0001C5.44771 12.0001 4.99999 11.5524 4.99999 11.0001C4.99999 10.4479 5.44771 10.0002 5.99999 10.0002Z"
            fill="white"></path>
        </svg>
        <span class="filterbtn">დეტალური ფილტრი</span>
      </button>
    </div>
  </transition>
  <div class="sidebar">
    <ul>
      <li>
        <router-link :to="{ path: `/` }" :class="{ active: $route.path === `/` }">
          <i class="fa-solid fa-house outline-icon" :class="{ active: $route.path === `/` }"></i>
          <span>მთავარი</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{ path: `/cart` }" :class="{ active: $route.path === `/cart` }">
          <i class="fa-solid fa-cart-shopping outline-icon" :class="{ active: $route.path === `/cart` }"></i>
          <span>კალათა</span>
        </router-link>
      </li>
      <li class="mobile-only">
        <router-link :to="{ path: `/favorites` }" :class="{ active: $route.path === `/favorites` }">
          <i class="fa-solid fa-heart outline-icon" :class="{ active: $route.path === `/favorites` }"></i>
          <span>რჩეულები</span>
        </router-link>
      </li>
      <li class="mobile-only">
        <router-link :to="{ path: `/orders` }" :class="{ active: $route.path === `/orders` }">
          <i class="fa-solid fa-bag-shopping outline-icon" :class="{ active: $route.path === `/orders` }"></i>
          <span>შეკვეთები</span>
        </router-link>
      </li>
      <li class="mobile-only">
        <router-link v-if="isAuthenticated" :to="{ path: `/profile` }" :class="{ active: $route.path === `/profile` }">
          <i class="fa-solid fa-user outline-icon" :class="{ active: $route.path === `/profile` }"> </i>
          <span>{{ getUser }}</span>
        </router-link>
        <button v-else class="user-section" @click.prevent="openmodal('loginmodal')">
          <i class="fa-solid fa-user outline-icon"></i>
          <span>შესვლა</span>
        </button>

      </li>
    </ul>
  </div>
  <CategoryModal :isModalVisible="isModalVisible" @close-modal="isModalVisible = false" />
</template>

<script>
import CategoryModal from './CategoryModal.vue';
import { mapGetters, mapState, mapMutations } from 'vuex';

export default {
  components: {
    CategoryModal,
  },
  data() {
    return {
      showFilterButton: true,
      lastScrollY: 0,
      isModalVisible: false,
    };
  },
  computed: {
    showTopButton() {
      return (this.$route.path.startsWith('/product') && this.showFilterButton && this.$route.query.section) || this.$route.path.startsWith('/collection')
    },
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapGetters('auth', ['getUser']),
    ...mapState('modals', [
      'loginmodal',
      'registermodal',
      'forgetmodal',
      'confirmmodal',
      'passwordmmodal',
      'data',
    ]),

  },
  watch: {
    loginmodal(newVal) {
      this.noscroll(newVal)
    },
    passwordmmodal(newVal) {
      this.noscroll(newVal)

    },
    registermodal(newVal) {
      this.noscroll(newVal)

    },
    forgetmodal(newVal) {
      this.noscroll(newVal)

    },
    confirmmodal(newVal) {
      this.noscroll(newVal)

    },
  },
  methods: {
    noscroll(newVal) {
      if (newVal) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    },
    ...mapMutations('modals', ['openmodal', 'closemodal', 'setdata']),

    handleButtonClick() {
      console.log('Filter clicked!');
    },
    handleScroll() {
      const currentY = window.scrollY;
      if (currentY < this.lastScrollY - 10) {
        this.showFilterButton = true;
      } else if (currentY > this.lastScrollY + 10) {
        this.showFilterButton = false;
      }
      this.lastScrollY = currentY;
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.top-button {
  position: fixed;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.top-button button {
  background-color: #7a1fff;
  display: flex;
  height: 45px;
  width: 180px;
  align-items: center;
  gap: 10px;
  justify-content: center;
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.filterbtn {
  font-size: 11px;
}

.sidebar {
  width: 100%;
  height: 65px;
  background-color: #f0f4f5;
  color: #333;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 5px 0;
}

.sidebar ul {
  display: flex;
  width: 100%;
  padding: 0;
  margin: 0;
}

.sidebar ul li {
  list-style: none;
  flex: 1;
  text-align: center;
  margin: 15px 0;
  overflow: hidden;
}

.user-section {
  flex: 1;
  text-align: center;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  gap: 10px;
}


.sidebar ul li i,
.user-section i {
  font-size: 1rem;
}

.sidebar ul li a,
.user-section button {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  font-weight: 500;
  color: #333;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  background-color: rgba(255, 255, 255, 0.9);

}

.outline-icon {
  color: transparent;
  -webkit-text-stroke: 1.3px #7c4dbd;
}

.outline-icon.active {
  color: #7c4dbd;
}

.mobile-only {
  display: block;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    background-color: #f0f4f5;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 5px 0;
  }
  .user-section span{
    color: #333333;
  }

  .sidebar ul li {
    list-style: none;
    flex: 1;
    text-align: center;
  }

  .sidebar ul li a,
  .user-section {
    font-size: 11px;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    width: 100%;
    border: none;
  }

  .sidebar ul li i,
  .user-section i {
    font-size: 1rem;
  }

  .sidebar ul li a.active {
    color: #7c4dbd;
    font-size: 11.3px;

  }
}
</style>
