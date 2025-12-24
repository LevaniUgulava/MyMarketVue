<template>
    <transition name="fade">
        <div class="search-container" v-if="props.open">
            <div class="search-input">
                <input v-model="searchname" @input="performLocalSearch" type="text" placeholder="რას ეძებ?">
                <button @pointerdown="performSearch" class="search-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="currentcolor">
                        <path
                            d="M779.38-153.85 528.92-404.31q-30 25.54-69 39.54t-78.38 14q-96.1 0-162.67-66.53-66.56-66.53-66.56-162.57 0-96.05 66.53-162.71 66.53-66.65 162.57-66.65 96.05 0 162.71 66.56Q610.77-676.1 610.77-580q0 41.69-14.77 80.69t-38.77 66.69l250.46 250.47-28.31 28.3ZM381.54-390.77q79.61 0 134.42-54.81 54.81-54.8 54.81-134.42 0-79.62-54.81-134.42-54.81-54.81-134.42-54.81-79.62 0-134.42 54.81-54.81 54.8-54.81 134.42 0 79.62 54.81 134.42 54.8 54.81 134.42 54.81Z">
                        </path>
                    </svg> ძიება
                </button>
            </div>

            <TermSection v-if="!searchname" title="პოპულარული საძიებო ტერმინები" :items="popularterms"
                @select="selectTerm" />

            <TermSection v-if="recentlyViewed.terms.length && !searchname" title="ბოლოს მოძიებული ტერმინები"
                :items="recentlyViewed.terms" @select="selectTerm" />


            <div class="title" v-if="searchname.length == 0">ბოლო დროს ნანახი</div>
            <div class="title" v-else>მოძიებული პროდუქტები</div>

            <div class="cards-container">
                <div class="cards">
                    <SkeletonGrid v-if="loading" />
                    <ProductGrid v-else :items="recentlyViewed.products" @open="openProduct" />
                </div>

                <div v-if="!loading && recentlyViewed.products.length == 0" class="title">
                    მოცემულ ტერმინზე პროდუქტი არ მოიძებნა
                </div>

                <button v-if="recentlyViewed.pagination.current < recentlyViewed.pagination.last"
                    @click="loadMoreProducts" class="load-more-btn">
                    <span>შედეგების ნახვა</span>
                </button>
            </div>
        </div>
    </transition>
</template>

