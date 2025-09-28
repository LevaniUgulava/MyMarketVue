<template>
    <div class="sgtg-wrap">
        <header class="sgtg-header">
            <div class="sgtg-controls">
                <div class="sgtg-input-group">
                    <input v-model="query" class="sgtg-input" type="text"
                        placeholder="ძებნა: template name / subject" />
                    <button class="sgtg-btn" :disabled="loading" @click="refresh">განახლება</button>
                </div>
                <div class="sgtg-selects">
                    <label class="sgtg-check">
                        <input type="checkbox" v-model="onlyActive" />
                        <span>მაჩვენე მხოლოდ აქტიური ვერსიები</span>
                    </label>
                    <select v-model="sortBy" class="sgtg-select">
                        <option value="updated_desc">ხალ.PUT — უახლესი</option>
                        <option value="updated_asc">ხალ.PUT — უძველესი</option>
                        <option value="name_asc">სახელი A–Z</option>
                        <option value="name_desc">სახელი Z–A</option>
                    </select>
                </div>
            </div>
        </header>

        <section class="sgtg-state" v-if="loading || error || note">
            <div v-if="loading" class="sgtg-info">იტვირთება…</div>
            <div v-else-if="error" class="sgtg-error">შეცდომა: {{ error }}</div>
            <div v-else-if="note" class="sgtg-note">{{ note }}</div>
        </section>

        <section v-if="!loading && !error" class="sgtg-grid">
            <article v-for="tpl in filtered" :key="tpl.id" class="sgtg-card">
                <div @pointerup="redirect(tpl.id)" class="sgtg-thumb"
                    :style="{ backgroundImage: 'url(' + thumbOf(activeVersion(tpl)?.thumbnail_url) + ')' }">
                    <div class="sgtg-badges">
                        <span class="sgtg-badge"
                            :class="{ 'is-dynamic': tpl.generation === 'dynamic', 'is-legacy': tpl.generation === 'legacy' }">
                            {{ tpl.generation }}
                        </span>
                        <span v-if="activeVersion(tpl)" class="sgtg-badge is-active">active: {{ activeVersion(tpl)?.name
                        }}</span>
                    </div>
                </div>

                <div class="sgtg-body">
                    <div class="sgtg-headline">
                        <h3 class="sgtg-name" :title="tpl.name">{{ tpl.name }}</h3>
                        <time class="sgtg-updated" :datetime="tpl.updated_at">{{ formatDate(tpl.updated_at) }}</time>
                    </div>

                    <p class="sgtg-subject" v-if="activeVersion(tpl)?.subject" :title="activeVersion(tpl)?.subject">
                        {{ activeVersion(tpl)?.subject }}
                    </p>

                    <div class="sgtg-ids">
                        <button class="sgtg-chip" @click="copy(tpl.id)">
                            <span class="sgtg-chip-key">Template ID</span>
                            <span class="sgtg-chip-value">{{ short(tpl.id) }}</span>
                        </button>
                        <button v-if="activeVersion(tpl)" class="sgtg-chip" @click="copy(activeVersion(tpl).id)">
                            <span class="sgtg-chip-key">Version ID</span>
                            <span class="sgtg-chip-value">{{ short(activeVersion(tpl).id) }}</span>
                        </button>
                        <button v-if="!tpl.is_added" class="v-copy"
                            @click="addTemplate(tpl.name, tpl.id)">დამატება</button>
                        <button v-else class="v-copy v-success">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                fill="#10B981">
                                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                            </svg>
                        </button>

                    </div>

                    <details class=" sgtg-versions">
                        <summary>{{ tpl.versions?.length || 0 }} ვერსია</summary>
                        <ul>
                            <li v-for="v in tpl.versions || []" :key="v.id" :class="{ 'is-on': v.active === 1 }">
                                <span class="v-name">{{ v.name }}</span>
                                <span class="v-sep">•</span>
                                <span class="v-subj" :title="v.subject">{{ v.subject || '—' }}</span>
                                <span class="v-sep">•</span>
                                <time class="v-date">{{ formatDate(v.updated_at) }}</time>
                                <button class="v-copy" @click="copy(v.id)">კოპირება</button>
                            </li>
                        </ul>
                    </details>
                </div>
            </article>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

const loading = ref(false)
const error = ref('')
const note = ref('')
const router = useRouter()

const raw = ref({ result: [], _metadata: {} })

const query = ref('')
const onlyActive = ref(false)
const sortBy = ref('updated_desc')

// ————— API Call —————

