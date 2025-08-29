<template>

  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  </head>
  <div :class="['sticky-header', isMobile ? 'mobile-header' : 'desktop-header', isScrolled ? 'header-scrolled' : null]">

    <nav>
      <p v-if="!isMobile" @pointerup="redirect">Dressing</p>

      <div class="search-desktop">
        <div class="search-container">
          <input type="text" v-model="searchname" placeholder="ძიება..." class="searchname" />
          <button @pointerup.stop.prevent="performSearch" class="srchbtn">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
        <div class="search-container-mobile" @pointerup.stop.prevent>
          <div>
            logo
          </div>
          <input type="text" class="searchname-mobile" v-model="searchname" placeholder="ძიება..." />
          <button @pointerup.stop.prevent="toggleSearch" class="srchbtn-mobile">
            <i class="fas fa-search"></i>
          </button>
        </div>
        <div v-if="searchname.length > 0 && SuggestionNames.length > 0" class="suggestions-container">
          <div v-for="(item, index) in SuggestionNames" :key="index" class="suggestion-item"
            @pointerup.stop.prevent="selectSuggestion(item)">
            <i class="fa-solid fa-magnifying-glass"></i> <span v-html="highlightedName(item)"></span>
          </div>
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
          <router-link :to="{ path: `/orders`, query: { section: 'pending' } }" class="redirect-button"
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
        <button class="login" v-if="!isAuthenticated" @pointerup.stop.prevent="openmodal('loginmodal')">ავტორიზაცია <i
            class="fa-solid fa-user"></i></button>
        <div v-else class="dropdown-wrapper">
          <button ref="dropdown" @pointerup.stop.prevent="toggleDropdown" class="login"> {{ getUser }} <i
              class="fa-solid fa-user"></i></button>
          <ul v-if="isOpendropdown" class="dropdown-menu">
            <router-link class="router-link" to="/profile/info">
              <li> <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px"
                  fill="currentcolor">
                  <path
                    d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
                </svg> პირადი ინფორმაცია</li>
            </router-link>
            <router-link class="router-link" to="/profile/status">
              <li> <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px"
                  fill="currentcolor">
                  <path
                    d="m387-412 35-114-92-74h114l36-112 36 112h114l-93 74 35 114-92-71-93 71ZM240-40v-309q-38-42-59-96t-21-115q0-134 93-227t227-93q134 0 227 93t93 227q0 61-21 115t-59 96v309l-240-80-240 80Zm240-280q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70ZM320-159l160-41 160 41v-124q-35 20-75.5 31.5T480-240q-44 0-84.5-11.5T320-283v124Zm160-62Z" />
                </svg> სტატუსი</li>
            </router-link>
            <router-link class="router-link" to="/profile/address">

              <li> <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px"
                  fill="currentcolor">
                  <path
                    d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
                </svg> მისამართები</li>
            </router-link>
            <!-- <router-link class="router-link" to="/profile/verification">
              <li> <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px"
                  fill="currentcolor">
                  <path
                    d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Zm0 200q17 0 29.5-12.5T522-322q0-17-12.5-29.5T480-364q-17 0-29.5 12.5T438-322q0 17 12.5 29.5T480-280Zm-29-128h60v-22q0-11 5-21 6-14 16-23.5t21-19.5q17-17 29.5-38t12.5-46q0-45-34.5-73.5T480-680q-40 0-71.5 23T366-596l54 22q6-20 22.5-34t37.5-14q22 0 38.5 13t16.5 33q0 17-10.5 31.5T501-518q-12 11-24 22.5T458-469q-7 14-7 29.5v31.5Z" />
                </svg>ვერიფიკაცია</li>
            </router-link> -->
            <router-link class="router-link" to="/profile/reset">

              <li> <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px"
                  fill="currentcolor">
                  <path
                    d="M280-400q-33 0-56.5-23.5T200-480q0-33 23.5-56.5T280-560q33 0 56.5 23.5T360-480q0 33-23.5 56.5T280-400Zm0 160q-100 0-170-70T40-480q0-100 70-170t170-70q67 0 121.5 33t86.5 87h352l120 120-180 180-80-60-80 60-85-60h-47q-32 54-86.5 87T280-240Zm0-80q56 0 98.5-34t56.5-86h125l58 41 82-61 71 55 75-75-40-40H435q-14-52-56.5-86T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Z" />
                </svg> პაროლის შეცვლა</li>
            </router-link>

            <li @pointerdown="logout"> <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"
                width="24px" fill="currentcolor">
                <path
                  d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z" />
              </svg> გასვლა</li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="small-sections-wrapper">
      <SmallSections />
    </div>
    <!-- :open="loginmodal" -->
    <LoginComponent :open="loginmodal" @close="() => closemodal('loginmodal')"
      @openregister="() => openmodal('registermodal')" @openforget="() => openmodal('forgetmodal')"
      @emaildata="handleconfirmmail" />

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
import { Capacitor } from '@capacitor/core';


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
    this.PlatformCheck();
    this.checkScroll();
    document.addEventListener('click', this.handleClickOutside);
    document.addEventListener('click', this.handleClickOutsideforDropdown);

    window.addEventListener('scroll', this.checkScroll);

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
    logout() {
      this.logoutAction();
      this.$router.push('/');

    },
    ...mapMutations('modals', ['openmodal', 'closemodal', 'setdata']),
    checkScroll() {
      const maxTop = 40;
      const scrollY = window.scrollY || 0;
      const topValue = Math.max(0, maxTop - scrollY);

      document.documentElement.style.setProperty('--header-top', `${topValue}px`);
    },
    handleClickOutsideforDropdown(event) {
      if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
        this.isOpendropdown = false;
      }
    },

    PlatformCheck() {
      const platform = Capacitor.getPlatform();
      if (platform === "ios") {
        document.querySelector('.mobile-header').style.paddingTop = 'env(safe-area-inset-top)';
        document.querySelector('.mobile-header').style.height = 'calc(90px + env(safe-area-inset-top))';
      } else if (platform === "android") {
        document.querySelector('.mobile-header').style.paddingTop = '50px';
        document.querySelector('.mobile-header').style.height = '140px';

      }
    },
    highlightedName(name) {
      const input = this.searchname.toLowerCase();
      const lowerName = name.toLowerCase();
      const index = lowerName.indexOf(input);

      if (index !== -1 && input !== "") {
        const before = name.slice(0, index);
        const match = name.slice(index, index + input.length);
        const after = name.slice(index + input.length);

        return `${before}<strong style="color: black;">${match}</strong>${after}`;
      }

      return name;
    },



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
      this.SuggestionNames = this.Searchnames.filter((name) =>
        name.toLowerCase().startsWith(this.searchname.toLowerCase())
      );
    },
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('scroll', this.checkScroll);
    document.removeEventListener('click', this.handleClickOutsideforDropdown);


  }
};
</script>


