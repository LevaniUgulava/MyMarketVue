<template>
    <div class="smallsection-container" v-if="categories.length > 0">
        <div class="sectionrole" @click="handlerole">როლის მიხედვით</div>
        <div @click="handle(item.id)" v-for="(item, index) in categories" :key="index" class="section">
            {{ item.name }}
        </div>
    </div>
</template>


<script>
import api from '@/api';
export default {
    name: "SmallSections",
    data() {
        return {
            categories: [],
        }
    },
    methods: {

        handlerole() {
            this.$router.push("/exclusive")
        },

        handle(item) {

            this.$router.push({
                path: `/product`,
                query: {
                    section: 'all',
                    maincategory: item,
                    page: 1,
                },
            });
        },
        async getMaincategories() {
            try {
                const response = await api.get("/maincategory", {
                    tokenRequired: false
                });
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
    margin-top: 5px;
    overflow-x: auto;
    white-space: nowrap;
    max-width: 100%;
    scroll-behavior: smooth;
    font-size: 13px;
}

.section,
.sectionrole {
    cursor: pointer;
    font-weight: 500;
    padding: 8px 12px;
    color: #333;
    transition: color 0.3s ease;
}

.sectionrole {
    color: #7a1dff;
}

.section:hover,
.sectionrole:hover {
    color: #7a1dff;

    text-decoration: none;
}

.smallsection-container::-webkit-scrollbar {
    display: none;
}

@media (max-width: 768px) {
    .smallsection-container {
        gap: 5px;
        font-size: 10px;
    }

    .section,
    .sectionrole {
        padding: 3px 6px;
    }
}
</style>
