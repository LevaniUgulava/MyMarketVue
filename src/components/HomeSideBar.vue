<template>
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
      <li v-if="isAuthorized">
        <router-link :to="{ path: `/orders` }" :class="{ active: $route.path === `/orders` }">
          <i class="fa-solid fa-bag-shopping outline-icon" :class="{ active: $route.path === `/orders` }"></i>
          <span>შეკვეთები</span>
        </router-link>
      </li>
      <li class="mobile-only" @click="toggleDropup">
        <router-link :to="{ path: `/profile` }" :class="{ active: $route.path === `/profile` }">
          <i class="fa-solid fa-user outline-icon" :class="{ active: $route.path === `/profile` }"> </i>
          <span> {{ name }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    isMobile: Boolean,
  },
  computed: {
    isActive() {
      return (
        this.$route.path === `/${this.$route.params.lang}/profile` ||
        this.$route.path === `/${this.$route.params.lang}/orders` ||
        this.$route.path === `/${this.$route.params.lang}/favorites` ||
        this.isUserClicked
      );
    },
    isAuthorized() {
      return Boolean(localStorage.getItem('token'));
    },
    name() {
      return this.isAuthorized ? localStorage.getItem('name') : " შესვლა";
    }
  },
}; </script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Raleway:wght@400;500;700&display=swap');

.sidebar {
  width: 100%;
  height: 60px;
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
  font-family: 'Raleway', sans-serif;
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
  border-radius: 8px;
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
  font-weight: bold;
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
.user-section {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  font-weight: 500;
  color: #333;
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

/* Mobile-only style */
.mobile-only {
  display: block;
}

/* No hover effects or active transformation */
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
  }

  .sidebar ul li i,
  .user-section i {
    font-size: 1rem;
  }

  .sidebar ul li a.active {
    background-color: #7a1fff1a;
    color: #873ef5;
    font-weight: bold;
  }
}
</style>
