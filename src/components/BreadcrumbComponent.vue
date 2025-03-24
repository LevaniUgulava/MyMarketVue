<template>
    <div class="breadcrumb">
        <span class="clickable" @click="navigatemain()">
            <i class="fa-solid fa-house outline-icon"></i>
        </span>
        <span class="separator"> / </span>

        <span v-if="computedSection" class="clickable" @click="navigate({ section: computedSection })">
            {{ formatSection(computedSection) }}
        </span>

        <template v-if="isArray(maincategory) && maincategory.length">
            <span class="separator"> / </span>
            <span v-for="(item, index) in maincategory" :key="index" class="clickable background">
                {{ item.name }} <i @click.prevent="remove(index, 'selectedMainCategories')"
                    class="fa-solid fa-xmark"></i>
            </span>
        </template>
        <template v-else-if="isObject(maincategory)">
            <span class="separator"> / </span>
            <span class="clickable" @click="navigate({ section: computedSection, maincategory: maincategory.id })">
                {{ maincategory.name }}
            </span>
        </template>

        <template v-if="isArray(category) && category.length">
            <span class="separator"> / </span>
            <span v-for="(item, index) in category" :key="index" class="clickable background">
                {{ item.name }} <i @click.prevent="remove(index, 'selectedCategories')"
                    class="fa-solid fa-xmark"></i>
            </span>
        </template>
        <template v-else-if="isObject(category)">
            <span class="separator"> / </span>
            <span class="clickable"
                @click="navigate({ section: computedSection, maincategory: getMainCategoryId(), category: category.id })">
                {{ category.name }}
            </span>
        </template>

        <template v-if="isArray(subcategory) && subcategory.length">
            <span class="separator"> / </span>
            <span v-for="(item, index) in subcategory" :key="index" class="clickable background">
                {{ item.name }} <i @click.prevent="remove(index, 'selectedsubCategories')"
                    class="fa-solid fa-xmark"></i>
            </span>
        </template>
        <template v-else-if="isObject(subcategory)">
            <span class="separator"> / </span>
            <span class="clickable"
                @click="navigate({ section: computedSection, maincategory: getMainCategoryId(), category: getCategoryId(), subcategory: subcategory.id })">
                {{ subcategory.name }}
            </span>
        </template>

        <span v-if="name" class="separator"> / </span>
        <span v-if="name" class="product-name">{{ name }}</span>
    </div>
</template>

<script>

export default {
    props: {
        maincategory: {
            type: [Object, Array],
            default: () => []
        },
        category: {
            type: [Object, Array],
            default: () => []
        },
        subcategory: {
            type: [Object, Array],
            default: () => []
        },
        name: {
            type: String,
            default: ""
        }
    },
    computed: {
        computedSection() {
            return this.$route.query.section || localStorage.getItem('section') || "all";
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
        getMainCategoryId() {
            return this.isArray(this.maincategory) && this.maincategory.length > 0 ? this.maincategory[0].id : null;
        },
        getCategoryId() {
            return this.isArray(this.category) && this.category.length > 0 ? this.category[0].id : null;
        },
        isArray(value) {
            return Array.isArray(value);
        },
        isObject(value) {
            return typeof value === "object" && value != 0;
        },
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
    /* Added gap between elements */
}

.separator {
    font-weight: 400;
    color: rgba(23, 23, 23, 0.2);
}

.clickable {
    font-weight: 400;
    color: rgb(52, 51, 51);
    cursor: pointer;
    font-size: 13px;
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
    font-size: 13px;
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
    }
}
</style>
