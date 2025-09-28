<template>
    <section v-if="getApiLoaded" class="cat-wrap" aria-labelledby="cat-head">
        <header class="cat-head">
            <div class="filters-left">
                <input v-model="q" class="search" type="search" placeholder="ძიება კატეგორიებში..."
                    aria-label="ძიება კატეგორიებში" />
            </div>

            <div class="filters-right">
                <button class="chip" :class="{ active: activeView === 'grid' }" @click="toggleView"
                    @keydown.enter.prevent="toggleView" @keydown.space.prevent="toggleView"
                    :aria-pressed="activeView === 'grid'"
                    :title="activeView === 'carousel' ? 'გადაიყვანე Grid-ზე' : 'გადაიყვანე Carousel-ზე'">
                    <svg v-if="activeView === 'carousel'" xmlns="http://www.w3.org/2000/svg" height="24px"
                        viewBox="0 -960 960 960" width="24px" fill="#10B981">
                        <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="#10B981">
                        <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
                    </svg>
                </button>
            </div>
        </header>

        <div v-if="activeView === 'carousel' && filtered.length > 0" class="carousel" tabindex="0"
            aria-roledescription="scrollable list" :aria-label="`კატეგორიები (${filtered.length})`">
            <div v-for="cat in filtered" :key="cat.id" class="card" @click="onClick(cat)" tabindex="0"
                @keydown.enter="onClick(cat)">
                <div class="hero">
                    <img :src="cat.image_url" :alt="cat.ka_name" loading="lazy" decoding="async" />
                    <div class="ring"></div>
                    <div class="badge">{{ cat.count }}+</div>
                </div>
                <div class="meta">
                    <h3 class="title">{{ cat.ka_name }}</h3>
                    <p class="subtitle">{{ cat.subtitle }}</p>
                </div>
            </div>
        </div>


        <ul v-else-if="activeView === 'grid' && filtered.length > 0" class="grid" role="list">
            <li v-for="cat in filtered" :key="cat.id" class="gcard" @click="onClick(cat)" tabindex="0"
                @keydown.enter="onClick(cat)">
                <div class="thumb">
                    <img :src="cat.image_url" :alt="cat.ka_name" loading="lazy" decoding="async" />
                    <div class="gradient"></div>
                </div>
                <div class="text">
                    <span class="gtitle">{{ cat.ka_name }}</span>
                    <span class="gsub">{{ cat.subtitle }}</span>
                </div>
                <span class="pill">{{ cat.count }} საქ.</span>
            </li>
        </ul>
        <div class="noCategory" v-else>
            <p>კატეგორიები არ მოიძებნა</p>
        </div>


    </section>

    <div v-else class="skeleton-wrapper">
        <header class="cat-head-skeleton">
            <div class="filters-skeleton"></div>
        </header>
        <div v-for="n in 5" :key="n" class="skeleton-item">
            <div class="skeleton-thumb"></div>
            <div class="title-skeleton">
                <div class="skeleton-text"></div>
                <div class="skeleton-sub"></div>
            </div>
        </div>
    </div>
</template>
<script setup>
import router from '@/router';
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex';

const store = useStore();

const activeView = ref('carousel')
const q = ref('')
const categories = ref([])

const getCategories = computed(() => store.getters['product/getAllCategory']);
const getApiLoaded = computed(() => store.getters['product/getApiLoaded']);

watch(getCategories, (list) => {
    const src = Array.isArray(list) ? list : [];
    categories.value = src.map(d => ({
        id: d.id,
        ka_name: d.ka_name ?? '',
        subtitle: Array.isArray(d.subcategories) ? d.subcategories.map(s => s?.ka_name ?? '').filter(Boolean).join(', ') : '',
        image_url: Array.isArray(d.image_url) ? (d.image_url[0] ?? '') : (d.image_url ?? ''),
        count: d.count ?? 0,
    }));
}, { immediate: true });

const filtered = computed(() => {
    const term = q.value?.toLowerCase().trim()
    if (!term) return categories.value
    return categories.value.filter(c => {
        const name = (c.ka_name ?? '').toLowerCase()
        const sub = (c.subtitle ?? '').toLowerCase()
        return name.includes(term) || sub.includes(term)
    })
})

function toggleView() {
    activeView.value = activeView.value === 'carousel' ? 'grid' : 'carousel'
}

function onClick(cat) {
    router.push({ name: 'allproduct', query: { section: 'all', category: cat.id } })
}

</script>




<style scoped>
.noCategory {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 213px;
    color: #555;
    background-color: #f5f5f590;
    border-radius: 12px;
    border: 1px dashed #bbb;
    width: 100%;
    text-align: center;
}

.noCategory p {
    margin: 0;
    font-weight: bold;
}

.cat-head-skeleton {
    display: flex;
    width: 100%;
}



.filters-skeleton {
    height: 38px;
    width: clamp(180px, 28vw, 200px);
    background-color: #ccc;
    border-radius: 12px;
    animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    padding: 28px 18px 18px;
}

.skeleton-item {
    width: 100%;
    max-width: 250px;
    padding: 6px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
}

.skeleton-thumb {
    width: 100%;
    height: 150px;
    background-color: #ccc;
    border-radius: 16px;
    margin-bottom: 8px;
    animation: pulse 1.5s infinite ease-in-out;

}

.title-skeleton {
    width: 100%;
    display: flex;
    flex-direction: column;

}

@keyframes pulse {
    0% {
        background-color: #ccc;
    }

    50% {
        background-color: #e0e0e0;
    }

    100% {
        background-color: #ccc;
    }
}

.skeleton-text {
    width: 40%;
    height: 20px;
    background-color: #ccc;
    margin-bottom: 8px;
    border-radius: 4px;
    animation: pulse 1.5s infinite ease-in-out;

}