<script setup>
import api from '@/api';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/mixin/reuse';
import ProductGrid from './ProductGrid.vue';
import TermSection from './TermSection.vue';
import SkeletonGrid from './SkeletonGrid.vue';
const router = useRouter();
const route = useRoute();
const currentPage = ref(1);
const loading = ref(true);
const searchname = ref('');
const recentlyViewed = reactive({
    terms: [],
    products: [],
    pagination: {
        current: 0,
        last: 0,
        total: 0
    }
});
const isAuth = useAuth();
const props = defineProps({
    open: {
        type: Boolean,
        Required: true,
    }

});
const emit = defineEmits('close');
async function performLocalSearch(resetPage = true) {
    try {
        const term = searchname.value.trim();

        if (resetPage) {
            currentPage.value = 1;
            recentlyViewed.products = [];
            recentlyViewed.pagination = { current: 0, last: 0, total: 0 };
        }

        if (!term) {
            loading.value = true;
            await getRecently();
            return;
        }

        loading.value = true;

        const response = await withMinimumDelay(
            api.post(`/product/search?page=${currentPage.value}`, {
                searchname: searchname.value,
            }),
            450
        );

        const payload = response.data;

        if (currentPage.value === 1) {
            recentlyViewed.products = payload.data;
        } else {
            recentlyViewed.products.push(...payload.data);
        }

        recentlyViewed.pagination = {
            current: payload.current_page,
            last: payload.last_page,
            total: payload.total,
        };
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

async function withMinimumDelay(promise, delay = 400) {
    const start = Date.now();
    const result = await promise;

    const elapsed = Date.now() - start;
    if (elapsed < delay) {
        await new Promise(resolve => setTimeout(resolve, delay - elapsed));
    }

    return result;
}

async function loadMoreProducts() {
    if (
        loading.value ||
        recentlyViewed.pagination.current >= recentlyViewed.pagination.last
    ) return;

    currentPage.value++;
    await performLocalSearch(false); // resetPage = false → append mode
}

function performSearch() {
    const currentQuery = { ...route.query };

    router.push({
        path: `/product`,
        query: {
            ...currentQuery,
            section: currentQuery.section || 'all',
            searchname: searchname.value,
            page: 1,
        },
    });
    if (isAuth) {
        searchHistory(searchname.value);
    }


    emit('close');
}
function selectTerm(item) {

    searchname.value = item.term ?? item;
}
async function getRecently() {
    try {
        const response = await api.get('/history/getRecently', {
            tokenRequired: true
        });

        recentlyViewed.terms = response.data.terms ?? [];
        recentlyViewed.products = Object.values(response.data.products ?? {});

        // შეგიძლია pagination-იც შეავსო, რომ შემდეგში მარტივად იმუშაო
        recentlyViewed.pagination = {
            current: 1,
            last: 1,
            total: recentlyViewed.products.length,
        };
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

async function searchHistory(search) {
    try {
        const response = await api.post('/history/recentlySearch', {
            term: search
        }, {
            tokenRequired: true
        })
        console.log(response);

    } catch (error) {
        console.log(error);
    }
}

const popularterms = ref(['კაბა', 'შარვალი'])
onMounted(() => {
    getRecently();
})
</script>
<style scoped>
.search-container {
    position: absolute;
    top: 80px;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: white;
    border-top: 1px solid #eaeaea;
    z-index: 999;
    padding: 24px 64px 48px;
    animation: fadeIn 0.25s ease-in-out;
}

.search-input {
    display: flex;
    flex: 0 0 auto;
    gap: 10px;
}

.search-input input {
    width: 100%;
    padding: 16px 24px;
    font-size: 15px;
    border-radius: 10px;
    background-color: transparent;
    border: 1px solid #dcdcdc;
}

.search-btn {
    display: flex;
    align-items: center;
    font-size: 14px;
    border-radius: 10px;
    border: none;
    background-color: #102556;
    color: white;
    gap: 5px;
    width: auto;
    justify-content: center;
    min-width: 160px;
    cursor: pointer;

    padding: 10px 20px;
}

.search-btn:hover {
    background-color: #162E63;

}

.search-input input:focus {
    columns: black;
}

.popular {
    display: flex;
    flex: 0 0 auto;
    font-size: 13px;
    padding-top: 10px;
    gap: 5px;
    flex-direction: column;
}

.popular .items {
    display: flex;
    gap: 10px;
}


.items .item {
    display: flex;
    align-items: center;
    gap: 5px;
    position: relative;
    cursor: pointer;
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 8px;

}

.items .item:hover {
    background-color: #e8e7e7;

}


.cards-container {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    font-size: 13px;
    overflow-y: auto;
    padding-bottom: 50px;
    gap: 15px;
}

.title {
    font-size: 13px;
    margin-top: 5px;
    margin-bottom: 5px;

}

.cards-container::-webkit-scrollbar {
    width: 2px;
}

.cards-container::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 10px;
}

.cards-container::-webkit-scrollbar-thumb {
    background-color: #888;
}

.cards-container::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}

.load-more-btn {
    position: relative;
    padding: 10px 20px;
    background-color: transparent;
    border: 1px solid #eaeaea;
    width: 200px;
    border-left: 2px solid black;
    cursor: pointer;
    overflow: hidden;
    color: black;
    transition: color 0.3s ease-in-out;
}

.load-more-btn::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    color: white;
    background-color: black;
    transition: left 0.3s ease-in-out;
}

.load-more-btn:hover::after {
    left: 0;
}

.load-more-btn:hover {
    color: white;
}

.load-more-btn span {
    position: relative;
    display: flex;
    justify-content: center;
    z-index: 1;
}


.cards {
    display: grid;
    gap: 20px;
}

.card {
    border: 1px solid #eaeaea;
    display: flex;
    gap: 15px;
    align-items: center;
}

.detail {
    display: flex;
    flex-direction: column;
}

.detail .name {
    font-size: 14px;
    font-weight: 500;
}

.detail .price {
    color: #2b2731;
    font-size: 13px;
    margin-top: 5px;
    display: flex;
    margin-bottom: 5px;
    font-weight: bold;
    gap: 3px;
}

.card img {
    width: 96px;
    height: 120px;
    padding: 10px;

}
</style>