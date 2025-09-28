<template>
  <div class="footer">
    <div class="contact-container">
      <div class="contact">
        <div class="logo">
          <span>შეიყვანეთ მეილი სიახლეებისთის</span>
        </div>
        <div class="input">

          <input type="email" v-model="email" placeholder="შეიყვანეთ ელ.ფოსტა">
          <span class="mail-icon">
            <img src="../assets/svg/mail.svg">
          </span>
          <div class="btn">
            <span v-if="loading" class="spinner" aria-hidden="true"></span>

            <div class="div" v-else-if="status === 'success' && !loading">
              <div v-if="showTooltip" class="popup-message">
                {{ Message }}
                <div class="arrow-down"></div>
              </div>
              <svg @pointerdown="clear" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false"
                xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#48752C">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
              </svg>

            </div>

            <div class="div" v-else-if="status === 'error' && !loading">
              <div v-if="showTooltip" class="popup-message">
                {{ Message }}
                <div class="arrow-down"></div>
              </div>
              <svg @pointerdown="clear" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false"
                xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#EA3323">
                <path
                  d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </div>
            <div class="div" v-else-if="status === 'exist' && !loading">
              <div v-if="showTooltip" class="popup-message">
                {{ Message }}
                <div class="arrow-down"></div>
              </div>
              <svg @pointerdown="clear" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false"
                xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#F19E39">
                <path
                  d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
            </div>





            <button class="button" v-else-if="isShown" @pointerdown="subscription"><img
                src="../assets/svg/keyboard-arrow-right.svg"></button>

          </div>
        </div>
      </div>

    </div>
    <div class="container">

      <div class="footer-columns">
        <div class="column">
          <h4>კომპანია</h4>
          <ul>
            <li><router-link to="/docs#privacy-policy">ჩვენს შესახებ</router-link></li>
            <li><router-link to="/terms">წესები და პირობები</router-link></li>
            <li><router-link to="/privacy-policy">პირადი მონაცემების პოლიტიკა</router-link></li>
            <li><router-link to="/returns">დაბრუნების პოლიტიკა</router-link></li>
          </ul>
        </div>

        <div class="column">
          <h4>კონტაქტი:</h4>
          <ul>
            <li>ელფოსტა:</li>
            <li>ნომერი:</li>
            <div class="column socials">
              <div class="icons">
                <a href="#" target="_blank"><i class="fab fa-facebook"></i></a>
                <a href="#" target="_blank"><i class="fab fa-twitter"></i></a>
                <a href="#" target="_blank"><i class="fab fa-instagram"></i></a>
                <a href="#" target="_blank"><i class="fab fa-pinterest"></i></a>
              </div>
            </div>
          </ul>
        </div>

        <div class="column">
          <h4>ახალი შეთავაზებეი</h4>
          <ul>
            <li><router-link to="/returns">დაბრუნების პოლიტიკა</router-link></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2024 YourStore. Powered by Webflow</p>
      <div class="links">
        <p>tbc</p>
        <p>bog</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';


