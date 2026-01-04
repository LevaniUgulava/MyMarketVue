<template>
    <transition name="fade">
        <div v-if="showBanner" class="cookie-banner-overlay" role="dialog" aria-live="polite">
            <div class="cookie-banner-card">
                <div class="banner-icon">
                    <img src="../assets/cookie_1330438.png" class="icon" alt="Cookie Icon" />
                </div>
                <div class="banner-text">
                    ჩვენ ვიყენებთ აუცილებელ cookie-ებს საიტის მუშაობისთვის.
                    დამატებითი cookie-ები (analytics, personalization) დაინიშნება მხოლოდ თქვენი თანხმობის შემთხვევაში.
                </div>
                <div class="banner-actions">
                    <button @click="acceptAll" class="btn-primary">ვეთანხმები</button>
                    <button class="btn-secondary">მხოლოდ აუცილებელი</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import api from '@/api';
import { ref, onMounted } from 'vue';

const showBanner = ref(false);

onMounted(() => {

    showBanner.value = true;
});


onMounted(() => {
    showBanner.value = true;
});

async function acceptAll() {
    try {
        await api.post('/cookie', { allowed_type: "all" });
        showBanner.value = false;

    } catch (error) {
        console.log(error);
        showBanner.value = true;
    }
}


</script>

<style scoped>
.cookie-banner-card {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-direction: column;
}

.banner-icon .icon {
    width: 50px;
    height: 50px;
    color: #fbbf24;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Overlay */
.cookie-banner-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 16px;
    z-index: 9999;
}

.cookie-banner-card {
    background-color: #1f2937;
    color: white;
    padding: 24px 28px;
    border-radius: 16px;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
    max-width: 850px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    font-family: 'Inter', sans-serif;
    transform: translateY(0);
}

.banner-text {
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
}

.banner-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

/* Buttons */
.btn-primary,
.btn-secondary {
    padding: 10px 15px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-size: 13px;
    transition: all 0.25s ease;
    width: 140px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.btn-primary {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    color: white;
}

.btn-primary:hover {
    background: linear-gradient(135deg, #1d4ed8, #1e3a8a);
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
}

.btn-primary:focus {
    outline: 3px solid #93c5fd;
    outline-offset: 2px;
}

/* Secondary button */
.btn-secondary {
    background: #4b5563;
    color: white;
}

.btn-secondary:hover {
    background-color: #374151;
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
}

.btn-secondary:focus {
    outline: 3px solid #9ca3af;
    outline-offset: 2px;
}

/* Responsive layout */
@media(min-width: 640px) {
    .cookie-banner-card {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
}
</style>
