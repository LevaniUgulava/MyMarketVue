<template>
  <section class="status">
    <header class="status__header">
      <div class="status__title-row">
        <h3 class="status__title">სტატუსის უპირატესობები</h3>
        <span class="status__badge" :data-level="CurrentStatus || 'none'">
          {{ CurrentStatus || 'No Status' }}
        </span>
      </div>
      <p class="status__subtitle">
        გახსენით ექსპკლუზიური ფასდაკლებები კონკრეტულ პროდუქტებზე თქვენი სტატუსის დონის მიხედვით.
      </p>
    </header>

    <div class="status__card" role="region">
      <div class="status__bar" aria-hidden="true">
        <div class="status__progress" :style="{ width: progressPercentage + '%' }"></div>
      </div>

      <div class="status__meta">
        <div class="status__meta-item">
          <span class="status__meta-label">მიმდინარე სტატუსი</span>
          <span class="status__meta-value">{{ CurrentStatus || 'No Status' }}</span>
        </div>
        <div class="status__divider"></div>
        <div class="status__meta-item">
          <span class="status__meta-label">შემდეგი სტატუსი</span>
          <span class="status__meta-value">{{ NextStatus || 'None' }}</span>
        </div>
        <div class="status__divider"></div>
        <div class="status__meta-item">
          <span class="status__meta-label">პროგრესი</span>
          <span class="status__meta-value">{{ Math.min(Math.round(progressPercentage), 100) }}%</span>
        </div>
      </div>

      <dl class="status__details">
        <div class="status__detail">
          <dt>სულ დახარჯული</dt>
          <dd>{{ formatAmount(totalSpent) }}</dd>
        </div>
        <div class="status__detail">
          <dt>შემდეგი ბარიერი</dt>
          <dd>{{ nextToAchieve > 0 ? formatAmount(nextToAchieve) : '—' }}</dd>
        </div>
        <div class="status__detail">
          <dt>დარჩენილია</dt>
          <dd>
            <span :class="['status__pill', remainingAmount > 0 ? 'status__pill--pending' : 'status__pill--done']">
              {{ remainingAmount > 0 ? formatAmount(remainingAmount) : 'მიღწეულია' }}
            </span>
          </dd>
        </div>
        <div class="status__detail">
          <dt>დარჩენილი ლიმიტი</dt>
          <dd>
            <span :class="['status__pill', limit > 0 ? 'status__pill--pending' : 'status__pill--done']">
              {{ limit > 0 ? formatAmount(limit) : 'მიღწეულია' }}
            </span>
            <svg class="svg" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
              fill="currentcolor">
              <path
                d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
            </svg>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script>
import api from "@/api";

export default {
  name: "UserStatusComponent",
  data() {
    return {
      totalSpent: 0,
      progressPercentage: 0,
      CurrentStatus: null,
      NextStatus: null,
      nextToAchieve: 0,
      remainingAmount: 0,
      limit: 0,
      nf: new Intl.NumberFormat("ka-GE", { style: "currency", currency: "GEL", maximumFractionDigits: 2 }),
    };
  },
  methods: {
    formatAmount(v) {
      const n = Number(v);
      return Number.isFinite(n) ? this.nf.format(n) : "—";
    },
    updateProgress() {
      let pct = 0;
      if (this.nextToAchieve > 0) pct = (this.totalSpent / this.nextToAchieve) * 100;
      else pct = this.NextStatus ? 0 : 100;
      this.progressPercentage = Math.max(0, Math.min(pct, 100));
    },
    determineStatuses(statuses, totalSpent) {
      const sorted = [...(statuses || [])].sort((a, b) => parseFloat(a.toachieve) - parseFloat(b.toachieve));
      let current = null;
      for (const s of sorted) if (totalSpent >= parseFloat(s.toachieve)) current = s;
      const next = sorted.find((s) => parseFloat(s.toachieve) > totalSpent);
      return { current, next };
    },
    async getuserstatus() {
      try {
        const { data } = await api.get("/userstatuses", { tokenRequired: true });
        const { user, statuses, limit } = data;
        this.totalSpent = parseFloat(typeof user === "object" ? user.total_spent ?? 0 : user);
        const { current, next } = this.determineStatuses(statuses, this.totalSpent);
        this.limit = limit
        this.CurrentStatus = current ? current.name : "No Status";
        this.NextStatus = next ? next.name : null;
        this.nextToAchieve = next ? parseFloat(next.toachieve) : 0;
        this.remainingAmount = next ? Math.max(0, this.nextToAchieve - this.totalSpent) : 0;

        this.updateProgress();
      } catch (e) {
        console.error(e);
      }
    },
  },
  mounted() {
    this.getuserstatus();
  },
};
</script>

<style scoped>
.status {
  --accent: #7b3fb8;
  --accent-ink: #5d2f8b;

  --bg-card: #ffffff;
  --bg-surface: #f7f8fb;
  --text: #1f2937;
  --muted: #6b7280;
  --border: #e5e7eb;

  --success: #16a34a;
  --warning: #d97706;

  --radius-xl: 16px;
  --shadow-lg: 0 10px 24px rgba(31, 41, 55, 0.06);
}

.status {
  padding: 20px;
  color: var(--text);
}

.status__header {
  margin-bottom: 14px;
}

.status__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status__title {
  font-size: 1.125rem;
  font-weight: 800;
  margin: 0;
  color: var(--text);
}

.status__subtitle {
  margin: 6px 0 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--muted);
}

.status__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #fafafa;
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: capitalize;
}

.status__badge[data-level="No Status"],
.status__badge[data-level="none"] {
  color: var(--muted);
}

.status__card {
  margin-top: 16px;
  padding: 18px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.status__bar {
  position: relative;
  height: 12px;
  width: 100%;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  overflow: hidden;
}

.status__progress {
  height: 100%;
  width: 0%;
  background: var(--accent);
  transition: width 420ms cubic-bezier(.22, .85, .34, 1);
}

.status__meta {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  gap: 10px;
  align-items: center;
  margin-top: 14px;
}

.status__divider {
  width: 1px;
  height: 20px;
  background: var(--border);
}

.status__meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.status__meta-label {
  font-size: 0.72rem;
  color: var(--muted);
  letter-spacing: 0.2px;
}

.status__meta-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status__details {
  margin: 14px 0 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.status__detail dt {
  font-size: 0.72rem;
  color: var(--muted);
  margin-bottom: 4px;
}

.status__detail dd {
  display: flex;
  margin: 0;
  gap: 5px;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
}

.svg {
  cursor: pointer;
  color: #959393;
}
.svg:hover{
  color: #555;
}

.status__pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  border: 1px solid transparent;
}

.status__pill--pending {
  background: rgba(217, 119, 6, 0.08);
  border-color: rgba(217, 119, 6, 0.18);
  color: var(--warning);
}

.status__pill--done {
  background: rgba(22, 163, 74, 0.10);
  border-color: rgba(22, 163, 74, 0.22);
  color: var(--success);
}

@media (max-width: 520px) {
  .status {
    padding: 14px;
  }

  .status__meta {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .status__divider {
    display: none;
  }

  .status__details {
    grid-template-columns: 1fr;
  }

  .status__title {
    font-size: 1rem;
  }

  .status__subtitle {
    font-size: 0.8rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .status__progress {
    transition: none;
  }
}
</style>
