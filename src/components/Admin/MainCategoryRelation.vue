<template>
    <section class="rel">
        <!-- Header -->
        <header class="rel__head">
            <h2 class="rel__title">მთავარი კატეგორიის კავშირები</h2>
            <p class="rel__subtitle">გადაიტანე კატეგორია მარცხენა „გროვიდან“ შესაბამის მთავარ კატეგორიაში.</p>
        </header>

        <!-- Table: Main categories + attached categories -->
        <div class="panel">
            <div class="table-wrap">
                <table class="table">
                    <thead>
                        <tr>
                            <th style="width: 280px;">მთავარი კატეგორია</th>
                            <th>დაკავშირებული კატეგორიები</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="mc in mainCategories" :key="mc.id" class="drop-row"
                            @dragover.prevent="onDragOver($event, mc)" @dragleave="onDragLeave"
                            @drop.prevent.stop="handleDrop(mc)" :class="{ 'drop-row--over': isOver(mc) }">
                            <td class="strong">
                                {{ mc.ka_name }}
                                <div class="row-hint">ჩააგდე აქ</div>
                            </td>
                            <td>
                                <div class="chips">
                                    <div v-for="cat in (mc.categories || [])" :key="cat.id" class="chip"
                                        draggable="false" title="ამოღება">
                                        <span class="chip__label">{{ cat.ka_name }}</span>
                                        <button class="chip__x" @click.prevent="remove(mc.id, cat.id)"
                                            :aria-label="`ამოღება: ${cat.ka_name}`" title="ამოღება">
                                            <i class="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                </div>
                                <div v-if="!mc.categories || !mc.categories.length" class="empty-inline">
                                    ჯერ არ აქვს კატეგორია
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!mainCategories.length">
                            <td colspan="2" class="empty">მთავარი კატეგორიები ვერ მოიძებნა</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Heap: draggable categories -->
        <div class="panel">
            <div class="rel__heap-head">
                <h3 class="panel__title">კატეგორიების გროვა</h3>
                <div class="search">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="search" v-model.trim="searchName" class="input" placeholder="ძებნა სახელით…"
                        @input="onSearch" />
                </div>
            </div>

            <div class="heap">
                <div v-for="cat in filteredCategories" :key="cat.id" class="heap__item" draggable="true"
                    @dragstart="handleDragStart(cat)" @dragend="handleDragEnd" :title="cat.ka_name">
                    <i class="fa-regular fa-folder"></i>
                    <span class="heap__label">{{ cat.ka_name }}</span>
                </div>

                <div v-if="!filteredCategories.length" class="empty">
                    კატეგორიები ვერ მოიძებნა
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import api from '@/api';

export default {
    name: 'MainCategoryRelations',
    data() {
        return {
            mainCategories: [],
            categories: [],
            searchName: '',
            draggedCategory: null,
            dragOverId: null,
            debounceTimer: null,
        };
    },
    computed: {
        filteredCategories() {
            const src = this.categories || [];
            if (!this.searchName) return src;
            const q = this.searchName.toLowerCase();
            // ძიება ka_name/en_name-ზეც
            return src.filter(c =>
                String(c.ka_name || '').toLowerCase().includes(q) ||
                String(c.en_name || '').toLowerCase().includes(q)
            );
        },
    },
    methods: {
        // API
        async getMainCategory() {
            try {
                const { data } = await api.get('maincategory');
                // ველოდებით მასივს; თუ ობიექტია data.data, მაინც მოერგება
                this.mainCategories = Array.isArray(data) ? data : (data?.data || []);
                // უზრუნველვყოთ, რომ თითოეულს ჰქონდეს categories მასივი
                this.mainCategories = this.mainCategories.map(mc => ({
                    ...mc,
                    categories: Array.isArray(mc.categories) ? mc.categories : (mc.categories ? Object.values(mc.categories) : []),
                }));
            } catch (error) {
                console.log(error);
            }
        },
        async getCategory() {
            try {
                const { data } = await api.get('category');
                this.categories = Array.isArray(data) ? data : (data?.data || []);
            } catch (error) {
                console.log(error);
            }
        },

        // Drag & Drop
        handleDragStart(cat) {
            this.draggedCategory = cat;
            document.body.classList.add('dragging');
        },
        handleDragEnd() {
            document.body.classList.remove('dragging');
            this.draggedCategory = null;
            this.dragOverId = null;
        },
        onDragOver(e, mc) {
            e.preventDefault();
            this.dragOverId = mc?.id ?? null;
        },
        onDragLeave() {
            this.dragOverId = null;
        },
        isOver(mc) {
            return this.dragOverId === mc.id;
        },

        async handleDrop(mainCategory) {
            // ჩავიჭიროთ ლოკალურად, რადგან await-ისას შეიძლება შეიცვალოს
            const dragged = this.draggedCategory;
            if (!mainCategory?.id || !dragged?.id) return;

            try {
                await api.post(
                    'admin/categories/assignRelation',
                    { maincategory_id: mainCategory.id, category_id: dragged.id },
                    { tokenRequired: true }
                );

                // UI refresh: დაამატე, თუ უკვე არაა
                const target = this.mainCategories.find(m => m.id === mainCategory.id);
                if (target) {
                    target.categories = target.categories || [];
                    const exists = target.categories.some(c => c.id === dragged.id);
                    if (!exists) target.categories.push(dragged);
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.handleDragEnd();
            }
        },

        async remove(mainCategoryId, categoryId) {
            if (!confirm('გინდა ამოიღო ეს კავშირი?')) return;
            try {
                await api.post(
                    'admin/categories/deleteRelation',
                    { maincategory_id: mainCategoryId, category_id: categoryId },
                    { tokenRequired: true }
                );

                const mc = this.mainCategories.find(m => m.id === mainCategoryId);
                if (mc && Array.isArray(mc.categories)) {
                    mc.categories = mc.categories.filter(c => c.id !== categoryId);
                }
            } catch (error) {
                console.log(error);
            }
        },

        // Search debounce
        onSearch() {
            if (this.debounceTimer) clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                // computed გააკეთებს თავისას
            }, 200);
        },
    },
    async mounted() {
        await Promise.all([this.getMainCategory(), this.getCategory()]);
    },
};
</script>

