<template>
    <transition name="drawer">
        <div class="overlay" v-if="props.open" @mousedown.self="handleOverlayClick" role="dialog" aria-modal="true">
            <div class="modal-content" tabindex="-1">
                <!-- Close button -->
                <div class="close" @pointerdown="emit('close')">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"
                        fill="currentColor">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </div>

                <div class="menu-wrapper">
                    <ul>
                        <li @pointerdown.stop="handleRedirect('address-info', [])">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                                fill="currentcolor">
                                <path
                                    d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
                            </svg>
                            მისამართები
                        </li>
                        <li @pointerdown.stop="handleRedirect('status-info', [])">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                                fill="currentcolor">
                                <path
                                    d="m387-412 35-114-92-74h114l36-112 36 112h114l-93 74 35 114-92-71-93 71ZM240-40v-309q-38-42-59-96t-21-115q0-134 93-227t227-93q134 0 227 93t93 227q0 61-21 115t-59 96v309l-240-80-240 80Zm240-280q100 0 170-70t70-170q0-100-70-170t-170-70q-100 0-170 70t-70 170q0 100 70 170t170 70ZM320-159l160-41 160 41v-124q-35 20-75.5 31.5T480-240q-44 0-84.5-11.5T320-283v124Zm160-62Z" />
                            </svg>
                            სტატუსის მიხედვით
                        </li>

                        <li @pointerdown="toggleCategories">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                                fill="currentcolor">
                                <path
                                    d="M80-140v-320h320v320H80Zm80-80h160v-160H160v160Zm60-340 220-360 220 360H220Zm142-80h156l-78-126-78 126Z" />
                            </svg>
                            კატეგორიები
                            <svg v-if="!categoriesOpen" class="chevron" xmlns="http://www.w3.org/2000/svg" height="20"
                                viewBox="0 0 24 24" width="20" fill="currentColor">
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                            <svg v-else class="chevron" xmlns="http://www.w3.org/2000/svg" height="20"
                                viewBox="0 -960 960 960" width="20" fill="currentColor">
                                <path d="m288-384 192-192 192 192H288Z" />
                            </svg>
                        </li>
                        <ul v-if="categoriesOpen" class="sub-categories">
                            <li v-for="(main, mIndex) in Maincategories" :key="mIndex">
                                <div class="category-header">
                                    <span @pointerdown.stop="handleRedirect('allproduct', ['all', main.id])"
                                        class="category-name">
                                        {{ main.ka_name }}
                                    </span>
                                    <button @pointerdown="toggleMainCategory(mIndex)" class="toggle-btn">
                                        <svg v-if="!main.open" class="chevron" xmlns="http://www.w3.org/2000/svg"
                                            height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                        <svg v-else class="chevron" xmlns="http://www.w3.org/2000/svg" height="20"
                                            viewBox="0 0 24 24" width="20" fill="currentColor">
                                            <path d="M18 15l-6-6-6 6" />
                                        </svg>
                                    </button>

                                </div>

                                <ul v-if="main.open" class="sub-categories">
                                    <li v-for="(sub, sIndex) in main.categories" :key="sIndex">
                                        <div class="category-header">
                                            <span
                                                @pointerdown.stop="handleRedirect('allproduct', ['all', main.id, sub.id])"
                                                class="category-name">
                                                {{ sub.ka_name }}
                                            </span>
                                            <button @pointerdown.stop="toggleSubCategory(mIndex, sIndex)"
                                                class="toggle-btn">
                                                <svg v-if="sub.subcategories && !sub.open" class="chevron"
                                                    xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24"
                                                    width="20" fill="currentColor">
                                                    <path d="M6 9l6 6 6-6" />
                                                </svg>
                                                <svg @pointerdown.stop="toggleSubCategory(mIndex, sIndex)"
                                                    v-else-if="sub.subcategories" class="chevron"
                                                    xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24"
                                                    width="20" fill="currentColor">
                                                    <path d="M18 15l-6-6-6 6" />
                                                </svg>
                                            </button>

                                        </div>

                                        <ul v-if="sub.open && sub.subcategories" class="sub-categories">
                                            <li v-for="(child, cIndex) in sub.subcategories" :key="cIndex">
                                                <span class="category-name"
                                                    @pointerdown.stop="handleRedirect('allproduct', ['all', main.id, sub.id, child.id])">
                                                    {{ child.ka_name }}

                                                </span>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>

                        <li @pointerdown.stop="handleRedirect('allproduct', ['new'])">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"
                                fill="currentColor">
                                <path
                                    d="M9 2L7 8H2l5 3.5L5 18l4-3 4 3-2-6.5L17 8h-5L9 2zm11 14l-.75 2.25L17 19l2.25.75L20 22l.75-2.25L23 19l-2.25-.75L21 16z" />
                            </svg>
                            ახალი პროდუქტები
                        </li>

                        <li @pointerdown.stop="handleRedirect('allproduct', ['all'])">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px"
                                fill="currentcolor">
                                <path
                                    d="M263.72-96Q234-96 213-117.15T192-168v-456q0-29.7 21.15-50.85Q234.3-696 264-696h72v-16q0-60 40.5-106T480-864q60 0 102 42t42 102v24h72q29.7 0 50.85 21.15Q768-653.7 768-624v456q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72Zm.28-72h432v-456h-72v60q0 15.3-10.29 25.65Q603.42-528 588.21-528t-25.71-10.35Q552-548.7 552-564v-60H408v60q0 15.3-10.29 25.65Q387.42-528 372.21-528t-25.71-10.35Q336-548.7 336-564v-60h-72v456Zm144-528h144v-24q0-29.7-21.21-50.85-21.21-21.15-51-21.15T429-770.85Q408-749.7 408-720v24ZM264-168v-456 456Z" />
                            </svg>
                            ყველა პროდუქტი
                        </li>

                        <li class="highlight" @pointerdown.stop="handleRedirect('allproduct', ['discount'])">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                                fill="currentcolor">
                                <path
                                    d="M300-520q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T360-660q0-25-17.5-42.5T300-720q-25 0-42.5 17.5T240-660q0 25 17.5 42.5T300-600Zm360 440q-58 0-99-41t-41-99q0-58 41-99t99-41q58 0 99 41t41 99q0 58-41 99t-99 41Zm0-80q25 0 42.5-17.5T720-300q0-25-17.5-42.5T660-360q-25 0-42.5 17.5T600-300q0 25 17.5 42.5T660-240Zm-444 80-56-56 584-584 56 56-584 584Z" />
                            </svg>
                            ფასდაკლება
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import api from '@/api';
import { ref, onBeforeUnmount, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
const props = defineProps({ open: { type: Boolean, default: false } });
const emit = defineEmits(['close']);
const router = useRouter()

const categoriesOpen = ref(false);
const Maincategories = ref([]);

async function getCategories() {
    try {
        const response = await api.get('/allCategory');
        Maincategories.value = response.data;
    } catch (error) {
        console.log(error.response);
    }

}
function handleRedirect(path, params) {
    router.push({
        name: path, query: {
            section: params[0],
            maincategory: params[1],
            category: params[2],
            subcategory: params[3],
        },
    })
    console.log(params);
    emit('close');
}


function toggleCategories() {
    categoriesOpen.value = !categoriesOpen.value;
}
function toggleMainCategory(index) {
    Maincategories.value[index].open = !Maincategories.value[index].open;
}
function toggleSubCategory(mIndex, sIndex) {
    const sub = Maincategories.value[mIndex]?.categories?.[sIndex];
    if (sub?.subcategories?.length) {
        sub.open = !sub.open;
    }
}

function handleOverlayClick(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    emit('close');
}
watch(() => props.open, (val) => {
    document.body.classList.toggle('no-scroll', val);
});
onMounted(() => {
    getCategories();
}),
    onBeforeUnmount(() => {
        document.body.classList.remove('no-scroll');
    });
</script>


<style scoped>
.toggle-btn {
    display: flex;
    background: transparent;
    border: none;
    align-items: center;
}

.overlay.drawer-enter-from,
.overlay.drawer-leave-to {
    opacity: 0;
    backdrop-filter: blur(0px);
}

.overlay.drawer-enter-to,
.overlay.drawer-leave-from {
    opacity: 1;
    backdrop-filter: blur(4px);
}

.overlay.drawer-enter-active,
.overlay.drawer-leave-active {
    transition: opacity 0.25s ease, backdrop-filter 0.25s ease;
}




.sub-categories li .chevron {
    margin-left: auto;
}


.modal-content.drawer-enter-from,
.modal-content.drawer-leave-to {
    opacity: 0;
    transform: translateX(-100%) scale(0.98);
    box-shadow: none;
}

.modal-content.drawer-enter-to,
.modal-content.drawer-leave-from {
    opacity: 1;
    transform: translateX(0) scale(1);
    box-shadow: 12px 0 40px rgba(0, 0, 0, 0.25);
}

.modal-content.drawer-enter-active,
.modal-content.drawer-leave-active {
    transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}


.overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, .45);
    display: flex;
    backdrop-filter: blur(4px);

    justify-content: flex-start;
    align-items: stretch;
}

