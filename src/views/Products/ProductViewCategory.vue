<template>
    <div class="category-modal">
        <button @click="resetFilters" class="reset-button">ფილტრის გასუფთავება</button>
        <div class="filter-section">
            <h3 @click="toggleSection('mainCategory')">
                მთავრი კატეგორია
                <svg v-if="collapsed.mainCategory" class="icon icon-chevron-up icon-md" viewBox="0 0 24 24"
                    stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 15L12 9L18 15"></path>
                </svg>
                <svg v-else class="icon icon-chevron-down icon-md" viewBox="0 0 24 24" stroke="currentColor" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9L12 15L6 9"></path>
                </svg>
            </h3>
            <div v-if="!collapsed.mainCategory">
                <div v-for="(mainCategory, index) in mainCategories" :key="index" class="checkbox-container">
                    <input type="checkbox" :id="'main-' + mainCategory.id" v-model="selectedMainCategories"
                        :value="mainCategory" @change="performSearch" />
                    <label :for="'main-' + mainCategory.id">{{ mainCategory.name }}</label>
                </div>
            </div>
        </div>

        <div class="filter-section">
            <h3 @click="toggleSection('category')">
                კატეგორია
                <svg v-if="collapsed.category" class="icon icon-chevron-up icon-md" viewBox="0 0 24 24"
                    stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 15L12 9L18 15"></path>
                </svg>
                <svg v-else class="icon icon-chevron-down icon-md" viewBox="0 0 24 24" stroke="currentColor" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9L12 15L6 9"></path>
                </svg>
            </h3>
            <div v-if="!collapsed.category">
                <div class="checkbox-container" v-for="(category, catIndex) in filteredCategory || []" :key="catIndex">
                    <input type="checkbox" :id="'category-' + category.id" v-model="selectedCategories"
                        :value="category" @change="performSearch" />
                    <label :for="'category-' + category.id">{{ category.name }}</label>
                </div>
            </div>
        </div>

        <!-- Subcategory Section -->
        <div class="filter-section">
            <h3 @click="toggleSection('subcategory')">
                ქვეკატეგორია
                <svg v-if="collapsed.subcategory" class="icon icon-chevron-up icon-md" viewBox="0 0 24 24"
                    stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 15L12 9L18 15"></path>
                </svg>
                <svg v-else class="icon icon-chevron-down icon-md" viewBox="0 0 24 24" stroke="currentColor" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9L12 15L6 9"></path>
                </svg>
            </h3>
            <div v-if="!collapsed.subcategory">
                <div class="checkbox-container" v-for="(subcategory, subIndex) in filteredsubCategory || []"
                    :key="subIndex">
                    <input type="checkbox" :id="'subcategory-' + subcategory.id" v-model="selectedsubCategories"
                        :value="subcategory" @change="performSearch" />
                    <label :for="'subcategory-' + subcategory.id">{{ subcategory.name }}</label>
                </div>
            </div>
        </div>
        <!-- Brand Section -->
        <div class="filter-section">
            <h3 @click="toggleSection('brand')">
                მწარმოებელი
                <svg v-if="collapsed.brand" class="icon icon-chevron-up icon-md" viewBox="0 0 24 24"
                    stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 15L12 9L18 15"></path>
                </svg>
                <svg v-else class="icon icon-chevron-down icon-md" viewBox="0 0 24 24" stroke="currentColor" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9L12 15L6 9"></path>
                </svg>
            </h3>
            <div v-if="!collapsed.brand">
                <div class="checkbox-container" v-for="(brand, Index) in brands || []" :key="Index">
                    <input type="checkbox" :id="'brand-' + brand.id" v-model="selectedBrands" :value="brand.id"
                        @change="performSearch" />
                    <label :for="'brand-' + brand.id">{{ brand.name }}</label>
                </div>
            </div>
        </div>

        <!-- Price Range Section -->
        <div class="filter-section">
            <h3 @click="toggleSection('price')">
                ფასი
                <svg v-if="collapsed.price" class="icon icon-chevron-up icon-md" viewBox="0 0 24 24"
                    stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 15L12 9L18 15"></path>
                </svg>
                <svg v-else class="icon icon-chevron-down icon-md" viewBox="0 0 24 24" stroke="currentColor" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9L12 15L6 9"></path>
                </svg>
            </h3>
            <div v-if="!collapsed.price">
                <div class="inputs">
                    <input class="input" type="number" placeholder="დან" v-model="priceRange.min"
                        @input="performSearch">
                    <input class="input" type="number" placeholder="მდე" v-model="priceRange.max"
                        @input="performSearch">
                </div>
            </div>
        </div>

        <div class="filter-section">
            <h3 @click="toggleSection('size')">
                ზომა
                <svg v-if="collapsed.size" class="icon icon-chevron-up icon-md" viewBox="0 0 24 24"
                    stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 15L12 9L18 15"></path>
                </svg>
                <svg v-else class="icon icon-chevron-down icon-md" viewBox="0 0 24 24" stroke="currentColor" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9L12 15L6 9"></path>
                </svg>
            </h3>
            <div v-if="!collapsed.size" class="size">
                <div class="size-grid">
                    <div class="size-section">
                        <div class="checkbox-container" v-for="(size, sizeIndex) in sizes.clothsize" :key="sizeIndex">
                            <input type="checkbox" :id="'cloth-' + size" v-model="selectedSizes" :value="size"
                                @change="performSearch" />
                            <label :for="'cloth-' + size">{{ size }}</label>
                        </div>
                    </div>

                    <div class="size-section">
                        <div class="checkbox-container" v-for="(size, sizeIndex) in sizes.shoessize" :key="sizeIndex">
                            <input type="checkbox" :id="'shoes-' + size" v-model="selectedSizes" :value="size"
                                @change="performSearch" />
                            <label :for="'shoes-' + size">{{ size }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="filter-section">
            <h3 @click="toggleSection('color')">
                ფერი
                <svg v-if="collapsed.color" class="icon icon-chevron-up icon-md" viewBox="0 0 24 24"
                    stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 15L12 9L18 15"></path>
                </svg>
                <svg v-else class="icon icon-chevron-down icon-md" viewBox="0 0 24 24" stroke="currentColor" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9L12 15L6 9"></path>
                </svg>
            </h3>
            <div v-if="!collapsed.color">
                <div class="checkbox-container" v-for="(color, colorIndex) in colors" :key="colorIndex">
                    <input type="checkbox" :id="'color-' + color.id" v-model="selectedColors" :value="color.color"
                        @change="performSearch" />
                    <label :for="'color-' + color.id">{{ color.color }}</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api';
import { mapMutations, mapGetters } from 'vuex';
export default {
    data() {
        return {
            collapsed: {
                mainCategory: false,
                category: false,
                subcategory: false,
                price: false,
                color: false,
                size: false,
                brand: false
            },
            mainCategories: [],
            Categories: [],
            subCategories: [],

            selectedMainCategories: [],
            selectedCategories: [],
            selectedsubCategories: [],


            priceRange: {
                min: null,
                max: "",
            },
            colors: [],
            selectedColors: [],
            sizes: [],
            selectedSizes: [],
            brands: [],
            selectedBrands: []

        };
    },
    methods: {
        loadsavefilter() {
            this.selectedMainCategories = this.getMainCategory;
            this.selectedCategories = this.getCategory;
            this.selectedsubCategories = this.getSubCategory;
            this.priceRange = this.getPriceRange;
            this.selectedColors = this.getColors;
            this.selectedSizes = this.getSizes;
            this.selectedBrands = this.getBrands;
        },
        resetFilters() {
            this.selectedMainCategories = [];
            this.selectedCategories = [];
            this.selectedsubCategories = [];
            this.selectedColors = [];
            this.selectedSizes = [];
            this.selectedBrands = [];
            this.priceRange = { min: null, max: "" };

            this.setMainCategory([]);
            this.setCategory([]);
            this.setSubCategory([]);
            this.setColors([]);
            this.setPriceRange([]);
            this.setSizes([]);
            this.setBrands([]);

            localStorage.removeItem('selectedMainCategories');
            localStorage.removeItem('selectedCategories');
            localStorage.removeItem('selectedsubCategories');
            localStorage.removeItem('selectedColors');
            localStorage.removeItem('priceRange');
            localStorage.removeItem('selectedSizes');
            localStorage.removeItem('selectedBrands');

            this.performSearch();

        },
        ...mapMutations('categories', [
            'setMainCategory',
            'setCategory',
            'setSubCategory',
            'setPriceRange',
            'setColors',
            'setSizes',
            'setBrands'
        ]),

        toggleSection(section) {
            this.collapsed[section] = !this.collapsed[section];
        },
        async fetchCategories() {
            try {
                const response = await api.get('maincategory', {
                    tokenRequired: false
                });
                const responsee = await api.get('category', {
                    tokenRequired: false
                });
                const responseee = await api.get('subcategory', {
                    tokenRequired: false
                });
                const responsecolor = await api.get('colors', {
                    tokenRequired: false
                });
                const responsesize = await api.get('sizes', {
                    tokenRequired: false
                });
                const responsebrand = await api.get('/brand/display', {
                    tokenRequired: false
                });


                this.mainCategories = response.data;
                this.Categories = responsee.data;
                this.subCategories = responseee.data;
                this.colors = responsecolor.data
                this.sizes = responsesize.data;
                this.brands = responsebrand.data
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }

        },

        setCategroies() {
            this.setMainCategory(this.selectedMainCategories);
            this.setCategory(this.selectedCategories);
            this.setSubCategory(this.selectedsubCategories);
            this.setPriceRange(this.priceRange);
            this.setSizes(this.selectedSizes);
            this.setColors(this.selectedColors);
            this.setBrands(this.selectedBrands);
        },


        performSearch() {
            this.setCategroies();

            const currentQuery = { ...this.$route.query };

            const maincategoryParam = this.selectedMainCategories.map(q => q.id).join(",");
            const categoryParam = this.selectedCategories.map(q => q.id).join(",");
            const subcategoryParam = this.selectedsubCategories.map(q => q.id).join(",");
            const sizesParm = this.selectedSizes.join(",");
            const colorsParam = this.selectedColors.join(',');
            const brandParam = this.selectedBrands.join(',');



            this.$router.push({
                path: `/product`,
                query: {
                    section: currentQuery.section || 'all',
                    maincategory: maincategoryParam || '',
                    category: categoryParam || '',
                    subcategory: subcategoryParam || '',
                    brand: brandParam || '',
                    min: this.priceRange.min || '',
                    max: this.priceRange.max || '',
                    sizes: sizesParm || '',
                    colors: colorsParam || '',
                    page: 1,
                },
            });
        },
    },

    computed: {
        ...mapGetters('categories', [
            'getMainCategory',
            'getCategory',
            'getSubCategory',
            'getPriceRange',
            'getColors',
            'getSizes',
            "getBrands"
        ]),
        filteredCategory() {
            if (this.selectedMainCategories.length) {
                return this.Categories.filter((category) => {
                    return category.maincategory_id.some(id => this.selectedMainCategories.some(maincategory => maincategory.id === id));
                });
            } else {
                return this.Categories;
            }

        },
        filteredsubCategory() {
            if (this.selectedCategories.length) {
                return this.subCategories.filter((subcategory) => {
                    return subcategory.category_id.some(id => this.selectedCategories.some(maincategory => maincategory.id === id));
                });
            } else {
                return this.subCategories
            }

        }

    },

    mounted() {
        this.fetchCategories();
        this.loadsavefilter();
    },
};
</script>

<style scoped>
.size-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.reset-button {
    width: 100%;
    padding: 5px;
    border: none;
    cursor: pointer;
    font-size: 13px;
    border-radius: 5px;
}

.reset-button:hover {
    background-color: #e5e0e0;
}

.icon {
    width: 24px;
    height: 24px;
}

.inputs {
    display: flex;
    gap: 10px;
}

.category-modal {
    width: 100%;
    height: 80vh;
    overflow-y: auto;
    border-radius: 8px;
}

.category-modal::-webkit-scrollbar {
    display: none;
}

.category-modal {
    -webkit-overflow-scrolling: touch;
}

.filter-section {
    margin-bottom: 20px;
    padding: 10px;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    overflow-y: auto;
}


.filter-section h3 {
    font-size: 16px;
    cursor: pointer;
    display: flex;
    font-weight: 400;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f1eaea;
    padding-bottom: 10px;
}

.filter-section h3 span {
    font-size: 18px;
}

/* Hide default checkbox */
.checkbox-container input[type="checkbox"] {
    display: none;
}

/* Custom checkbox */
.checkbox-container label {
    position: relative;
    padding-left: 35px;
    cursor: pointer;
    font-size: 13px;
}

.checkbox-container label:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 15px;
    height: 15px;
    border: 1px solid #333;
    border-radius: 5px;
    background-color: #fff;
    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.checkbox-container input[type="checkbox"]:checked+label:before {
    background-color: #171717;
    border-color: #171717;
}

.checkbox-container input[type="checkbox"]:checked+label:after {
    content: "✔";
    position: absolute;
    left: 5px;
    top: 2px;
    color: #fff;
    font-size: 10px;
}

.checkbox-container label:hover:before {
    border-color: #888;
}

.input {
    width: 100px;
    height: 30px;
    border: 0.5px solid #171717;
    border-radius: 5px;
    padding: 5px;
}

.input::-webkit-outer-spin-button,
.input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.input[type="number"] {
    -moz-appearance: textfield;
    -webkit-appearance: none;
    appearance: none;
}

.input:focus {
    outline: none;
    border: 0.5px solid #232323;
    box-shadow: 0 0 5px #e5e0e0;
}


div>div {
    margin-bottom: 5px;
}

@media (min-width: 390px) and (max-width: 574px) {
    .category-modal {
        /* background-color: white; */
        height: 80%;
    }

    .checkbox-container label:before {
        width: 20px;
        height: 20px;
    }

}
</style>
