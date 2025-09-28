<template>
    <div class="docs-container">
        <!-- Privacy Policy Section -->
        <section id="privacy-policy" class="section">
            <h2>კონფიდენციალურობა</h2>
            <PrivacyPolicy />
        </section>

        <!-- Terms Section -->
        <section id="terms" class="section">
            <h2>წესები</h2>
            <p>
                ჩვენი კონფიდენციალობის პოლიტიკა...
                ... (remaining content)
            </p>
        </section>

        <!-- Payments Section -->
        <section id="payments" class="section">
            <h2>გადახდები</h2>
            <p>
                ჩვენი კონფიდენციალობის პოლიტიკა...
                ... (remaining content)
            </p>
        </section>

        <!-- Returns Section -->
        <section id="returns" class="section">
            <h2>დაბრუნება</h2>
            <p>
                ჩვენი კონფიდენციალობის პოლიტიკა...
                ... (remaining content)
            </p>
        </section>
    </div>
</template>

<script>
import PrivacyPolicy from "@/components/Footer/Documents/privacy-policy.vue";

export default {
    mounted() {
        this.scrollToSection();
    },
    components: {
        PrivacyPolicy,
    },
    watch: {
        "$route.hash": "scrollToSection",
    },
    methods: {
        scrollToSection() {
            const hash = this.$route.hash;
            if (hash) {
                const element = document.querySelector(hash);
                if (element) {
                    window.scrollTo({
                        top: element.offsetTop - 100,  // adjusted for better view
                        behavior: "smooth",
                    });
                }
            }
        },
    },
};
</script>

<style scoped>
/* General Styles */
.docs-container {
    padding: 20px;
    font-family: 'Arial', sans-serif;
    display: flex;
    flex-direction: column;
    margin: auto;
    margin-top: 50px;
    margin-bottom: 20px;
    max-width: 1200px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(55, 58, 64, 0.1);
}

section {
    margin-top: 30px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
}

h2 {
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 20px;
}

p {
    font-size: 1rem;
    color: #333;
    line-height: 1.6;
    word-wrap: break-word;
}

a {
    color: #007bff;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

.section {
    padding: 20px;
    max-width: 1000px;
}

.message {
    position: sticky;
    top: 70px;
    z-index: 999;
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    .docs-container {
        padding: 15px;
    }

    section {
        padding: 15px;
    }

    h2 {
        font-size: 1.4rem;
    }

    p {
        font-size: 0.95rem;
    }
}

@media (max-width: 600px) {
    .docs-container {
        max-width: 100%;
        padding: 10px;
    }

    section {
        max-width: 100%;
        padding: 15px;
    }

    h2 {
        font-size: 1.3rem;
    }
}
</style>
