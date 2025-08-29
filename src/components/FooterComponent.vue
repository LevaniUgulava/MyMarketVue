<template>
  <div class="footer">
    <div class="contact-container">
      <div class="contact">
        <div class="logo">
          logo
          <span>შეიყვანეთ მეილი სიახლეებისთის</span>
        </div>
        <div class="input">

          <input type="email" v-model="email" placeholder="შეიყვანეთ ელ.ფოსტა">
          <span class="mail-icon">
            <img src="../assets/svg/mail.svg">
          </span>
          <button v-if="isShown" class="srchbtn" @pointerdown="subscription">
            <img src="../assets/svg/keyboard-arrow-right.svg">
          </button>
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
    }
  },

  methods: {
    checkValidation() {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(this.email)) {
        this.isShown = false;
      } else {
        this.isShown = true;
      }
    },
    async subscription() {
      try {
        const res = await api.post('/subscribe', {
          email: this.email
        });
        this.email = '';
        console.log(res);

      } catch (err) {
        console.log(err.message);
      }

    }
  },
};
</script>

<style scoped>
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
  gap: 10px;
}

.logo span {
  font-size: 16px;
}

.mail-icon,
.srchbtn {
  width: 40px;
  height: 50px;
  position: absolute;
  bottom: 0;
}

.mail-icon {
  left: 15px;
}

.srchbtn {
  display: flex;
  align-items: center;
  border: none;
  cursor: pointer;
  right: 0;
  font-size: 14px;
  padding: 8px;
  background-color: rgb(231, 237, 243);
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  color: gray;
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
</style>
