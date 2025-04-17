const state = {
    selectedMainCategories: getLocalStorage('selectedMainCategories'),
    selectedCategories: getLocalStorage('selectedCategories'),
    selectedsubCategories: getLocalStorage('selectedsubCategories'),
    priceRange: getLocalStorage('priceRange'),
    selectedColors: getLocalStorage('selectedColors'),
    selectedSizes: getLocalStorage('selectedSizes'),
    selectedBrands: getLocalStorage('selectedBrands')

};
function getLocalStorage(key) {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) {
        if (key === 'priceRange') {
            return { min: null, max: "" };
        }
        return [];
    }

    try {
        const parsedValue = JSON.parse(storedValue);
        
        if (Array.isArray(parsedValue)) {
            return parsedValue;
        } 
        else if (key === 'priceRange' && typeof parsedValue === 'object') {
            return parsedValue;
        } 
        else {
            if (key === 'priceRange') {
                return { min: null, max: "" }; 
            }
            return [];
        }
    } catch (e) {
        console.error(`Error parsing JSON from localStorage for ${key}: `, e);
        return key === 'priceRange' ? { min: null, max: "" } : [];  
    }
}


const mutations = {
    setMainCategory(state, category) {
        state.selectedMainCategories = category;
        localStorage.setItem("selectedMainCategories", JSON.stringify(category));
    },
    setCategory(state, category) {
        state.selectedCategories = category;
        localStorage.setItem("selectedCategories", JSON.stringify(category));
    },
    setSubCategory(state, category) {
        state.selectedsubCategories = category;
        localStorage.setItem("selectedsubCategories", JSON.stringify(category));
    },
    setPriceRange(state ,pricerange){
        state.priceRange = pricerange;
        localStorage.setItem("priceRange", JSON.stringify(pricerange));

    },
    setColors(state, color) {
        state.selectedColors = color;
        localStorage.setItem("selectedColors", JSON.stringify(color));
    },
    setSizes(state, size) {
        state.selectedSizes = size;
        localStorage.setItem("selectedSizes", JSON.stringify(size));
    },
    setBrands(state, brand) {
        state.selectedBrands = brand;
        localStorage.setItem("selectedBrands", JSON.stringify(brand));
    },
};

const getters = {
    getMainCategory: (state) => state.selectedMainCategories,
    getCategory: (state) => state.selectedCategories,
    getSubCategory: (state) => state.selectedsubCategories,
    getPriceRange: (state) => state.priceRange,
    getColors: (state) => state.selectedColors,
    getSizes: (state) => state.selectedSizes,
    getBrands: (state) => state.selectedBrands,
};

export default {
    namespaced: true,
    state,
    mutations,
    getters
};
