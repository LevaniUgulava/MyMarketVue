<template lang="">
  <div class="status-component">
    <h1>User Statuses</h1>
    <table class="status-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Status Name</th>
          <th>Start</th>
          <th>End</th>
          <th>Toachieve</th>
          <th>Action</th>

        </tr>
      </thead>
      <tbody>
        <tr v-for="(status) in statuses" :key="status.id">
          <td>{{ status.id }}</td>
          <td>{{ status.name }}</td>
          <td>{{ status.start_data }}</td>
          <td>{{ status.end_date }}</td>

          <td>{{ status.toachieve }}</td>
    <td>
  <p class="button delete" @click="deletestatus(status.id)">
    <i class="fa-solid fa-trash"></i> Delete
  </p>
    <p class="button view" @click="viewstatus(status.id)">
    <i class="fa-solid fa-eye"></i> View
  </p>
 <p class="button eligible" @click="vieweligible(status.id)">
  <i class="fa-solid fa-award"></i>Eligible
</p>


</td>

        </tr>
      </tbody>
    </table>
<button class="showbutton" @click="showform = !showform">
  <i class="fa-solid fa-caret-down"></i> Click to Create
</button>

<div v-if="showform" class="form-container">
  <h3>Create Status</h3>
  <form @submit.prevent="create">
    <label for="statusName">Name:</label>
    <input
      type="text"
      id="statusName"
      v-model="data.name"
      placeholder="Enter status name"
      required
    />

    <label for="toAchieve">To Achieve:</label>
    <input
      type="number"
      id="toAchieve"
      v-model="data.toAchieve"
      placeholder="Enter the target to achieve"
      required
    />
      <label for="start_date">Start_date:</label>
    <input
      type="datetime-local"
      id="start_data"
      v-model="data.start_data"
      placeholder="Enter the Start Date"
    />
        <label for="end_date">End_date:</label>
    <input
      type="datetime-local"
      id="end_date"
      v-model="data.end_date"
      placeholder="Enter the End Date"
    />
    <div class="form-actions">
      <button type="submit" class="submit-button">Create</button>
      <button type="button" class="cancel-button" @click="cancel">
        Cancel
      </button>
    </div>
  </form>
</div>

  </div>
</template>
<script>
import api from '@/api';
export default {
  name: 'StatusComponent',
  data() {
    return {
      statuses: [],
      showform: false,
      data: {
        name: "",
        toAchieve: "",
        start_data: "",
        end_date: ""
      },

    }
  },
  methods: {
    cancel() {
      this.data.name = ''
      this.data.toAchieve = ''
    },
    viewstatus(id) {
      this.$router.push({ name: "singlestatus", params: { id } });
    },

    async display() {
      try {
        const response = await api.get('admin/userstatus/display', {
          tokenRequired: true

        });
        this.statuses = response.data.statuses

      } catch (error) {
        console.log(error)
      }
    },
    async create() {

      try {
        const response = await api.post('admin/userstatus/create', {
          name: this.data.name,
          toachieve: this.data.toAchieve,
          start_data: this.data.start_data,
          end_date: this.data.end_date,
        }, {
          tokenRequired: true

        });
        this.data.name = '',
          this.data.toAchieve = '',
          this.data.start_data = '',
          this.data.end_date_date = ''


        this.display();
        console.log(response);

      } catch (error) {
        console.log(error);
      }
    },
    async deletestatus(id) {
      try {
        const response = await api.post(`admin/userstatus/delete/${id}`, {}, {
          tokenRequired: true

        });

        this.display();
        console.log(response);

      } catch (error) {
        console.log(error);
      }
    },
    vieweligible(id) {
      this.$router.push({ name: "singleeligiblestatus", params: { id } });
    }





  },

  mounted() {
    this.display();
  },


}
</script>
<style scoped>
.status-component {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.status-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
  background: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.status-table th,
.status-table td {
  border: 1px solid #ddd;
  padding: 10px;
  width: 10%;
  text-align: left;
}

.status-table th {
  background-color: #007bff;
  color: white;
}

.status-table tbody tr:hover {
  background-color: #f1f1f1;
}

.showbutton {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2%;
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: Thin;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.showbutton i {
  margin-right: 10px;
}

.showbutton:hover {
  background-color: #c5cacf;
}

.form-container {
  margin: 20px auto;
  margin-top: 2%;
  padding: 20px;
  max-width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h3 {
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
  color: #333;
}

form label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.submit-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #c82333;
}

td .button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

td .delete {
  background-color: rgb(246, 75, 75);
}

td .delete:hover {
  background-color: rgb(200, 50, 50);
  transform: scale(1.05);
}

td .view {
  background-color: rgb(75, 146, 246);
}

td .view:hover {
  background-color: rgb(50, 100, 200);
  transform: scale(1.05);
}

td .eligible {
  background-color: #28a745;
  /* Green for eligibility */
  color: white;
}

td .eligible:hover {
  background-color: #218838;
  /* Darker green on hover */
  transform: scale(1.05);
  /* Slight zoom effect */
  transition: background-color 0.3s ease, transform 0.2s ease;
  /* Smooth hover effect */
}

td .button i {
  margin-left: 5px;
  /* Add spacing between the icon and text */
}

td .button i {
  margin-left: 5px;
  margin-right: 5px;
}
</style>