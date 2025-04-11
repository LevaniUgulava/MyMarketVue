<template>
  <div class="roles-container">
    <div class="role-section">
      <h2 dragover.prevent @drop="drop(1)">Admins</h2>
      <table v-if="admins.length > 0">
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
        <tr v-for="item in admins" :key="item.id" draggable="true" @dragstart="dragStart(item.id)" @dragover.prevent
          @drop="drop(item.pivot.role_id)">
          <td>{{ item.name }}</td>
          <td>{{ item.email }}</td>
        </tr>

      </table>
    </div>

    <div class="role-section">
      <h2 @dragover.prevent @drop="drop(2)">Operators</h2>
      <table v-if="operators.length > 0">
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
        <tr v-for="item in operators" :key="item.id" draggable="true" @dragstart="dragStart(item.id)" @dragover.prevent
          @drop="drop(item.pivot.role_id)">
          <td>{{ item.name }}</td>
          <td>{{ item.email }}</td>
        </tr>

      </table>
    </div>

    <div class="role-section">
      <h2 @dragover.prevent @drop="drop(3)">Editors</h2>
      <table v-if="editors.length > 0">
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
        <tr v-for="item in editors" :key="item.id" draggable="true" @dragstart="dragStart(item.id)" @dragover.prevent
          @drop="drop(item.pivot.role_id)">
          <td>{{ item.name }}</td>
          <td>{{ item.email }}</td>
        </tr>

      </table>
    </div>

    <div class="role-section">
      <h2 @dragover.prevent @drop="drop(4)">Defaults</h2>


      <table v-if="defaultRoles.length > 0">
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
        <tr v-for="item in defaultRoles" :key="item.id" draggable="true" @dragstart="dragStart(item.id)"
          @dragover.prevent @drop="drop(item.pivot.role_id)">
          <td>{{ item.name }}</td>
          <td>{{ item.email }}</td>
        </tr>

      </table>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  name: 'RolesComponent',

  data() {
    return {
      admins: [],
      operators: [],
      editors: [],
      defaultRoles: {},
    }
  },

  methods: {

    dragStart(index) {
      this.draggedIndex = index;
    },
    async drop(targetIndex) {
      try {
        if (this.draggedIndex !== null && this.draggedIndex !== undefined) {
          console.log('Dropped on item with index:', targetIndex);

          await api.post(`admin/roles/change/user/${this.draggedIndex}/role/${targetIndex}`, {}, {
            tokenRequired: true

          });

          this.draggedIndex = null;
        } else {
          console.error('No item was dragged.');
        }
      } catch (error) {
        console.error('Error making API call:', error);
      }
      this.getroles();
    },

    async getroles() {


      try {
        const response = await api.get('admin/roles/', {
          tokenRequired: true

        });


        this.admins = response.data.admin;
        this.operators = response.data.operator;
        this.editors = response.data.editor;
        this.defaultRoles = response.data.default;

      } catch (error) {
        console.log(error)
      }
    }
  },

  mounted() {
    this.getroles();
  }
}
</script>

<style scoped>
.roles-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.role-section {
  flex: 1 1 200px;
  margin: 10px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.role-section input {}

.role-section h2 {
  margin-top: 0;
  color: #333;
  font-size: 1.5em;
  border-bottom: 2px solid #4caf50;
  padding-bottom: 10px;
}


.role-item {
  margin: 5px 0;
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 3px;
  color: #555;
  font-size: 1em;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
