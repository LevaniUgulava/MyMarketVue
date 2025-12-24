<template>
    <div class="category-modal">
        <button @pointerdown="resetFilters" class="reset-button">ფილტრის გასუფთავება</button>
        <div class="filter-section">
            <div class="sect" @pointerdown="toggleSection('mainCategory')">
                მთავრი კატეგორია
                <svg v-if="collapsed.mainCategory" class="icon icon-chevron-up icon-md" viewBox="0 0 24 24"
                    stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 15L12 9L18 15"></path>
                </svg>
                <svg v-else class="icon icon-chevron-down icon-md" viewBox="0 0 24 24" stroke="currentColor" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9L12 15L6 9"></path>
                </svg>
            </div>
            <div v-if="!collapsed.mainCategory">
                <div v-for="(mainCategory, index) in mainCategories" :key="index" class="checkbox-container">
                    <input type="checkbox" :id="'main-' + mainCategory.id" v-model="selectedMainCategories"
                        :value="mainCategory" @change="performSearch" />
                    <label :for="'main-' + mainCategory.id">{{ mainCategory.ka_name }}</label>
                </div>
            </div>
        </div>

        <div class="filter-section">
            <div class="sect" @pointerdown="toggleSection('category')">
                კატეგორია
                <svg v-if="collapsed.category" class="icon icon-chevron-up icon-md" viewBox="0 0 24 24"
                    stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 15L12 9L18 15"></path>
                </svg>
                <svg v-else class="icon icon-chevron-down icon-md" viewBox="0 0 24 24" stroke="currentColor" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9L12 15L6 9"></path>
                </svg>
            </div>
            <div v-if="!collapsed.category">
                <div class="checkbox-container" v-for="(category, catIndex) in filteredCategory || []" :key="catIndex">
                    <input type="checkbox" :id="'category-' + category.id" v-model="selectedCategories"
                        :value="category" @change="performSearch" />
                    <label :for="'category-' + category.id">{{ category.ka_name }}</label>
                </div>
            </div>
        </div>

        <!-- Subcategory Section -->
        <div class="filter-section">
            <div class="sect" @pointerdown="toggleSection('subcategory')">
                ქვეკატეგორია
                <svg v-if="collapsed.subcategory" class="icon icon-chevron-up icon-md" viewBox="0 0 24 24"
                    stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 15L12 9L18 15"></path>
                </svg>
                <svg v-else class="icon icon-chevron-down icon-md" viewBox="0 0 24 24" stroke="currentColor" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9L12 15L6 9"></path>
                </svg>
            </div>
            <div v-if="!collapsed.subcategory">
                <div class="checkbox-container" v-for="(subcategory, subIndex) in filteredsubCategory || []"
                    :key="subIndex">
                    <input type="checkbox" :id="'subcategory-' + subcategory.id" v-model="selectedsubCategories"
                        :value="subcategory" @change="performSearch" />
                    <label :for="'subcategory-' + subcategory.id">{{ subcategory.ka_name }}</label>
                </div>
            </div>
        </div>
        <!-- Brand Section -->
        <div class="filter-section">
            <div class="sect" @pointerdown="toggleSection('brand')">
                მწარმოებელი
                <svg v-if="collapsed.brand" class="icon icon-chevron-up icon-md" viewBox="0 0 24 24"
                    stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 15L12 9L18 15"></path>
                </svg>
                <svg v-else class="icon icon-chevron-down icon-md" viewBox="0 0 24 24" stroke="currentColor" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9L12 15L6 9"></path>
                </svg>
            </div>
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
            <div class="sect" @pointerdown="toggleSection('price')">
                ფასი
                <svg v-if="collapsed.price" class="icon icon-chevron-up icon-md" viewBox="0 0 24 24"
                    stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 15L12 9L18 15"></path>
                </svg>
                <svg v-else class="icon icon-chevron-down icon-md" viewBox="0 0 24 24" stroke="currentColor" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9L12 15L6 9"></path>
                </svg>
            </div>
            <div v-if="!collapsed.price">
                <SliderComponent @min="onMinChange" @max="onMaxChange" />
                <div class="inputs">
                    <input class="input" type="number" placeholder="დან" v-model="priceRange.min"
                        @input="performSearch">
                    <input class="input" type="number" placeholder="მდე" v-model="priceRange.max"
                        @input="performSearch">
                </div>
            </div>
        </div>

        <div class="filter-section">
            <div class="sect" @pointerdown="toggleSection('size')">
                ზომა
                <svg v-if="collapsed.size" class="icon icon-chevron-up icon-md" viewBox="0 0 24 24"
                    stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 15L12 9L18 15"></path>
                </svg>
                <svg v-else class="icon icon-chevron-down icon-md" viewBox="0 0 24 24" stroke="currentColor" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9L12 15L6 9"></path>
                </svg>
            </div>
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
            <div class="sect" @pointerdown="toggleSection('color')">
                ფერი
                <svg v-if="collapsed.color" class="icon icon-chevron-up icon-md" viewBox="0 0 24 24"
                    stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 15L12 9L18 15"></path>
                </svg>
                <svg v-else class="icon icon-chevron-down icon-md" viewBox="0 0 24 24" stroke="currentColor" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9L12 15L6 9"></path>
                </svg>
            </div>
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
import SliderComponent from '@/components/SliderComponent.vue';
import { mapMutations, mapGetters } from 'vuex';
export default {
    components: {
        SliderComponent
    },
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
        onMinChange(data) {
            this.priceRange.min = data
        },
        onMaxChange(data) {
            this.priceRange.max = data
        },
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
                // const storedCategories = sessionStorage.getItem('categories');

                // if (storedCategories) {
                //     const parsedCategories = JSON.parse(storedCategories);
                //     this.mainCategories = parsedCategories.mainCategories;
                //     this.Categories = parsedCategories.Categories;
                //     this.subCategories = parsedCategories.subCategories;
                //     this.colors = parsedCategories.colors;
                //     this.sizes = parsedCategories.sizes;
                //     this.brands = parsedCategories.brands;
                // } else {
                    const [response, responsee, responseee, responsecolor, responsesize, responsebrand] = await Promise.all([
                        api.get('maincategory', { tokenRequired: false }),
                        api.get('category', { tokenRequired: false }),
                        api.get('subcategory', { tokenRequired: false }),
                        api.get('colors', { tokenRequired: false }),
                        api.get('sizes', { tokenRequired: false }),
                        api.get('/brand/display', { tokenRequired: false })
                    ]);

                    const categoriesData = {
                        mainCategories: response.data,
                        Categories: responsee.data,
                        subCategories: responseee.data,
                        colors: responsecolor.data,
                        sizes: responsesize.data,
                        brands: responsebrand.data
                    };

                    sessionStorage.setItem('categories', JSON.stringify(categoriesData));

                    this.mainCategories = response.data;
                    this.Categories = responsee.data;
                    this.subCategories = responseee.data;
                    this.colors = responsecolor.data;
                    this.sizes = responsesize.data;
                    this.brands = responsebrand.data;
                // }

                // this.setCategoryFromQuery();

            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        },

        setCategoryFromQuery() {
            const currentQuery = { ...this.$route.query };
            if (currentQuery.maincategory) {
                const ids = currentQuery.maincategory.split(',');
                const obj = this.mainCategories.filter((main) => {
                    return ids.includes(String(main.id));
                });
                this.setMainCategory(obj);
            }
            if (currentQuery.category) {
                const ids = currentQuery.category.split(',');
                const obj = this.Categories.filter((main) => {
                    return ids.includes(String(main.id));
                });
                this.setCategory(obj);
            }
            if (currentQuery.subcategory) {
                const ids = currentQuery.subcategory.split(',');
                const obj = this.subCategories.filter((main) => {
                    return ids.includes(String(main.id));
                });
                this.setSubCategory(obj);
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
                path: this.$route.path,
                query: {
                    section: currentQuery.section,
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
        this.fetchCategories().then(() => {
            this.loadsavefilter();
            this.setCategoryFromQuery();
        });
    },
    watch: {
        '$route.query': {
            handler() {
                if (this.mainCategories.length) {
                    this.setCategoryFromQuery();
                    this.loadsavefilter();
                } else {
                    console.log("Waiting for categories to load");
                }
            },
            immediate: true,
        }
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
    width: 20px;
    height: 20px;
}

.inputs {
    display: flex;
    justify-content: space-between;
}

.category-modal {
    width: 100%;
    height: 100vh;
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
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    overflow-y: auto;
}


.filter-section .sect {
    font-size: 14px;
    cursor: pointer;
    display: flex;
    font-weight: 400;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f1eaea;
    padding-bottom: 10px;
}

.filter-section .sect span {
    font-size: 18px;
}

/* Hide default checkbox */
.checkbox-container input[type="checkbox"] {
    display: none;
}

/* Custom checkbox */
.checkbox-container label {
    position: relative;
    padding-left: 25px;
    cursor: pointer;
    font-size: 13px;
}

.checkbox-container label:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 13px;
    height: 13px;
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
    top: 3px;
    color: #fff;
    font-size: 10px;
}

.checkbox-container label:hover:before {
    border-color: #888;
}

.input {
    width: 50px;
    height: 20px;
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

    .checkbox-container label:hover:before {
        border-color: none;
    }

    .reset-button:hover {
        background-color: none;
    }

}
</style>
