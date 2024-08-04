<template>
    <div class="roles-container">
        <div class="role-section">
            <h2>Admins</h2>
          <table v-if="Object.keys(admins).length > 0">
           <tr>
             <th>Name</th>
             <th>Email</th>
           </tr>
           <tr v-for="(name , email) in admins" :key="email" >
             <td>{{ name }}</td>
             <td>{{ email }}</td>
          </tr>
 
         </table>              </div>

        <div class="role-section">
            <h2>Operators</h2>
        <table v-if="Object.keys(operators).length > 0">
           <tr>
             <th>Name</th>
             <th>Email</th>
           </tr>
           <tr v-for="(name , email) in operators" :key="email" >
             <td>{{ name }}</td>
             <td>{{ email }}</td>
          </tr>
 
         </table>      
           </div>

        <div class="role-section">
            <h2>Editors</h2>
               <table v-if="Object.keys(editors).length > 0">
           <tr>
             <th>Name</th>
             <th>Email</th>
           </tr>
           <tr v-for="(name , email) in editors" :key="email" >
             <td>{{ name }}</td>
             <td>{{ email }}</td>
          </tr>
 
         </table>
        </div>

        <div class="role-section">
            <h2>Defaults</h2>
            <table v-if="Object.keys(defaultRoles).length > 0">
           <tr>
             <th>Name</th>
             <th>Email</th>
           </tr>
           <tr v-for="(name , email) in defaultRoles" :key="email" >
             <td>{{ name }}</td>
             <td>{{ email }}</td>
          </tr>
 
         </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

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
        async getroles() {
            const token = localStorage.getItem('token');

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/roles/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
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

<style lang="css">
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

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
