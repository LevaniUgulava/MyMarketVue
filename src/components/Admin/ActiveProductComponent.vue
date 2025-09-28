<template>
  <section class="ap">
    <!-- Actions -->
    <header class="bar">
      <div class="bar__group">
        <div class="field">
          <label class="field__label">კატეგორიით ძიება</label>
          <button class="btn" @click="isModalVisible = true" :disabled="loading.fetch">
            <i class="fa-regular fa-filter"></i> Category
          </button>
        </div>
      </div>

      <div class="bar__group">
        <div class="field">
          <label class="field__label">ძებნა</label>
          <div class="inline">
            <input type="search" class="input" v-model.trim="Searchname" placeholder="სახელი / აღწერა"
              @input="performSearch" :disabled="loading.fetch" />
            <button class="btn btn--ghost" @click="performSearch(true)" :disabled="loading.fetch">ძებნა</button>
          </div>
        </div>
      </div>
    </header>

    <!-- Toast -->
    <transition name="fade">
      <div v-if="toast.show" class="toast" :class="`toast--${toast.type}`" role="status" aria-live="polite">
        <strong class="toast__title">
          {{ toast.type === 'success' ? 'წარმატება' : toast.type === 'error' ? 'შეცდომა' : 'ინფო' }}
        </strong>
        <span class="toast__msg">{{ toast.message }}</span>
        <span v-if="toast.code" class="toast__code">[{{ toast.code }}]</span>
        <button class="toast__close" @click="toast.show = false" aria-label="დახურვა">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </transition>

    <!-- Modal -->
    <CategoryModalVue :isModalVisible="isModalVisible" @close-modal="closeModal" @search-category="searchCategory" />

    <!-- Table -->
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th style="width:80px;">ID</th>
            <th>დასახელება</th>
            <th>აღწერა</th>
            <th>ფასი</th>
            <th>მთავარი კატეგორია</th>
            <th>კატეგორია</th>
            <th>ქვეკატეგორია</th>
            <th>სურათი</th>
            <th style="width:120px;">მოქმედებები</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td class="mono">{{ p.id }}</td>
            <td class="strong">{{ p.name }}</td>
            <td class="muted ellipsis" :title="p.description">{{ p.description }}</td>
            <td>{{ formatMoney(p.price) }}</td>
            <td>{{ p.MainCategory?.name || p.MainCategory?.ka_name || '—' }}</td>
            <td>{{ p.Category?.name || p.Category?.ka_name || '—' }}</td>
            <td>{{ p.SubCategory?.name || p.SubCategory?.ka_name || p.Subcategory?.ka_name || '—' }}</td>
            <td>
              <img :src="imgSrc(p)" class="img" @error="onImgError($event)" alt="product" />
            </td>
            <td>
              <button v-if="p.active" class="btn btn--success" @click="toggleActive(p, false)"
                :disabled="loading.toggleId === p.id" :aria-busy="loading.toggleId === p.id" title="გააუქმე აქტიური">
                <i v-if="loading.toggleId === p.id" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-regular fa-eye"></i>
              </button>
              <button v-else class="btn btn--warning" @click="toggleActive(p, true)"
                :disabled="loading.toggleId === p.id" :aria-busy="loading.toggleId === p.id" title="გააქტიურება">
                <i v-if="loading.toggleId === p.id" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-regular fa-eye-slash"></i>
              </button>
            </td>
          </tr>

          <tr v-if="!loading.fetch && !products.length">
            <td colspan="9" class="empty">პროდუქტები ვერ მოიძებნა</td>
          </tr>
          <tr v-if="loading.fetch">
            <td colspan="9" class="empty"><i class="fa-solid fa-spinner fa-spin"></i> იტვირთება…</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav v-if="pagination.total" class="pager">
      <button class="page" :disabled="pagination.current_page <= 1" @click="goPage(pagination.current_page - 1)">
        წინა
      </button>
      <button v-for="pg in pageList" :key="pg" class="page" :class="{ 'page--active': pg === pagination.current_page }"
        @click="goPage(pg)">
        {{ pg }}
      </button>
      <button class="page" :disabled="pagination.current_page >= pagination.last_page"
        @click="goPage(pagination.current_page + 1)">
        შემდეგი
      </button>
      <div class="pager__meta">
        სულ: {{ pagination.total }} | გვერდი: {{ pagination.current_page }} / {{ pagination.last_page }}
      </div>
    </nav>
  </section>
