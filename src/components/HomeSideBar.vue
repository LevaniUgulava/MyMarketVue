<template>
  <div class="sidebar">
    <ul>
      <li>
        <router-link :to="{ path: `/${$route.params.lang}` }"
          :class="{ active: $route.path === `/${$route.params.lang}` }">
          <i class="fa-solid fa-house outline-icon" :class="{ active: $route.path === `/${$route.params.lang}` }">
          </i>
          <span>{{ $t('homesidebar.home') }}</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{ path: `/${$route.params.lang}/cart` }"
          :class="{ active: $route.path === `/${$route.params.lang}/cart` }">
          <i class="fa-solid fa-cart-shopping outline-icon"
            :class="{ active: $route.path === `/${$route.params.lang}/cart` }">
          </i>
          <span>{{ $t('homesidebar.cart') }}</span>
        </router-link>
      </li>
      <li :class="[isMobile ? '' : 'mobile-only']" @click="IsopenSearchfun">
        <div class="user-section" ref="userSection" :class="{ active: isActiveSearch }">
          <i class="fa-solid fa-magnifying-glass outline-icon"></i>
          <span>ძებნა</span>
        </div>
      </li>
      <li :class="[isMobile ? '' : 'mobile-only']" @click="toggleDropup">
        <div class="user-section" ref="userSection" :class="{ active: isActive }">
          <i class="fa-solid fa-user outline-icon"></i>
          <span>შენ</span>
        </div>
      </li>
      <!-- Dropup Menu -->
      <div class="dropup" v-if="isdropupopen" ref="dropup">
        <li>
          <router-link :to="{ path: `/${$route.params.lang}/favorites` }"
            :class="{ active: $route.path === `/${$route.params.lang}/favorites` }">
            <i class="fa-solid fa-heart outline-icon"
              :class="{ active: $route.path === `/${$route.params.lang}/favorites` }"></i>
            <span>{{ $t('homesidebar.favorite') }}</span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ path: `/${$route.params.lang}/orders` }"
            :class="{ active: $route.path === `/${$route.params.lang}/orders` }">
            <i class="fa-solid fa-bag-shopping outline-icon"
              :class="{ active: $route.path === `/${$route.params.lang}/orders` }"></i>
            <span>{{ $t('homesidebar.orders') }}</span>
          </router-link>
        </li>
      </div>


      <li :class="[isMobile ? 'mobile-only' : '']">
        <router-link :to="{ path: `/${$route.params.lang}/favorites` }"
          :class="{ active: $route.path === `/${$route.params.lang}/favorites` }">
          <i class="fa-solid fa-heart outline-icon"
            :class="{ active: $route.path === `/${$route.params.lang}/favorites` }">
          </i>
          <span>{{ $t('homesidebar.favorite') }}</span>
        </router-link>
      </li>
      <li :class="[isMobile ? 'mobile-only' : '']">
        <router-link :to="{ path: `/${$route.params.lang}/orders` }"
          :class="{ active: $route.path === `/${$route.params.lang}/orders` }">
          <i class="fa-solid fa-bag-shopping outline-icon"
            :class="{ active: $route.path === `/${$route.params.lang}/orders` }">
          </i>
          <span>{{ $t('homesidebar.orders') }}</span>
        </router-link>
      </li>
    </ul>
    <CategoryModal :isModalVisible="IsopenSearch" @close-modal="closeModal" @search-category="searchCategory" />

  </div>
</template>

<script>
import CategoryModal from './CategoryModal.vue';
export default {
  props: {
    isMobile: Boolean,
  },
  components: {
    CategoryModal
  },
  data() {
    return {
      isdropupopen: false,
      isUserClicked: false,
      IsopenSearch: false,
      searchnameinput: '',
      selectedmainCategory: "",
      selectedCategory: '',
      selectedsubCategory: '',
      emitmin: '',
      emitmax: '',
    };
  },
  computed: {
    isActive() {
      return this.$route.path === `/${this.$route.params.lang}/profile` || this.isUserClicked;
    }
  },
  methods: {
    IsopenSearchfun() {
      this.IsopenSearch = true;
    },
    closeModal() {
      this.IsopenSearch = false;
    },
    toggleDropup() {
      this.isdropupopen = !this.isdropupopen;
      this.isUserClicked = true;

      if (this.isdropupopen) {
        document.addEventListener("click", this.closeDropupOutside);
      }
    },
    closeDropupOutside(event) {
      if (
        this.$refs.dropup &&
        !this.$refs.dropup.contains(event.target) &&
        !this.$refs.userSection.contains(event.target)
      ) {
        this.isdropupopen = false;
        this.isUserClicked = false;
        document.removeEventListener("click", this.closeDropupOutside);
      }
    },
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeDropupOutside);
  },
};
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Raleway:wght@400;500;700&display=swap');


.sidebar {
  width: 250px;
  background-color: #f0f4f5;
  color: #333;
  padding: 20px;
  border-top-right-radius: 8px;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
  height: 100vh;
  position: relative;
  top: 0;
  font-family: 'Raleway', sans-serif;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar ul li {
  margin: 15px 0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}


.sidebar ul li a {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  font-weight: 500;
  color: #333;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s, color 0.3s;
}



.sidebar ul li a:hover {
  background-color: #7a1fff1a;
  color: #873ef5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: scale(1.03);
}

.sidebar ul li a.active {
  background-color: #7a1fff1a;
  color: #873ef5;
  font-weight: bold;
}

.sidebar ul li i {
  font-size: 1.3rem;
}

.outline-icon {
  color: transparent;
  -webkit-text-stroke: 1.3px #7a1fff;
}

.outline-icon.active {
  color: #7a1fff;
}


.toggle-btn {
  display: none;
  margin-bottom: 20px;
}

.mobile-only {
  display: none;
}

@media (max-width: 1024px) {
  .toggle-btn {
    display: block;
  }
}

@media (max-width: 768px) {
  .dropup {
    width: 100%;
    position: fixed;
    bottom: 60px;
    background-color: #fbf2f2;
    left: 0;
    box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.2);
  }

  .mobile-only {
    width: 100%;
    justify-content: center;
    padding: 12px;
  }

  .sidebar {
    width: 100%;
    height: 60px;
    background-color: #f0f4f5;
    color: #333;
    position: fixed !important;
    bottom: 0 !important;
    left: 0;
    z-index: 9999;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 5px 0px;
  }

  body,
  html {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  .main-content {
    padding-bottom: 70px;
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
  }

  .user-section {
    list-style: none;
    flex: 1;
    text-align: center;
    padding: 12px;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: background-color 0.3s, color 0.3s;
    gap: 10px;
  }

  .user-section.active {
    background-color: #7a1fff1a;
    /* Light purple */
    color: #873ef5;
    /* Text color */
    font-weight: bold;
  }

  .user-section.active span {
    color: #873ef5;
  }

  /* Ensure icon color also changes */
  .user-section.active i {
    color: #873ef5;
  }

  .sidebar ul li i,
  .user-section i {
    font-size: 1.2rem;
  }

  .sidebar ul li a,
  .user-section {
    font-size: 0.75rem;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
