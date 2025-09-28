<template>
  <section class="eligible">
    <!-- Status card -->
    <div class="panel">
      <header class="panel__head">
        <h2 class="panel__title">{{ data.name || 'სტატუსი' }}</h2>
        <span class="badge">ID: {{ data.id ?? '—' }}</span>
      </header>
      <div class="panel__body">
        <div class="kv">
          <span class="kv__key">მისაღწევი დონე</span>
          <span class="kv__val">{{ formatMoney(data.toachieve) }}</span>
        </div>
        <div class="kv">
          <span class="kv__key">შექმნის თარიღი</span>
          <span class="kv__val">{{ formatDate(data.created_at) || '—' }}</span>
        </div>
        <div class="kv">
          <span class="kv__key">განახლების თარიღი</span>
          <span class="kv__val">{{ formatDate(data.updated_at) || '—' }}</span>
        </div>
      </div>
    </div>

    <!-- Eligible products -->
    <div class="panel">
      <header class="panel__head">
        <h3 class="panel__title">მოცემულ სტატუსზე დაშვებული პროდუქტები</h3>

        <div class="actions">
          <label class="select-all">
            <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
            <span>ყველას მონიშვნა</span>
          </label>

          <div class="actions__btns">
            <button class="btn btn--primary" @click="addEligible">
              <i class="fa-solid fa-plus"></i> დამატება
            </button>
            <button class="btn btn--danger" :disabled="!selectedProducts.length || deleting" @click="deleteSelected"
              :aria-disabled="!selectedProducts.length">
              <i class="fa-solid fa-trash"></i>
              {{ deleting ? 'წაშლა…' : `წაშლა (${selectedProducts.length})` }}
            </button>
          </div>
        </div>
      </header>

      <div v-if="data.eligible_products && data.eligible_products.length" class="grid">
        <article v-for="product in data.eligible_products" :key="product.id" class="card">
          <div class="card__media">
            <input class="checkbox" type="checkbox" :value="product.id" v-model="selectedProducts"
              :aria-label="`მონიშვნა: ${product.name}`" />
            <img class="img" :src="getProductImage(product)" :alt="product.name || 'პროდუქტი'" loading="lazy" />
          </div>

          <div class="card__body">
            <h4 class="card__title">{{ product.name }}</h4>
            <p class="card__desc" v-if="product.description">{{ product.description }}</p>

            <div class="price">
              <div class="price__row">
                <span class="price__key">ფასი</span>
                <span class="price__val">{{ formatMoney(product.price) }}</span>
              </div>

              <div class="price__row">
                <span class="price__key">ჩვეულებრივი ფასდაკლება</span>
                <span class="chip chip--red">{{ Number(product.product_discount) }}%</span>
              </div>
              <div class="price__row">
                <span class="price__key">ჩვეულებრივი ფასდაკლებით</span>
                <span class="price__val price__val--strong">
                  {{ formatMoney(product.discountprice ?? product.price) }}
                </span>
              </div>
              <div class="price__row">
                <span class="price__key">სტატუსური ფასდაკლება</span>
                <span class="chip chip--gold">{{ Number(product.status_discount) }}%</span>
              </div>

              <div class="price__row">
                <span class="price__key">სტატუსური ფასდაკლებით</span>
                <span class="price__val price__val--strong">
                  {{ formatMoney(product.price * (1 - (product.status_discount / 100))) }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="empty">
        <div class="empty__inner">
          <i class="fa-regular fa-box-open empty__icon"></i>
          <p class="empty__title">ამ სტატუსზე პროდუქტები არ არის დამატებული</p>
          <p class="empty__sub">დაამატე პროდუქტები „დამატება“ ღილაკიდან</p>
          <button class="btn btn--primary" @click="addEligible">
            <i class="fa-solid fa-plus"></i> დამატება
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from "@/api";

export default {
  name: "EligibleproductComponent",
  props: {
    id: { type: [String, Number], required: true },
  },
  data() {
    return {
      data: { eligible_products: [] },
      selectedProducts: [],
      deleting: false,
      nfGel: new Intl.NumberFormat("ka-GE", {
        style: "currency",
        currency: "GEL",
        maximumFractionDigits: 2,
      }),
      df: new Intl.DateTimeFormat("ka-GE", { dateStyle: "medium", timeStyle: "short" }),
    };
  },
  computed: {
    allSelected() {
      const ids = (this.data.eligible_products || []).map((p) => p.id);
      return ids.length > 0 && ids.every((id) => this.selectedProducts.includes(id));
    },
  },
  methods: {
    formatMoney(v) {
      const n = Number(v);
      return Number.isFinite(n) ? this.nfGel.format(n) : "—";
    },
    formatDate(v) {
      if (!v) return "";
      const d = new Date(v);
      return isNaN(+d) ? "" : this.df.format(d);
    },
    getProductImage(product) {
      if (Array.isArray(product.image_urls) && product.image_urls.length) {
        return product.image_urls[0];
      }
      if (product.image && typeof product.image === "string") {
        return product.image;
      }
      if (product.media && Array.isArray(product.media) && product.media[0]?.original_url) {
        return product.media[0].original_url;
      }
      return "https://via.placeholder.com/480x320?text=Product";
    },
    async display() {
      try {
        const { data } = await api.get(`admin/eligible/display/${this.id}`, {
          tokenRequired: true,
        });
        this.data = data.status || { eligible_products: [] };
        this.selectedProducts = [];
      } catch (error) {
        console.error("სტატუსის წამოღების შეცდომა:", error);
      }
    },
    addEligible() {
      this.$router.push({ name: "productseligible", params: { id: this.id } });
    },
    toggleSelectAll(e) {
      if (!this.data.eligible_products?.length) return;
      if (e.target.checked) {
        this.selectedProducts = this.data.eligible_products.map((p) => p.id);
      } else {
        this.selectedProducts = [];
      }
    },
    async deleteSelected() {
      if (!this.selectedProducts.length || this.deleting) return;
      if (!confirm("დარწმუნებული ხარ, რომ მონიშნული პროდუქტები წაიშალოს ამ სტატუსიდან?")) return;

      this.deleting = true;
      try {
        await api.post(
          `admin/eligible/delete/${this.id}`,
          { id: this.selectedProducts },
          { tokenRequired: true }
        );
        await this.display();
      } catch (error) {
        console.error("Eligible პროდუქტების წაშლის შეცდომა:", error);
      } finally {
        this.deleting = false;
      }
    },
  },
  mounted() {
    this.display();
  },
};
</script>

<style scoped>
.eligible {
  --accent: #6B21A8;
  --accent-ink: #4C1878;

  --bg: #ffffff;
  --surface: #f7f7fb;
  --border: #e6e8ef;

  --text: #111827;
  --muted: #6b7280;

  --success: #16a34a;
  --danger: #ef4444;

  --radius: 14px;
  --shadow: 0 12px 28px rgba(17, 24, 39, 0.06);
}

/* ===== Layout ===== */
.eligible {
  padding: 20px;
  color: var(--text);
}

.panel {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
  padding: 16px;
  margin-bottom: 18px;
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.panel__title {
  margin: 0;
  font-weight: 800;
  letter-spacing: 0.2px;
}

.panel__body {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.badge {
  background: color-mix(in oklab, var(--accent) 10%, #fff);
  border: 1px solid color-mix(in oklab, var(--accent) 30%, transparent);
  color: var(--accent-ink);
  font-weight: 700;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
}

/* key-value lines */
.kv {
  display: flex;
  align-items: center;
  gap: 10px;
}

.kv__key {
  color: var(--muted);
  min-width: 140px;
}

.kv__val {
  font-weight: 700;
}

/* ===== Actions row ===== */
.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.select-all {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-weight: 600;
}

.actions__btns {
  display: inline-flex;
  gap: 8px;
}

/* ===== Grid of product cards ===== */
.grid {
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
  font-size: 13px;
}

.price__val {
  font-weight: 700;
  font-size: 13px;

}

.price__val--strong {
  color: var(--accent-ink);
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


.chip--red {
  color: white;
  background: red
}

.chip--gold {
  color: white;
  background: gold
}


/* empty state */
.empty {
  display: grid;
  place-items: center;
  padding: 28px 10px;
  text-align: center;
  color: var(--muted);
}

.empty__inner {
  display: grid;
  gap: 8px;
  place-items: center;
}

.empty__icon {
  font-size: 28px;
  opacity: .55;
}

.empty__title {
  margin: 0;
  font-weight: 800;
  color: var(--text);
}

.empty__sub {
  margin: 0 0 6px;
}

/* buttons */
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

.btn--danger {
  background: #fff;
  color: var(--danger);
  border-color: color-mix(in oklab, var(--danger) 35%, transparent);
}

.btn--danger:hover {
  background: color-mix(in oklab, var(--danger) 6%, #fff);
  transform: translateY(-1px);
}

/* responsive */
@media (max-width: 720px) {
  .panel__body {
    grid-template-columns: 1fr;
  }
}
</style>
