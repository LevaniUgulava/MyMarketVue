<template>

  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  </head>
  <div :class="['sticky-header', isMobile ? 'mobile-header' : 'desktop-header']">


    <nav>
      <p v-if="!isMobile" @click="redirect()">MyDressWay</p>

      <div class="search-container">
        <input type="text" class="searchname" v-model="searchname" placeholder="ძიება..." />
        <button @click="performSearch" class="srchbtn"><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>
      <div class="search-container-mobile" @click.stop>
        <input type="text" class="searchname-mobile" v-model="searchname" placeholder="ძიება..." />
        <button @click="toggleSearch" class="srchbtn-mobile">
          <i class="fas fa-search"></i>
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
            :class="{ 'active': $route.path === `/orders` }">
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
        <button class="login" v-if="!isAuthenticated" @click="openmodal('loginmodal')">შესვლა <i
            class="fa-solid fa-user"></i></button>
        <div v-else class="dropdown-wrapper">
          <button @click="toggleDropdown" class="login"> {{ getUser }} <i class="fa-solid fa-user"></i></button>
          <ul v-if="isOpendropdown" class="dropdown-menu">
            <li v-for="item in kaitems" :key="item" @click="selectItem(item)">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="small-sections-wrapper">

      <SmallSections />
    </div>
    <LoginComponent :open="loginmodal" @close="() => closemodal('loginmodal')"
      @openregister="() => openmodal('registermodal')" @openforget="() => openmodal('forgetmodal')" />

    <RegisterComponent :open="registermodal" @close="() => closemodal('registermodal')"
      @openlogin="() => openmodal('loginmodal')" @emaildata="handleconfirmmail" />

    <ForgetPassword :open="forgetmodal" @close="() => closemodal('forgetmodal')" @emaildata="handleconfirmmail" />

    <EmailConfirmation :open="confirmmodal" :data="data" @close="() => closemodal('confirmmodal')"
      @openresetmodal="() => openmodal('passwordmmodal')" />

    <PasswordComponent :open="passwordmmodal" :email="data.email" @close="() => closemodal('passwordmmodal')" />

  </div>
</template>

<script>
import SmallSections from '@/components/Status/SmallSections.vue';
import api from '@/api';
import LoginComponent from './LoginComponent.vue';
import RegisterComponent from './RegisterComponent.vue';
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
import ForgetPassword from '@/views/Password/ForgetPassword.vue';
import EmailConfirmation from '@/views/Password/EmailConfirmation.vue';
import PasswordComponent from '@/views/Password/PasswordComponent.vue';

