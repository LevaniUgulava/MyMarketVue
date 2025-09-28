<template>
  <section class="cp">
    <!-- Top status message -->
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

    <div class="form-card">
      <header class="form-card__head">
        <h2 class="form-card__title">პროდუქტის დამატება</h2>
        <p class="form-card__sub">შეავსე აუცილებელი ველები და დაადასტურე.</p>
      </header>

      <form class="product-form" @submit.prevent="createProduct" novalidate>
        <!-- Base info -->
        <div class="grid">
          <div class="field">
            <label for="name">სახელი</label>
            <input id="name" v-model.trim="form.name" type="text" class="input" placeholder="მაგ. Air Max 90" required
              :disabled="loading.submit">
          </div>

          <div class="field">
            <label for="price">ფასი</label>
            <input id="price" v-model.number="form.price" min="0" step="0.01" type="number" class="input"
              placeholder="მაგ. 199.99" required :disabled="loading.submit">
          </div>

          <div class="field field--full">
            <label for="desc">აღწერა</label>
            <input id="desc" v-model.trim="form.description" type="text" class="input" placeholder="მოკლე აღწერა"
              required :disabled="loading.submit">
          </div>
        </div>

        <!-- Relations -->
        <div class="grid">
          <div class="field">
            <label>მთავარი კატეგორია</label>
            <select v-model="form.mainCategory" class="input" required
              :disabled="loading.submit || !maincategories.length">
              <option value="" disabled>აირჩიე</option>
              <option v-for="mc in maincategories" :key="mc.id" :value="mc.id">{{ mc.ka_name }}</option>
            </select>
          </div>

          <div class="field">
            <label>კატეგორია</label>
            <select v-model="form.category" class="input" required
              :disabled="loading.submit || !filteredcategory.length">
              <option value="" disabled>აირჩიე</option>
              <option v-for="c in filteredcategory" :key="c.id" :value="c.id">{{ c.ka_name }}</option>
            </select>
          </div>

          <div class="field">
            <label>ქვეკატეგორია</label>
            <select v-model="form.subCategory" class="input" required
              :disabled="loading.submit || !filteredsubcategory.length">
              <option value="" disabled>აირჩიე</option>
              <option v-for="s in filteredsubcategory" :key="s.id" :value="s.id">{{ s.ka_name }}</option>
            </select>
          </div>

          <div class="field">
            <label>ბრენდები</label>
            <select v-model="form.brand" class="input" multiple :disabled="loading.submit || !brands.length">
              <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
            </select>
            <small class="hint">შეგიძლია რამდენიმე ბრენდის არჩევა.</small>
          </div>
        </div>

        <!-- Sizes -->
        <div class="grid">
          <div class="field">
            <label>ზომის ტიპი</label>
            <select v-model="form.size_type" class="input" required :disabled="loading.submit">
              <option value="" disabled>აირჩიე</option>
              <option value="numeric">რიცხვითი</option>
              <option value="letter-based">ასოებზე</option>
            </select>
          </div>

          <div class="field field--full" v-if="form.size_type === 'numeric'">
            <label>რიცხვითი ზომები</label>
            <select v-model="form.Sizes" class="input" multiple :disabled="loading.submit || !numericbased.length">
              <option v-for="sz in numericbased" :key="`n-${sz}`" :value="sz">{{ sz }}</option>
            </select>
            <small class="hint">აირჩიე ერთზე მეტი ზომაც.</small>
          </div>

          <div class="field field--full" v-if="form.size_type === 'letter-based'">
            <label>ასოებზე ზომები</label>
            <select v-model="form.Sizes" class="input" multiple :disabled="loading.submit || !letterbased.length">
              <option v-for="sz in letterbased" :key="`l-${sz}`" :value="sz">{{ sz }}</option>
            </select>
          </div>
        </div>

        <!-- Size details -->
        <div v-if="form.Sizes.length && (form.size_type === 'numeric' || form.size_type === 'letter-based')"
          class="size-block">
          <div v-for="(size, index) in form.Sizes" :key="index" class="size-detail">
            <div class="size-detail__head">
              <h4 class="size-detail__title">{{ size }} — დეტალები</h4>

              <div class="qctrl">
                <span class="qctrl__label">ფერების რაოდენობა</span>
                <div class="qctrl__row">
                  <button class="btn btn--ghost" @click.prevent="decrease(index)" :disabled="loading.submit">−</button>
                  <span class="qctrl__val">{{ colorquantity[index] || 1 }}</span>
                  <button class="btn btn--ghost" @click.prevent="increase(index)" :disabled="loading.submit">+</button>
                </div>
              </div>
            </div>

            <div v-for="colorIndex in (colorquantity[index] || 1)" :key="`sz-${index}-c-${colorIndex - 1}`"
              class="color-row">
              <input type="number" min="0" class="input" v-model.number="form.quantity[index][colorIndex - 1]"
                placeholder="რაოდენობა" required :disabled="loading.submit" />

              <input type="text" class="input" v-model.trim="form.color[index][colorIndex - 1]"
                placeholder="ფერის სახელი ( напр. Black )" required :disabled="loading.submit" />

              <div class="hex-wrap">
                <input class="input input--color" type="color" v-model="form.hex[index][colorIndex - 1]"
                  :disabled="loading.submit" />
                <input class="input" type="text" v-model.trim="form.hex[index][colorIndex - 1]" placeholder="#000000"
                  required :disabled="loading.submit" />
              </div>
            </div>
          </div>
        </div>

        <!-- Additional info -->
        <div class="divider"></div>

        <button class="btn btn--ghost" @click.prevent="toggleAdditionalInfo" type="button">
          {{ isAdditionalinfo ? 'დამატებითი ინფორმაციის დაფარვა' : 'დამატებითი ინფორმაცია?' }}
        </button>

        <div class="addl" v-if="isAdditionalinfo">
          <header class="addl__head">
            <h4 class="addl__title">დამატებითი ველები</h4>
            <div class="qctrl">
              <span class="qctrl__label">რაოდენობა</span>
              <div class="qctrl__row">
                <button class="btn btn--ghost" @click.prevent="infocolumn = Math.max(1, infocolumn - 1)"
                  :disabled="loading.submit">−</button>
                <span class="qctrl__val">{{ infocolumn }}</span>
                <button class="btn btn--ghost" @click.prevent="infocolumn++" :disabled="loading.submit">+</button>
              </div>
            </div>
            <button class="btn" :class="islockedin ? 'btn--primary' : 'btn--ghost'" @click.prevent="toggleisLockedin"
              type="button">
              {{ islockedin ? 'განბლოკე' : 'ჩაკეტე' }}
            </button>
          </header>

          <div class="addl__list">
            <div class="addl__row" v-for="(n, i) in infocolumn" :key="i">
              <input :disabled="islockedin || loading.submit" type="text" class="input" v-model.trim="additionalname[i]"
                placeholder="ველის სახელი ( напр. Material )" required>
              <input :disabled="islockedin || loading.submit" type="text" class="input"
                v-model.trim="additionaldescription[i]" placeholder="ველის მნიშვნელობა ( напр. Cotton )" required>
            </div>
          </div>
        </div>

        <!-- Images -->
        <div class="grid">
          <div class="field field--full">
            <label>ფოტოები</label>
            <input type="file" class="input" name="image" multiple accept="image/*" @change="onFileChange"
              :disabled="loading.submit">
            <div v-if="imagePreviews.length" class="previews">
              <img v-for="(src, i) in imagePreviews" :key="i" :src="src" alt="preview" class="preview">
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="form-actions">
          <button type="submit" class="btn btn--primary" :disabled="!canSubmit || loading.submit">
            <i v-if="loading.submit" class="fa-solid fa-spinner fa-spin"></i>
            {{ loading.submit ? 'დამატება…' : 'პროდუქტის დამატება' }}
          </button>
          <button type="button" class="btn btn--ghost" @click="resetForm"
            :disabled="loading.submit">გასუფთავება</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import api from '@/api';

