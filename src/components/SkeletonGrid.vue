<template>
    <div class="grid">
        <div class="skeleton" v-for="i in 12" :key="i"></div>
    </div>
</template>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 14px;
}

.skeleton {
    height: 260px;
    border-radius: 10px;
    background: linear-gradient(90deg, #eee, #f8f8f8, #eee);
    animation: pulse 1.2s infinite;
}

@keyframes pulse {
    0% {
        opacity: 1
    }

    50% {
        opacity: .6
    }

    100% {
        opacity: 1
    }
}
</style>
