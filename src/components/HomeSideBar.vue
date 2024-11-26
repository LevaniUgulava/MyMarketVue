<template>
  <div class="sidebar">
    <ul>
      <li>
        <router-link
          :to="{ path: `/${$route.params.lang}` }"
          :class="{ active: $route.path === `/${$route.params.lang}` }"
        >
          <i class="fa-solid fa-house outline-icon"></i>{{$t('homesidebar.home')}}
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ path: `/${$route.params.lang}/cart` }"
          :class="{ active: $route.path === `/${$route.params.lang}/cart` }"
        >
          <i class="fa-solid fa-cart-shopping outline-icon"></i>{{$t('homesidebar.cart')}}
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ path: `/${$route.params.lang}/favorites` }"
          :class="{ active: $route.path === `/${$route.params.lang}/favorites` }"
        >
          <i class="fa-solid fa-heart outline-icon"></i>{{$t('homesidebar.favorite')}}
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ path: `/${$route.params.lang}/orders` }"
          :class="{ active: $route.path === `/${$route.params.lang}/orders` }"
        >
          <i class="fa-solid fa-bag-shopping outline-icon"></i>{{$t('homesidebar.orders')}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {};
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
  background-color: rgba(76, 175, 80, 0.15);
  color: #008080;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: scale(1.03);
}

.sidebar ul li a.active {
  background-color: rgba(76, 175, 80, 0.25);
  color: #004d40;
  font-weight: bold;
}

.sidebar ul li i {
  font-size: 1.3rem;
  color: #008080;
}

/* CSS Stroke Effect for Icons */
.outline-icon {
  color: transparent;
  -webkit-text-stroke: 1px #008080; /* Color and width of outline */
}

@media (max-width: 390px) {
  .sidebar {
    width: 100%;
  }
}

@media (max-width: 575px) {
  .sidebar {
    width: 60%;
  }

  .sidebar ul li a {
    font-size: 0.9rem;
  }
}

@media (min-width: 576px) and (max-width: 767px) {
  .sidebar {
    width: 50%;
  }
}
</style>