export default {
  name: 'CreateProductComponent',
  data() {
    return {
      // UI state
      loading: { submit: false },
      toast: { show: false, type: 'info', message: '', code: null },
      imagePreviews: [],

      // persisted extras
      additionalname: JSON.parse(localStorage.getItem('additionalname')) || [],
      additionaldescription: JSON.parse(localStorage.getItem('additionaldescription')) || [],
      infocolumn: 1,
      islockedin: localStorage.getItem('islockedin') === 'true' || false,
      isAdditionalinfo: localStorage.getItem('isAdditionalinfo') === 'true' || false,

      // master data
      maincategories: [],
      categories: [],
      subcategories: [],
      brands: [],
      numericbased: [],
      letterbased: [],

      // dynamic size helpers
      colorquantity: {},

      // form
      form: {
        name: '',
        description: '',
        price: null,
        mainCategory: '',
        category: '',
        subCategory: '',
        image: null,
        size_type: '',
        Sizes: [],
        quantity: [],
        color: [],
        hex: [],
        brand: [], // multiple
      },
    };
  },
  computed: {
    filteredcategory() {
      const mcId = Number(this.form.mainCategory);
      if (!mcId) return [];
      return (this.categories || []).filter(c =>
        this._asArrayIds(c.maincategory_id).some(id => id === mcId)
      );
    },
    filteredsubcategory() {
      const cId = Number(this.form.category);
      if (!cId) return [];
      return (this.subcategories || []).filter(sc =>
        this._asArrayIds(sc.category_id).some(id => id === cId)
      );
    },
    canSubmit() {
      const baseOk =
        this.form.name.trim() &&
        this.form.description.trim() &&
        Number(this.form.price) >= 0 &&
        this.form.mainCategory &&
        this.form.category &&
        this.form.subCategory &&
        this.form.size_type;

      // თუ ზომებია არჩეული, გადაამოწმე რომ quantity/color/hex შეივსო
      if (this.form.Sizes.length) {
        for (let i = 0; i < this.form.Sizes.length; i++) {
          const q = this.form.quantity[i] || [];
          const c = this.form.color[i] || [];
          const h = this.form.hex[i] || [];
          const len = this.colorquantity[i] || 1;
          for (let k = 0; k < len; k++) {
            if (
              !(q[k] >= 0) ||
              !String(c[k] || '').trim() ||
              !String(h[k] || '').trim()
            ) return false;
          }
        }
      }
      return !!baseOk;
    },
  },
  watch: {
    'form.Sizes': {
      handler(newSizes) {
        // ინიციალიზაცია თითო ინდექსზე, როცა ზომებს ამატებ/აშლი
        newSizes.forEach((_, idx) => {
          if (!this.colorquantity[idx]) this.colorquantity[idx] = 1;
          if (!Array.isArray(this.form.color[idx])) this.form.color[idx] = [];
          if (!Array.isArray(this.form.quantity[idx])) this.form.quantity[idx] = [];
          if (!Array.isArray(this.form.hex[idx])) this.form.hex[idx] = [];
        });
      },
      deep: true,
    },
    isAdditionalinfo(v) {
      localStorage.setItem('isAdditionalinfo', v);
    },
    islockedin(v) {
      localStorage.setItem('islockedin', v);
    },
  },
  methods: {
    _asArrayIds(v) {
      if (Array.isArray(v)) return v.map(x => Number(x));
      const n = Number(v);
      return Number.isFinite(n) ? [n] : [];
    },
    showToast(type, message, code = null) {
      this.toast = { show: true, type, message, code };
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => (this.toast.show = false), 4000);
    },
    resetForm() {
      this.form = {
        name: '',
        description: '',
        price: null,
        mainCategory: '',
        category: '',
        subCategory: '',
        image: null,
        size_type: '',
        Sizes: [],
        quantity: [],
        color: [],
        hex: [],
        brand: [],
      };
      this.colorquantity = {};
      this.imagePreviews = [];
    },

    // toggles
    toggleAdditionalInfo() {
      this.isAdditionalinfo = !this.isAdditionalinfo;
    },
    toggleisLockedin() {
      this.islockedin = !this.islockedin;
      for (let i = 0; i < this.infocolumn; i++) {
        localStorage.setItem(`additionalname[${i}]`, this.additionalname[i] || '');
        localStorage.setItem(`additionaldescription[${i}]`, this.additionaldescription[i] || '');
      }
      localStorage.setItem('additionalname', JSON.stringify(this.additionalname));
      localStorage.setItem('additionaldescription', JSON.stringify(this.additionaldescription));
    },
    convertTojson() {
      const data = this.additionalname.map((name, idx) => ({ [name]: this.additionaldescription[idx] }));
      return JSON.stringify(data);
    },

    // color qty
    decrease(index) {
      if ((this.colorquantity[index] || 1) > 1) this.colorquantity[index] -= 1;
    },
    increase(index) {
      if (!(index in this.colorquantity)) this.colorquantity[index] = 1;
      this.colorquantity[index] += 1;
    },

    // data fetch
    async fetchcategory() {
      try {
        const [mc, c, sc] = await Promise.all([
          api.get('maincategory'),
          api.get('category'),
          api.get('subcategory'),
        ]);
        this.maincategories = Array.isArray(mc.data) ? mc.data : (mc.data?.data || []);
        this.categories = Array.isArray(c.data) ? c.data : (c.data?.data || []);
        this.subcategories = Array.isArray(sc.data) ? sc.data : (sc.data?.data || []);
      } catch (error) {
        this.showToast('error', 'კატეგორიების წამოღება ვერ მოხერხდა', error?.response?.status);
        console.error(error);
      }
    },
    async Getsize() {
      try {
        const { data } = await api.get('getSizes');
        this.letterbased = data.letterbased || [];
        this.numericbased = data.numericbased || [];
      } catch (error) {
        this.showToast('error', 'ზომების წამოღება ვერ მოხერხდა', error?.response?.status);
        console.error(error);
      }
    },
    async getBrand() {
      try {
        const { data } = await api.get('admin/brand/display', { tokenRequired: true });
        this.brands = Array.isArray(data) ? data : (data?.data || []);
      } catch (error) {
        this.showToast('error', 'ბრენდების წამოღება ვერ მოხერხდა', error?.response?.status);
        console.error(error);
      }
    },

    // images
    onFileChange(e) {
      this.form.image = e.target.files;
      this.imagePreviews = [];
      if (this.form.image && this.form.image.length) {
        Array.from(this.form.image).forEach((f) => {
          const url = URL.createObjectURL(f);
          this.imagePreviews.push(url);
        });
      }
    },

    // submit
    async createProduct() {
      if (!this.canSubmit) {
        this.showToast('error', 'გთხოვ, შეავსე აუცილებელი ველები');
        return;
      }

      this.loading.submit = true;
      try {
        const fd = new FormData();
        fd.append('name', this.form.name);
        fd.append('description', this.form.description);
        fd.append('price', Number(this.form.price).toFixed(2));
        fd.append('maincategory_id', this.form.mainCategory);
        fd.append('category_id', this.form.category);
        fd.append('subcategory_id', this.form.subCategory);
        fd.append('size_type', this.form.size_type);

        // brand multiple → brand_id[]
        (this.form.brand || []).forEach((b, i) => fd.append(`brand_id[${i}]`, b));

        // sizes + color rows
        this.form.Sizes.forEach((size, i) => {
          fd.append(`size[${i}]`, size);
          const len = this.colorquantity[i] || 1;
          for (let k = 0; k < len; k++) {
            fd.append(`color[${i}][${k}]`, this.form.color[i]?.[k] ?? '');
            fd.append(`quantity[${i}][${k}]`, this.form.quantity[i]?.[k] ?? 0);
            fd.append(`hex[${i}][${k}]`, this.form.hex[i]?.[k] ?? '#000000');
          }
        });

        // additional info JSON
        fd.append('additionalinfo', this.convertTojson());

        // images[]
        if (this.form.image) {
          for (let i = 0; i < this.form.image.length; i++) {
            fd.append('images[]', this.form.image[i]);
          }
        }

        const res = await api.post('addproduct', fd, { tokenRequired: true });

        this.showToast('success', 'პროდუქტი წარმატებით დაემატა', res?.status);
        // this.resetForm();
      } catch (error) {
        const code = error?.response?.status;
        const msg = error?.response?.data?.message || 'შეცდომა პროდუქტის დამატებისას';
        this.showToast('error', msg, code);
        console.error('Create product error:', error);
      } finally {
        this.loading.submit = false;
      }
    },
  },
  mounted() {
    this.fetchcategory();
    this.Getsize();
    this.getBrand();
  },
};
</script>

