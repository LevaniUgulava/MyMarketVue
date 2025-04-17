<template>
  <transition name="fade-slide">
    <div v-if="showTopButton" class="top-button">
      <button @click="isModalVisible = true">ფილტრი</button>
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
        <button class="user-section" @click.prevent="openmodal('loginmodal')">
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
      return this.$route.path.startsWith('/product') && this.showFilterButton;
    },
    isActive() {
      return (
        this.$route.path === `/${this.$route.params.lang}/profile` ||
        this.$route.path === `/${this.$route.params.lang}/orders` ||
        this.$route.path === `/${this.$route.params.lang}/favorites` ||
        this.isUserClicked
      );
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
  z-index: 9999;
}

.top-button button {
  padding: 8px 15px;
  background-color: #7a1fff;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
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

.user-section.active {
  background-color: #7a1fff1a;
  color: #873ef5;
}

.user-section.active span {
  color: #873ef5;
}

.user-section.active i {
  color: #873ef5;
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

/* Outline Icon Styles */
.outline-icon {
  color: transparent;
  -webkit-text-stroke: 1.3px #7a1fff;
}

.outline-icon.active {
  color: #7a1fff;
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

  .sidebar ul li {
    list-style: none;
    flex: 1;
    text-align: center;
  }

  .sidebar ul li a,
  .user-section {
    font-size: 0.7rem;
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
    color: #873ef5;
    font-weight: bold;
  }
}
</style>
