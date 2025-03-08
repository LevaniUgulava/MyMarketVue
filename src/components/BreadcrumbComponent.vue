<template>
    <div class="breadcrumb">
        <span class="clickable" @click="navigatemain()">
            მთავარი
        </span>
        <span class="separator"> > </span>

        <span v-if="computedSection" class="clickable" @click="navigate({ section: computedSection })">
            {{ formatSection(computedSection) }}
        </span>

        <span v-if="maincategory?.name && computedSection" class="separator"> > </span>
        <span v-if="maincategory?.name" class="clickable"
            @click="navigate({ section: computedSection, maincategory: maincategory.id })">
            {{ maincategory.name }}
        </span>

        <span v-if="category?.name" class="separator"> > </span>
        <span v-if="category?.name" class="clickable"
            @click="navigate({ section: computedSection, maincategory: maincategory.id, category: category.id })">
            {{ category.name }}
        </span>

        <span v-if="subcategory?.name" class="separator"> > </span>
        <span v-if="subcategory?.name" class="clickable"
            @click="navigate({ section: computedSection, maincategory: maincategory.id, category: category.id, subcategory: subcategory.id })">
            {{ subcategory.name }}
        </span>

        <span v-if="name" class="separator"> > </span>
        <span v-if="name" class="product-name">{{ name }}</span>
    </div>
</template>

<script>
export default {
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
            required: false,
            default: ""
        }
    },
    computed: {
        computedSection() {
            let section = this.$route.query.section || localStorage.getItem('section') || "all";
            return section;
        }
    },
    methods: {
        navigate(params) {
            const lang = this.$route.params.lang || 'ka';
            this.$router.push({
                path: `/${lang}/product`,
                query: { section: this.computedSection, ...params, page: 1 }
            });
        },
        navigatemain() {
            const lang = this.$route.params.lang || 'ka';
            this.$router.push({
                path: `/${lang}`,
            });
        },
        formatSection(section) {
            return this.$t(`homemain.${section}`) || this.$t("homemain.default");
        }
    }

};
</script>

<style scoped>
.breadcrumb {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.separator {
    margin: 0 5px;
    color: gray;
}

.clickable {
    color: #737678;
    cursor: pointer;
    transition: color 0.3s ease;
}

.clickable:hover {
    text-decoration: none;
    font-weight: bold;
    color: black;
}

.product-name {
    font-weight: bold;
    color: rgb(58, 53, 53);
}

@media (max-width: 768px) {
    .breadcrumb {
        display: block;
        font-size: 15px;

    }

    .separator {
        margin: 0 0px;
    }
}
</style>
