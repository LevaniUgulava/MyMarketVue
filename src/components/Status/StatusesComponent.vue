<template>
  <section class="status-admin">
    <header class="sa__header">
      <h1 class="sa__title">User Statuses</h1>
      <p class="sa__subtitle">მართე სტატუსები, ბარიერები და ლიმიტები</p>
    </header>

    <div class="sa__card">
      <div class="sa__table-wrap">
        <table class="sa__table">
          <thead>
            <tr>
              <th>#</th>
              <th>სტატუსის სახელი</th>
              <th>დრო</th>
              <th>გაფართოება</th>
              <th>მისაღწევი დონე</th>
              <th>ლიმიტი</th>
              <th>მოქმედებები</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="status in statuses" :key="status.id">
              <td>{{ status.id }}</td>
              <td class="sa__cell-strong">{{ status.name }}</td>
              <td>{{ status.time || '—' }}</td>
              <td>{{ status.expansion || '—' }}</td>
              <td>{{ formatNumber(status.toachieve) }}</td>
              <td>{{ status.limit }}</td>

              <td class="sa__actions">
                <button class="btn btn--ghost-red" @click="deletestatus(status.id)">
                  <i class="fa-solid fa-trash"></i>
                  Delete
                </button>
                <button class="btn btn--ghost-blue" @click="viewstatus(status.id)">
                  <i class="fa-solid fa-eye"></i>
                  View
                </button>
                <button class="btn btn--ghost-green" @click="vieweligible(status.id)">
                  <i class="fa-solid fa-award"></i>
                  Eligible
                </button>
              </td>
            </tr>
            <tr v-if="!statuses.length">
              <td colspan="6" class="sa__empty">სტატუსები არ არის</td>
            </tr>
          </tbody>
        </table>
      </div>

      <button class="sa__toggle" @click="showform = !showform">
        <i class="fa-solid" :class="showform ? 'fa-caret-up' : 'fa-caret-down'"></i>
        <span>{{ showform ? 'Close' : 'Click to Create' }}</span>
      </button>

      <transition name="fade">
        <div v-if="showform" class="sa__form">
          <h3 class="sa__form-title">Create Status</h3>
          <form @submit.prevent="create">
            <div class="grid">
              <div class="field">
                <label for="statusName">სახელი</label>
                <input id="statusName" type="text" v-model.trim="form.name" placeholder="შეიყვანეთ სტატუსის სახელი"
                  required />
              </div>

              <div class="field">
                <label for="toAchieve">მისაღწევი დონე</label>
                <input id="toAchieve" type="number" v-model.number="form.toachieve" placeholder=" მაგ. 1000" min="0"
                  step="1" required />
              </div>



              <div class="field">
                <label for="limit">ლიმიტი (10.00)</label>
                <input id="limit" type="text" v-model="form.limit" placeholder=" მაგ. 10.00" inputmode="decimal"
                  required />
                <small class="hint">ფორმატი ზუსტად ორი ათწილადი: 0.00, 25.50, 1000.00</small>
              </div>

              <div class="field">
                <label for="time">დრო</label>
                <input id="time" type="number" v-model="form.time" placeholder=" მაგ. 1" required />
                <small class="hint">ფორმატი ზუსტად: 1-30მდე</small>
              </div>


              <div class="field">
                <label for="scope">გაფართოება</label>
                <select id="scope" v-model="form.scope">
                  <option value="">— აირჩიე —</option>
                  <option value="day">დღე</option>
                  <option value="month">თვე</option>
                  <option value="year">წელი</option>


                </select>
              </div>
            </div>

            <div class="sa__form-actions">
              <button type="submit" class="btn btn--primary" :disabled="submitting">
                {{ submitting ? 'Saving…' : 'Create' }}
              </button>
              <button type="button" class="btn btn--ghost" @click="cancel" :disabled="submitting">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
import api from '@/api';

export default {
  name: 'StatusComponent',
  data() {
    return {
      statuses: [],
      showform: false,
      submitting: false,
      form: {
        name: '',
        toachieve: '',
        time: '',
        limit: '',
        scope: '',
      },
      nf: new Intl.NumberFormat('ka-GE'),
      df: new Intl.DateTimeFormat('ka-GE', { dateStyle: 'medium' }),
    };
  },
  methods: {
    formatNumber(n) {
      const v = Number(n);
      return Number.isFinite(v) ? this.nf.format(v) : '—';
    },
    formatDate(d) {
      if (!d) return '';
      const dt = new Date(d);
      return isNaN(+dt) ? '' : this.df.format(dt);
    },

    async display() {
      try {
        const { data } = await api.get('admin/userstatus/display', { tokenRequired: true });
        this.statuses = data.statuses || [];
      } catch (e) {
        console.error(e);
      }
    },

    async create() {


      this.submitting = true;
      try {
        await api.post(
          'admin/userstatus/create',
          {
            name: this.form.name,
            toachieve: this.form.toachieve,
            time: this.form.time || null,
            limit: this.form.limit,
            expansion: this.form.scope || null,
          },
          { tokenRequired: true }
        );

        this.cancel();   // გასუფთავება
        await this.display();
      } catch (e) {
        console.error(e);
      } finally {
        this.submitting = false;
      }
    },

    cancel() {
      this.form = {
        name: '',
        toachieve: '',
        start_data: '',
        end_date: '',
        limit: '',
        scope: '',
      };
      this.showform = false;
    },

    async deletestatus(id) {
      if (!confirm('წავშალო სტატუსი?')) return;
      try {
        await api.post(`admin/userstatus/delete/${id}`, {}, { tokenRequired: true });
        await this.display();
      } catch (e) {
        console.error(e);
      }
    },

    viewstatus(id) {
      this.$router.push({ name: 'singlestatus', params: { id } });
    },

    vieweligible(id) {
      this.$router.push({ name: 'singleeligiblestatus', params: { id } });
    },
  },

  mounted() {
    this.display();
  },
};
</script>