<style scoped>
/* ===== Tokens ===== */
.cp {
  --accent: #6B21A8;
  --accent-ink: #4C1878;

  --bg: #ffffff;
  --surface: #f7f7fb;
  --border: #e6e8ef;

  --text: #111827;
  --muted: #6b7280;

  --success: #16a34a;
  --error: #ef4444;

  --radius: 14px;
  --shadow: 0 12px 28px rgba(17, 24, 39, .06);
}

.cp {
  padding: 20px;
  color: var(--text);
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

/* ===== Card ===== */
.form-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
  padding: 16px;
}

.form-card__head {
  margin-bottom: 10px;
}

.form-card__title {
  margin: 0;
  font-weight: 800;
}

.form-card__sub {
  margin: 4px 0 0;
  color: var(--muted);
}

/* ===== Grid/Form ===== */
.product-form {
  display: grid;
  gap: 14px;
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

.field--full {
  grid-column: 1 / -1;
}

@media (max-width: 720px) {

  .field,
  .field--full {
    grid-column: 1 / -1;
  }
}

label {
  font-size: .9rem;
  color: var(--muted);
}

.hint {
  color: var(--muted);
  font-size: 12px;
}

/* Inputs */
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

.input--color {
  padding: 0 4px;
  width: 56px;
}

/* Size block */
.size-block {
  display: grid;
  gap: 12px;
}

.size-detail {
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #fff;
  box-shadow: var(--shadow);
  padding: 12px;
}

.size-detail__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.size-detail__title {
  margin: 0;
  font-weight: 800;
}

.color-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 8px;
}

.hex-wrap {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 8px;
}

/* Qty controls */
.qctrl {
  display: inline-grid;
  gap: 4px;
  justify-items: center;
}

.qctrl__row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.qctrl__val {
  min-width: 20px;
  text-align: center;
  font-weight: 800;
}

/* Additional info */
.divider {
  height: 1px;
  background: var(--border);
  margin: 8px 0;
}

.addl {
  display: grid;
  gap: 10px;
}

.addl__head {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.addl__title {
  margin: 0;
  font-weight: 800;
}

.addl__list {
  display: grid;
  gap: 10px;
}

.addl__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

@media (max-width: 720px) {
  .addl__row {
    grid-template-columns: 1fr;
  }
}

/* Previews */
.previews {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.preview {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--border);
}

/* Actions & Buttons */
.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
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
</style>
