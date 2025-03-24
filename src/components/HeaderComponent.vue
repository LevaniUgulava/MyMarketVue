<template>

  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  </head>
  <div :class="['sticky-header', isMobile ? 'mobile-header' : 'desktop-header']">


    <nav>
      <img src="/logo/2.png" @click="redirect()" class="logo">

      <div class="search-container">
        <input type="text" class="searchname" v-model="searchname" placeholder="ძიება..." />
        <button @click="performSearch" class="srchbtn"><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>

      <div class="search-container-mobile">
        <input type="text" class="searchname-mobile" v-model="searchname" placeholder="ძიება..." />
        <button @click="toggleSearch" class="srchbtn-mobile">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>





      <div v-if="searchname.length > 0 && SuggestionNames.length > 0" class="suggestions-container">
        <div v-for="(item, index) in SuggestionNames" :key="index" class="suggestion-item"
          @click="selectSuggestion(item)">
          {{ item }}
        </div>
      </div>
      <div class="redirects">
        <div class="btnredirect">
          <router-link :to="{ path: `/favorites` }" class="redirect-button"
            :class="{ 'active': $route.path === `/favorites` }">
            <i class="fa-solid fa-heart outline-icon"></i>
            <span>რჩეულები</span>
          </router-link>
        </div>

        <div class="btnredirect">
          <router-link :to="{ path: `/orders` }" class="redirect-button"
            :class="{ 'active': $route.path === `orders` }">
            <i class="fa-solid fa-bag-shopping outline-icon"></i>
            <span>შეკვეთები</span>
          </router-link>
        </div>

        <div class="btnredirect">
          <router-link :to="{ path: `/cart` }" class="redirect-button" :class="{ 'active': $route.path === `/cart` }">
            <i class="fa-solid fa-cart-shopping outline-icon"></i>
            <span>კალათა</span>
          </router-link>
        </div>
      </div>



      <div>
      </div>
      <div class="user-section">
        <router-link v-if="notLogin" to="/login">შესვლა</router-link>
        <div v-else class="dropdown-wrapper">
          <button @click="toggleDropdown" class="dropdown"> {{ displayName }}</button>
          <ul v-if="isOpen" class="dropdown-menu">
            <li v-for="item in kaitems" :key="item" @click="selectItem(item)">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <CategoryModal :isModalVisible="isModalVisible" @close-modal="closeModal" @search-category="searchCategory" />
    <div class="small-sections-wrapper">

      <SmallSections />
    </div>

  </div>
</template>

<script>
import CategoryModal from './CategoryModal.vue';
import SmallSections from '@/components/Status/SmallSections.vue';
import api from '@/api';

