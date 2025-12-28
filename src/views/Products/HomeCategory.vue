<template>
    <section v-if="getApiLoaded" class="wrap">
        <div class="grid" aria-label="categories">
            <article v-for="cat in filtered" :key="cat.id" class="tile" role="button" tabindex="0" @click="onClick(cat)"
                @keydown.enter.prevent="onClick(cat)">
                <img class="img" :src="cat.cover" :alt="cat.ka_name" loading="lazy" decoding="async" />
                <div class="shade" aria-hidden="true"></div>

                <div class="text">
                    <div class="count">{{ cat.count }} products</div>
                    <div class="title">{{ cat.ka_name }}</div>
                </div>
            </article>
        </div>
    </section>
</template>

<script setup>
import router from '@/router'
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const q = ref('')
const categories = ref([])

const getCategories = computed(() => store.getters['product/getAllCategory'])
const getApiLoaded = computed(() => store.getters['product/getApiLoaded'])

watch(
    getCategories,
    (list) => {
        const arr = Array.isArray(list) ? list : []
        categories.value = arr.map((c) => {
            const imgs = Array.isArray(c.image_url) ? c.image_url : c.image_url ? [c.image_url] : []
            return {
                id: c.id,
                ka_name: c.ka_name ?? '',
                count: c.count ?? 0,
                cover: imgs[0] ?? '', // მთავარი ფოტო (როგორც სქრინზე)
            }
        })
    },
    { immediate: true }
)

const filtered = computed(() => {
    const term = q.value.toLowerCase().trim()
    if (!term) return categories.value
    return categories.value.filter((c) => (c.ka_name ?? '').toLowerCase().includes(term))
})

function onClick(cat) {
    router.push({ name: 'allproduct', query: { section: 'all', category: cat.id } })
}
</script>

<style scoped>
.wrap {
    width: 90%;
    margin: auto;

}

.grid {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 28px;
}

/* card */
.tile {
    position: relative;
    height: 520px;
    border-radius: 26px;
    overflow: hidden;
    cursor: pointer;
    outline: none;
    background: #ddd;
    box-shadow: 0 10px 30px rgba(0, 0, 0, .08);
    transition: transform .25s ease, box-shadow .25s ease;
}

.tile:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, .12);
}

/* image */
.img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.02);
    transition: transform .6s ease;
}

.tile:hover .img {
    transform: scale(1.07);
}

.shade {
    position: absolute;
    inset: 0;
    background: radial-gradient(1200px 600px at 30% 60%, rgba(0, 0, 0, .35), rgba(0, 0, 0, 0) 55%);
    pointer-events: none;
}

.text {
    position: absolute;
    left: 35%;
    bottom: 50%;
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-shadow: 0 10px 30px rgba(0, 0, 0, .35);
}

.count {
    font-size: 14px;
    opacity: .5;
    font-weight: 500;
}

.title {
    font-size: 15px;
    line-height: 1.05;
    font-weight: 800;
    letter-spacing: -0.5px;
}

/* responsive */
@media (max-width: 1200px) {
    .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .tile {
        height: 460px;
    }

    .title {
        font-size: 34px;
    }
}

@media (max-width: 640px) {
    .wrap {
        padding: 28px 16px;
    }

    .grid {
        grid-template-columns: 1fr;
        gap: 18px;
    }

    .tile {
        height: 420px;
        border-radius: 22px;
    }

    .text {
        left: 22px;
        bottom: 90px;
    }

    .title {
        font-size: 32px;
    }
}
</style>