async function fetchAll() {
    loading.value = true
    error.value = ''
    note.value = ''
    raw.value = { result: [], _metadata: {} }

    try {
        const res = await api.get('/templates')
        const resultArr = Array.isArray(res.data)
            ? res.data
            : (res.data.result ?? [])

        raw.value = {
            result: normalizeResult({ result: resultArr }),
            _metadata: res.data._metadata ?? {}
        }
    } catch (e) {
        error.value = e.message || String(e)
    } finally {
        loading.value = false
    }
}

onMounted(fetchAll)

// ————— Helpers —————

function normalizeResult(json) {
    const result = Array.isArray(json?.result) ? json.result : []
    return result.map(t => ({
        ...t,
        _updated: new Date(t.updated_at?.replace(' ', 'T'))
    }))
}

function formatDate(s) {
    if (!s) return '—'
    const d = new Date(s.replace(' ', 'T'))
    return isNaN(d) ? s : d.toLocaleString()
}

function thumbOf(url) {
    if (!url) return placeholder()
    return url.startsWith('//') ? 'https:' + url : url
}

function placeholder() {
    return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>
      <defs>
        <linearGradient id='g' x1='0' x2='1'>
          <stop offset='0%' stop-color='#eef2ff'/>
          <stop offset='100%' stop-color='#e2e8f0'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <g fill='#94a3b8'>
        <rect x='40' y='40' width='560' height='280' rx='12' fill-opacity='0.4'/>
        <circle cx='320' cy='180' r='48' fill-opacity='0.6'/>
      </g>
    </svg>
  `)}`
}

function short(id) {
    if (!id) return ''
    return id.length <= 12 ? id : id.slice(0, 6) + '…' + id.slice(-4)
}

async function copy(text) {
    try {
        await navigator.clipboard.writeText(text)
    } catch (e) {
        console.warn('Clipboard failed', e)
    }
}

function activeVersion(tpl) {
    const vs = tpl?.versions || []
    return vs.find(v => v.active === 1) || vs[0] || null
}

function refresh() {
    fetchAll()
}

function redirect(id) {
    router.push({ name: 'singlemail', params: { id } })
}

const filtered = computed(() => {
    const templates = Array.isArray(raw.value.result) ? raw.value.result : []
    const q = query.value.trim().toLowerCase()

    let arr = templates.filter(t => {
        const hitsName = (t.name || '').toLowerCase().includes(q)
        const hitsSubject = (t.versions || []).some(v =>
            (v.subject || '').toLowerCase().includes(q)
        )
        const activeOk =
            !onlyActive.value || (t.versions || []).some(v => v.active === 1)

        return (q ? hitsName || hitsSubject : true) && activeOk
    })

    switch (sortBy.value) {
        case 'updated_asc':
            arr.sort((a, b) => a._updated - b._updated)
            break
        case 'name_asc':
            arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
            break
        case 'name_desc':
            arr.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
            break
        default:
            arr.sort((a, b) => b._updated - a._updated)
    }

    return arr
})


const addLoading = ref(false)

async function addTemplate(name, id) {
    addLoading.value = true
    try {
        const response = await api.post('/addtemplate', {
            key: name,
            template_id: id
        })
        console.log(response.data)
        refresh()
    } catch (error) {
        console.log(error.response)
    } finally {
        addLoading.value = false
    }
}
</script>

<style scoped>
:root {
    --sgtg-bg: #f7f8fb;
    --sgtg-card: #ffffff;
    --sgtg-text: #0f172a;
    --sgtg-sub: #475569;
    --sgtg-muted: #64748b;
    --sgtg-border: #e2e8f0;
    --sgtg-accent: #2563eb;
    --sgtg-good: #059669;
    --sgtg-legacy: #a855f7;
}

.sgtg-wrap {
    background: var(--sgtg-bg);
    min-height: 100vh;
    padding: 32px 16px;
}

.sgtg-header {
    max-width: 1120px;
    margin: 0 auto 16px;
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr;
}

@media (min-width: 860px) {
    .sgtg-header {
        grid-template-columns: 1fr auto;
        align-items: end;
    }
}

.sgtg-title h1 {
    margin: 0;
    font-size: 28px;
    color: var(--sgtg-text);
    letter-spacing: -0.02em;
}

.sgtg-title p {
    margin: 4px 0 0;
    color: var(--sgtg-sub);
}

.sgtg-controls {
    display: grid;
    gap: 10px;
    grid-auto-flow: row;
}

@media (min-width: 860px) {
    .sgtg-controls {
        grid-auto-flow: column;
        align-items: center;
    }
}

.sgtg-input-group {
    display: flex;
    gap: 8px;
}

