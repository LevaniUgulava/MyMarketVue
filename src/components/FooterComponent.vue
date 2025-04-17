<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-columns">
        <!-- Column for "Company" section -->
        <div class="column">
          <h4>კომპანია</h4>
          <ul>
            <li><router-link to="/docs#privacy-policy">ჩვენს შესახებ</router-link></li>
            <li><router-link to="/terms">წესები და პირობები</router-link></li>
            <li><router-link to="/privacy-policy">პირადი მონაცემების პოლიტიკა</router-link></li>
            <li><router-link to="/returns">დაბრუნების პოლიტიკა</router-link></li>
          </ul>
        </div>

        <!-- Column for "Contact" section -->
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

        <!-- Column for "New Offers" section -->
        <div class="column">
          <h4>ახალი შეთავაზებეი</h4>
          <ul>
            <li><router-link to="/returns">დაბრუნების პოლიტიკა</router-link></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Footer bottom section -->
    <div class="footer-bottom">
      <p>&copy; 2024 YourStore. Powered by Webflow</p>
      <div class="links">
        <a href="#">კონფიდენციალურობის პოლიტიკა</a>
        <a href="#">პირადი მონაცემების პოლიტიკა</a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent",
  data() {
    return {
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
};
</script>

<style scoped>
.footer {
  background-color: #f9f9f9;
  padding: 40px 20px 20px;
  font-family: 'Inter', sans-serif;
  color: #6b6b6b;
}

.container {
  max-width: 1350px;
  margin: auto;
}

.footer-columns {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
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

.payment-methods .icons {
  display: flex;
  gap: 20px;
}

.payment-methods .icons img {
  width: 40px;
}

.footer-bottom {
  border-top: 1px solid #ddd;
  margin-top: 30px;
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 0.9rem;
}

.footer-bottom .links a {
  margin-left: 20px;
}

.footer-bottom .links a:hover {
  color: #000;
}

.column-1 {
  padding: 20px;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  /* Space between title and items */
}

.flex {
  display: flex;
  flex-wrap: wrap;
  /* Allow wrapping */
  gap: 20px;
  /* Space between items */
}

.sec {
  width: calc(33.33% - 20px);
  /* 3 items per row */
  margin-bottom: 20px;
  /* Space between rows */
}

.sec ul {
  padding: 0;
  list-style: none;
}

.sec ul li {
  margin: 5px 0;
}

@media (max-width: 768px) {
  .sec {
    width: calc(50% - 20px);
    /* 2 items per row for smaller screens */
  }
}

@media (max-width: 480px) {
  .sec {
    width: 100%;
    /* 1 item per row for very small screens */
  }
}

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
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .payment-methods .icons {
    justify-content: center;
  }
}
</style>
