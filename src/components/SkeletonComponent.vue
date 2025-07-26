<template>
    <div class="skeletondiv">
        <div class="skeleton" v-for="index in 8" :key="index">
            <div class="skeleton-item">
                <div class="skeleton-image"></div>
                <div class="skeleton-name"></div>
                <div class="skeleton-price"></div>
                <button class="skeleton-button"></button>
            </div>
        </div>
    </div>
</template>
<script>
export default {

}
</script>
<style scoped>
.skeletondiv {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    flex-wrap: wrap;
    gap: 15px;
}

.skeleton-item {
    width: 250px;
    height: 390px;
    background-color: transparent;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.skeleton-image {
    height: 260px;
    margin-bottom: 10px;
    border-radius: 12px;
    animation: pulse 1.5s infinite ease-in-out;

}

.skeleton-name {
    height: 20px;
    width: 50%;
    margin: auto;
    margin-bottom: 10px;
    border-radius: 4px;
    animation: pulse 1.5s infinite ease-in-out;

}

.skeleton-price {
    height: 20px;
    margin-bottom: 10px;
    border-radius: 4px;
    margin: auto;
    width: 20%;
    animation: pulse 1.5s infinite ease-in-out;

}

.skeleton-button {
    display: flex;
    justify-content: center;
    padding: 10px;
    border-radius: 8px;
    border: none;
    height: 30px;
    width: 200px;
    margin: auto;
    animation: pulse 1.5s infinite ease-in-out;

}

@keyframes pulse {
    0% {
        background-color: #f0f0f0;
    }

    50% {
        background-color: #e0e0e0;
    }

    100% {
        background-color: #f0f0f0;
    }
}

@media (max-width: 767px) {
    .skeletondiv {
        margin-top: 20px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        flex-wrap: wrap;
        gap: 15px;
    }

    .skeleton-item {
        width: 170px;
        height: 330px;
        background-color: transparent;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .skeleton-image {
        height: 200px;
        width: 170px;
        margin-bottom: 10px;
        border-radius: 12px;
        animation: pulse 1.5s infinite ease-in-out;

    }

    .skeleton-button {
        width: 150px;
        margin: 0 auto;


    }
}
</style>