<template>
  <head>
    <!-- Other head content -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  </head>
  <div class="header sticky-header">
    <h1>Website Header</h1>
    <nav>
      <ul class="main-nav">
        <li><router-link to="/"><i class="fa-solid fa-house"></i></router-link></li>
        <li><router-link to="/cart"><i class="fa-solid fa-cart-shopping"></i></router-link></li>
        <li><a href="#">Services</a></li>
      </ul>
      <div class="search-container">
        <input v-model="searchname" placeholder="Search...">
        <select v-model="selectedCategory" class="category-dropdown">
          <option selected value="">Select category...</option>
          <option v-for="category in maincategories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
        <button @click="performSearch" class="srchbtn"><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>
      <div class="user-section">
        <router-link v-if="notLogin" to="/login">Login</router-link>
        <div v-else class="dropdown-wrapper">
          <button @click="toggleDropdown" class="dropdown">{{ displayName }}</button>
          <ul v-if="isOpen" class="dropdown-menu">
            <li v-for="item in items" :key="item" @click="selectItem(item)">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HeaderComponent',
  props: {
    maincategories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isOpen: false,
      items: ['Profile', 'Settings', 'Logout'],
      displayName: 'Login',
      searchname: '',
      selectedCategory: '',
    };
  },
  computed: {
    notLogin() {
      return !localStorage.getItem('token');
    },
  },
  mounted() {
    const name = localStorage.getItem('name');
    if (!this.notLogin) {
      this.displayName = name || 'User';
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    async selectItem(item) {
      this.isOpen = false;
      if (item === 'Profile') {
        this.$router.push('/profile');
      } else if (item === 'Settings') {
        this.$router.push('/settings');
      } else if (item === 'Logout') {
        try {
          await axios.post('http://127.0.0.1:8000/api/logout', {}, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          localStorage.removeItem('token');
          localStorage.removeItem('name');
          localStorage.removeItem('roles');
          this.$router.push('/login');
        } catch (error) {
          console.error('Logout failed', error);
        }
      }
    },
    performSearch() {
      this.$emit('search', { searchname: this.searchname, maincategory: this.selectedCategory });
    },
  },
};
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  width: 100vw;
  z-index: 1000;
  background-color: #f8f8f8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
}

nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
}

nav ul.main-nav {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

nav ul.main-nav li {
  margin-left: 20px;
}

nav a {
  text-decoration: none;
  color: #333;
}

h1 {
  margin: 0;
}

.user-section {
  display: flex;
  align-items: center;
}

.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.dropdown {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background: none;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  padding: 0;
  margin: 0;
  list-style: none;
  background: white;
  border: 1px solid #ccc;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.dropdown-menu li {
  padding: 10px 20px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #f0f0f0;
}

.srchbtn {
  width: 35px;
  height: 38px;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-container input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
}

.category-dropdown {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