.skeleton-sub {
    width: 80%;
    height: 15px;
    background-color: #ccc;
    border-radius: 4px;
    animation: pulse 1.5s infinite ease-in-out;

}

.cat-wrap {
    width: min(1400px, 100%);
    margin: 0 auto;
    padding: 28px 18px 18px;
    background: transparent;
    border-radius: 26px;
    overflow-y: auto;
    scrollbar-width: none;
}

.cat-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
}

.filters-left {
    flex: 1;
    display: flex;
}

.filters-right {
    display: flex;
    gap: 10px;
}

.filters {
    display: flex;
    gap: 10px;
    align-items: center;
}

.search {
    height: 38px;
    width: clamp(180px, 28vw, 200px);
    border: 1px solid #ccc;
    background: #f7f5f5;
    border-radius: 12px;
    padding: 0 12px;
    outline: none;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.search::placeholder {
    color: #8b8a8a;
}

.chip {
    height: 36px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: var(--card);
    color: var(--text);
    cursor: pointer;
    transition: transform .15s ease, border-color .2s ease, background .2s ease;
}

.chip:hover {
    transform: translateY(-1px);
}

.chip.active {
    border-color: transparent;
    background: linear-gradient(135deg, var(--brand), var(--brand2));
    color: white;
}

.carousel {
    display: flex;
    gap: 18px;
    overflow-x: auto;
    padding: 6px;
    scroll-snap-type: x mandatory;
}

.carousel .card,
.grid .card {
    width: 17%;
    flex-shrink: 0;
}

.carousel::-webkit-scrollbar {
    height: 10px;
}

.carousel::-webkit-scrollbar-thumb {
    border-radius: 999px;
}

.card {
    position: relative;
    padding: 10px;
    scroll-snap-align: start;
    width: 48%;
    cursor: pointer;
    transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
    outline: none;
}


.card:hover {
    transform: translateY(-4px);
    border-color: rgba(124, 49, 201, 0.35);
}

.hero,
.thumb {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    aspect-ratio: 16/10;
    background: #0c0c0f;
}

.hero img,
.thumb img {
    width: 240px;
    height: 150px;
    object-fit: cover;
    transform: scale(1.02);
    transition: transform .5s ease;
}

.card:hover .hero img,
.thumb img {
    transform: scale(1.06);
}

.ring {
    position: absolute;
    inset: -1px;
    border-radius: 18px;
    pointer-events: none;
    background: conic-gradient(from 180deg, rgba(124, 49, 201, 0.6), rgba(254, 124, 163, 0.6), rgba(124, 49, 201, 0.6));
    filter: blur(16px) saturate(1.1);
    opacity: .25;
    transition: opacity .25s ease;
}

.card:hover .ring {
    opacity: .5;
}

.badge {
    position: absolute;
    right: 10px;
    top: 10px;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    box-shadow: 0 6px 14px rgba(124, 49, 201, .35);
}

.meta {
    padding: 10px 4px 2px;
}

.title {
    font-size: 16px;
    font-weight: 800;
    letter-spacing: -.01em;
    margin: 0 0 2px 0;
}

.subtitle {
    font-size: 12.5px;
    line-height: 1.35;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* ------- Grid ------- */
.grid {
    display: grid;
    gap: 17px;
    margin: 0;
    padding: 0;
    grid-template-columns: repeat(5, minmax(250px, 1fr));
}

.gcard {
    position: relative;
    padding: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: transform .2s ease, border-color .2s ease;
    outline: none;
}

.gcard:hover {
    transform: translateY(-3px);
    border-color: rgba(124, 49, 201, 0.35);
}

.gcard:focus-visible {
    box-shadow: 0 0 0 3px rgba(124, 49, 201, 0.35), var(--shadow);
}

.gcard:hover .thumb img {
    transform: scale(1.07);
}

.gradient {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(180deg, transparent 55%, rgba(12, 12, 15, .65));
}

.text {
    position: absolute;
    left: 20px;
    bottom: 20px;
    right: 10px;
    display: grid;
    gap: 2px;
}

.gtitle {
    color: #fff;
    font-weight: 800;
    letter-spacing: -.01em;
    font-size: 14.5px;
}

.gsub {
    color: rgba(255, 255, 255, .9);
    font-size: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.pill {
    position: absolute;
    top: 20px;
    left: 20px;
    background: linear-gradient(135deg, var(--brand), var(--brand2));
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 6px 10px;
    border-radius: 999px;
    box-shadow: 0 6px 14px rgba(124, 49, 201, .35);
}

/* Reduce motion */
@media (prefers-reduced-motion: reduce) {

    .card,
    .gcard,
    .chip,
    .hero img,
    .thumb img {
        transition: none !important;
    }
}

/* Small screens tuning */
@media (max-width: 767px) {
    .cat-wrap {
        border-radius: 0;
        padding: 0;
    }

    .cat-head {
        margin-bottom: 0;
        padding-top: 30px;
    }

    .hero img,
    .thumb img {
        width: 100%;
        height: auto;
    }

    .carousel {
        gap: 5px;
    }

    .carousel .card {
        width: 45%;
        flex-shrink: 0;
    }

    .title {
        font-size: 13px;
    }

    .subtitle {
        white-space: wrap;
        font-size: 11px;
    }

    .filters .chip {
        display: none;
    }

    .grid {
        gap: 5px;
        grid-template-columns: repeat(2, minmax(45%, 1fr));
    }

    .gsub {
        white-space: wrap;
    }

    .gcard {
        padding: 6px;
    }
}

@media (min-width: 768px) and (max-width: 1024px) {
    .carousel {
        gap: 12px;
    }
}
</style>
