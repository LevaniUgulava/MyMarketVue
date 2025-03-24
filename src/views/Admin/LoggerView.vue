<template>
  <div class="logger-container">
    <h1 class="title">Site Logger</h1>

    <div class="controls">
      <div class="actionbtn">
        <button @click="updateUrl('created')" class="action-button">Created</button>
        <button @click="updateUrl('updated')" class="action-button">Updated</button>
        <button @click="updateUrl('deleted')" class="action-button">Deleted</button>
      </div>
      <div class="search-container">
        <input type="text" v-model="email" placeholder="Search by Email..." class="search-input">
        <button @click="updateUrl()" class="search-button">Search</button>
      </div>
    </div>

    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Model</th>
            <th>Product</th>
            <th>Role</th>
            <th>Current Role</th>
            <th>Created</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td>{{ item.user_email }}</td>
            <td>{{ item.action }}</td>
            <td>{{ item.model }}</td>
            <td>{{ item.product ? item.product.name : 'N/A' }}</td>
            <td>{{ item.role }}</td>
            <td>{{ item.current_role }}</td>
            <td>{{ item.created_at }}</td>
            <td>{{ item.updated_at }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from '@/api';


export default {
  name: "LoggerView",
  data() {
    return {
      data: [],
      email: '',
      selectedAction: ''
    };
  },
  methods: {
    updateUrl(action = null) {
      if (action) {
        this.selectedAction = action;
      }

      const currentQuery = { ...this.$route.query };
      this.$router.push({
        path: '/admin/logs',
        query: {
          ...currentQuery,
          action: this.selectedAction || undefined,
          email: this.email || undefined
        }
      }).then(() => {
        this.Logs();
      });
    },
    async Logs() {
      try {
        const response = await api.get('logs', {
          tokenRequired: true,
          params: this.$route.query
        });
        this.data = response.data;
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    }
  },
  mounted() {
    this.Logs();
  }
};
</script>

<style scoped>
/* Centered and compact container */
.logger-container {
  max-width: 100%;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 8px;
}

/* Title styling */
.title {
  text-align: center;
  color: #444;
  margin-bottom: 20px;
  font-size: 1.6rem;
}

/* Controls styling */
.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.actionbtn {
  display: flex;
  gap: 10px;
}

.action-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #0056b3;
}

/* Search container styling */
.search-container {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  max-width: 500px;
}

.search-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.search-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #218838;
}

/* Table styling */
.table-container {
  overflow-x: auto;
  width: 100%;
  margin-top: 20px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background-color: #f8f9fa;
}

.table th,
.table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
  /* Prevent columns from breaking */
}

.table th {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table tr:hover {
  background-color: #e9ecef;
}
</style>