<style scoped>
/* ===== Brand palette (matching your purple header) ===== */
.status-admin {
  --accent: #6B21A8;
  /* მთავარი იისფერი (header-ს ტონი) */
  --accent-ink: #4C1878;

  --bg: #ffffff;
  --surface: #f7f7fb;
  --border: #e6e8ef;

  --text: #111827;
  --muted: #6b7280;

  --blue: #3b82f6;
  --green: #16a34a;
  --red: #ef4444;

  --radius: 12px;
  --shadow: 0 12px 28px rgba(17, 24, 39, 0.06);
}

/* ===== Layout ===== */
.status-admin {
  padding: 24px;
}

.sa__header {
  margin: 0 0 16px;
}

.sa__title {
  margin: 0;
  font-weight: 800;
  text-align: center;
  color: var(--text);
}

.sa__subtitle {
  margin: 6px 0 0;
  text-align: center;
  color: var(--muted);
}

.sa__card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
  padding: 16px;
}

/* ===== Table ===== */
.sa__table-wrap {
  overflow-x: auto;
}

.sa__table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg);
  border-radius: 12px;
  overflow: hidden;
}

.sa__table thead th {
  background: var(--accent);
  color: #fff;
  text-align: left;
  padding: 12px 14px;
  font-weight: 700;
  letter-spacing: .2px;
  white-space: nowrap;
}

.sa__table tbody td {
  border-bottom: 1px solid var(--border);
  padding: 12px 14px;
  vertical-align: middle;
}

.sa__table tbody tr:nth-child(odd) {
  background: var(--surface);
}

.sa__cell-strong {
  font-weight: 700;
  color: var(--text);
}

.sa__empty {
  text-align: center;
  color: var(--muted);
  padding: 20px;
}

/* ===== Actions ===== */
.sa__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-weight: 700;
  border-radius: 999px;
  border: 1px solid transparent;
  background: #fff;
  color: var(--text);
  transition: transform .12s ease, background .2s ease, border-color .2s ease, color .2s ease;
  cursor: pointer;
}

.btn i {
  font-size: 0.9em;
}

.btn--ghost-blue {
  color: var(--blue);
  border-color: color-mix(in oklab, var(--blue) 35%, transparent);
  background: color-mix(in oklab, var(--blue) 6%, #fff);
}

.btn--ghost-green {
  color: var(--green);
  border-color: color-mix(in oklab, var(--green) 35%, transparent);
  background: color-mix(in oklab, var(--green) 6%, #fff);
}

.btn--ghost-red {
  color: var(--red);
  border-color: color-mix(in oklab, var(--red) 35%, transparent);
  background: color-mix(in oklab, var(--red) 6%, #fff);
}

.btn--ghost-blue:hover,
.btn--ghost-green:hover,
.btn--ghost-red:hover {
  transform: translateY(-1px);
  background: #fff;
}

.btn--primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.btn--primary:hover {
  background: var(--accent-ink);
  border-color: var(--accent-ink);
}

.btn--ghost {
  background: #fff;
  border-color: var(--border);
  color: var(--text);
}

.btn--ghost:hover {
  background: var(--surface);
}

/* ===== Toggle ===== */
.sa__toggle {
  margin: 12px 0 0;
  width: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 44px;
  border-radius: 10px;
  background: color-mix(in oklab, var(--accent) 8%, #fff);
  color: var(--accent-ink);
  border: 1px solid color-mix(in oklab, var(--accent) 28%, transparent);
  font-weight: 700;
  cursor: pointer;
  transition: background .2s ease, transform .12s ease;
}

.sa__toggle:hover {
  transform: translateY(-1px);
}

/* ===== Form ===== */
.sa__form {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed var(--border);
}

.sa__form-title {
  text-align: center;
  margin: 0 0 12px;
  color: var(--text);
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 12px;
}

.field {
  grid-column: span 6;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field:nth-child(1) {
  grid-column: span 12;
}

label {
  font-size: .875rem;
  color: var(--muted);
}

input,
select {
  width: 100%;
  height: 42px;
  border-radius: 10px;
  text-indent: 15px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--text);
  outline: none;
  transition: border-color .2s ease, box-shadow .2s ease;
}

input:focus,
select:focus {
  border-color: color-mix(in oklab, var(--accent) 40%, var(--border));
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 15%, transparent);
}

.hint {
  color: var(--muted);
  font-size: 12px;
}

.sa__form-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* ===== Animations ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== Responsive ===== */
@media (max-width: 720px) {
  .status-admin {
    padding: 16px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .field {
    grid-column: 1 / -1;
  }
}
</style>
