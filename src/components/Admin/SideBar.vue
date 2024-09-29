<template>
<head>
    <!-- Other head content -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>

  <div class="container">
    <div class="sidebar">
      <h1>Admin Panel</h1>
      <ul>
        <li><a href="dashboard">Dashboard</a></li>
        <li>
          <button @click="toggleDropproduct" class="dropdown">
            Manage Product <i class="fa-solid fa-caret-down"></i>
          </button>
        <ul v-if="isOpenproduct" class="dropdown-menu">
            <li v-for="item in itemsproduct" :key="item" @click="selectItemproduct(item)">{{item}} </li>
          </ul>
         </li>

        <li><a href="category">Manage Categories</a></li>

        <li><a href="roles" v-if="isadmin">Manage roles</a></li>
        <li><a href="#other">Other</a></li>
      </ul>
    </div>
  
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpencategory: false,
      isOpenproduct:false,
      itemsproduct:["Create","Discount","Actions"],
      isadmin : localStorage.getItem('roles') == 'admin' ? true : false

    };
  },
  methods: {
    toggleDropdowncategory() {
      this.isOpencategory = !this.isOpencategory;
    },

 

    toggleDropproduct(){
      this.isOpenproduct=!this.isOpenproduct
    },
    selectItemproduct(item){
      if(item==="Create"){
        this.$router.push('/admin/create')
      }
       else if(item === "Actions"){
        this.$router.push("/admin/actions");
      } else if(item === "Discount"){
        this.$router.push("/admin/discount");
      }

    }
  },

};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar h1 {
  font-size: 1.5em;
  margin-bottom: 20px;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar ul li {
  margin: 20px 0;
}

.sidebar ul li a,
.sidebar ul li button {
  text-decoration: none;
  color: white;
  display: block;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.sidebar ul li a:hover,
.sidebar ul li button:hover,
.sidebar ul li a:focus,
.sidebar ul li button:focus {
  background-color: #34495e;
}

.dropdown {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  margin: 0;
  font: inherit;
}

.dropdown-menu {
  list-style-type: none;
  padding: 0;
  margin: 10px 0 0 20px;
  background-color: #34495e;
  border-radius: 5px;
}

.dropdown-menu li {
  padding: 10px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #3b5360;
}

.content {
  flex: 1;
  padding: 20px;
}

.content div {
  margin: 20px 0;
}
</style>

