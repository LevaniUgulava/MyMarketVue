<template>
    <div class="breadcrumb">
        <span class="clickable" @click="navigatemain()">
            <i class="fa-solid fa-house outline-icon"></i>
        </span>


        <template v-if="computedSection">
            <span class="separator"> / </span>
            <span class="clickable" @click="navigate({ section: computedSection })">

                {{ formatSection(computedSection) }}
            </span>
        </template>


        <template v-if="getMainCategory && getMainCategory.length && isShown">
            <span class="separator"> / </span>
            <span v-for="(item, index) in getMainCategory" :key="index" class="clickable background">
                {{ item.ka_name }}
                <i @click.prevent="remove(index, 'selectedMainCategories')" class="fa-solid fa-xmark"></i>
            </span>
        </template>

        <template v-if="maincategory && maincategory.ka_name">
            <span class="separator"> / </span>
            <span class="clickable">
                {{ maincategory.ka_name }}
            </span>
        </template>

        <template v-if="getCategory && getCategory.length && isShown">
            <span class="separator"> / </span>
            <span v-for="(item, index) in getCategory" :key="index" class="clickable background">
                {{ item.ka_name }}
                <i @click.prevent="remove(index, 'selectedCategories')" class="fa-solid fa-xmark"></i>
            </span>
        </template>
        <template v-if="category && category.ka_name">
            <span class="separator"> / </span>
            <span class="clickable">
                {{ category.ka_name }}
            </span>
        </template>

        <template v-if="getSubCategory && getSubCategory.length && isShown">
            <span class="separator"> / </span>
            <span v-for="(item, index) in getSubCategory" :key="index" class="clickable background">
                {{ item.ka_name }}
                <i @click.prevent="remove(index, 'selectedsubCategories')" class="fa-solid fa-xmark"></i>
            </span>
        </template>
        <template v-if="subcategory && subcategory.ka_name">
            <span class="separator"> / </span>
            <span class="clickable">
                {{ subcategory.ka_name }}
            </span>
        </template>
        <span v-if="name" class="separator"> / </span>
        <span v-if="name" class="product-name">{{ name }}</span>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        computedSection() {
            return this.$route.query.section || null;
        },
        ...mapGetters('categories', [
            'getMainCategory',
            'getCategory',
            'getSubCategory',
        ]),
        isShown() {
            return this.$route.query.section
        }
    },
    props: {
        maincategory: {
            type: Object,
            required: false,
            default: () => ({})
        },
        category: {
            type: Object,
            required: false,
            default: () => ({})

        },
        subcategory: {
            type: Object,
            required: false,
            default: () => ({})
        },
        name: {
            type: String,
            required: false
        }

    },

    methods: {
        remove(index, category) {
            const data = {
                category: category,
                index: index
            };
            this.$emit("item-removed", data);
        },
        navigate(params) {
            this.$router.push({
                path: `/product`,
                query: { section: this.computedSection, ...params, page: 1 }
            });
        },
        navigatemain() {
            this.$router.push({ path: `/` });
        },
        formatSection(section) {
            switch (section) {
                case "all":
                    return "ყველა პროდუქტი";
                case "discount":
                    return "ფასდაკლებული პროდუქტი";
                default:
                    return section;
            }
        },
    },
    mounted() {
        localStorage.setItem("section", this.$route.query.section);
    },
};
</script>

<style scoped>
.breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    gap: 10px;
}

.separator {
    font-weight: 400;
    color: rgba(23, 23, 23, 0.2);
}

.clickable {
    font-weight: 400;
    color: rgb(52, 51, 51);
    cursor: pointer;
    font-size: 12px;
    transition: color 0.3s ease;
}

.clickable:hover {
    text-decoration: none;
    color: black;
}

.fa-solid.fa-xmark {
    font-size: 11px;
    font-weight: 600;
    color: gray;
}

.fa-solid.fa-xmark:hover {
    color: black;
}


.background {
    display: flex;
    gap: 5px;
    align-items: baseline;
    background-color: rgb(242, 236, 236);
    padding: 3px 10px;
    border-radius: 10px;
}

.product-name {
    font-weight: bold;
    font-size: 12px;
    color: rgb(0, 0, 0);
}

.outline-icon {
    color: transparent;
    font-size: 16px;
    -webkit-text-stroke: 1.2px #343333;
}

.outline-icon.active {
    color: #7a1fff;
}

@media (max-width: 768px) {
    .breadcrumb {
        display: flex;
        flex-wrap: wrap;
        font-size: 15px;
        gap: 7px;
    }
}
</style>