export default {

  name: 'HeaderComponent',
  components: {
    CategoryModal,
    SmallSections
  },
  props: {
    isMobile: Boolean,
  },
  data() {
    return {
      isOpen: false,
      isInputVisible: false,
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
    redirect() {
      this.$router.push("/");
    },
    selectSuggestion(item) {
      this.searchname = item;
      this.$nextTick(() => {
        this.SuggestionNames = [];
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
      if (item === 'პროფილი') {
        this.$router.push(`/profile`);
      } else if (item === 'გასვლა') {
        try {
          await api.post('logout', {}, {
            tokenRequired: true

          });
          localStorage.removeItem('token');
          localStorage.removeItem('name');
          localStorage.removeItem('roles');
          this.$router.push(`/login`);
        } catch (error) {
          console.error('Logout failed', error);
        }
      }
    },
    performSearch() {
      const currentQuery = { ...this.$route.query };

      this.$router.push({
        path: `/product`,
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
    toggleSearch() {
      const container = document.querySelector('.search-container-mobile');
      container.classList.toggle('active');
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
        const response = await api.get("/nameforsearch");
        this.Searchnames = response.data;
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
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.small-sections-wrapper {
  width: 100%;
  border-top: 1px solid #e0e0e0;
}

.redirects {
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;
}

.btnredirect {
  display: flex;
  justify-content: center;
  align-items: center;
}

.redirect-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 15px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  border: none;
  cursor: pointer;
  text-align: center;
  width: 100px;
}

.redirect-button span {
  font-size: 0.6rem;
}

.redirect-button i {
  font-size: 18px;
}

.redirect-button.active i {
  color: #62389c;
}

.outline-icon {
  color: transparent;
  -webkit-text-stroke: 1.3px #62389c;
}

.outline-icon.active {
  color: #7a1fff;
}

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
  cursor: pointer;
}


.sticky-header {
  position: fixed;
  top: 20px;
  width: 100vw;
  z-index: 1000;
  min-height: 60px;
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  width: 100%;
  flex-direction: column;
  background-blend-mode: multiply;
  background-color: #f9fbfb;
}

.desktop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  width: 100%;
  flex-direction: column;
  background-blend-mode: multiply;
  background-color: #f9fbfb;

}

nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
  color: #7a1dff;
  /* Teal */
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
  font-size: 0.9rem;
  padding: 10px 20px;
  text-align: center;
  box-sizing: border-box;
  transition: background-color 0.2s ease;
}

.dropdown-menu li:hover {
  background-color: #7a1dff1a;
}

.dropdown:hover {
  background-color: #7a1dff1a;
  border-radius: 10px;
  cursor: pointer;
}

.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  max-width: 500px;
  margin: auto;
  background: #fff;
  border: 1px solid #b180f5;
  border-radius: 8px;
  padding: 5px;
  position: relative;
}

.search-container input {
  flex-grow: 1;
  padding: 12px 18px;
  height: 30px;
  font-size: 16px;
  border: none;
  outline: none;
  border-radius: 6px;
  width: 100%;
  /* Keeps text aligned to the left */
}

.search-container input::placeholder {
  color: #aaa;
  /* Ensures placeholder stays aligned */
}

.srchbtn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 8px;
  color: #4155c5;
  transition: color 0.3s;
  position: absolute;
}

.srchbtn {
  right: 10px;
}



.srchbtn:hover {
  color: #7a1dff;
  font-size: 19px;

}

.search-container-mobile {
  display: none;
}

@media (max-width: 768px) {

  .search-container-mobile {
    position: absolute;
    top: 15px;
    right: 20px;
    display: flex;
    align-items: center;
    transition: 0.4s ease-in-out;
  }

  .srchbtn-mobile {
    background-color: #7a1dff;
    border: none;
    cursor: pointer;
    height: 30px;
    font-size: 14px;
    border-radius: 5px;
    color: white;
    transition: 0.3s ease-in-out;
    z-index: 2;
  }

  .searchname-mobile {
    font-size: 13px;
    border: 1px solid #ccc;
    border-radius: 5px;
    height: 30px;
    padding-left: 10px;
    padding-right: 10px;
    width: 0;
    opacity: 0;
    visibility: hidden;
    transform: translateX(100%);
    transition: width 0.4s ease-in-out, opacity 0.4s ease-in-out, transform 0.65s ease-in-out, visibility 0s 0.4s;
    margin-right: 0;
  }

  .search-container-mobile.active .searchname-mobile {
    width: 200px;
    opacity: 1;
    visibility: visible;
    border: 1px solid #7a1dff;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    transform: translateX(0);
  }

  .searchname-mobile {
    outline: none;
  }

  .search-container-mobile.active .srchbtn-mobile {
    color: white;
    background-color: #7a1fff;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    padding: 5px;
  }

  .search-container-mobile .searchname-mobile {
    width: 0;
    opacity: 0;
    visibility: hidden;
    transform: translateX(100%);
  }

  .sticky-header {
    top: 0;

  }

  .redirects {
    display: none;
  }

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
    display: none;
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
    font-size: 1rem;
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

    display: none;

  }

}
</style>