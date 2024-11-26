<template lang="">
  <div class="status-container">
    <div class="status-card">
      <div class="status-header">
        <h2>{{ data.name }} Status</h2>
        <span class="badge">ID: {{ data.id }}</span>
      </div>
      <div class="status-body">
        <p><strong>To Achieve:</strong> ${{ data.toachieve }}</p>
        <p><strong>Discount:</strong> {{ data.discount }}%</p>
        <p><strong>Created At:</strong> {{ data.created_at || "N/A" }}</p>
        <p><strong>Updated At:</strong> {{ data.updated_at || "N/A" }}</p>
      </div>
    </div>

    <!-- Users List -->
    <div v-if="data.users && data.users.length" class="users-list">
      <h3>Users with {{ data.name }} Status</h3>
      <div class="users-grid">
        <div v-for="(user, index) in data.users" :key="user.id" class="user-card">
          <h4>{{ index + 1 }}. {{ user.name }}</h4>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Total Spent:</strong> ${{ user.total_spent }}</p>
        </div>
      </div>
    </div>

    <div v-else class="no-users">
      <p>No users found for this status.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "SingleStatusComponent",
  props: ["id"],
  data() {
    return {
      data: {}, 
    };
  },
  methods: {
    async display() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`admin/userstatus/${this.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.data = response.data.status;
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    },
  },
  mounted() {
    this.display(); 
  },
};
</script>

<style scoped>
/* General Styles */
.status-container {
  font-family: 'Roboto', sans-serif;
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  background-color: #f4f4f9;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Status Card */
.status-card {
  background: linear-gradient(135deg, #e0f7fa, #80deea);
  color: #004d40;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-header h2 {
  font-size: 24px;
  font-weight: bold;
}

.badge {
  background: white;
  color: #4caf50;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
}

.status-body p {
  font-size: 16px;
  margin: 5px 0;
}

/* Users List */
.users-list h3 {
  margin-bottom: 15px;
  font-size: 22px;
  color: #333;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

/* User Card */
.user-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.user-card h4 {
  font-size: 18px;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 10px;
}

.user-card p {
  font-size: 14px;
  margin: 5px 0;
  color: #555;
}

/* No Users Found */
.no-users {
  text-align: center;
  color: #777;
  font-style: italic;
  margin-top: 20px;
}
</style>
