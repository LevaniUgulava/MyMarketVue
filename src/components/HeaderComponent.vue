<template>

  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  </head>
  <div :class="['sticky-header', isMobile ? 'mobile-header' : 'desktop-header']">

    <img src="/logo/logo2.png" class="logo">

    <nav>

      <div class="search-container">
        <input class="searchname" v-model="searchname" :placeholder="$t('header.splaceholder')" />
        <button class="catbtn" @click="openModal"><i class="fa-solid fa-filter"></i>{{ $t('header.filter') }}</button>
        <button @click="performSearch" class="srchbtn"><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>
      <div v-if="searchname.length > 0 && SuggestionNames.length > 0" class="suggestions-container">
        <div v-for="(item, index) in SuggestionNames" :key="index" class="suggestion-item"
          @click="selectSuggestion(item)">
          {{ item }}
        </div>
      </div>

      <div>
      </div>
      <div class="user-section">
        <router-link v-if="notLogin" to="/ka/login">{{ $t('header.user.login') }}</router-link>
        <div v-else class="dropdown-wrapper">
          <button @click="toggleDropdown" class="dropdown">{{ displayName }}</button>
          <ul v-if="isOpen" class="dropdown-menu">
            <li v-for="item in (currentlang == 'ka' ? kaitems : enitems)" :key="item" @click="selectItem(item)">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <CategoryModal :isModalVisible="isModalVisible" @close-modal="closeModal" @search-category="searchCategory" />
  </div>
</template>

<script>
import axios from 'axios';
import CategoryModal from './CategoryModal.vue';

export default {
  name: 'HeaderComponent',
  components: {
    CategoryModal,
  },
  props: {
    isMobile: Boolean,
  },
  data() {
    return {
      currentlang: localStorage.getItem('selectedLanguage'),
      isOpen: false,
      displayName: 'Login',
      searchname: '',
      selectedmainCategory: "",
      selectedCategory: '',
      selectedsubCategory: '',
      isModalVisible: false,
      Searchnames: [],
      SuggestionNames: [],
      emitmin: '',
      emitmax: '',
      enitems: ["Profile", "Logout"],
      kaitems: ["პროფილი", "გასვლა"],

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
    this.selectItem();
    this.NamesforSearch();
  },
  watch: {
    searchname() {
      this.Suggestion();
    },
  },

  methods: {
    selectSuggestion(item) {
      this.searchname = item;
      this.$nextTick(() => {
        this.SuggestionNames = []; // Ensures UI updates immediately
      });
    },

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
          min: this.emitmin,
          max: this.emitmax,
          page: 1,
        },
      });
    },

    searchCategory(data) {
      this.selectedmainCategory = data.maincategory;
      this.selectedCategory = data.category;
      this.selectedsubCategory = data.subcategory;
      this.emitmin = data.min;
      this.emitmax = data.max;
    },
    async NamesforSearch() {
      try {
        const response = await axios.get("/nameforsearch");
        this.Searchnames = response.data;
        console.log(this.Searchnames);
      } catch (error) {
        console.log(error);
      }
    },
    Suggestion() {
      this.SuggestionNames = this.Searchnames.filter((name) => name.toLowerCase().includes(this.searchname.toLowerCase()));
    }
  },


};
</script>


<style>
.suggestions-container {
  position: absolute;
  width: 400px;
  background: #ffffff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
  padding: 8px;
  top: 75%;
  left: 255px;
}


.suggestion-item {
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 10px;
  font-weight: bold;
  font-size: 0.9rem;
  color: #004d40;

}

.suggestion-item:hover {
  background: linear-gradient(90deg, #f2e8ff, #e0c9fc);
  /* Soft purple gradient */
  color: #4a148c;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.suggestions-container::-webkit-scrollbar {
  width: 5px;
}

.suggestions-container::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 5px;
}

.suggestions-container::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}

.logo {
  height: 65px;
  margin-left: 20px;
}

.sticky-header {
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 1000;
  min-height: 60px;
}

.mobile-header {
  display: none;
}

.desktop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  width: 100%;
  background-blend-mode: multiply;
  background-color: #f0f4f5;

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
  color: #008080;
  /* Teal */
}

h1 {
  margin: 0;
  color: #004d40;
  /* Darker teal */
}

.user-section {
  display: flex;
  align-items: center;
}

.dropdown-wrapper {
  position: relative;
}

.dropdown {
  padding: 8px 35px;
  width: 100%;
  cursor: pointer;
  border: none;
  background: none;
  font-weight: bold;
  color: #008080;
  /* Teal */
  transition: background-color 0.3s;
}

.dropdown-menu {
  position: absolute;
  width: 100%;
  top: 100%;
  left: 0;
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
  align-items: center;
}

.dropdown-menu li {
  cursor: pointer;
  width: 100%;
  padding: 10px 20px;
  text-align: center;
  box-sizing: border-box;
  transition: background-color 0.2s ease;
}

.dropdown-menu li:hover {
  background-color: rgba(76, 175, 80, 0.25);
}

.dropdown:hover {
  background-color: rgba(76, 175, 80, 0.15);
}

.srchbtn {
  width: 35px;
  height: 38px;
  color: #4155c5;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.srchbtn:hover {
  background-color: #7a1dff1a;
}

.catbtn {
  height: 38px;
  margin-right: 5px;
  color: #4155c5;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.catbtn:hover {
  background-color: #7a1dff1a;

}

.search-container {
  display: flex;
  align-items: center;
  margin-left: 30px;
}

.search-container input {
  padding: 10px;
  margin: 10px;
  font-size: 16px;
  border: 1px solid #b180f5;
  border-radius: 6px;
  width: 400px;
  transition: border-color 0.3s;
}

.search-container input:focus {
  border-color: #7a1dff;
  outline: none;
}

@media (max-width: 768px) {
  .logo {
    height: 40px;
    margin-left: -10px;
  }

  .header {
    padding: 0px 0px;
    height: 60px;
  }

  h1 {
    font-size: 0.5rem;
    margin-left: 5%;
  }

  nav a {
    font-size: 0.7rem;

  }

  .search-container {
    width: 90%;
    display: flex;
    margin-left: 0px;

    align-items: center;
  }



  .search-container input {
    width: 100%;
    margin: 2px;
    font-size: 0.5rem;
  }

  .srchbtn,
  .catbtn {
    width: 45px;
    height: 30px;
    font-size: 0.5rem;
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
  }

  .dropdown {
    padding: 8px 25px;
    font-size: 0.6rem;

  }


  .dropdown-menu li {
    font-size: 0.6rem;
  }


}
</style>