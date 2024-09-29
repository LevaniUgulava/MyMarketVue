<template>
  <head>
    <!-- Other head content -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  </head>
  <div class="header sticky-header">
    <h1>Website Header</h1>
    <nav>
    
      <div class="search-container">
        <input class="searchname" v-model="searchname" placeholder="Search...">
        <button class="catbtn" @click="openModal"><i class="fa-solid fa-bars"></i></button>
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

<CategoryModal 
:isModalVisible="isModalVisible"
 @close-modal="closeModal"
 @search-category="searchCategory"
 />
  </div>
</template>

<script>
import axios from 'axios';
import CategoryModal from './CategoryModal.vue'
export default {
  name: 'HeaderComponent',
  components:{
    CategoryModal
  },
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
      selectedsubCategory:'',
      isModalVisible: false,

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
    openModal(){
       this.isModalVisible= true
    },
      closeModal(){
       this.isModalVisible= false
    },
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
      this.$router.push({
        path: '/',
        query: {
          searchname: this.searchname,        
          maincategory: this.selectedmainCategory, 
          category: this.selectedCategory,
          subcategory: this.selectedsubCategory, // Corrected here
          page: 1                             
        }
      });
},
    searchCategory(data) {
      this.selectedmainCategory = data.maincategory; 
      this.selectedCategory=data.category;
      this.selectedsubCategory=data.subcategory;

    },
  },
};
</script>

<style>
.sticky-header {
  position: sticky;
  top: 0;
  width: 100vw;
  z-index: 1000;
  background-color: #f8f8f8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 60px; /* Adjust this value to your header height */
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
.catbtn {
  margin: 10px;
  width: 35px;
  height: 38px;
}

.search-container {
  display: flex;
  align-items: center;
}

.search-container input {
  padding: 10px;
  margin: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 400px;
}

/* Adjust for smaller devices (e.g., iPhone 13 Pro) */
@media (max-width: 390px) {
  h1 {
    font-size: 0.8rem; /* Smaller font size for the title */
  }
  
  .search-container {
    width: 60%; /* Make search input more flexible */
    margin-left: 5%; /* Add some margin */
  }

  .search-container input {
    width: 100%; /* Adjust the width to take full space */
    font-size: 0.8rem; /* Adjust font size */
  }

  .srchbtn,
  .catbtn {
    width: 30px; /* Smaller button size */
    height: 32px; 
  }

  .user-section {
    margin-left: auto;
  }
  
  nav {
    flex-wrap: wrap; /* Allow wrapping if needed */
    justify-content: space-between;
    padding: 5px;
  }
}

/* Adjust for medium devices */
@media (min-width: 391px) and (max-width: 575px) {
  h1 {
    font-size: 1rem;
  }

  .search-container {
    width: 80%; /* Adjust search container width */
    margin: 0 auto; /* Center the search container */
  }

  .search-container input {
    width: 100%; /* Full width of the container */
    font-size: 0.9rem; /* Adjust font size */
  }

  .srchbtn,
  .catbtn {
    width: 35px;
    height: 38px;
  }

  .user-section {
    margin-left: auto;
  }

  nav {
    padding: 5px;
  }
}

/* Adjust for larger mobile devices */
@media (min-width: 576px) and (max-width: 767px) {
  h1 {
    font-size: 1.2rem; 
  }

  .search-container {
    width: 50%; 
    margin-left: 5%;
    display: flex;
    align-items: center;
  }

  .user-section {
    margin-left: auto; 
    display: flex;
    align-items: center;
  }

  nav {
    display: flex;
    justify-content: space-between; 
    align-items: center; 
    width: 100%; 
    padding: 0 10px; 
  }
}


</style>
