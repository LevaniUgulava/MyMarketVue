<template>
  <section class="sp">
    <header class="sp__head">
      <div class="sp__titles">
        <h3 class="sp__title">სტატუსის პროდუქტების დამატება</h3>
        <p class="sp__subtitle">სტატუსი: <strong>#{{ id }}</strong></p>
      </div>

      <div class="sp__controls">
        <div class="sp__discount">
          <label for="discount">ფასდაკლება (%)</label>
          <input id="discount" type="number" min="0" max="100" step="1" v-model.number="discount" class="input"
            :class="{ 'input--error': discountInvalid }" placeholder=" напр. 10" />
        </div>

        <div class="sp__search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="search" v-model.trim="query" class="input input--search" placeholder="ძებნა სახელით…"
            @input="onSearch" />
        </div>

        <button class="btn btn--primary" @click="addSelected" :disabled="!canSubmit">
          <i class="fa-solid fa-plus"></i>
          დამატება მონიშნულების ({{ selectedProducts.length }})
        </button>
      </div>
    </header>

    <div class="sp__toolbar" v-if="filteredProducts.length">
      <label class="select-all">
        <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
        <span>ყველას მონიშვნა</span>
      </label>

      <span class="sp__count">
        ნაპოვნია: <strong>{{ filteredProducts.length }}</strong> პროდუქტი
      </span>
    </div>

    <div v-if="loading" class="sp__loading">
      იტვირთება…
    </div>

    <div v-else>
      <div v-if="filteredProducts.length" class="grid">
        <article v-for="product in filteredProducts" :key="product.id" class="card">
          <div class="card__media">
            <input class="checkbox" type="checkbox" :value="product.id" v-model="selectedProducts"
              :aria-label="`მონიშვნა: ${product.name}`" />
            <img class="img" :src="getProductImage(product)" :alt="product.name || 'პროდუქტი'" loading="lazy" />
          </div>

          <div class="card__body">
            <h4 class="card__title" :title="product.name">{{ product.name }}</h4>
            <p class="card__desc" v-if="product.description">{{ product.description }}</p>

            <div class="price">
              <div class="price__row">
                <span class="price__key">ფასი</span>
                <span class="price__val">{{ formatMoney(product.price) }}</span>
              </div>
              <div class="price__row" v-if="Number(product.discount) > 0">
                <span class="price__key">არსებული ფასდაკლება</span>
                <span class="chip chip--purple">{{ Number(product.discount) }}%</span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="sp__empty">
        <i class="fa-regular fa-box-open sp__empty-icon"></i>
        <p class="sp__empty-title">ამ სტატუსისთვის შესაფერისი პროდუქტები არ მოიძებნა</p>
        <p class="sp__empty-sub"> სცადე სხვა ძიება ან შეცვალე ფილტრები</p>
      </div>

      <footer class="sp__pager" v-if="pagination && (pagination.current_page || pagination.currentPage)">
        <button class="btn btn--ghost" :disabled="!hasPrev" @click="changePage(currentPage - 1)">
          <i class="fa-solid fa-chevron-left"></i> წინა
        </button>

        <span class="sp__page-indicator">
          გვერდი {{ currentPage }} / {{ lastPage }}
        </span>

        <button class="btn btn--ghost" :disabled="!hasNext" @click="changePage(currentPage + 1)">
          შემდეგი <i class="fa-solid fa-chevron-right"></i>
        </button>
      </footer>
    </div>
  </section>
</template>

<script>
import api from "@/api";