<style scoped>
.router-link {
  all: unset;
  display: block;
  width: 100%;
}

.test {
  padding: 20px;
}


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
  height: 40px;
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
  touch-action: manipulation;
  display: flex;
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



.logo {
  height: 65px;
  cursor: pointer;
}




.sticky-header {
  position: fixed;
  top: var(--header-top);
  left: 0;
  right: 0;
  z-index: 1000;
  min-height: 60px;
  background: #fff;
}

.sticky-header.header-scrolled {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  width: 100%;
  flex-direction: column;
  background-blend-mode: multiply;
}

.desktop-header {
  display: flex;
  align-items: center;
  left: 0;
  right: 0;
  justify-content: space-between;
  width: 100%;
  flex-direction: column;
  background-blend-mode: multiply;

}



nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 100px 10px 100px;
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
  top: 120%;
  right: 0;
  padding: 0;
  margin-top: -5px;
  width: 250px;
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
  display: flex;
  width: 100%;
  gap: 5px;
  align-items: center;
  font-size: 16px;
  padding: 10px 6px;
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

.search-desktop {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  margin: auto;
  position: relative;

}

.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  max-width: 350px;
  margin: auto;
  background: #fff;
  border: 1px solid #929395;
  border-radius: 100px;
  padding: 5px;
  position: relative;
}

.search-container input {
  flex-grow: 1;
  padding: 12px 40px;
  height: 30px;
  font-size: 13px;
  border: none;
  outline: none;
  border-radius: 6px;
  width: 100%;
}

.search-container input::placeholder {
  color: gray;
}

.suggestions-container {
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background: #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
  border-radius: 6px;
  max-height: 250px;
  max-width: 340px;
  width: 100%;
  overflow-y: auto;
  margin: auto;
  z-index: 9;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #888;
  font-size: 13px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.suggestion-item span {
  gap: 0;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
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



.srchbtn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 8px;
  height: 40px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  color: gray;
  position: absolute;
}


.srchbtn {
  left: 10px;
}



.search-container-mobile {
  display: none;
}



@media (max-width: 768px) {
  .small-sections-wrapper {
    display: none;
  }

  nav {
    flex: none;
    padding: 0;
  }

  .search-container-mobile {
    position: relative;
    width: 100%;
    margin: auto;
    height: 30px;
    display: flex;
    justify-content: space-between;

  }

  .searchname-mobile {
    width: 90%;
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

  .suggestions-container {
    top: 140%;
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

  .suggestions-container {
    max-width: 300px;

  }
}
</style>