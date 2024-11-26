<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
      </div>

      <!-- Social Media -->
      <div class="footer-section">
        <h4>Follow Us</h4>
        <div class="social-icons">
          <a href="#"><i class="fab fa-facebook-f"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-linkedin-in"></i></a>
        </div>
      </div>

      <!-- Company Info -->
      <div class="footer-section">
        <h4>Contact</h4>
        <p>Email: info@company.com</p>
        <p>Phone: +123 456 789</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 Company Name. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent",
};
</script>

<style scoped>
.footer {
  width: 100%;
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  text-align: center;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}
.footer-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 20px;
}

.footer-section {
  margin: 10px;
  min-width: 200px;
}

.footer-section h4 {
  margin-bottom: 10px;
  font-size: 1.2em;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin: 5px 0;
}

.footer-section ul li a {
  color: #ddd;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #fff;
}

.social-icons a {
  color: #ddd;
  margin: 0 10px;
  font-size: 1.2em;
  transition: color 0.3s;
}

.social-icons a:hover {
  color: #fff;
}

.footer-bottom {
  border-top: 1px solid #444;
  padding-top: 10px;
  font-size: 0.9em;
}
</style>
