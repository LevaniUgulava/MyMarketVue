<template>
    <div class="container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <ul>
                <li v-for="(item, index) in titles" :key="index" :class="{ active: item === activeTitle }"
                    @click="scrollToSection(index)">
                    {{ item.name }}
                </li>
            </ul>
        </aside>

        <!-- Content -->
        <div class="content">
            <div v-for="(item, index) in titles" :key="index" :ref="el => sectionRefs[index] = el" class="item"
                :class="{ active: item === activeTitle }">
                <h3>{{ item.name }}</h3>
                <component v-if="item.component" :is="item.component"></component>
                <div v-else class="item-text">{{ item.text }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import Rules from "@/components/Footer/Rules/ServiceandRules.vue"

const titles = reactive([
    { name: "წესები და პირობები", component: Rules },
    { name: "განმარტებები", text: "აქ იხილავთ ტერმინების განმარტებებს." },
    { name: "ანგარიშის რეგისტრაცია", text: "მომხმარებლის ანგარიშის შექმნის პროცესი." },
    { name: "შეკვეთები და შესყიდვები", text: "შეკვეთების დადება და გადახდის პროცედურები." },
    { name: "მიწოდების პირობები", text: "მიწოდების პოლიტიკა და პირობები." },
    { name: "მიწოდების ვარიანტები", text: "შესაძლო მიწოდების მეთოდები." },
    { name: "დაბრუნების პოლიტიკა", text: "გადასახდელის დაბრუნების წესები." },
    { name: "გადახდის მეთოდები", text: "გადახდის საშუალებები და პროცედურები." },
    { name: "კონტაქტი", text: "დაგვიკავშირდით ჩვენი საკონტაქტო გვერდიდან." },
    { name: "პარტნიორობა", text: "ინფორმაცია პარტნიორებისთვის." },
    { name: "კონფიდენციალობა", text: "პირად მონაცემთა დაცვის პოლიტიკა." }
])

const activeTitle = ref(titles[0])
const sectionRefs = []

const scrollToSection = (index) => {
    sectionRefs[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const onScroll = () => {
    const scrollMiddle = window.scrollY + window.innerHeight / 2
    let currentIdx = null

    for (let i = 0; i < sectionRefs.length; i++) {
        const section = sectionRefs[i]
        if (!section) continue

        const top = section.offsetTop
        const bottom = top + section.offsetHeight

        if (scrollMiddle >= top && scrollMiddle < bottom) {
            currentIdx = i
            break
        }
    }

    activeTitle.value = titles[currentIdx]
}


function checkScroll() {
    const sidebar = document.querySelector('.sidebar');
    const footer = document.querySelector('footer');
    if (!sidebar || !footer) return;

    const scrollY = window.scrollY || 0;
    const sidebarHeight = sidebar.offsetHeight;
    const footerTop = footer.getBoundingClientRect().top + scrollY;

    let topValue = 120;


    if (scrollY > 0) {
        topValue = Math.max(80, 120 - scrollY);
    }

    const maxTop = footerTop - sidebarHeight - 10;
    if (scrollY + topValue > maxTop) {
        topValue = maxTop - scrollY;
    }

    document.documentElement.style.setProperty('--sidebar-top', `${topValue}px`);
}






onMounted(() => {
    checkScroll();
    window.addEventListener('scroll', onScroll)
    window.addEventListener('scroll', checkScroll)

})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('scroll', checkScroll)

})
</script>

<style scoped>
.container {
    display: flex;
    gap: 20px;
    max-width: 1400px;
    margin-top: 20px;
}

/* Sidebar */
.sidebar {
    position: fixed;
    top: var(--sidebar-top);
    width: 250px;
    border-radius: 10px;
    font-size: 13px;
    padding: 15px;
    flex-shrink: 0;
}

.sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.sidebar li {
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s ease;
    color: #333;
}

.sidebar li:hover {
    background: #e6f0ff;
    color: #007bff;
}

.sidebar li.active {
    border-left: 5px solid #007bff;
    background: #e6f0ff;
    font-weight: bold;
}

.content {
    flex: 1;
    margin-left: 310px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 20px;
    font-family: "FiraGO", sans-serif;
}

.item {
    border-radius: 8px;
    padding: 20px;
    width: 95%;
    transition: all 0.3s ease;
}

.item.active {
    border-left: 5px solid #007bff;
    background: #eef6ff;
}

.item h3 {
    margin-bottom: 10px;
}

.item-text {
    font-size: 14px;
    color: #333;
    line-height: 1.6;
}
</style>
