<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-columns">
        <div class="column">
          <h4>Company</h4>
          <ul>
            <li><router-link to="/about">About Us</router-link></li>
            <li><router-link to="/press">Press</router-link></li>
            <li><router-link to="/support">Support</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>
        <div class="column">
          <h4>Resources</h4>
          <ul>
            <li><router-link to="/learning-centre">Learning Centre</router-link></li>
            <li><router-link to="/promotion">Promotion</router-link></li>
            <li><router-link to="/inspiration">Inspiration</router-link></li>
            <li><router-link to="/videos">Videos</router-link></li>
            <li><router-link to="/submit">Submit</router-link></li>
          </ul>
        </div>
        <div class="column">
          <h4>Store</h4>
          <ul>
            <li><router-link to="/store">View the Store</router-link></li>
            <li><router-link to="/forest-ui">Forest UI Kit</router-link></li>
            <li><router-link to="/otto-template">Otto Template</router-link></li>
          </ul>
        </div>
        <div class="column socials">
          <h4>Follow our Socials</h4>
          <div class="icons">
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-webflow"></i></a>
            <a href="#"><i class="fab fa-discord"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Flowbase. Powered by Webflow</p>
        <div class="links">
          <a href="#">Privacy Policy</a>
          <a href="#">Affiliate Notice</a>
          <a href="#">Press Kit</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FlowbaseFooter",
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
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 0.9rem;
}

.footer-bottom .links a {
  margin-left: 20px;
  text-decoration: none;
  color: #6b6b6b;
}

.footer-bottom .links a:hover {
  color: #000;
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
}
</style>