<style scoped>
/* ===== Tokens ===== */
.rel {
    --accent: #6B21A8;
    --accent-ink: #4C1878;

    --bg: #ffffff;
    --surface: #f7f7fb;
    --border: #e6e8ef;

    --text: #111827;
    --muted: #6b7280;

    --radius: 14px;
    --shadow: 0 12px 28px rgba(17, 24, 39, 0.06);
}

.rel {
    padding: 20px;
    color: var(--text);
}

.rel__head {
    margin-bottom: 12px;
}

.rel__title {
    margin: 0;
    font-weight: 800;
    letter-spacing: .2px;
}

.rel__subtitle {
    margin: 6px 0 0;
    color: var(--muted);
}

/* ===== Panels ===== */
.panel {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    box-shadow: var(--shadow);
    padding: 12px;
    margin-bottom: 14px;
}

.panel__title {
    margin: 0 0 8px;
    font-weight: 800;
}

/* ===== Table ===== */
.table-wrap {
    overflow-x: auto;
}

.table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
}

.table thead th {
    background: var(--accent);
    color: #fff;
    padding: 12px 14px;
    text-align: left;
    font-weight: 700;
}

.table tbody td {
    border-bottom: 1px solid var(--border);
    padding: 12px 14px;
    vertical-align: top;
}

.strong {
    font-weight: 800;
    color: var(--text);
}

.drop-row {
    transition: background .18s ease, border-color .18s ease;
}

.drop-row--over td {
    background: color-mix(in oklab, var(--accent) 6%, #fff);
    border-color: color-mix(in oklab, var(--accent) 25%, var(--border));
}

.row-hint {
    margin-top: 6px;
    font-size: 12px;
    color: var(--muted);
}

/* ===== Chips ===== */
.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: color-mix(in oklab, var(--accent) 10%, #fff);
    color: var(--accent-ink);
    border: 1px solid color-mix(in oklab, var(--accent) 28%, transparent);
    padding: 6px 10px;
    border-radius: 999px;
    font-weight: 700;
}

.chip__label {
    line-height: 1;
}

.chip__x {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: #fff;
    color: var(--accent-ink);
    transition: transform .12s ease, background .2s ease;
}

.chip__x:hover {
    transform: translateY(-1px);
    background: var(--surface);
}

/* ===== Heap ===== */
.rel__heap-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
}

.search {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.input {
    width: 260px;
    height: 40px;
    padding: 8px 12px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: #fff;
    color: var(--text);
    transition: border-color .2s ease, box-shadow .2s ease;
}

.input:focus {
    border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 15%, transparent);
}

.heap {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    min-height: 56px;
    padding: 8px;
    border: 1px dashed var(--border);
    border-radius: 12px;
    background: var(--surface);
}

.heap__item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 999px;
    background: #fff;
    border: 1px solid var(--border);
    font-weight: 700;
    cursor: grab;
    transition: transform .12s ease, border-color .2s ease, box-shadow .2s ease, background .2s ease;
}

.heap__item:active {
    cursor: grabbing;
}

.heap__item:hover {
    transform: translateY(-1px);
    border-color: color-mix(in oklab, var(--accent) 28%, var(--border));
    box-shadow: var(--shadow);
}

.heap__label {
    white-space: nowrap;
}

/* ===== Empty states ===== */
.empty {
    text-align: center;
    color: var(--muted);
    padding: 14px;
}

.empty-inline {
    color: var(--muted);
    font-size: 13px;
}

/* ===== Global dragging helper ===== */
:global(body.dragging) {
    user-select: none;
    cursor: grabbing;
}
</style>
