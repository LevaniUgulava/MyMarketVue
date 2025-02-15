<template>
  <div class="not-found-page">
    <div class="content">
      <div class="error-section">
        <h1>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <router-link :to="`/${currentLanguage}`" class="home-button">
          Return to Homepage
        </router-link>
      </div>
      <div class="animation-section">
        <div class="planet"></div>
        <div class="rocket"></div>
        <div class="star"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentLanguage: localStorage.getItem("selectedLanguage") || "en",
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap");

/* Full-page background setup */
body,
html,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  background: linear-gradient(135deg, #1c1f26, #0a0b0e);
  overflow: hidden;
}

.not-found-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  text-align: center;
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  flex-wrap: wrap;
  gap: 50px;
}

.error-section {
  flex: 1;
  max-width: 600px;
}

.error-section h1 {
  font-size: 6rem;
  font-weight: 600;
  margin: 0;
  color: #ff4757;
  text-shadow: 0px 5px 15px rgba(255, 71, 87, 0.5);
}

.error-section h2 {
  font-size: 2rem;
  font-weight: 400;
  margin: 10px 0;
  color: #f1f2f6;
}

.error-section p {
  font-size: 1.2rem;
  color: #dcdde1;
  margin: 20px 0 40px;
}

.home-button {
  display: inline-block;
  padding: 12px 30px;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(90deg, #ff4757, #ff6b81);
  border: none;
  border-radius: 25px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0px 5px 20px rgba(255, 71, 87, 0.5);
}

.home-button:hover {
  transform: scale(1.1);
  box-shadow: 0px 8px 30px rgba(255, 71, 87, 0.8);
}

.animation-section {
  flex: 1;
  position: relative;
  max-width: 500px;
  height: 300px;
}

.animation-section .planet {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a90e2, #50b5f6);
  animation: rotate 10s infinite linear;
  margin: 0 auto;
}

.animation-section .rocket {
  width: 80px;
  height: 120px;
  background: #ff4757;
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  position: absolute;
  top: 20%;
  right: 20%;
  animation: fly 4s infinite ease-in-out;
}

.animation-section .star {
  width: 50px;
  height: 50px;
  background: #f1c40f;
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
  position: absolute;
  top: 70%;
  left: 20%;
  animation: twinkle 3s infinite ease-in-out;
}

/* Animations */
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fly {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}
</style>
