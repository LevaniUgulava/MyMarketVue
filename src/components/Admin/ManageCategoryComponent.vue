<template>
    <section class="cats">
        <!-- Header / Tabs -->
        <header class="cats__head">
            <h2 class="cats__title">კატეგორიების მართვა</h2>
            <nav class="tabs" role="tablist" aria-label="კატეგორიები">
                <button class="tab" :class="{ 'tab--active': activeTab === 'main' }" role="tab"
                    aria-selected="activeTab === 'main'" @click="switchTab('main')">
                    მთავარი კატეგორია
                </button>
                <button class="tab" :class="{ 'tab--active': activeTab === 'cat' }" role="tab"
                    aria-selected="activeTab === 'cat'" @click="switchTab('cat')">
                    კატეგორია
                </button>
                <button class="tab" :class="{ 'tab--active': activeTab === 'sub' }" role="tab"
                    aria-selected="activeTab === 'sub'" @click="switchTab('sub')">
                    ქვეკატეგორია
                </button>

                <div class="tabs__spacer"></div>

                <button class="btn btn--ghost" @click="redirectmain">
                    მთავარი კატეგორიის კავშირები
                </button>
                <button class="btn btn--ghost" @click="redirectcat">
                    კატეგორიის კავშირები
                </button>
            </nav>
        </header>

        <!-- Panels -->
        <!-- MAIN CATEGORY -->
        <div v-if="activeTab === 'main'" class="panel">
            <h3 class="panel__title">მთავარი კატეგორია</h3>

            <form class="form" @submit.prevent="createMainCategory">
                <div class="grid">
                    <div class="field">
                        <label for="mc-ka">სახელი (KA)</label>
                        <input id="mc-ka" class="input" type="text" v-model.trim="mainCategoryName"
                            placeholder="მთავარი კატეგორიის სახელწოდება ქართულად" :disabled="loading.mainCreate"
                            required />
                    </div>
                    <div class="field">
                        <label for="mc-en">სახელი (EN)</label>
                        <input id="mc-en" class="input" type="text" v-model.trim="mainCategoryName_en"
                            placeholder="Main category name (English)" :disabled="loading.mainCreate" required />
                    </div>
                </div>

                <div class="form__actions">
                    <button class="btn btn--primary" type="submit" :disabled="!canCreateMain || loading.mainCreate">
                        {{ loading.mainCreate ? 'დამატება…' : 'დამატება' }}
                    </button>
                </div>
            </form>

            <div class="table-wrap">
                <table class="table">
                    <thead>
                        <tr>
                            <th style="width: 140px">იდენტიფიკაცია</th>
                            <th>სახელი</th>
                            <th style="width: 120px; text-align:right;">მოქმედებები</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="category in mainCategories" :key="category.id">
                            <td>{{ category.id }}</td>
                            <td class="strong">{{ category.ka_name }}</td>
                            <td class="td-actions">
                                <button class="btn btn--danger" @click="deleteMainCategory(category.id)"
                                    :disabled="loading.mainDeleteId === category.id">
                                    <i class="fa-solid fa-trash"></i>
                                    {{ loading.mainDeleteId === category.id ? '...' : 'წაშლა' }}
                                </button>
                            </td>
                        </tr>
                        <tr v-if="!mainCategories.length">
                            <td colspan="3" class="empty">არცერთი მთავარი კატეგორია</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- CATEGORY -->
        <div v-if="activeTab === 'cat'" class="panel">
            <h3 class="panel__title">კატეგორია</h3>

            <form class="form" @submit.prevent="createCategory" enctype="multipart/form-data">
                <div class="grid">
                    <div class="field">
                        <label for="c-ka">სახელი (KA)</label>
                        <input id="c-ka" class="input" type="text" v-model.trim="categoryName"
                            placeholder="კატეგორიის სახელი ქართულად" :disabled="loading.catCreate" required />
                    </div>
                    <div class="field">
                        <label for="c-en">სახელი (EN)</label>
                        <input id="c-en" class="input" type="text" v-model.trim="categoryName_en"
                            placeholder="Category name (English)" :disabled="loading.catCreate" required />
                    </div>
                    <div class="field">
                        <label for="c-img">სურათი</label>
                        <input id="c-img" class="input" type="file" accept="image/*" @change="onFileChange"
                            :disabled="loading.catCreate" />
                    </div>
                </div>

                <div class="form__actions">
                    <button class="btn btn--primary" type="submit" :disabled="!canCreateCategory || loading.catCreate">
                        {{ loading.catCreate ? 'დამატება…' : 'დამატება' }}
                    </button>
                </div>
            </form>

            <div class="table-wrap">
                <table class="table">
                    <thead>
                        <tr>
                            <th style="width: 140px">იდენტიფიკაცია</th>
                            <th>სახელი</th>
                            <th style="width: 120px; text-align:right;">მოქმედებები</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!categories.length">
                            <td colspan="3" class="empty">კატეგორიები არ არის</td>
                        </tr>
                        <tr v-for="category in categories" :key="category.id">
                            <td>{{ category.id }}</td>
                            <td class="strong">{{ category.ka_name }}</td>
                            <td class="td-actions">
                                <button class="btn btn--danger" @click="deleteCategory(category.id)"
                                    :disabled="loading.catDeleteId === category.id">
                                    <i class="fa-solid fa-trash"></i>
                                    {{ loading.catDeleteId === category.id ? '...' : 'წაშლა' }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- SUBCATEGORY -->
        <div v-if="activeTab === 'sub'" class="panel">
            <h3 class="panel__title">ქვეკატეგორია</h3>

            <form class="form" @submit.prevent="createSubCategory">
                <div class="grid">
                    <div class="field">
                        <label for="sc-ka">სახელი (KA)</label>
                        <input id="sc-ka" class="input" type="text" v-model.trim="subcategoryName"
                            placeholder="ქვეკატეგორიის სახელი ქართულად" :disabled="loading.subCreate" required />
                    </div>
                    <div class="field">
                        <label for="sc-en">სახელი (EN)</label>
                        <input id="sc-en" class="input" type="text" v-model.trim="subcategoryName_en"
                            placeholder="Subcategory name (English)" :disabled="loading.subCreate" required />
                    </div>
                </div>

                <div class="form__actions">
                    <button class="btn btn--primary" type="submit" :disabled="!canCreateSub || loading.subCreate">
                        {{ loading.subCreate ? 'დამატება…' : 'დამატება' }}
                    </button>
                </div>
            </form>

            <div class="table-wrap">
                <table class="table">
                    <thead>
                        <tr>
                            <th style="width: 140px">იდენტიფიკაცია</th>
                            <th>სახელი</th>
                            <th style="width: 120px; text-align:right;">მოქმედებები</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!subcategories.length">
                            <td colspan="3" class="empty">ქვეკატეგორიები არ არის</td>
                        </tr>
                        <tr v-for="subcategory in subcategories" :key="subcategory.id">
                            <td>{{ subcategory.id }}</td>
                            <td class="strong">{{ subcategory.ka_name }}</td>
                            <td class="td-actions">
                                <button class="btn btn--danger" @click="deleteSubCategory(subcategory.id)"
                                    :disabled="loading.subDeleteId === subcategory.id">
                                    <i class="fa-solid fa-trash"></i>
                                    {{ loading.subDeleteId === subcategory.id ? '...' : 'წაშლა' }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>

<script>
import api from '@/api';

export default {
    name: 'ManageCategoryComponent',
    data() {
        return {
            // tabs
            activeTab: 'main',

            // main
            mainCategoryName: '',
            mainCategoryName_en: '',
            mainCategories: [],

            // category
            categoryName: '',
            categoryName_en: '',
            categories: [],
            image: null,

            // subcategory
            subcategoryName: '',
            subcategoryName_en: '',
            subcategories: [],

            // loading flags
            loading: {
                mainCreate: false,
                mainDeleteId: null,
                catCreate: false,
                catDeleteId: null,
                subCreate: false,
                subDeleteId: null,
            },
        };
    },
    computed: {
        canCreateMain() {
            return this.mainCategoryName.trim() && this.mainCategoryName_en.trim();
        },
        canCreateCategory() {
            return this.categoryName.trim() && this.categoryName_en.trim();
        },
        canCreateSub() {
            return this.subcategoryName.trim() && this.subcategoryName_en.trim();
        },
    },
    methods: {
        switchTab(tab) {
            this.activeTab = tab;
        },
        onFileChange(e) {
            this.image = e.target.files[0] || null;
        },

        // MAIN
        async createMainCategory() {
            if (!this.canCreateMain || this.loading.mainCreate) return;
            this.loading.mainCreate = true;
            try {
                await api.post(
                    'admin/categories/maincategory/create',
                    { ka_name: this.mainCategoryName, en_name: this.mainCategoryName_en },
                    { tokenRequired: true }
                );
                this.mainCategoryName = '';
                this.mainCategoryName_en = '';
                await this.getMainCategory();
            } catch (error) {
                console.error(error);
            } finally {
                this.loading.mainCreate = false;
            }
        },
        async getMainCategory() {
            try {
                const { data } = await api.get('maincategory');
                this.mainCategories = Array.isArray(data) ? data : (data?.data || []);
            } catch (error) {
                console.log(error);
            }
        },
        async deleteMainCategory(id) {
            if (!confirm('წავშალო მთავარი კატეგორია?')) return;
            this.loading.mainDeleteId = id;
            try {
                await api.post(`admin/categories/maincategory/delete/${id}`, {}, { tokenRequired: true });
                this.mainCategories = this.mainCategories.filter((c) => c.id !== id);
                // ასევე გაწმინდეთ ჩამონათვლები თუ ჰქონდათ კავშირი
                this.categories = this.categories.filter((c) => c.maincategory_id !== id);
                this.subcategories = this.subcategories.filter((s) => s.maincategory_id !== id);
            } catch (error) {
                console.log(error);
            } finally {
                this.loading.mainDeleteId = null;
            }
        },

        // CATEGORY
        async createCategory() {
            if (!this.canCreateCategory || this.loading.catCreate) return;
            this.loading.catCreate = true;
            try {
                const formData = new FormData();
                formData.append('ka_name', this.categoryName);
                formData.append('en_name', this.categoryName_en);
                if (this.image) formData.append('image', this.image);

                await api.post('admin/categories/category/create', formData, { tokenRequired: true });
                this.categoryName = '';
                this.categoryName_en = '';
                this.image = null;
                await this.getCategory();
            } catch (error) {
                console.error(error);
            } finally {
                this.loading.catCreate = false;
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
        async deleteCategory(id) {
            if (!confirm('წავშალო კატეგორია?')) return;
            this.loading.catDeleteId = id;
            try {
                await api.post(`admin/categories/category/delete/${id}`, {}, { tokenRequired: true });
                this.categories = this.categories.filter((c) => c.id !== id);
            } catch (error) {
                console.log(error);
            } finally {
                this.loading.catDeleteId = null;
            }
        },

        // SUBCATEGORY
        async createSubCategory() {
            if (!this.canCreateSub || this.loading.subCreate) return;
            this.loading.subCreate = true;
            try {
                await api.post(
                    'admin/categories/subcategory/create',
                    { ka_name: this.subcategoryName, en_name: this.subcategoryName_en },
                    { tokenRequired: true }
                );
                this.subcategoryName = '';
                this.subcategoryName_en = '';
                await this.getSubCategory();
            } catch (error) {
                console.error(error);
            } finally {
                this.loading.subCreate = false;
            }
        },
        async getSubCategory() {
            try {
                const { data } = await api.get('subcategory');
                this.subcategories = Array.isArray(data) ? data : (data?.data || []);
            } catch (error) {
                console.log(error);
            }
        },
        async deleteSubCategory(id) {
            if (!confirm('წავშალო ქვეკატეგორია?')) return;
            this.loading.subDeleteId = id;
            try {
                await api.post(`admin/categories/subcategory/delete/${id}`, {}, { tokenRequired: true });
                this.subcategories = this.subcategories.filter((s) => s.id !== id);
            } catch (error) {
                console.log(error);
            } finally {
                this.loading.subDeleteId = null;
            }
        },

        // Routing
        redirectmain() {
            this.$router.push('/admin/mainrelation');
        },
        redirectcat() {
            this.$router.push('/admin/categoryrelation');
        },
    },
    async mounted() {
        // პირველ ეკრანზე დავტვირთოთ ყველაფერი, რომ ტაბის გადართვისას მომენტალურად გამოჩნდეს
        await Promise.all([this.getMainCategory(), this.getCategory(), this.getSubCategory()]);
    },
};
</script>

<style scoped>
/* ===== Tokens (ბრენდის იისფერი) ===== */
.cats {
    --accent: #6B21A8;
    --accent-ink: #4C1878;

    --bg: #ffffff;
    --surface: #f7f7fb;
    --border: #e6e8ef;

    --text: #111827;
    --muted: #6b7280;

    --danger: #ef4444;

    --radius: 14px;
    --shadow: 0 12px 28px rgba(17, 24, 39, 0.06);
}

/* ===== Layout ===== */
.cats {
    padding: 20px;
    color: var(--text);
}

.cats__head {
    display: grid;
    gap: 12px;
    margin-bottom: 12px;
}

.cats__title {
    margin: 0;
    font-weight: 800;
    letter-spacing: .2px;
}

.tabs {
    display: flex;
    gap: 8px;
    align-items: center;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 8px;
    box-shadow: var(--shadow);
}

.tabs__spacer {
    flex: 1;
}

.tab {
    padding: 8px 14px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: #fff;
    color: var(--text);
    font-weight: 700;
    cursor: pointer;
    transition: background .2s ease, color .2s ease, border-color .2s ease, transform .12s ease;
}

.tab:hover {
    background: var(--surface);
    transform: translateY(-1px);
}

.tab--active {
    background: color-mix(in oklab, var(--accent) 10%, #fff);
    color: var(--accent-ink);
    border-color: color-mix(in oklab, var(--accent) 28%, transparent);
}

/* ===== Panel ===== */
.panel {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 16px;
    box-shadow: var(--shadow);
}

.panel__title {
    margin: 0 0 10px;
    font-weight: 800;
}

/* ===== Form ===== */
.form {
    display: grid;
    gap: 10px;
    margin-bottom: 10px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 10px;
}

.field {
    grid-column: span 6;
    display: grid;
    gap: 6px;
}

.field:first-child {
    grid-column: span 6;
}

@media (max-width: 720px) {
    .field {
        grid-column: 1 / -1;
    }
}

label {
    font-size: .9rem;
    color: var(--muted);
}

.input {
    width: 100%;
    height: 42px;
    text-indent: 15px;
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

.form__actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

/* ===== Table ===== */
.table-wrap {
    overflow-x: auto;
}

.table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
}

.table thead th {
    background: var(--accent);
    color: #fff;
    text-align: left;
    padding: 12px 14px;
    font-weight: 700;
    letter-spacing: .2px;
}

.table tbody td {
    border-bottom: 1px solid var(--border);
    padding: 12px 14px;
    vertical-align: middle;
}

.table tbody tr:nth-child(odd) {
    background: var(--surface);
}

.strong {
    font-weight: 800;
    color: var(--text);
}

.td-actions {
    text-align: right;
}

.empty {
    text-align: center;
    color: var(--muted);
    padding: 16px;
}

/* ===== Buttons ===== */
.btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid transparent;
    font-weight: 800;
    cursor: pointer;
    transition: transform .12s ease, background .2s ease, color .2s ease, border-color .2s ease;
}

.btn--primary {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
}

.btn--primary:hover {
    background: var(--accent-ink);
    border-color: var(--accent-ink);
    transform: translateY(-1px);
}

.btn--ghost {
    background: #fff;
    color: var(--text);
    border-color: var(--border);
}

.btn--ghost:hover {
    background: var(--surface);
    transform: translateY(-1px);
}

.btn--danger {
    background: #fff;
    color: var(--danger);
    border-color: color-mix(in oklab, var(--danger) 35%, transparent);
}

.btn--danger:hover {
    background: color-mix(in oklab, var(--danger) 6%, #fff);
    transform: translateY(-1px);
}
</style>
