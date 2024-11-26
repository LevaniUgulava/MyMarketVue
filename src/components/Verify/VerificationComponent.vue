<template>
  <div class="email-verification-container">
    <div class="card">
      <div class="icon-wrapper">
        <i class="verification-icon">✔</i>
      </div>
      <h1 class="title">Email Verification</h1>
      <p class="message">{{ message }}</p>
      <div v-if="redirectMessage" class="redirect-container">
        <p class="redirect">{{ redirectMessage }}</p>
        <div class="loading-dots">
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

export default {
  data() {
    return {
      message: "",
      redirectMessage: "",
    };
  },
  async mounted() {
    const route = useRoute();
    const router = useRouter();

    const { id } = route.params;
    const { expires, signature } = route.query;

    try {
      const response = await axios.get(`email/verify/${id}`, {
        params: { expires, signature },
      });

      this.message = response.data.message || "Email verification successful!";

      this.redirectMessage = "Redirecting to login";
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      this.message =
        error.response?.data?.message || "Email verification failed.";
      this.redirectMessage = "Returning to login";

      setTimeout(() => {
        router.push("/");
      }, 5000);
    }
  },
};
</script>

<style scoped>
.email-verification-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
  font-family: "Poppins", sans-serif;
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
  color: #333;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: scale(1.02);
}

.icon-wrapper {
  width: 70px;
  height: 70px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.verification-icon {
  font-size: 2rem;
  color: white;
  font-weight: bold;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.message {
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 1.5rem;
}

.redirect-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.redirect {
  font-size: 0.9rem;
  color: #27ae60;
  font-weight: bold;
}

.loading-dots {
  font-size: 1.5rem;
  color: #27ae60;
  display: flex;
}

.loading-dots span {
  animation: blink 1.4s infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .card {
    padding: 1.5rem;
  }
  .title {
    font-size: 1.5rem;
  }
  .message {
    font-size: 0.9rem;
  }
}
</style>
