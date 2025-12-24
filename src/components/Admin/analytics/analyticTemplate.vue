<template>
    <div class="container">
        <div class="analytic-frame" v-for="(item, index) in data" :key="index" :data-positive="item.precentage >= 0">
            <div class="title">{{ item.title }}</div>

            <div class="value">
                {{ item.value }}
                <span v-if="item.currency" class="currency">₾</span>
            </div>

            <div class="quantity" v-if="item.quantity">
                შეკვეთების რაოდენობა: <b>{{ item.quantity }}</b>
            </div>

            <div class="precentage" v-if="item.precentage !== undefined">
                {{ item.precentage }}%
                <span v-if="item.precentage > 0">↑</span>
                <span v-else-if="item.precentage < 0">↓</span>
            </div>
        </div>
    </div>
</template>

<script setup>
const data = [
    { title: "დღიური შემოსავალი", value: 300, currency: true, quantity: 3, precentage: 10 },
    { title: "დღიური სუფთა მოგება", value: 120, currency: true, precentage: -5 },
    { title: "აქტიური შეკვეთები", value: 5, precentage: 12 },
    { title: "დღიური კონვერსიის მაჩვენებელი", value: "80%", precentage: 0 }
];
</script>

<style scoped>
.container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
    padding: 10px;
}

.analytic-frame {
    background: #f8fafc;
    border-radius: 14px;
    padding: 18px;
    height: 100px;
    transition: 0.25s ease;
    position: relative;
    overflow: hidden;
    border: 1px solid #e5e7eb;
}

.analytic-frame:hover {
    transform: translateY(-1px);
    background: #f1f5f9;
}

.analytic-frame::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 5px;
    height: 100%;
    background: linear-gradient(180deg, #64748b, #94a3b8);
    border-radius: 14px 0 0 14px;
}

.title {
    font-weight: 600;
    font-size: 13px;
    color: #334155;
}

.value {
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.currency {
    font-size: 18px;
    opacity: 0.7;
}

.quantity {
    font-size: 13px;
    margin-top: 10px;
    color: #475569;
}

.precentage {
    font-size: 13px;
    margin-top: 5px;
    font-weight: 600;
}

.analytic-frame[data-positive="true"] .precentage {
    color: #22c55e;
}

.analytic-frame[data-positive="false"] .precentage {
    color: #ef4444;
}
</style>
