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
                <div class="checkbox-container" v-for="(category, catIndex) in filteredCategories || []"
                    :key="catIndex">
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
                <div class="checkbox-container" v-for="(subcategory, subIndex) in filteredSubcategories || []"
                    :key="subIndex">
                    <input type="checkbox" :id="'subcategory-' + subcategory.id" v-model="selectedsubCategories"
                        :value="subcategory" @change="performSearch" />
                    <label :for="'subcategory-' + subcategory.id">{{ subcategory.name }}</label>
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
                <div class="checkbox-container" v-for="(color, colorIndex) in filteredcolor" :key="colorIndex">
                    <input type="checkbox" :id="'color-' + color.id" v-model="selectedColors" :value="color"
                        @change="performSearch" />
                    <label :for="'color-' + color.id">{{ color.color }}</label>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import api from '@/api';

export default {
    data() {
        return {
            collapsed: {
                mainCategory: false,
                category: false,
                subcategory: false,
                price: false,
                color: false,
                size: false
            },
            mainCategories: [],
            Categories: [],
            subCategories: [],

            selectedMainCategories: [],
            selectedCategories: [],
            selectedsubCategories: [],
            autoSelectedMainCategoryIds: [],
            autoSelectedCategoryIds: [],
            priceRange: {
                min: null,
                max: "",
            },
            colors: [],
            selectedColors: [],
            sizes: [],
            selectedSizes: []

        };
    },
    methods: {
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


                this.mainCategories = response.data;
                this.Categories = responsee.data;
                this.subCategories = responseee.data;
                this.colors = responsecolor.data
                this.sizes = responsesize.data;
                this.filterCategoriesAndSubcategories();
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
            this.loadSavedFilters();

        },
        resetFilters() {
            this.selectedMainCategories = [];
            this.selectedCategories = [];
            this.selectedsubCategories = [];
            this.priceRange = { min: null, max: "" };
            this.selectedColors = [];
            localStorage.removeItem('selectedMainCategories');
            localStorage.removeItem('selectedCategories');
            localStorage.removeItem('selectedsubCategories');
            localStorage.removeItem('priceRange');
            localStorage.removeItem('selectedColors');
            localStorage.removeItem('selectedSizes');
            this.performSearch();
        },

        filterCategoriesAndSubcategories() {
            const selectedMainCategoryIds = this.selectedMainCategories.map(category => category.id);

            if (selectedMainCategoryIds.length > 0) {
                this.filteredCategories = this.Categories.filter(category =>
                    selectedMainCategoryIds.includes(category.maincategory_id)
                );
                this.filteredSubcategories = this.subCategories.filter(subcategory =>
                    selectedMainCategoryIds.includes(subcategory.maincategory_id) ||
                    this.selectedCategories.map(cat => cat.id).includes(subcategory.category_id)
                );
                this.filteredcolor = this.colors
                    .filter(color => {
                        if (selectedMainCategoryIds.length > 0 && this.selectedCategories.length === 0 && this.selectedsubCategories.length === 0) {
                            return selectedMainCategoryIds.includes(color.maincategory_id);
                        }

                        if (selectedMainCategoryIds.length > 0 && this.selectedCategories.length > 0 && this.selectedsubCategories.length === 0) {
                            return selectedMainCategoryIds.includes(color.maincategory_id) &&
                                this.selectedCategories.map(cat => cat.id).includes(color.category_id);
                        }

                        if (selectedMainCategoryIds.length > 0 && this.selectedCategories.length > 0 && this.selectedsubCategories.length > 0) {
                            return selectedMainCategoryIds.includes(color.maincategory_id) &&
                                this.selectedCategories.map(cat => cat.id).includes(color.category_id) &&
                                this.selectedsubCategories.map(sub => sub.id).includes(color.subcategory_id);
                        }

                        return true;
                    })
                    .reduce((unique, color) => {
                        if (!unique.some(c => c.color === color.color)) {
                            unique.push(color);
                        }
                        return unique;
                    }, []);


            } else {
                this.filteredCategories = this.Categories;
                this.filteredSubcategories = this.subCategories;
                
                this.filteredcolor = this.colors.reduce((unique, color) => {
                    if (!unique.some(c => c.color === color.color)) {
                        unique.push(color);
                    }
                    return unique;
                }, []);
            }
        },
        loadSavedFilters() {
            const savedMainCategories = localStorage.getItem('selectedMainCategories');
            const savedCategories = localStorage.getItem('selectedCategories');
            const savedsubCategories = localStorage.getItem('selectedsubCategories');
            const savedPriceRange = localStorage.getItem('priceRange');
            const savedColors = localStorage.getItem('selectedColors');
            const savedSizes = localStorage.getItem('selectedSizes');


            if (savedMainCategories) this.selectedMainCategories = JSON.parse(savedMainCategories);
            if (savedCategories) this.selectedCategories = JSON.parse(savedCategories);
            if (savedsubCategories) this.selectedsubCategories = JSON.parse(savedsubCategories);
            if (savedPriceRange) this.priceRange = JSON.parse(savedPriceRange);
            if (savedColors) this.selectedColors = JSON.parse(savedColors);
            if (savedSizes) this.selectedSizes = JSON.parse(savedSizes);

        },

        saveFilters() {
            localStorage.setItem('selectedMainCategories', JSON.stringify(this.selectedMainCategories));
            localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
            localStorage.setItem('selectedsubCategories', JSON.stringify(this.selectedsubCategories));
            localStorage.setItem('priceRange', JSON.stringify(this.priceRange));
            localStorage.setItem('selectedColors', JSON.stringify(this.selectedColors));
            localStorage.setItem('selectedSizes', JSON.stringify(this.selectedSizes));

        },
        emitfilter() {
            this.$emit("maincategories", this.selectedMainCategories);
            this.$emit("categories", this.selectedCategories);
            this.$emit("subcategories", this.selectedsubCategories);
            this.$emit("colors", this.selectedColors);

        },

        performSearch() {
            console.log(this.selectedColors);
            const currentQuery = { ...this.$route.query };

            const maincategoryParam = this.selectedMainCategories.map(q => q.id).join(",");
            const categoryParam = this.selectedCategories.map(q => q.id).join(",");
            const subcategoryParam = this.selectedsubCategories.map(q => q.id).join(",");

            this.$router.push({
                path: `/product`,
                query: {
                    section: currentQuery.section || 'all',
                    maincategory: maincategoryParam || '',
                    category: categoryParam || '',
                    subcategory: subcategoryParam || '',
                    min: this.priceRange.min || '',
                    max: this.priceRange.max || '',
                    page: 1,
                },
            });

            if (this.selectedCategories.length > 0) {
                const autoMain = this.mainCategories.filter(main =>
                    this.selectedCategories.some(cat => cat.maincategory_id === main.id)
                );
                this.selectedMainCategories = [
                    ...new Set([
                        ...this.selectedMainCategories,
                        ...autoMain.filter(m => !this.selectedMainCategories.some(mc => mc.id === m.id))
                    ])
                ];
            }

            if (this.selectedsubCategories.length > 0) {
                const autoMain = this.mainCategories.filter(main =>
                    this.selectedsubCategories.some(sub => sub.maincategory_id === main.id)
                );
                const autoCats = this.Categories.filter(cat =>
                    this.selectedsubCategories.some(sub => sub.category_id === cat.id)
                );

                this.selectedMainCategories = [
                    ...new Set([
                        ...this.selectedMainCategories,
                        ...autoMain.filter(m => !this.selectedMainCategories.some(mc => mc.id === m.id))
                    ])
                ];
                this.selectedCategories = [
                    ...new Set([
                        ...this.selectedCategories,
                        ...autoCats.filter(c => !this.selectedCategories.some(sc => sc.id === c.id))
                    ])
                ];
            }

            if (this.selectedMainCategories.length === 0) {
                this.selectedCategories = [];
                this.selectedsubCategories = [];
            }
            this.emitfilter();
            this.filterCategoriesAndSubcategories();
            this.saveFilters();
        },

        clearAutoSelections() {
            this.selectedMainCategories = this.selectedMainCategories.filter(mc => !this.autoSelectedMainCategoryIds.includes(mc.id));
            this.selectedCategories = this.selectedCategories.filter(c => !this.autoSelectedCategoryIds.includes(c.id));
        },
    },
    watch: {
        selectedMainCategories() {
            this.filterCategoriesAndSubcategories();
        },
        selectedCategories() {
            this.filterCategoriesAndSubcategories();
        },
        selectedsubCategories() {
            this.filterCategoriesAndSubcategories();
        },
    },
    mounted() {
        this.fetchCategories();
        this.loadSavedFilters()
        this.emitfilter();
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
    max-height: 100vh;
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

/* Checkbox checked state */
.checkbox-container input[type="checkbox"]:checked+label:before {
    background-color: #171717;
    border-color: #171717;
}

/* Checkbox checked state inner tick mark */
.checkbox-container input[type="checkbox"]:checked+label:after {
    content: "✔";
    position: absolute;
    left: 5px;
    top: 2px;
    color: #fff;
    font-size: 10px;
}

/* Hover effect */
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
        background-color: white;
        height: 80%;
    }
}
</style>
