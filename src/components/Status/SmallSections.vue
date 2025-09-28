<template>
    <div class="smallsection-container" v-if="categories.length > 0">
        <div class="left">
            <div class="address" @pointerdown="redirectaddress">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="currentColor">
                    <path
                        d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
                </svg>
                <p>მისამართები</p>
            </div>


        </div>

        <div class="center-strip">
            <StatusButton class="statusbutton" />
            <div v-for="(item, index) in categories" :key="index" class="section" @pointerdown="handle(item.id)">
                {{ item.ka_name }}
            </div>
        </div>

        <div class="right">

        </div>
    </div>
</template>


<script>
import api from '@/api';
import StatusButton from "@/components/Status/StatusButtomComponent.vue"
export default {
    name: "SmallSections",
    components: {
        StatusButton
    },
    data() {
        return {
            categories: [],
        }
    },
    methods: {
        redirectaddress() {
            this.$router.push('/profile/address');

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
            const category = sessionStorage.getItem('maincategories');

            if (!category) {
                try {
                    const response = await api.get("/maincategory", {
                        tokenRequired: false
                    });
                    this.categories = response.data;

                    sessionStorage.setItem('maincategories', JSON.stringify(response.data));
                } catch (error) {
                    console.log(error);
                }
            } else {
                this.categories = JSON.parse(category);
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
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    align-items: center;
    gap: 15px;
    height: 60px;
    background-color: #7c317c;
    white-space: nowrap;
    font-size: 13px;
}

.left {
    justify-self: start;
    color: #fff;
    padding: 8px 12px;
    font-weight: 600;
}

.address {
    display: flex;
    align-items: center;
    margin-left: 40px;
    gap: 5px;
    cursor: pointer;
    transition: color 0.2s ease;

}

.left:hover {
    color: #7a1dff;
}



.center-strip {
    grid-column: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    max-width: 100%;
    overflow-x: auto;
}

.center-strip::-webkit-scrollbar {
    display: none;
}

.section {
    cursor: pointer;
    font-weight: 500;
    padding: 8px 12px;
    color: #fff;
    transition: color 0.2s ease;
}

.section:hover {
    color: #7a1dff;
}

.statusbutton {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    padding: 5px 15px;
    border-radius: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 13px;
}

@media (max-width: 768px) {
    .smallsection-container {
        gap: 5px;
        font-size: 10px;
    }

    .section {
        padding: 3px 6px;
    }

    .statusbutton {
        padding: 0;
    }
}
</style>
