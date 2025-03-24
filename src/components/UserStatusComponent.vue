<template>
  <div>
    <h3 class="status-title">სტატუსის უპირატესობები</h3>
    <p class="status-description">
      გახსენით ექსკლუზიური ფასდაკლებები კონკრეტულ პროდუქტებზე თქვენი სტატუსის დონის მიხედვით.</p>
    <div class="status-bar">
      <div class="progress" :style="{ width: `${progressPercentage}%` }"></div>
    </div>
    <div class="status-info">
      <span class="status-label">მიმდინარე სტატუსი: {{ CurrentStatus }}</span>
      <span class="status-label">შემდეგი სტატუსი: {{ NextStatus || 'None' }}</span>
    </div>
    <div class="status-details">
      <p>სულ დახარჯული: {{ totalSpent }}</p>
      <p>შემდეგი სტატუსის მისაღწევად: {{ nextToAchieve }}</p>
      <p>
        შემდეგი სტატუსის მისაღწევად დარჩენილია:
        {{ remainingAmount > 0 ? remainingAmount : 'Achieved' }}
      </p>
    </div>
  </div>
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
    };
  },
  methods: {
    updateProgress() {
      this.progressPercentage = Math.min(
        (this.totalSpent / this.nextToAchieve) * 100,
        100
      );
    },
    determineStatuses(statuses, totalSpent) {
      // Sort statuses by `toachieve` in ascending order
      const sortedStatuses = statuses.sort(
        (a, b) => parseFloat(a.toachieve) - parseFloat(b.toachieve)
      );

      // Determine the current status
      let currentStatus = null;
      for (const status of sortedStatuses) {
        if (totalSpent >= parseFloat(status.toachieve)) {
          currentStatus = status;
        }
      }

      // Determine the next status
      const nextStatus = sortedStatuses.find(
        (status) => parseFloat(status.toachieve) > totalSpent
      );

      return {
        current: currentStatus,
        next: nextStatus,
      };
    },
    async getuserstatus() {
      try {
        const response = await api.get("/userstatuses", {
          tokenRequired: true
        });

        const { user, statuses } = response.data;

        this.totalSpent = parseFloat(user);

        const { current, next } = this.determineStatuses(statuses, this.totalSpent);

        this.CurrentStatus = current ? current.name : "No Status";
        this.NextStatus = next ? next.name : null;
        this.nextToAchieve = next ? parseFloat(next.toachieve) : 0;

        this.remainingAmount = next
          ? Math.max(0, this.nextToAchieve - this.totalSpent)
          : 0;

        this.updateProgress();
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.getuserstatus();
  },
};
</script>

<style scoped>
.status-title {
  font-size: 20px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 10px;
}

.status-description {
  font-size: 14px;
  color: #777777;
  margin-bottom: 20px;
  line-height: 1.5;
}

.status-bar {
  position: relative;
  width: 100%;
  height: 10px;
  background-color: #e6e6e6;
  border-radius: 15px;
  overflow: hidden;
  margin: 20px 0;
}

.progress {
  height: 100%;
  background: linear-gradient(135deg, #731decac, #b794e9);
  border-radius: 15px;
  transition: width 0.4s ease;
}

.status-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #555555;
}

.status-label {
  font-weight: 600;
}

.status-details {
  font-size: 14px;
  color: #555555;
  margin-top: 10px;
}

.status-details p {
  margin: 5px 0;
}

@media (min-width: 375px) and (max-width: 430px) {
  .status-title {
    font-size: 0.8rem;
  }

  .status-description {
    font-size: 0.6rem;
  }

  .status-label {
    font-size: 0.5rem;
  }

  .status-bar {
    height: 10px;
  }

  .status-details p {
    font-size: 0.5rem;
  }
}
</style>
