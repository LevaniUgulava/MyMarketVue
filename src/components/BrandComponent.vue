<template>
    <div class="smallsection-container">
        <div @click="handle(item.id)" v-for="(item, index) in brands" :key="index" class="section">
            <div class="seperate-section">
                <img class="image" :src="item.image" alt="brand logo" />
                <span class="name">{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            brands: [
                {
                    id: 1,
                    name: "Gucci",
                    image: "/logo/logo-gucci.png"
                },
                {
                    id: 2,
                    name: "Luis Vitton",
                    image: "/logo/luisviton.png"
                },
            ]
        }
    },
    methods: {
        handle(id) {
            console.log(id);
        },
    },
}
</script>

<style scoped>
.image {
    width: 60px;
    border-radius: 50%;
    transition: width 0.5s ease, height 0.5s ease;
}

.name {
    font-size: 12px;
    font-weight: 500;
    margin-top: -10px;
    align-items: center;
    color: #333;
    transition: font-size 0.5s ease;
}

.seperate-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 15px;
    border-radius: 50%;
    background-color: transparent;
    border: 1.5px solid #e0e0e0;
    width: 90px;
    height: 90px;
    justify-content: center;
    transition: background-color 0.8s ease, border 0.8s ease;
}

.seperate-section:hover {
    background-color: #fff;
    border: 1.5px solid #cac9c9;
}

.seperate-section:hover .image {
    width: 65px;
}

.seperate-section:hover .name {
    font-size: 12px;
    color: #333;
}

.smallsection-container {
    display: flex;
    gap: 15px;
    margin-top: 5px;
    overflow-x: auto;
    white-space: nowrap;
    max-width: 90%;
    margin: auto;
    align-items: center;
    scroll-behavior: smooth;
    font-size: 13px;
}

.section {
    cursor: pointer;
    font-weight: 500;
    color: #333;
    transition: color 0.3s ease;
}
</style>