export default {

  name: 'HeaderComponent',
  components: {
    SmallSections,
    LoginComponent,
    RegisterComponent,
    ForgetPassword,
    EmailConfirmation,
    PasswordComponent
  },
  props: {
    isMobile: Boolean,
  },
  data() {
    return {
      isOpen: false,
      isOpendropdown: false,
      isInputVisible: false,
      searchname: '',
      selectedmainCategory: "",
      selectedCategory: '',
      selectedsubCategory: '',
      Searchnames: [],
      SuggestionNames: [],
      emitmin: '',
      emitmax: '',
      kaitems: ["პროფილი", "გასვლა"],

    };
  },

  computed: {
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
  mounted() {
    this.NamesforSearch();
    document.addEventListener('click', this.handleClickOutside);

  },
  watch: {
    searchname() {
      this.Suggestion();
    },
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
    name(newValue) {
      localStorage.setItem("name", newValue);
    }
  },

  methods: {
    ...mapMutations('modals', ['openmodal', 'closemodal', 'setdata']),

    noscroll(newVal) {
      if (newVal) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    },
    handleresetopen(data) {
      this.setdata(data);
      this.openmodal('passwordmmodal');
    },
    handleconfirmmail(data) {
      this.setdata(data);
      this.closemodal('forgetmodal');
      this.closemodal('registermodal');
      this.openmodal('confirmmodal');
    },
    redirect() {
      this.$router.push("/");
    },
    selectSuggestion(item) {
      this.searchname = item;
      this.$nextTick(() => {
        this.SuggestionNames = [];
      });
    },

    toggleDropdown() {
      this.isOpendropdown = !this.isOpendropdown;
    },
    ...mapActions("auth", {
      logoutAction: 'logout',
    }),
    async selectItem(item) {
      this.isOpendropdown = false;
      if (item === 'პროფილი') {
        this.$router.push(`/profile`);
      } else if (item === 'გასვლა') {
        this.logoutAction();
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
      this.isOpen = !this.isOpen;
      this.$nextTick(() => {
        if (this.isOpen && this.$refs.searchInput) {
          this.$refs.searchInput.focus();
        }
      });
      // this.$router.push('/search');
    },
    closeOnBlur() {
      setTimeout(() => {
        this.isOpen = false;
      }, 150);
    },
    handleClickOutside(event) {
      const container = this.$refs.searchContainer;
      if (container && !container.contains(event.target)) {
        this.isOpen = false;
      }
    },
    submitSearch() {
      if (!this.searchname.trim()) {
        alert("გთხოვთ ჩაწერეთ საძიებო სიტყვა 🙏");
        return;
      }
      // Redirect or call search
      //this.$router.push({ path: '/product', query: { searchname: this.searchname } });
      this.isOpen = false;
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
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },


};
</script>


<style scoped>
* {
  box-sizing: border-box;
}

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

.no-scroll {
  overflow: hidden;
}

.redirects {
  display: flex;
  gap: 15px;
  margin: auto;
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
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  border: none;
  cursor: pointer;
  text-align: center;
  width: 100px;
  height: 60px;
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

.login {
  display: flex;
  padding: 15px 25px;
  background-color: transparent;
  border: 1.5px solid #e0e0e0;
  border-radius: 6px;
  gap: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  color: #551A8b;
}

.login i {
  font-size: 1rem;
}

.login:hover {
  border-color: #c8c5c5;
}

.outline-icon {
  color: transparent;
  -webkit-text-stroke: 1.3px #62389c;
}

.outline-icon.active {
  color: #62389c;
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
  top: 30px;
  width: 100%;
  z-index: 1000;
  min-height: 60px;
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  width: 100%;
  height: 100px;
  flex-direction: column;
  background-blend-mode: multiply;
  background-color: #f9fbfb;
}

.desktop-header {
  display: flex;
  align-items: center;
  left: 0;
  right: 0;
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
  font-size: 14px;
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


.dropdown-menu {
  position: absolute;
  width: 100%;
  top: 100%;
  left: 0;
  padding: 0;
  margin-top: -5px;
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
  background-color: #62389c;
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
  border: 1px solid #6d45a5;
  border-radius: 8px;
  padding: 5px;
  position: relative;
}

.search-container input {
  flex-grow: 1;
  padding: 12px 10px;
  height: 30px;
  font-size: 16px;
  border: none;
  outline: none;
  border-radius: 6px;
  width: 100%;
}

.search-container input::placeholder {
  color: #aaa;
}

.srchbtn {
  background: #62389c;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 8px;
  height: 40px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  color: white;
  position: absolute;
}

.srchbtn:hover {
  background: #542d89;
}

.srchbtn {
  right: 0px;
}



.search-container-mobile {
  display: none;
}

/* .search-transition-enter-active,
.search-transition-leave-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.search-transition-enter-from,
.search-transition-leave-to {
  transform: scaleX(0.5);
  opacity: 0;
}

.search-transition-enter-to,
.search-transition-leave-from {
  transform: scaleX(1);
  opacity: 1;
} */

@media (max-width: 768px) {
  nav {
    flex: none;
  }

  .search-container-mobile {
    position: relative;
    width: 100%;
    margin: auto;
    height: 30px;
    display: block;

  }

  .searchname-mobile {
    width: 100%;
    height: 40px;
    padding: 0 40px 0 15px;
    font-size: 14px;
    border: 1px solid #7a1dff;
    border-radius: 5px;
    outline: none;
  }

  .srchbtn-mobile {
    position: absolute;
    right: 0;
    top: 0;
    width: 35px;
    height: 40px;
    background-color: #62389c;
    border: none;
    color: white;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
  }

  .search-container {
    display: none;
  }


  .sticky-header {
    top: 0;
    left: 0;
  }

  .redirects {
    display: none;
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
    width: 50px;
    height: 40px;
    font-size: 1rem;
  }

  .user-section {
    display: none;
  }

  .dropdown {
    display: none;
  }

}

@media (min-width: 768px) and (max-width: 1024px) {
  .redirects {
    gap: 0px
  }

  .search-container {
    max-width: 300px;
  }
}
</style>