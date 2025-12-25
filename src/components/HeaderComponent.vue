<template>

  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  </head>
  <div @mouseenter="mouseenter = true" @mouseleave="mouseenter = false" ref="stickyHeader"
    :class="['sticky-header', isMobile ? 'mobile-header' : 'desktop-header']">

    <nav :class="{ center: opensearch }">
      <div v-show="!opensearch" class="menu">
        <div class="btnredirect">
          <button @pointerdown="opensection = !opensection"
            :class="['redirect-button', isShowed ? 'btn-scrolled' : '', activePopups.aboutus || activePopups.address ? 'blur' : '']">
            <svg v-if="!opensection" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960"
              width="30px" fill="currentcolor">
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px"
              fill="currentcolor">
              <path
                d="M256-227.69 227.69-256l224-224-224-224L256-732.31l224 224 224-224L732.31-704l-224 224 224 224L704-227.69l-224-224-224 224Z" />
            </svg>
          </button>
        </div>
        <div class="modals" v-if="!opensection">
          <div v-for="item in buttons" :key="item.key" class="btnredirect" @mouseenter="showPopup(item.key)"
            @mouseleave="hidePopup(item.key)">
            <div :class="[
              'redirect-button',
              isShowed ? 'btn-scrolled' : '',
              activePopups[item.key] ? 'active' : '',
              otherActive(item.key) ? 'blur' : ''
            ]">
              <span class="link-text">{{ item.label }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                fill="currentcolor">
                <path d="M480-371.69 267.69-584 296-612.31l184 184 184-184L692.31-584 480-371.69Z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="btnredirect" v-if="!opensection">
          <router-link :to="{ path: `/favorites` }"
            :class="['redirect-button hover', isShowed ? 'btn-scrolled' : '', activePopups.aboutus || activePopups.address ? 'blur' : '']">
            <span class="link-text">კონტაქტი</span>
          </router-link>
        </div>
      </div>


      <div :class="['logo', isShowed ? 'btn-scrolled' : '']" @pointerdown="redirect">
        Afftelie
      </div>

      <div class="closesearch" v-if="opensearch">
        <button @pointerdown="opensearch = false" class="close-btn">

          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px"
            fill="currentcolor">
            <path
              d="M256-227.69 227.69-256l224-224-224-224L256-732.31l224 224 224-224L732.31-704l-224 224 224 224L704-227.69l-224-224-224 224Z" />
          </svg>

        </button>
      </div>

      <div class="utilities" v-show="!opensearch">
        <div class="btnredirect">
          <button @pointerdown="opensearch = !opensearch" :class="['redirect-button', isShowed ? 'btn-scrolled' : '']">

            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px"
              fill="currentcolor">
              <path
                d="M779.38-153.85 528.92-404.31q-30 25.54-69 39.54t-78.38 14q-96.1 0-162.67-66.53-66.56-66.53-66.56-162.57 0-96.05 66.53-162.71 66.53-66.65 162.57-66.65 96.05 0 162.71 66.56Q610.77-676.1 610.77-580q0 41.69-14.77 80.69t-38.77 66.69l250.46 250.47-28.31 28.3ZM381.54-390.77q79.61 0 134.42-54.81 54.81-54.8 54.81-134.42 0-79.62-54.81-134.42-54.81-54.81-134.42-54.81-79.62 0-134.42 54.81-54.81 54.8-54.81 134.42 0 79.62 54.81 134.42 54.8 54.81 134.42 54.81Z" />
            </svg>

          </button>
        </div>
        <div class="btnredirect">
          <router-link :to="{ path: `/favorites` }" :class="['redirect-button', isShowed ? 'btn-scrolled' : '']">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
              fill="currentcolor">
              <path
                d="m480-173.85-30.31-27.38q-97.92-89.46-162-153.15-64.07-63.7-101.15-112.35-37.08-48.65-51.81-88.04Q120-594.15 120-634q0-76.31 51.85-128.15Q223.69-814 300-814q52.77 0 99 27t81 78.54Q514.77-760 561-787q46.23-27 99-27 76.31 0 128.15 51.85Q840-710.31 840-634q0 39.85-14.73 79.23-14.73 39.39-51.81 88.04-37.08 48.65-100.77 112.35Q609-290.69 510.31-201.23L480-173.85Zm0-54.15q96-86.77 158-148.65 62-61.89 98-107.39t50-80.61q14-35.12 14-69.35 0-60-40-100t-100-40q-47.77 0-88.15 27.27-40.39 27.27-72.31 82.11h-39.08q-32.69-55.61-72.69-82.5Q347.77-774 300-774q-59.23 0-99.62 40Q160-694 160-634q0 34.23 14 69.35 14 35.11 50 80.61t98 107q62 61.5 158 149.04Zm0-273Z" />
            </svg>
          </router-link>
        </div>


        <div class="btnredirect">
          <div :class="['redirect-button', isShowed ? 'btn-scrolled' : '']" @click="cartmodal = !cartmodal">

            <svg class="icon" aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24"
              fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.9984 5C13.9984 4.46957 13.7877 3.96086 13.4126 3.58579C13.0375 3.21071 12.5288 3 11.9984 3C11.4679 3 10.9592 3.21071 10.5842 3.58579C10.2091 3.96086 9.99836 4.46957 9.99836 5M19.2584 9.696L20.6434 18.696C20.6872 18.9808 20.6689 19.2718 20.5898 19.5489C20.5107 19.8261 20.3726 20.0828 20.1851 20.3016C19.9975 20.5204 19.7649 20.6961 19.5031 20.8167C19.2413 20.9372 18.9566 20.9997 18.6684 21H5.32836C5.04 21 4.75503 20.9377 4.49301 20.8173C4.23098 20.6969 3.99809 20.5212 3.81031 20.3024C3.62253 20.0836 3.48429 19.8267 3.40507 19.5494C3.32585 19.2721 3.30753 18.981 3.35136 18.696L4.73636 9.696C4.80901 9.22359 5.04844 8.79282 5.41129 8.4817C5.77413 8.17059 6.2364 7.9997 6.71436 8H17.2824C17.7602 7.99994 18.2222 8.17094 18.5848 8.48203C18.9475 8.79312 19.1857 9.22376 19.2584 9.696Z"
                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
        </div>

        <div class="btnredirect">
          <button @pointerdown="isAuthenticated ? toggleDropdown() : openmodal('loginmodal')"
            :class="['redirect-button', isShowed ? 'btn-scrolled' : '']">

            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px"
              fill="currentcolor">
              <path
                d="M247.85-260.62q51-36.69 108.23-58.03Q413.31-340 480-340t123.92 21.35q57.23 21.34 108.23 58.03 39.62-41 63.73-96.84Q800-413.31 800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 66.69 24.12 122.54 24.11 55.84 63.73 96.84ZM480.02-460q-50.56 0-85.29-34.71Q360-529.42 360-579.98q0-50.56 34.71-85.29Q429.42-700 479.98-700q50.56 0 85.29 34.71Q600-630.58 600-580.02q0 50.56-34.71 85.29Q530.58-460 480.02-460ZM480-120q-75.31 0-141-28.04t-114.31-76.65Q176.08-273.31 148.04-339 120-404.69 120-480t28.04-141q28.04-65.69 76.65-114.31 48.62-48.61 114.31-76.65Q404.69-840 480-840t141 28.04q65.69 28.04 114.31 76.65 48.61 48.62 76.65 114.31Q840-555.31 840-480t-28.04 141q-28.04 65.69-76.65 114.31-48.62 48.61-114.31 76.65Q555.31-120 480-120Zm0-40q55.31 0 108.85-19.35 53.53-19.34 92.53-52.96-39-31.31-90.23-49.5Q539.92-300 480-300q-59.92 0-111.54 17.81-51.61 17.81-89.84 49.88 39 33.62 92.53 52.96Q424.69-160 480-160Zm0-340q33.69 0 56.85-23.15Q560-546.31 560-580t-23.15-56.85Q513.69-660 480-660t-56.85 23.15Q400-613.69 400-580t23.15 56.85Q446.31-500 480-500Zm0-80Zm0 350Z" />
            </svg>
          </button>
        </div>
      </div>
      <div>


      </div>

    </nav>

    <SmallSections :open="opensection" />
    <SearchComponent v-if="opensearch" :open="opensearch" @close="opensearch = false" />



    <transition name="slide-fade">
      <div @mouseenter="cancelHide('aboutus')" @mouseleave="hidePopup('aboutus')" v-show="activePopups.aboutus"
        class="popup-message aboutus">
        <RouterLink class="link">გამოყენების პირობები</RouterLink>
        <RouterLink class="link">კონფიდეციალურობა</RouterLink>
        <RouterLink class="link">გამოყენების პირობები</RouterLink>
      </div>
    </transition>
    <transition name="slide-fade">
      <div @mouseenter="cancelHide('address')" @mouseleave="hidePopup('address')" v-show="activePopups.address"
        class="popup-message addresmodal">
        <AddressComponent />
      </div>
    </transition>
    <transition name="slide-fade">
      <div v-if="isOpendropdown" class="popup-message profile-dropdown">
        <router-link class="router-link" to="/profile/info" @click="isOpendropdown = false">
          <li> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
              fill="currentcolor">
              <path
                d="M480-492.31q-57.75 0-98.87-41.12Q340-574.56 340-632.31q0-57.75 41.13-98.87 41.12-41.13 98.87-41.13 57.75 0 98.87 41.13Q620-690.06 620-632.31q0 57.75-41.13 98.88-41.12 41.12-98.87 41.12ZM180-187.69v-88.93q0-29.38 15.96-54.42 15.96-25.04 42.66-38.5 59.3-29.07 119.65-43.61 60.35-14.54 121.73-14.54t121.73 14.54q60.35 14.54 119.65 43.61 26.7 13.46 42.66 38.5Q780-306 780-276.62v88.93H180Zm60-60h480v-28.93q0-12.15-7.04-22.5-7.04-10.34-19.11-16.88-51.7-25.46-105.42-38.58Q534.7-367.69 480-367.69q-54.7 0-108.43 13.11-53.72 13.12-105.42 38.58-12.07 6.54-19.11 16.88-7.04 10.35-7.04 22.5v28.93Zm240-304.62q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0-80Zm0 384.62Z" />
            </svg>პირადი ინფორმაცია</li>
        </router-link>
        <router-link @click="isOpendropdown = false" class="router-link"
          :to="{ path: `/profile/orders`, query: { section: 'pending' } }" active-class="active-link">
          <li> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
              fill="currentcolor">
              <path
                d="M180-180v-476l-74.15-162.31 54.3-25.53L245.69-658h468.62l85.54-185.84 54.3 25.53L780-656v476H180Zm220-270h160q12.75 0 21.37-8.63 8.63-8.63 8.63-21.38 0-12.76-8.63-21.37Q572.75-510 560-510H400q-12.75 0-21.37 8.63-8.63 8.63-8.63 21.38 0 12.76 8.63 21.37Q387.25-450 400-450ZM240-240h480v-358H240v358Zm0 0v-358 358Z" />
            </svg>შეკვეთები</li>
        </router-link>
        <router-link @click="isOpendropdown = false" class="router-link" to="/profile/status">
          <li> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
              fill="currentcolor">
              <path
                d="m392-420.46 33.08-108.62-87-67.07h108.23L480-704.31l33.69 108.16h108.23l-87.61 67.07 33.07 108.62L480-488l-88 67.54ZM260-70.77v-286.31q-38-39.69-59-91.77-21-52.07-21-111.15 0-125.54 87.23-212.77T480-860q125.54 0 212.77 87.23T780-560q0 59.08-21 111.15-21 52.08-59 91.77v286.31l-220-70-220 70ZM480-320q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70ZM320-158.62l160-42.92 160 42.92v-148.61q-34.23 22.31-74.92 34.77Q524.38-260 480-260q-44.38 0-85.08-12.46-40.69-12.46-74.92-34.77v148.61Zm160-74.3Z" />
            </svg> სტატუსი</li>
        </router-link>


        <router-link @click="isOpendropdown = false" class="router-link" to="/profile/reset">

          <li> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
              fill="currentcolor">
              <path
                d="M280-415.39q-26.85 0-45.73-18.88-18.88-18.88-18.88-45.73 0-26.85 18.88-45.73 18.88-18.88 45.73-18.88 26.85 0 45.73 18.88 18.88 18.88 18.88 45.73 0 26.85-18.88 45.73-18.88 18.88-45.73 18.88ZM280-260q-91.54 0-155.77-64.23T60-480q0-91.54 64.23-155.77T280-700q64.31 0 116.31 33.19 52 33.2 79.38 86.81h360.08l100 100-153.85 153.07-74.23-55.76-76.15 56.53L553.46-380h-77.77q-27.38 53.23-79.38 86.61Q344.31-260 280-260Zm0-60q57.54 0 99.65-34.77 42.12-34.77 54.97-85.23h137.69l57.61 39.85 78.16-57.16L776-405.38 850.62-480l-40-40h-376q-12.85-50.46-54.97-85.23Q337.54-640 280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Z" />
            </svg> პაროლის შეცვლა</li>
        </router-link>

        <li @pointerdown="logout"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
            width="24px" fill="currentcolor">
            <path
              d="M212.31-140Q182-140 161-161q-21-21-21-51.31v-142.3h60v142.3q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h535.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-535.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v142.3h-60v-142.3Q140-778 161-799q21-21 51.31-21h535.38Q778-820 799-799q21 21 21 51.31v535.38Q820-182 799-161q-21 21-51.31 21H212.31Zm214.61-161.54-42.15-43.38L489.85-450H140v-60h349.85L384.77-615.08l42.15-43.38L605.38-480 426.92-301.54Z" />
          </svg> გასვლა</li>
      </div>
    </transition>


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

    <CartModal :open="cartmodal" @close="cartmodal = false" />

    <MobileSidebarModal :open="openMobile" @close="openMobile = false" />
  </div>
</template>

<script>
import LoginComponent from './LoginComponent.vue';
import RegisterComponent from './RegisterComponent.vue';
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
import ForgetPassword from '@/views/Password/ForgetPassword.vue';
import EmailConfirmation from '@/views/Password/EmailConfirmation.vue';
import PasswordComponent from '@/views/Password/PasswordComponent.vue';
import { Capacitor } from '@capacitor/core';
import MobileSidebarModal from './MobileSidebarModal.vue';
import SmallSections from './Status/SmallSections.vue';
import SearchComponent from './SearchComponent.vue';
import AddressComponent from './profile/Components/AddressComponent.vue';
import CartModal from './Modal/CartModal.vue';


export default {

  name: 'HeaderComponent',
  components: {
    LoginComponent,
    RegisterComponent,
    ForgetPassword,
    EmailConfirmation,
    PasswordComponent,
    MobileSidebarModal,
    SmallSections,
    AddressComponent,
    SearchComponent,
    CartModal
  },
  props: {
    isMobile: Boolean,

  },
  data() {
    return {
      isOpen: false,
      cartmodal: false,
      isOpendropdown: false,
      isInputVisible: false,
      searchname: '',
      selectedmainCategory: "",
      openMobile: false,
      selectedCategory: '',
      selectedsubCategory: '',
      isScrolled: false,
      Searchnames: [],
      SuggestionNames: [],
      emitmin: '',
      emitmax: '',
      opensection: false,
      opensearch: false,
      mouseenter: false,
      activePopups: {
        aboutus: false,
        address: false
      },
      hideTimeouts: {},
      buttons: [
        { key: 'aboutus', label: 'ჩვენს შესახებ' },
        { key: 'address', label: 'მისამართები' }
      ],



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
    isAnyModalOpen() {
      return (
        this.loginmodal ||
        this.registermodal ||
        this.forgetmodal ||
        this.confirmmodal ||
        this.passwordmmodal
      );
    },
    isShowed() {
      if (this.$route.path !== '/') {
        return true;
      }
      return this.isScrolled || this.opensection || this.opensearch || this.mouseenter || this.isOpendropdown || this.isAnyModalOpen || this.activePopups.address || this.activePopups.aboutus
    }
  },
  mounted() {
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

    loginmodal: 'handleScroll',
    opensection: 'handleScroll',
    opensearch: 'handleScroll',
    passwordmmodal: 'handleScroll',
    registermodal: 'handleScroll',
    forgetmodal: 'handleScroll',
    confirmmodal: 'handleScroll',
    openMobile: 'handleScroll',

    name(newValue) {
      localStorage.setItem("name", newValue);
    }
  },

  methods: {
    handleScroll(newVal) {
      this.noscroll(newVal);
    },
    showPopup(key) {
      Object.keys(this.hideTimeouts).forEach(k => clearTimeout(this.hideTimeouts[k]));

      Object.keys(this.activePopups).forEach(k => {
        if (k !== key) this.activePopups[k] = false;
      });

      this.activePopups[key] = true;

    },
    hidePopup(key) {
      this.hideTimeouts[key] = setTimeout(() => {
        this.activePopups[key] = false;
      }, 200);
    },
    cancelHide(key) {
      clearTimeout(this.hideTimeouts[key]);
    },
    otherActive(currentKey) {
      return Object.keys(this.activePopups).some(k => k !== currentKey && this.activePopups[k]);
    },
    openMobileModal() {
      this.openMobile = !this.openMobile
    },
    logout() {
      this.logoutAction();
      this.$router.push('/');

    },
    ...mapMutations('modals', ['openmodal', 'closemodal', 'setdata']),
    checkScroll() {
      const maxTop = 40;
      const scrollY = window.scrollY || 0;

      if (scrollY > 0) {
        this.isScrolled = true;
        this.$refs.stickyHeader.style.setProperty('--header-top', `0px`);
      } else {
        this.isScrolled = false;
        this.$refs.stickyHeader.style.setProperty('--header-top', `${maxTop}px`); // დაბრუნება
      }
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

    toggleDropdown() {
      this.isOpendropdown = !this.isOpendropdown;
    },
    ...mapActions("auth", {
      logoutAction: 'logout',
    }),


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




  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('scroll', this.checkScroll);
    document.removeEventListener('click', this.handleClickOutsideforDropdown);


  }
};
</script>


<style scoped>
.popup-message {
  position: absolute;
  top: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 200px;
  transform: translateX(-50%) translateY(0);
  background-color: #fff;
  border: 1px solid #eaeaea;
  padding: 8px;
  white-space: nowrap;
  z-index: 10;
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(0px);
}

.slide-fade-enter-to {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.slide-fade-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(0px);
}

.ul {
  padding: 10px;
  line-height: 2;
}

.ul li {
  list-style: none;
  margin: 0;
  padding: 0;
}



.aboutus {
  left: 16%;
}

.addresmodal {
  left: 26%;

}

.link {
  display: flex;
  font-size: 13px;
  padding: 10px;
  text-decoration: none;
  color: black;
  justify-content: start;
}

.menu {
  display: flex;
  flex: 0 1 39%;
  column-gap: 20px;

}

.logo {
  display: flex;
  flex: 0 1 22%;
  justify-content: center;
  color: black;
  align-items: center;
  transition: all 0.3s ease-in-out;


}

.utilities {
  display: flex;
  flex: 0 1 39%;
  gap: 5px;
  justify-content: end;

}

.closesearch {
  position: absolute;
  right: 100px;
}

.close-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;

}

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

:global(body.no-scroll) {
  overflow: hidden;
}


.redirects {
  display: flex;
  gap: 20px;
  align-items: center;

}


.btnredirect {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  transition: all 0.3s ease-in-out;

  padding: 10px;

}

.modals {
  display: flex;
}

.hover::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  height: 2px;
  width: 0;
  background: #000;
  transition: width .22s ease;
}

.hover:hover::after {
  width: 65%;
}

.redirect-button::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  height: 2px;
  width: 0;
  background: #000;
  transition: width .22s ease;
}

