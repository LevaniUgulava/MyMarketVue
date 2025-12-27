<template>
    <div class="popular">
        <div class="section-title">{{ title }}</div>
        <div class="items">
            <div v-for="(item, index) in items" @click="selectTerm(item)" :key="index" class="item">
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                    fill="currentcolor">
                    <path
                        d="M779.38-153.85 528.92-404.31q-30 25.54-69 39.54t-78.38 14q-96.1 0-162.67-66.53-66.56-66.53-66.56-162.57 0-96.05 66.53-162.71 66.53-66.65 162.57-66.65 96.05 0 162.71 66.56Q610.77-676.1 610.77-580q0 41.69-14.77 80.69t-38.77 66.69l250.46 250.47-28.31 28.3ZM381.54-390.77q79.61 0 134.42-54.81 54.81-54.8 54.81-134.42 0-79.62-54.81-134.42-54.81-54.81-134.42-54.81-79.62 0-134.42 54.81-54.81 54.8-54.81 134.42 0 79.62 54.81 134.42 54.8 54.81 134.42 54.81Z">
                    </path>
                </svg>
                <div class="hover">
                    {{ item.term ?? item }}

                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    items: Array
});
defineEmits(['select']);
</script>

<style scoped>
.section-title {
    font-size: 13px;
    margin-bottom: 6px;
}

.popular {
    display: flex;
    flex: 0 0 auto;
    font-size: 14px;
    padding-top: 15px;
    gap: 15px;
    flex-direction: column;
}

.popular .items {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.items .item {
    display: flex;
    align-items: center;
    gap: 5px;
    position: relative;
    cursor: pointer;
    border-radius: 5px;
    width: fit-content;
    background-color: transparent;
    padding: 8px;

}



.hover {
    position: relative;
    /* ეს აკლდა */
    width: 100%;
    /* underline-ს რომ ქონდეს ბაზა */
    display: inline-block;
    /* ტექსტის სიგანეზე უკეთ მოერგება */
}

.hover::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -4px;
    height: 2px;
    width: 0;
    background: #6a4a3a;
    transition: width 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

.hover:hover::after {
    width: 70%;
    /* ახლა უკვე იმუშავებს smooth და ლამაზად */
}
</style>