</template>

<script>
import CategoryModalVue from '../CategoryModal.vue';
import api from '@/api';

export default {
  name: "ActiveProductComponent",
  components: { CategoryModalVue },
  data() {
    return {
      products: [],
      isModalVisible: false,
      pagination: {},
      Searchname: '',
      selectedmainCategory: null,
      selectedCategory: null,
      selectedsubCategory: null,
      loading: { fetch: false, toggleId: null },
      toast: { show: false, type: 'info', message: '', code: null },
      debounceTimer: null,
      placeholderImg: 'https://via.placeholder.com/80x60?text=IMG',
    };
  },
  computed: {
    pageList() {
      const cur = this.pagination.current_page || 1;
      const last = this.pagination.last_page || 1;
      const span = 2;
      const from = Math.max(1, cur - span);
      const to = Math.min(last, cur + span);
      const arr = [];
      for (let i = from; i <= to; i++) arr.push(i);
      if (from > 1) arr.unshift(1);
      if (to < last) arr.push(last);
      return [...new Set(arr)];
    },
  },
  watch: {
    '$route.query': {
      handler() { this.fetchProductData(); },
      immediate: true,
    },
  },
  methods: {
    // UI helpers
    showToast(type, message, code = null) {
      this.toast = { show: true, type, message, code };
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => (this.toast.show = false), 3500);
    },
    formatMoney(v) {
      const n = Number(v);
      if (!Number.isFinite(n)) return '—';
      return new Intl.NumberFormat('ka-GE', { style: 'currency', currency: 'GEL', maximumFractionDigits: 2 }).format(n);
    },
    imgSrc(p) {
      if (Array.isArray(p.image_urls) && p.image_urls.length) return p.image_urls[0];
      if (typeof p.image_urls === 'string' && p.image_urls) return p.image_urls;
      if (p.media?.[0]?.original_url) return p.media[0].original_url;
      return this.placeholderImg;
    },
    onImgError(e) { e.target.src = this.placeholderImg; },

    // Modal / filters
    openModal() { this.isModalVisible = true; },
    closeModal() { this.isModalVisible = false; },
    searchCategory(data) {
      this.selectedmainCategory = data.maincategory || null;
      this.selectedCategory = data.category || null;
      this.selectedsubCategory = data.subcategory || null;
      this.isModalVisible = false;
      this.updateRoute({ page: 1 });
    },

    // Search (debounced)
    performSearch(force = false) {
      clearTimeout(this.debounceTimer);
      const run = () => this.updateRoute({ page: 1 });
      if (force) run();
      else this.debounceTimer = setTimeout(run, 250);
    },

    updateRoute(merge = {}) {
      const cur = { ...this.$route.query };
      const next = {
        ...cur,
        page: merge.page ?? cur.page ?? 1,
        searchname: this.Searchname || undefined,
        maincategory: this.selectedmainCategory || undefined,
        category: this.selectedCategory || undefined,
        subcategory: this.selectedsubCategory || undefined,
      };
      Object.keys(next).forEach(k => next[k] === undefined && delete next[k]);
      this.$router.replace({ path: '/admin/actions', query: next });
    },

    // Fetch
    async fetchProductData() {
      const q = new URLSearchParams(this.$route.query);
      const page = parseInt(q.get('page')) || 1;
      this.loading.fetch = true;
      try {
        const { data } = await api.get(`admindisplay`, {
          tokenRequired: true,
          params: {
            page,
            searchname: this.Searchname || undefined,
            maincategory: this.selectedmainCategory || undefined,
            category: this.selectedCategory || undefined,
            subcategory: this.selectedsubCategory || undefined,
          }
        });
        if (data && data.data) {
          this.products = data.data;
          this.pagination = {
            current_page: data.meta.current_page,
            last_page: data.meta.last_page,
            per_page: data.meta.per_page,
            total: data.meta.total,
            links: data.links
          };
        } else {
          this.products = [];
          this.pagination = {};
          console.error('Unexpected API response structure:', data);
        }
      } catch (error) {
        this.showToast('error', 'პროდუქტების წამოღება ვერ მოხერხდა', error?.response?.status);
        console.error('Error fetching product data:', error);
      } finally {
        this.loading.fetch = false;
      }
    },

    // Toggle active
    async toggleActive(product, makeActive) {
      if (!product?.id) return;
      this.loading.toggleId = product.id;
      try {
        const url = makeActive ? `active/${product.id}` : `notactive/${product.id}`;
        const res = await api.post(url, {}, { tokenRequired: true });
        product.active = !!makeActive;
        this.showToast('success', makeActive ? 'პროდუქტი გააქტიურდა' : 'პროდუქტი გააუქმდა', res?.status);
      } catch (error) {
        const code = error?.response?.status;
        const msg = error?.response?.data?.message || 'მოქმედების შესრულება ვერ მოხერხდა';
        this.showToast('error', msg, code);
        console.error(error);
      } finally {
        this.loading.toggleId = null;
      }
    },

    // Pager
    goPage(pg) {
      if (pg === this.pagination.current_page) return;
      this.updateRoute({ page: pg });
    },
  },
};
</script>