.redirect-button.active::after {
  width: 65%;
}

.redirect-button.active {
  position: relative;
}

.badge {
  position: absolute;
  top: -6px;
  left: 30px;
  width: 15px;
  height: 15px;
  background-color: red;
  color: white;
  font-size: 10px !important;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

.redirect-button {
  touch-action: manipulation;
  position: relative;
  display: flex;
  align-items: center;
  color: black;

  background: transparent;
  border: none;
  justify-content: center;
  font-size: 14px;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  text-align: center;
}

.blur {
  color: #757575;
  filter: blur(1px);
}


.redirect-button span {
  font-size: 12px;
}


.login {
  display: flex;
  padding: 13px 25px;
  background-color: transparent;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  gap: 10px;
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







.sticky-header {
  position: fixed;
  top: var(--header-top);
  left: 0;
  right: 0;
  z-index: 1000;
  min-height: 60px;
  transition: all 0.3s ease-in-out;
  background-color: #ffffff;
  border-bottom: 1px solid #e9e9e9;
  transition: all 0.3s ease-in-out;
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
  padding: 15px 64px;

  flex: 1;
}

.center {
  justify-content: center;
  min-height: 80px;


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



.profile-dropdown {
  right: -2%;

}

.profile-dropdown li {
  cursor: pointer;
  display: flex;
  width: 100%;
  gap: 5px;
  align-items: center;
  font-size: 13px;
  padding: 5px;
  box-sizing: border-box;
  transition: background-color 0.2s ease;
}

.profile-dropdown li:hover {
  background-color: #7a1dff1a;
  border-radius: 10px;
}



@media (max-width: 768px) {
  .small-sections-wrapper {
    display: none;
  }

  nav {
    flex: none;
    padding: 0;
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


  .suggestions-container {
    top: 140%;
  }

  .search-container input {
    width: 100%;
    margin: 2px;
    text-indent: 25px;

  }

  .srchbtn {
    left: 5px;
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