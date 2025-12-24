<template>
    <teleport to="body">
        <!-- Side Panel Overlay -->
        <transition name="overlay-fade">
            <div v-if="open" class="overlay" @click.self="close" role="dialog" aria-modal="true" aria-label="site menu">
                <div class="side-panel" @keydown.esc.prevent="close" tabindex="0" ref="panel">
                    <div class="menu-wrap">
                        <!-- პირადი ჯგუფი -->
                        <div class="menu-group">
                            <p class="menu-title">პირადი</p>
                            <div class="menu-item" :class="{
                                inactive: activeCategoryId
                            }" @click="redirectaddress">მისამართები
                            </div>
                            <div class="menu-item" :class="{
                                inactive: activeCategoryId
                            }">სტატუსი</div>
                            <div class="menu-item" :class="{
                                inactive: activeCategoryId
                            }">პროფილი</div>
                        </div>

                        <!-- კატეგორიები ჯგუფი -->
                        <div class="menu-group">
                            <p class="menu-title">კატეგორიები</p>
                            <div v-for="(item, index) in categories" :key="index" class="menu-item" :class="{
                                active: activeCategoryId === item.id,
                                inactive: activeCategoryId && activeCategoryId !== item.id
                            }" @click="handle(item)">
                                <span class="menu-text">{{ item.ka_name }}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                    width="24px" fill="currentcolor">
                                    <path
                                        d="m517.85-480-184-184L376-706.15 602.15-480 376-253.85 333.85-296l184-184Z" />
                                </svg>
                            </div>

                        </div>

                        <div class="menu-group">
                            <p class="menu-title">კოლექციები</p>
                            <div class="menu-item" :class="{
                                inactive: activeCategoryId
                            }" @click="redirectaddress">ყველა კოლექცია</div>
                            <div class="menu-item" :class="{
                                inactive: activeCategoryId
                            }" @click="redirectaddress">ახალი კოლექცია</div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>

    <SmallSectionModal :open="nestedModalOpen" :category="selectedCategory" @update:open="nestedModalOpen = $event" />
</template>

<script setup>
import { ref, onMounted, watch, defineEmits, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';
import SmallSectionModal from '../SmallSectionModal.vue';

const props = defineProps({
    open: Boolean
});

watch(() => props.open, (newVal) => {
    console.log('props.open changed:', newVal)
    if (!newVal) {
        nestedModalOpen.value = false;
        activeCategoryId.value = null;
    }
})
const emit = defineEmits(['update:open']);

const router = useRouter();
const categories = ref([]);
const panel = ref(null);
const activeCategoryId = ref(null);

const nestedModalOpen = ref(false);
const selectedCategory = ref(null);

function close() {
    emit('update:open', false);
}

function redirectaddress() {
    router.push('/profile/address');
    close();
}

function handle(item) {
    selectedCategory.value = item;
    nestedModalOpen.value = true;
    activeCategoryId.value = item.id;

}
function checkScroll() {
    const maxTop = 120;
    const scrollY = window.scrollY || 0;
    const topValue = Math.max(80, maxTop - scrollY);

    document.documentElement.style.setProperty('--modal-top', `${topValue}px`);
}



async function getMaincategories() {
    const category = sessionStorage.getItem('maincategories');
    if (!category) {
        try {
            const response = await api.get('/maincategory', { tokenRequired: false });
            categories.value = response.data;
            sessionStorage.setItem('maincategories', JSON.stringify(response.data));
        } catch (error) {
            console.error(error);
        }
    } else {
        try {
            categories.value = JSON.parse(category);
        } catch (e) {
            categories.value = [];
        }
    }
}

watch(() => props.open, (val) => {
    if (val) setTimeout(() => panel.value?.focus(), 50);
});

onMounted(() => getMaincategories(), checkScroll(), window.addEventListener('scroll', checkScroll)
);
</script>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    top: var(--modal-top);
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: stretch;
    border-top: 1px solid #eaeaea;
    z-index: 9999;
    backdrop-filter: blur(3px);
    transition: all 10s ease-in-out;

}

.side-panel {
    width: 320px;
    max-width: 80%;
    background: #fff;
    padding: 36px 28px;
    padding-left: 60px;
    outline: none;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
}

.menu-wrap {
    display: flex;
    flex-direction: column;
    gap: 28px;
}

.menu-group {
    display: flex;
    flex-direction: column;
}

.menu-title {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: #999;
    margin-bottom: 12px;
    transition: all 0.2s ease;

}

.menu-item {
    cursor: pointer;
    padding: 12px 4px;
    display: flex;
    border-radius: 6px;
    transition: all .18s ease;
    font-family: "Georgia", "Times New Roman", serif !important;
    font-size: 20px;
    color: #111;
    line-height: 1;
    margin-bottom: 6px;
    position: relative;
}

.menu-item::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -6px;
    height: 2px;
    width: 0;
    background: #000;
    transition: width .22s ease;
}

.menu-item:hover::after {
    width: 35%;
}

.menu-item.active::after {
    width: 35%;
}

.menu-item.inactive {
    color: #757575;
    filter: blur(1px);
}


.overlay-fade-enter-active,
.overlay-fade-leave-active {
    transition: opacity .22s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
    opacity: 0;
}
</style>
