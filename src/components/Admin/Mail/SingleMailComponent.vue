<template>
    <div class="template-card" v-if="template">
        <div class="template-header">
            <h2>{{ template.name }}</h2>
            <span class="badge" :class="template.generation">{{ template.generation }}</span>
        </div>

        <div class="versions-grid">
            <div class="version-card" v-for="version in template.versions" :key="version.id"
                :class="{ active: version.active === 1 }">
                <div class="thumb" :style="{ backgroundImage: `url(${thumbnail(version.thumbnail_url)})` }"></div>

                <div class="version-content">
                    <div class="version-header">
                        <h3>{{ version.name }}</h3>
                        <div class="active-container">
                            <span class="status">{{ version.active === 1 ? 'Active' : 'Inactive' }}</span>
                            <button class="toggle-btn" :class="{ 'is-on': version.active }"
                                @click="setActive(version.active, template.id, version.id)">
                                <span class="toggle-circle" />
                            </button>
                        </div>


                    </div>
                    <p class="subject">{{ version.subject || 'No subject' }}</p>
                    <div class="meta">
                        <span>Updated: {{ format(version.updated_at) }}</span>
                        <button class="copy" @click="copy(version.id)">Copy ID</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'

const route = useRoute()
const template = ref(null)
const loading = ref(true)
const error = ref(null)

const id = route.params.id

onMounted(async () => {
    try {
        const response = await api.get(`template/${id}`)
        template.value = response.data
    } catch (err) {
        error.value = err.message || 'დატვირთვის შეცდომა'
    } finally {
        loading.value = false
    }
})

async function setActive(active, template_id, version_id) {
    if (active) {
        return;
    }
    try {
        const response = await api.post(`/template/${template_id}/version/${version_id}`, {});
        if (response.data === 200) {
            const responsee = await api.get(`template/${template_id}`)
            template.value = responsee.data

        }
    } catch (error) {
        console.log(error.response.message);
    }

}

function format(dateStr) {
    const d = new Date(dateStr)
    return isNaN(d) ? dateStr : d.toLocaleString()
}

function thumbnail(url) {
    if (!url) return ''
    return url.startsWith('//') ? 'https:' + url : url
}

async function copy(text) {
    try {
        await navigator.clipboard.writeText(text)
    } catch (err) {
        console.warn('Copy failed', err)
    }
}
</script>


<style scoped>
.active-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.toggle-btn {
    width: 48px;
    height: 26px;
    border-radius: 9999px;
    background-color: #e5e7eb;
    /* gray-200 */
    border: none;
    cursor: pointer;
    padding: 3px;
    display: flex;
    align-items: center;
    transition: background-color 0.3s ease;
    position: relative;
}

.toggle-btn .toggle-circle {
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-btn.is-on {
    background-color: #4ade80;
    /* green-400 */
}

.toggle-btn.is-on .toggle-circle {
    transform: translateX(22px);
}

.template-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 16px;
}

.template-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 20px 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.template-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
}

.template-header h2 {
    margin: 0;
    font-size: 22px;
    color: #1e293b;
}

.badge {
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 999px;
    background: #e5e7eb;
    color: #334155;
    text-transform: uppercase;
    font-weight: 500;
}

.badge.dynamic {
    background: rgba(37, 99, 235, 0.12);
    color: #1e3a8a;
}

.badge.legacy {
    background: rgba(168, 85, 247, 0.15);
    color: #581c87;
}

.versions-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.version-card {
    display: flex;
    width: 100%;
    max-width: 100%;
    min-height: 300px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #f9fafb;
    transition: 0.2s ease;
    overflow: hidden;
}

.version-card.active {
    border-color: #059669;
    box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.3);
}

.thumb {
    width: 300px;
    min-width: 120px;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-color: #f3f4f6;
}

.version-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    gap: 8px;
}

.version-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.version-header h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
}

.status {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
}

.subject {
    font-size: 14px;
    color: #475569;
    line-height: 1.4;
}

.meta {
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #64748b;
}

.copy {
    background: transparent;
    border: 1px solid #cbd5e1;
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
}

.copy:hover {
    background: #e0f2fe;
}

@media (max-width: 640px) {
    .version-card {
        flex-direction: column;
    }

    .thumb {
        width: 100%;
        height: 160px;
    }
}
</style>