.sgtg-input {
    flex: 1 1 auto;
    min-width: 240px;
    padding: 10px 12px;
    border: 1px solid var(--sgtg-border);
    border-radius: 12px;
    background: #fff;
    color: var(--sgtg-text);
    outline: none;
    transition: box-shadow 120ms ease, border-color 120ms ease;
}

.sgtg-input:focus {
    border-color: #cbd5e1;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
}

.sgtg-btn {
    padding: 10px 14px;
    border: 1px solid var(--sgtg-border);
    background: #fff;
    color: var(--sgtg-text);
    border-radius: 12px;
    cursor: pointer;
    transition: transform 80ms ease, background 120ms ease;
}

.sgtg-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.sgtg-btn:hover:not(:disabled) {
    background: #f8fafc;
}

.sgtg-btn:active:not(:disabled) {
    transform: translateY(1px);
}

.sgtg-selects {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
}

.sgtg-check {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    color: var(--sgtg-sub);
}

.sgtg-select {
    padding: 10px 12px;
    border: 1px solid var(--sgtg-border);
    border-radius: 12px;
    background: #fff;
    color: var(--sgtg-text);
}

.sgtg-state {
    max-width: 1120px;
    margin: 0 auto 8px;
}

.sgtg-info,
.sgtg-note,
.sgtg-error {
    padding: 10px 12px;
    border-radius: 10px;
}

.sgtg-info {
    background: #eef2ff;
    color: #3730a3;
}

.sgtg-note {
    background: #f1f5f9;
    color: #0f172a;
}

.sgtg-error {
    background: #fee2e2;
    color: #991b1b;
}

.sgtg-grid {
    max-width: 1120px;
    margin: 0 auto;
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.sgtg-card {
    background: var(--sgtg-card);
    border: 1px solid var(--sgtg-border);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(2, 6, 23, 0.06);
    transition: transform 160ms ease, box-shadow 160ms ease;
}

.sgtg-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 26px rgba(2, 6, 23, 0.12);
}

.sgtg-thumb {
    height: 160px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: #f1f5f9;
    position: relative;
}

.sgtg-badges {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.sgtg-badge {
    font-size: 12px;
    padding: 5px 9px;
    border-radius: 999px;
    background: #e5e7eb;
    color: #1f2937;
    font-weight: 500;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.sgtg-badge.is-dynamic {
    background: rgba(37, 99, 235, 0.12);
    color: #1e3a8a;
}

.sgtg-badge.is-legacy {
    background: rgba(168, 85, 247, 0.15);
    color: #581c87;
}

.sgtg-badge.is-active {
    background: rgba(5, 150, 105, 0.15);
    color: #065f46;
}

.sgtg-body {
    padding: 18px 18px 20px;
    display: grid;
    gap: 12px;
}

.sgtg-headline {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
}

.sgtg-name {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--sgtg-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.sgtg-updated {
    color: var(--sgtg-muted);
    font-size: 12px;
    white-space: nowrap;
}

.sgtg-subject {
    margin: 0;
    color: var(--sgtg-sub);
    font-size: 14px;
    line-height: 1.35;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.sgtg-ids {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.sgtg-chip {
    border: 1px dashed var(--sgtg-border);
    background: #fff;
    border-radius: 999px;
    padding: 7px 12px;
    font-size: 13px;
    cursor: pointer;
    display: inline-flex;
    gap: 8px;
    align-items: center;
    transition: background 0.2s ease;
}

.sgtg-chip:hover {
    background: #f1f5f9;
}

.sgtg-chip-key {
    color: var(--sgtg-muted);
    font-size: 12px;
}

.sgtg-chip-value {
    color: var(--sgtg-text);
    font-weight: 600;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.sgtg-versions {
    border-top: 1px solid var(--sgtg-border);
    padding-top: 10px;
}

.sgtg-versions summary {
    cursor: pointer;
    color: var(--sgtg-text);
    font-weight: 600;
    padding: 6px 0;
    transition: color 0.2s ease;
}

.sgtg-versions summary:hover {
    color: var(--sgtg-accent);
}

.sgtg-versions ul {
    list-style: none;
    padding: 8px 0 0;
    margin: 0;
    display: grid;
    gap: 6px;
}

.sgtg-versions li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--sgtg-sub);
}

.sgtg-versions li.is-on .v-name {
    color: #065f46;
    font-weight: 700;
}

.v-sep {
    color: #cbd5e1;
}

.v-copy {
    margin-left: auto;
    border: 1px solid var(--sgtg-border);
    background: #fff;
    border-radius: 8px;
    padding: 4px 8px;
    cursor: pointer;
}

.v-success {
    background: #e9f0ed !important;
}

.v-copy:hover {
    background: #f8fafc;
}
</style>
