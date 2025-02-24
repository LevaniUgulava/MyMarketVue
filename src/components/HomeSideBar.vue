<template>
  <div class="sidebar" :class="{ 'is-collapsed': isSidebarCollapsed }">
    <ul>
      <li class="toggle-btn" v-if="isMobileOrTablet">
        <button @click.prevent="toggleSidebar">
          <i class="fa-solid fa-bars"></i>
          <span v-if="!isSidebarCollapsed">{{ $t('homesidebar.openclose') }}</span>
        </button>
      </li>
      <li>
        <router-link :to="{ path: `/${$route.params.lang}` }"
          :class="{ active: $route.path === `/${$route.params.lang}`, 'collapsed': isSidebarCollapsed }">
          <i class="fa-solid fa-house outline-icon"></i>
          <span v-if="!isSidebarCollapsed">{{ $t('homesidebar.home') }}</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{ path: `/${$route.params.lang}/cart` }"
          :class="{ active: $route.path === `/${$route.params.lang}/cart`, 'collapsed': isSidebarCollapsed }">
          <i class="fa-solid fa-cart-shopping outline-icon"></i>
          <span v-if="!isSidebarCollapsed">{{ $t('homesidebar.cart') }}</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{ path: `/${$route.params.lang}/favorites` }"
          :class="{ active: $route.path === `/${$route.params.lang}/favorites`, 'collapsed': isSidebarCollapsed }">
          <i class="fa-solid fa-heart outline-icon"></i>
          <span v-if="!isSidebarCollapsed">{{ $t('homesidebar.favorite') }}</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{ path: `/${$route.params.lang}/orders` }"
          :class="{ active: $route.path === `/${$route.params.lang}/orders`, 'collapsed': isSidebarCollapsed }">
          <i class="fa-solid fa-bag-shopping outline-icon"></i>
          <span v-if="!isSidebarCollapsed">{{ $t('homesidebar.orders') }}</span>
        </router-link>
      </li>
      <li>

        <select v-model="locale" @change="setLanguage(locale)">
          <option value="ka">{{ isSidebarCollapsed ? "ქა" : "ქართული" }}</option>
          <option value="en">{{ isSidebarCollapsed ? "en" : "English" }}</option>
        </select>
      </li>
    </ul>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { computed, watch } from 'vue';
import router from '@/router';

export default {
  setup() {
    const { locale, t } = useI18n();

    const setInitialLanguage = () => {
      const savedLang = localStorage.getItem('selectedLanguage');
      const lang = savedLang || router.currentRoute.value.params.lang || 'ka';
      locale.value = lang;
      if (!savedLang) {
        localStorage.setItem('selectedLanguage', lang);
      }
    };

    watch(() => router.currentRoute.value.params.lang, (newLang) => {
      if (newLang) {
        locale.value = newLang;
        localStorage.setItem('selectedLanguage', newLang);
      }
    });

    const setLanguage = (lang) => {
      const currentPath = router.currentRoute.value.path.replace(/^\/(en|ka)/, `/${lang}`);
      const currentQuery = { ...router.currentRoute.value.query };

      router.replace({
        path: currentPath,
        query: currentQuery,
      });
      locale.value = lang;
      localStorage.setItem('selectedLanguage', lang); // Save the selected language
    };

    const items = computed(() => [t('header.user.profile'), t('header.user.logout')]);

    return {
      setLanguage,
      items,
      setInitialLanguage,
      locale,
    };
  },

  emits: ['sidebar-collapse'],
  data() {
    return {
      isSidebarCollapsed: window.innerWidth <= 1024,
      isMobileOrTablet: window.innerWidth <= 1024,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
      this.$emit('sidebar-collapse', this.isSidebarCollapsed);
    },
    handleResize() {
      this.isMobileOrTablet = window.innerWidth <= 1024;
      if (!this.isMobileOrTablet) {
        this.isSidebarCollapsed = false;
        this.$emit('sidebar-collapse', this.isSidebarCollapsed);
      } else {
        this.isSidebarCollapsed = true;
      }
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.setInitialLanguage();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
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

.sidebar ul li button,
select {
  display: flex;
  align-items: center;
  border: none;
  gap: 10px;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  color: #333;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s, color 0.3s;
}

.sidebar ul li select:hover {
  background-color: rgba(76, 175, 80, 0.15);
  color: #008080;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}



.sidebar ul li button i {
  font-size: 1.3rem;
  color: #008080;
}

.sidebar ul li button:hover {
  background-color: rgba(76, 175, 80, 0.15);
  color: #008080;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: scale(1.03);
}

.sidebar ul li button.active {
  background-color: rgba(76, 175, 80, 0.25);
  color: #004d40;
  font-weight: bold;
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


.outline-icon {
  color: transparent;
  -webkit-text-stroke: 1px #008080;
}

.sidebar.is-collapsed ul li span {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.sidebar.is-collapsed {
  width: 65px;
}


.toggle-btn {
  display: none;
  margin-bottom: 20px;
}

@media (max-width: 1024px) {
  .toggle-btn {
    display: block;
  }
}

@media (min-width: 375px) and (max-width: 430px) {
  .sidebar {
    width: 100px;
    /* Default responsive width */
  }

  .sidebar.is-collapsed {
    width: 60px;
    /* Width when collapsed on responsive */
  }

  .sidebar ul li button {
    font-size: 0.5rem;
    width: 100%;
  }

  select {
    font-size: 0.7rem;
    width: 100%;
    -webkit-appearance: none;
    /* For Safari and Chrome */
    -moz-appearance: none;
    /* For Firefox */
    appearance: none;
  }

  .sidebar ul li {
    margin: 10px 0;
  }

  .sidebar ul li a {
    font-size: 0.5rem;
    gap: 5px;
  }

  .sidebar ul li i {
    font-size: 1rem;
    color: #008080;
  }
}
</style>
