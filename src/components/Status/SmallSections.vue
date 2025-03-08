<template>
    <div class="smallsection-container" v-if="categories.length > 0">
        <div class="sectionrole" @click="handlerole">როლის მიხედვით</div>
        <div class="section" @click="handelpopular">პოპულარული</div>
        <div @click="handle(item.id)" v-for="(item, index) in categories" :key="index" class="section"
            :aria-label="item">
            {{ item.name }}
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "SmallSections",
    data() {
        return {
            categories: [],
        }
    },
    methods: {

        handlerole() {
            this.$router.push("/ka/exclusive")
        },
        handelpopular() {
            this.$router.push("/ka/popular")
        },
        handle(item) {
            const lang = this.$route.params.lang || 'ka';

            this.$router.push({
                path: `/${lang}/product`,
                query: {
                    section: 'all',
                    maincategory: item,
                    page: 1,
                },
            });
        },
        async getMaincategories() {
            try {
                const response = await axios.get("/maincategory");
                this.categories = response.data
            } catch (error) {
                console.log(error);
            }
        },

    },
    mounted() {
        this.getMaincategories();
    },

}
</script>

<style scoped>
.smallsection-container {
    display: flex;
    gap: 15px;
    margin-top: 20px;
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 10px;
    max-width: 100%;
    scroll-behavior: smooth;
}

.section {
    padding: 12px 20px;
    background-color: #f4f4f9;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.sectionrole {
    padding: 12px 20px;
    background: linear-gradient(50deg, gold 20%, #fff 40%, gold 60%, #fff 90%);

    background-size: 200% 100%;
    font-size: 16px;
    background-color: #f4f4f9;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    animation: sparkle 3s infinite linear;
}

.sectionrole:hover {
    background-color: #C68C28;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
}

@keyframes sparkle {
    0% {
        background-position: 100% 0%;
        background-size: 200% 200%;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    }

    50% {
        background-position: 0% 100%;
        background-size: 200% 200%;
        box-shadow: 0 0 20px rgba(255, 255, 255, 1);
    }

    100% {
        background-position: 100% 0%;
        background-size: 200% 200%;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    }
}

.section:hover {
    background-color: #7a1dff1a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
}

.smallsection-container::-webkit-scrollbar {
    display: none;
}

@media (max-width: 768px) {
    .smallsection-container {
        gap: 10px;
        margin-top: 0px;
    }

    .sectionrole {
        padding: 12px 10px;
        font-size: 14px;
    }

    .section {
        flex: 1 1 45%;
        padding: 12px 10px;
        font-size: 14px;
    }
}
</style>
