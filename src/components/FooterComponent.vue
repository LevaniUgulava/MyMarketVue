<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Left side -->
      <div class="footer-left">
        <div class="footer-title">გამოიწერეთ ჩვენი სიახლეები</div>
        <p class="footer-desc">
          იყავით პირველი, ვინც შეიტყობს ახალ კოლექციებს და ექსკლუზიურ შეთავაზებებს.
        </p>

        <form class="footer-subscribe">
          <input type="email" v-model="email" placeholder="ელფოსტა" required />
          <button @click.prevent="subscription" v-if="isShown">

            <svg v-if="!loading && status === null" xmlns="http://www.w3.org/2000/svg" height="24px"
              viewBox="0 -960 960 960" width="24px" fill="currentcolor">
              <path d="m556-258-38-39 158-158H180v-54h496L518-667l38-39 224 224-224 224Z" />
            </svg>
            <div v-else-if="loading" class="spinner"></div>

            <div v-else-if="!loading && status === 'exist'" class="message">
              <div class="popup-message">
                {{ Message }}
                <div class="arrow-down"></div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                fill="#F19E39">
                <path
                  d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
            </div>
            <div v-else-if="!loading && status === 'success'" class="message">
              <div class="popup-message">
                {{ Message }}
                <div class="arrow-down"></div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                fill="#9DC384">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
              </svg>
            </div>
            <div v-else-if="!loading && status === 'error'" class="message">
              <div class="popup-message">
                {{ Message }}
                <div class="arrow-down"></div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                fill="#EA3323">
                <path
                  d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </div>

          </button>
        </form>
        <div class="pay-term">
          <div class="footer-terms">
            გამოწერით თქვენ ეთანხმებით ჩვენი
            <a href="/docs/service-terms">გამოყენების პირობებს</a> და
            <a href="/docs/privacy-policy">კონფიდენციალურობის პოლიტიკას</a>.
          </div>

          <div class="footer-payments">

            <svg class="icon icon--full-color" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img"
              width="38" height="24" aria-labelledby="pi-visa">
              <title id="pi-visa">Visa</title>
              <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z">
              </path>
              <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
              <path
                d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                fill="#142688"></path>
            </svg>

            <svg class="icon icon--full-color" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img"
              width="38" height="24" aria-labelledby="pi-master">
              <title id="pi-master">Mastercard</title>
              <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z">
              </path>
              <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
              <circle fill="#EB001B" cx="15" cy="12" r="7"></circle>
              <circle fill="#F79E1B" cx="23" cy="12" r="7"></circle>
              <path fill="#FF5F00"
                d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"></path>
            </svg>

            <svg width="38" height="24" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img"
              aria-label="American Express">
              <defs>
                <linearGradient id="amexGradient" x1="0" y1="0" x2="38" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#2E77BB" />
                  <stop offset="100%" stop-color="#1A54A5" />
                </linearGradient>
              </defs>
              <rect width="38" height="24" rx="4" fill="url(#amexGradient)" />
              <rect width="38" height="24" rx="4" stroke="#E5E7EB" stroke-width="0.5" fill="none" />

              <text x="50%" y="56%" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="7" fill="none"
                stroke="white" stroke-width="0.6" font-weight="900" letter-spacing="0.5">
                AMEX
              </text>
            </svg>


          </div>
        </div>
      </div>



      <div class="footer-copy">
        <div class="footer-social">
          <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
        </div>
        <div>
          © 2025 onStore
        </div>
      </div>
    </div>
  </footer>

</template>

<script>
import api from '@/api';


export default {
  name: "FooterComponent",
  data() {
    return {
      email: '',
      loading: false,
      status: null,
      Message: '',
    }
  },
  watch: {
    email() {
      this.checkValidation()
    },
    loading() {
      setTimeout(() => {
        this.status = null
        this.Message = ''
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
          this.Message = "გმადლობთ გამოწერისთვის"
          this.status = 'success'
        }

      } catch (error) {
        if (error.response.status === 409) {
          this.Message = "ელ.ფოსტა ამ მისამართზე უკვე არსებობს"
          this.status = "exist"
        } else {
          this.Message = "დაფიქსირდა შეცდომა"
          this.status = "error"
        }
      } finally {
        this.loading = false;
      }

    }
  },

};
</script>

<style scoped>
.footer {
  background: #ffffff;
  color: #0b193a;
  font-family: "Noto Sans Georgian", sans-serif;
  border-top: 1px solid #eaeaea;
}

.footer-container {
  margin: 20px;
}

.footer-title {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 14px;
  width: fit-content;
  color: #0b193a;
}

.footer-desc {
  font-size: 14px;
  color: #4b5563;
  width: fit-content;
  margin-bottom: 20px;
  line-height: 1.6;
}

.footer-subscribe {
  display: flex;
  align-items: center;
  background: #f7f7f8;
  border-radius: 40px;
  width: 100%;
  max-width: 480px;
  transition: box-shadow 0.2s ease;
}

.message {
  position: relative;
}

.popup-message {
  position: absolute;
  bottom: 130%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  color: #333;
  border: 1px solid #d1d1d1;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 13px;
  white-space: nowrap;
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


.footer-subscribe:focus-within {
  box-shadow: 0 0 0 2px rgba(25, 60, 110, 0.15);
}

.footer-subscribe input {
  position: relative;

  flex: 1;
  padding: 15px 22px;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
  color: #111827;
}

.footer-subscribe button {
  background: transparent;
  border: none;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1c284d;
  cursor: pointer;
  transition: color 0.25s;
}

.footer-subscribe button:hover {
  color: #334173;
}

.footer-terms {
  font-size: 13px;
  color: #6b7280;
  margin-top: 18px;
  width: fit-content;
}

.pay-term {
  display: flex;
  justify-content: space-between;
}

.footer-terms a {
  color: #1c284d;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.25s;
}

.footer-terms a:hover {
  color: #334173;
}

.spinner {
  width: 20px;
  height: 20px;
  border: none;
  border-top: 2px solid #3498db;
  border-radius: 70%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}


.footer-bottom {
  display: flex;
  justify-content: end;
  align-items: center;
  margin-top: 70px;
  flex-wrap: wrap;
  gap: 20px;
}




.footer-social a {
  margin-left: 18px;
  font-size: 20px;
  color: #1c284d;
  transition: color 0.25s, transform 0.25s;
}

.footer-social a:hover {
  color: #3b5998;
  transform: translateY(-2px);
}

.footer-payments {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-payments img {
  height: 26px;
  filter: grayscale(100%) brightness(90%);
  transition: filter 0.3s ease;
}

.footer-payments img:hover {
  filter: grayscale(0%) brightness(100%);
}


.footer-copy {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
  color: #9ca3af;
  border-top: 1px solid #f1f1f3;
  position: relative;
  padding: 20px;
}

.footer-social {
  position: absolute;
  left: 20px;
}

.footer-copy div:last-child {
  text-align: center;
  font-size: 14px;
  flex: 1;
}

@media (max-width: 768px) {
  .footer {
    padding: 60px 7% 30px;
  }

  .footer-title {
    font-size: 32px;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 30px;
  }

  .footer-right {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .footer-payments img {
    height: 22px;
  }
}
</style>
