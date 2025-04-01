<template>
    <div class="smallsection-container">
        <div @click="handle(item.id)" v-for="(item, index) in brands" :key="index" class="section">
            <div class="seperate-section">
                <img class="image" :src="item.image" alt="brand logo" />
            </div>
            <span class="name">{{ item.name }}</span>
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
    display: flex;
    justify-content: center;
    transition: color 0.3s ease;
}

.seperate-section {
    display: flex;
    align-items: center;
    align-items: center;
    padding: 5px 5px;
    border-radius: 30%;
    background-color: transparent;
    border: 1.5px solid #e0e0e0;
    width: auto;
    height: auto;
    justify-content: center;
    transition: background-color 0.8s ease, border 0.8s ease;
}

.seperate-section:hover {
    background-color: #fff;
    border: 1.5px solid #cac9c9;
}

.seperate-section:hover .image {
    width: 63px;
}

.seperate-section:hover .name {
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
    display: flex;
    flex-direction: column;
    cursor: pointer;
    height: 120px;
    justify-content: center;
    font-weight: 500;
    color: #333;
    transition: color 0.3s ease;
}
</style>