export default {
  name: "StatusProductComponent",
  props: { id: { type: [String, Number], required: true } },
  data() {
    return {
      products: [],
      eligibleProductIds: [],
      filteredProducts: [],
      selectedProducts: [],
      pagination: {},
      discount: null,
      query: "",
      loading: false,
      nfGel: new Intl.NumberFormat("ka-GE", {
        style: "currency",
        currency: "GEL",
        maximumFractionDigits: 2,
      }),
      searchDebounce: null,
    };
  },
  computed: {
    currentPage() {
      // Laravel pagination sometimes returns current_page or currentPage
      return this.pagination.current_page || this.pagination.currentPage || 1;
    },
    lastPage() {
      return this.pagination.last_page || this.pagination.lastPage || 1;
    },
    hasPrev() {
      return this.currentPage > 1;
    },
    hasNext() {
      return this.currentPage < this.lastPage;
    },
    allSelected() {
      const ids = (this.filteredProducts || []).map((p) => p.id);
      return ids.length > 0 && ids.every((id) => this.selectedProducts.includes(id));
    },
    discountInvalid() {
      // null ნებადართულია? თუ აუცილებელია, ჩართე `this.discount === null` შედარებაშიც
      const d = Number(this.discount);
      return Number.isNaN(d) || d < 0 || d > 100;
    },
    canSubmit() {
      return this.selectedProducts.length > 0 && !this.discountInvalid && this.discount !== null;
    },
  },
  methods: {
    formatMoney(v) {
      const n = Number(v);
      return Number.isFinite(n) ? this.nfGel.format(n) : "—";
    },
    getProductImage(product) {
      if (Array.isArray(product.image_urls) && product.image_urls.length) return product.image_urls[0];
      if (product.image && typeof product.image === "string") return product.image;
      if (product.media && Array.isArray(product.media) && product.media[0]?.original_url) {
        return product.media[0].original_url;
      }
      return "https://via.placeholder.com/480x320?text=Product";
    },

    async fetchEligibleProducts() {
      const { data } = await api.get(`admin/eligible/display/${this.id}`, { tokenRequired: true });
      this.eligibleProductIds = (data?.status?.eligible_products || []).map((p) => p.id);
    },
    async fetchAllProducts(page = 1) {
      const { data } = await api.get(`/admindisplay?page=${page}`, { tokenRequired: true });
      this.products = data.data || data.items || [];
      this.pagination = data.meta || data.pagination || {};
    },
    filterProducts() {
      const q = this.query.toLowerCase();
      const base = this.products.filter((p) => !this.eligibleProductIds.includes(p.id));
      this.filteredProducts = q
        ? base.filter((p) => String(p.name || "").toLowerCase().includes(q))
        : base;
      // ვინახავთ მონიშნულებს მხოლოდ იმათზე, ვინც კვლავ ჩანს
      const visibleIds = new Set(this.filteredProducts.map((p) => p.id));
      this.selectedProducts = this.selectedProducts.filter((id) => visibleIds.has(id));
    },

    async display(page = 1) {
      try {
        this.loading = true;
        await this.fetchEligibleProducts();
        await this.fetchAllProducts(page);
        this.filterProducts();
      } catch (e) {
        console.error("პროდუქტების წამოღების შეცდომა:", e);
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      if (page < 1 || page > this.lastPage) return;
      this.display(page);
    },
    toggleSelectAll(e) {
      if (!this.filteredProducts?.length) return;
      this.selectedProducts = e.target.checked ? this.filteredProducts.map((p) => p.id) : [];
    },
    onSearch() {
      if (this.searchDebounce) clearTimeout(this.searchDebounce);
      this.searchDebounce = setTimeout(() => this.filterProducts(), 200);
    },

    async addSelected() {
      if (!this.canSubmit) return;
      try {
        await api.post(
          `admin/eligible/create/${this.id}`,
          { ids: this.selectedProducts, discount: this.discount },
          { tokenRequired: true }
        );
        // განვაახლოთ სია: ეს პროდუქტები გაქრება (ვერ იქნება ორჯერ დამატებული)
        await this.display(this.currentPage);
      } catch (e) {
        console.error("მონიშნულის დამატების შეცდომა:", e);
      }
    },
  },
  async mounted() {
    await this.display();
  },
};
</script>

<style scoped>
/* ===== Tokens (ბრენდთან შეთანხმებული იისფერი) ===== */
.sp {
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

/* ===== Header ===== */
.sp__head {
  display: grid;
  gap: 10px;
  margin-bottom: 12px;
}

.sp__titles {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.sp__title {
  margin: 0;
  font-weight: 800;
  color: var(--text);
}

.sp__subtitle {
  margin: 0;
  color: var(--muted);
}

.sp__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px;
  box-shadow: var(--shadow);
}

.sp__discount {
  display: grid;
  gap: 6px;
  min-width: 180px;
}

.sp__search {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 220px;
}

/* ===== Toolbar ===== */
.sp__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 0;
}

.select-all {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-weight: 600;
}

.sp__count {
  color: var(--muted);
}

/* ===== Grid ===== */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}

.card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform .15s ease, box-shadow .2s ease, border-color .2s ease;
}

.card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in oklab, var(--accent) 22%, var(--border));
  box-shadow: 0 16px 36px rgba(17, 24, 39, 0.1);
}

.card__media {
  position: relative;
  aspect-ratio: 3 / 2;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: grid;
  place-items: center;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.checkbox {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 18px;
  height: 18px;
  accent-color: var(--accent);
  cursor: pointer;
}

.card__body {
  padding: 12px;
}

.card__title {
  margin: 0 0 6px;
  font-weight: 800;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card__desc {
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0 0 8px;
}

/* pricing */
.price {
  display: grid;
  gap: 6px;
}

.price__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.price__key {
  color: var(--muted);
}

.price__val {
  font-weight: 700;
}

/* chip */
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 12px;
  border: 1px solid transparent;
}

.chip--purple {
  color: var(--accent-ink);
  background: color-mix(in oklab, var(--accent) 10%, #fff);
  border-color: color-mix(in oklab, var(--accent) 28%, transparent);
}

/* ===== Pager ===== */
.sp__pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 14px 0 6px;
}

.sp__page-indicator {
  color: var(--muted);
}

/* ===== States ===== */
.sp__loading {
  text-align: center;
  color: var(--muted);
  padding: 20px 0;
}

.sp__empty {
  display: grid;
  place-items: center;
  padding: 28px 10px;
  text-align: center;
  color: var(--muted);
}

.sp__empty-icon {
  font-size: 28px;
  opacity: .55;
}

.sp__empty-title {
  margin: 0;
  font-weight: 800;
  color: var(--text);
}

.sp__empty-sub {
  margin: 0 0 6px;
}

/* ===== Inputs & Buttons ===== */
.input {
  width: 100%;
  height: 40px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--text);
  outline: none;
  transition: border-color .2s ease, box-shadow .2s ease;
}

.input--search {
  padding-left: 6px;
}

.input:focus {
  border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 15%, transparent);
}

.input--error {
  border-color: color-mix(in oklab, var(--danger) 50%, var(--border));
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--danger) 15%, transparent);
}

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

.btn:disabled {
  opacity: .6;
  cursor: not-allowed;
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

/* ===== Responsive ===== */
@media (max-width: 740px) {
  .sp__controls {
    flex-direction: column;
    align-items: stretch;
  }

  .sp__search {
    width: 100%;
  }
}
</style>