.category {
    margin-left: 25px;
}

.modal-content {
    width: 100%;
    max-width: 70%;
    background: #fff;
    color: #111827;
    box-shadow: 12px 0 30px rgba(0, 0, 0, .18);
    border-radius: 0 16px 16px 0;
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr;
    overflow: hidden;
    padding:
        max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
}

/* Close button */
.close {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
}

.close>svg {
    background: #f3f4f6;
    border-radius: 8px;
    padding: 6px;
    cursor: pointer;
    transition: background .15s ease, transform .06s ease;
}

.close>svg:hover {
    background: #e5e7eb;
}

.close>svg:active {
    transform: translateY(1px);
}

/* Menu */
.menu-wrapper {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.category-header {
    display: flex;
    justify-content: center;
    width: fit-content;
}

.sub-categories {
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.sub-categories li {
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    align-items: baseline;
    flex-direction: column;
    cursor: pointer;
    color: #1C2733;
    background: #f9fafb;
}

ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 6px;
}

ul li {
    display: flex;
    padding: 12px 14px;
    border-radius: 10px;
    gap: 5px;
    font-size: 13px;
    font-weight: 500;
    align-items: center;
    color: #1C2733;
    cursor: pointer;
    transition: background .15s ease, transform .06s ease;
}





ul li.highlight {
    background: #f5f3ff;
    color: #6d28d9;
}

@keyframes drawer-in {
    from {
        opacity: 0;
        transform: translateX(-100%);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}



@media (prefers-reduced-motion: reduce) {
    .modal-content {
        animation: none;
    }
}

@media (min-width: 768px) {
    .overlay {
        display: none;
    }
}
</style>