export default {
  name: "FooterComponent",
  data() {
    return {
      email: '',
      isShown: false,
      loading: false,
      status: '',
      showTooltip: false,
      Message: '',
      items: [
        { "id": 1, "url": "bla", "name": "დადდს" },
        { "id": 2, "url": "bla", "name": "დადდს" },
        { "id": 3, "url": "bla", "name": "დადდს" },
        { "id": 4, "url": "bla", "name": "დადდს" },
        { "id": 5, "url": "bla", "name": "დადდს" },
        { "id": 6, "url": "bla", "name": "დადდს" },
        { "id": 7, "url": "bla", "name": "დადდს" },
        { "id": 8, "url": "bla", "name": "დადდს" }
      ],
    }
  },
  watch: {
    email() {
      this.checkValidation()
    },
    loading() {
      setTimeout(() => {
        this.status = ''
      }, 8000);
    }
  },

  methods: {
    clear() {
      this.status = ''
      this.Message = ''
      this.email = ''

    },
    checkValidation() {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(this.email)) {
        this.isShown = false;
      } else {
        this.isShown = true;
      }
    },
    async subscription() {
      this.loading = true
      try {
        const res = await api.post('/sendgrid/addContact', {
          email: this.email,
          source: 'footer',

        });

        if (res.status === 200) {
          this.email = '';
          this.status = 'success'
          this.Message = "ელ.ფოსტა წარმატებით დაემატა"
        }

      } catch (error) {
        if (error.response.status === 409) {
          this.status = "exist"
          this.Message = "ელ.ფოსტა უკვე არსებობს"

        } else {
          this.status = "error"
          this.Message = "ელ.ფოსტა დამატებისას მოხდა შეცდომა"


        }
      } finally {
        this.loading = false;
      }

    }
  },

};
</script>

<style scoped>
.div {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.popup-message {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  color: #333;
  border: 1px solid #d1d1d1;
  border-radius: 6px;
  width: 160px;
  padding: 8px 10px !important;
  font-size: 12px;
  white-space: wrap;
  z-index: 9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.popup-message .arrow-down {
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #d1d1d1;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-right-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.footer,
.footer * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.footer {
  background-color: #f9f9f9;
  font-family: 'Inter', sans-serif;
  color: #6b6b6b;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.contact-container {
  background-color: #7c317c;
}

.contact {
  max-width: 1350px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.input {
  width: 40%;
  position: relative;
}

.input input {
  width: 100%;
  font-size: 13px;
  text-indent: 45px;
  height: 50px;
  border: 1px solid #dbdbdb;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: white;
}

.logo span {
  font-size: 16px;
}

.mail-icon,
.btn,
.button {
  width: 40px;
  height: 50px;
  position: absolute;
  bottom: 0;
}

.mail-icon {
  left: 15px;
}

.button {
  display: flex;
  border: none;
  right: 0;
  cursor: pointer;
  background-color: transparent;
  align-items: center;
  justify-content: center;
}

.btn {
  display: flex;
  align-items: center;
  border: none;
  right: 0;
  font-size: 14px;
  padding: 8px;
  background-color: transparent;
  color: gray;
}

.button:hover {
  background-color: aliceblue;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;

}

.container {
  max-width: 1350px;
  margin: 0 auto;
  padding: 0 20px 20px;
}

.footer-columns {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  margin-top: 40px;
  justify-content: space-between;
}

.column {
  flex: 1 1 180px;
}

.column h4 {
  font-size: 1rem;
  margin-bottom: 10px;
  font-weight: 600;
  color: #2d2d2d;
}

.column ul {
  list-style: none;
  line-height: 2;
  padding: 0;
  margin: 0;
}

.column ul li {
  margin: 6px 0;
  font-size: 13px;
}

.column ul li a {
  color: #6b6b6b;
  text-decoration: none;
  transition: color 0.3s;
}

.column ul li a:hover {
  color: #000;
}

.socials .icons {
  margin-top: 10px;
}

.socials .icons a {
  margin-right: 10px;
  font-size: 1.2rem;
  color: #6b6b6b;
  transition: color 0.3s;
}

.socials .icons a:hover {
  color: #000;
}

.footer-bottom {
  border-top: 1px solid #ddd;
  margin-top: 30px;
  padding: 20px 0;
  width: 95%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 0.9rem;
}

.footer-bottom .links {
  display: flex;
  gap: 20px;
  margin-left: 0;
}

/* responsive */
@media (max-width: 768px) {
  .footer-columns {
    flex-direction: column;
    gap: 20px;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
  }

  .footer-bottom .links {
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media(max-width:767px) {
  .contact {
    flex-direction: column;
    gap: 20px;
  }

  .logo {
    justify-content: center;
  }

  .input {
    width: 100%;
  }
}
</style>
