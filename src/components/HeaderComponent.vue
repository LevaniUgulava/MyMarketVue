<template>
  <head>
    <!-- Other head content -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  </head>
  <div class="header sticky-header">
 
    <h1>Website Header</h1>
    <nav>
    
      <div class="search-container">
    <input class="searchname" v-model="searchname" :placeholder="$t('header.splaceholder')"  />
        <button class="catbtn" @click="openModal"><i class="fa-solid fa-filter"></i>{{$t('header.filter')}}</button>
        <button @click="performSearch" class="srchbtn"><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>
       <div>
  <div class="language-switcher">
    <i class="fa-solid fa-globe"></i>
    <button @click="setLanguage('en')" class="lang-btn">English</button>
    <button @click="setLanguage('ka')" class="lang-btn">ქართული</button>
  </div>
  </div>
      <div class="user-section">
        <router-link v-if="notLogin" to="/ka/login">{{$t('header.user.login')}}</router-link>
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
import CategoryModal from './CategoryModal.vue';
import { useI18n } from 'vue-i18n';
import { computed, watch } from 'vue';
import router from '@/router';

export default {
  setup() {
    const { locale, t } = useI18n();

    const setInitialLanguage = () => {
      const lang = router.currentRoute.value.params.lang || 'en'; 
      locale.value = lang;
    };
    watch(() => router.currentRoute.value.params.lang, (newLang) => {
      if (newLang) {
        locale.value = newLang;
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
};



    const items = computed(() => [t('header.user.profile'), t('header.user.logout')]);

    return {
      setLanguage,
      items,
      setInitialLanguage,
    };
  },

  name: 'HeaderComponent',
  components: {
    CategoryModal,
  },
  data() {
    return {
      isOpen: false,
      displayName: 'Login',
      searchname: '',
      selectedCategory: '',
      selectedsubCategory: '',
      isModalVisible: false,
      emitmin:'',
      emitmax:''
    };
  },

  computed: {
    notLogin() {
      return !localStorage.getItem('token');
    },
  },
  
  mounted() {
    this.setInitialLanguage(); 
    const name = localStorage.getItem('name');
    if (!this.notLogin) {
      this.displayName = name || 'User';
    }
    this.selectItem();
  },

  methods: {
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    async selectItem(item) {
      this.isOpen = false;
      if (item === 'Profile' || item === 'პროფილი') {
        this.$router.push(`/${this.$route.params.lang}/profile`);
      } else if (item === 'Logout' || item === 'გასვლა') {
        try {
          await axios.post('logout', {}, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          localStorage.removeItem('token');
          localStorage.removeItem('name');
          localStorage.removeItem('roles');
          this.$router.push(`/${this.$route.params.lang}/login`);
        } catch (error) {
          console.error('Logout failed', error);
        }
      }
    },
 performSearch() {
  const currentQuery = { ...this.$route.query }; 
  const lang = this.$route.params.lang || 'ka'; 

  this.$router.push({
    path: `/${lang}/product`,
    query: {
      section: currentQuery.section || 'all',
      searchname: this.searchname,
      maincategory: this.selectedmainCategory,
      category: this.selectedCategory,
      subcategory: this.selectedsubCategory,
      min:this.emitmin,
      max:this.emitmax,
      page: 1,
    },
  });
},

    searchCategory(data) {
      this.selectedmainCategory = data.maincategory;
      this.selectedCategory = data.category;
      this.selectedsubCategory = data.subcategory;
      this.emitmin =data.min;
      this.emitmax=data.max;
    },
  },


};
</script>


<style>

.language-switcher {
  display: flex;
  align-items: center;
  background-color: #e6e6e1;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.language-switcher i {
  font-size: 20px;
  margin-right: 10px;
  color: #6e6d6d; 
}

.lang-btn {
  background-color: transparent;
  border: 2px solid #6e6d6d; /* Teal */
  border-radius: 5px;
  color: #6e6d6d;
  padding: 5px 10px;
  margin-left: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.lang-btn:hover {
  background-color: rgba(48, 101, 50, 0.25);
}

.sticky-header {
  position: sticky;
  top: 0;
  width: 100vw;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 60px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-blend-mode: multiply;
  background-color: rgb(238, 239, 238); /* Light green */
  background-image: url("https://www.transparenttextures.com/patterns/diamond-upholstery.png");
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
  color: #008080; /* Teal */
}

h1 {
  margin: 0;
  color: #004d40; /* Darker teal */
}

.user-section {
  display: flex;
  align-items: center;
}

.dropdown {
  padding: 8px 16px;
  cursor: pointer;
  border: none;
  background: none;
  font-weight: bold;
  color: #008080; /* Teal */
  transition: background-color 0.3s;
}

.dropdown:hover {
  background-color: rgba(76, 175, 80, 0.15); /* Soft green */
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  padding: 0;
  margin: 0;
  list-style: none;
  background: #ffffff;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.dropdown-menu li {
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-menu li:hover {
  background-color: rgba(76, 175, 80, 0.25); /* Light green */
}

.srchbtn {
  width: 35px;
  height: 38px;
  background-color: #e6e6e1; /* Teal */
  color: #6e6d6d;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.srchbtn:hover {
  background-color: rgba(76, 175, 80, 0.25); /* Darker teal */
}

.catbtn {
  height: 38px;
  margin-right: 5px;
  background-color: #e6e6e1; /* Dark green */
  color: #6e6d6d;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.catbtn:hover {
  background-color: rgba(76, 175, 80, 0.25); /* Darker green */
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
  border-radius: 6px;
  width: 400px;
  transition: border-color 0.3s;
}

.search-container input:focus {
  border-color: #008080; /* Teal */
  outline: none;
}

/* Adjust for smaller devices (e.g., iPhone 13 Pro) */
@media (max-width: 390px) {
  h1 {
    font-size: 0.8rem;
  }

  .search-container {
    width: 60%;
    margin-left: 5%;
  }

  .search-container input {
    width: 100%;
    font-size: 0.8rem;
  }

  .srchbtn,
  .catbtn {
    width: 30px;
    height: 32px;
    background-color: #008080; /* Teal */
  }

  .user-section {
    margin-left: auto;
  }

  nav {
    flex-wrap: wrap;
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
    width: 80%;
    margin: 0 auto;
  }

  .search-container input {
    width: 100%;
    font-size: 0.9rem;
  }

  .srchbtn,
  .catbtn {
    width: 35px;
    height: 38px;
    background-color: #008080; /* Teal */
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