<style scoped>
/* ===== Tokens ===== */
.ap {
  --accent: #6B21A8;
  --accent-ink: #4C1878;

  --bg: #ffffff;
  --surface: #f7f7fb;
  --border: #e6e8ef;

  --text: #111827;
  --muted: #6b7280;

  --success: #16a34a;
  --warning: #f59e0b;
  --error: #ef4444;

  --radius: 14px;
  --shadow: 0 12px 28px rgba(17, 24, 39, 0.06);
}

.ap {
  padding: 20px;
  color: var(--text);
}

/* ===== Top bar ===== */
.bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

@media (max-width: 900px) {
  .bar {
    grid-template-columns: 1fr;
  }
}

.bar__group {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
  padding: 12px;
}

.field {
  display: grid;
  gap: 8px;
}

.field__label {
  font-size: .85rem;
  color: var(--muted);
}

.inline {
  display: flex;
  gap: 8px;
  align-items: center;
}

.input {
  height: 42px;
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

/* ===== Toast ===== */
.toast {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid transparent;
  box-shadow: var(--shadow);
}

.toast--success {
  background: color-mix(in oklab, var(--success) 8%, #fff);
  border-color: color-mix(in oklab, var(--success) 28%, transparent);
}

.toast--error {
  background: color-mix(in oklab, var(--error) 8%, #fff);
  border-color: color-mix(in oklab, var(--error) 28%, transparent);
}

.toast--info {
  background: var(--surface);
  border-color: var(--border);
}

.toast__title {
  font-weight: 800;
}

.toast__msg {
  color: var(--text);
}

.toast__code {
  color: var(--muted);
  font-size: 12px;
}

.toast__close {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--muted);
  padding: 6px;
  border-radius: 8px;
}

.toast__close:hover {
  background: #fff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== Table ===== */
.table-wrap {
  overflow-x: auto;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
}

.table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

.table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--accent);
  color: #fff;
  text-align: left;
  padding: 12px 14px;
  font-weight: 700;
}

.table tbody td {
  border-bottom: 1px solid var(--border);
  padding: 12px 14px;
  vertical-align: middle;
}

.table tbody tr:hover {
  background: color-mix(in oklab, var(--accent) 6%, #fff);
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.strong {
  font-weight: 800;
}

.muted {
  color: var(--muted);
}

.ellipsis {
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.img {
  width: 64px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border);
}

/* ===== Buttons ===== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--text);
  font-weight: 800;
  cursor: pointer;
  transition: transform .12s ease, background .2s ease, color .2s ease, border-color .2s ease;
}

.btn:hover {
  background: var(--surface);
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.btn--ghost {
  border-color: var(--border);
}

.btn--success {
  background: var(--success);
  color: #fff;
  border-color: var(--success);
}

.btn--success:hover {
  background: #138e3c;
  transform: translateY(-1px);
}

.btn--warning {
  background: var(--warning);
  color: #fff;
  border-color: var(--warning);
}

.btn--warning:hover {
  background: #d48806;
  transform: translateY(-1px);
}

/* ===== Pagination ===== */
.pager {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  flex-wrap: wrap;
}

.page {
  height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: #fff;
  cursor: pointer;
  font-weight: 800;
  transition: transform .12s ease, background .2s ease, border-color .2s ease;
}

.page:hover {
  background: var(--surface);
  transform: translateY(-1px);
}

.page:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.page--active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.pager__meta {
  color: var(--muted);
}
</style>
