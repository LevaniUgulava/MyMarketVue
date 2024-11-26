<template>
  <head>
    <!-- Other head content -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
    />
  </head>

  <div class="container">
    <div class="sidebar">
      <h1>Admin Panel</h1>
      <ul>
        <li><a href="/admin/dashboard"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
        <li><a href="/admin/orders"><i class="fas fa-box"></i> Orders</a></li>

        <li>
          <button @click="toggleDropproduct" class="dropdown">
            <i class="fas fa-boxes"></i> Manage Product <i class="fa-solid fa-caret-down"></i>
          </button>
          <ul v-if="isOpenproduct" class="dropdown-menu">
            <li v-for="item in itemsproduct" :key="item" @click="selectItemproduct(item)">
              {{ item }}
            </li>
          </ul>
        </li>
        <li><a href="/admin/statuses"><i class="fas fa-user-check"></i>Status and Eligible</a></li>
        <li><a href="/admin/collection"><i class="fas fa-layer-group"></i> Collection</a></li>
        <li><a href="/admin/category"><i class="fas fa-tags"></i> Manage Categories</a></li>

        <li v-if="isadmin"><a href="/admin/roles"><i class="fas fa-user-cog"></i> Manage Roles</a></li>
        <li><a href="/admin/logs"><i class="fas fa-clipboard-list"></i> Site Log</a></li>
        <li><a href="#other"><i class="fas fa-ellipsis-h"></i> Other</a></li>
      </ul>
    </div>

    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpencategory: false,
      isOpenproduct: false,
      itemsproduct: ["Create", "Discount", "Actions"],
      isadmin: localStorage.getItem("roles") === "admin"
    };
  },
  methods: {
    toggleDropproduct() {
      this.isOpenproduct = !this.isOpenproduct;
    },
    selectItemproduct(item) {
      if (item === "Create") {
        this.$router.push("/admin/create");
      } else if (item === "Actions") {
        this.$router.push("/admin/actions");
      } else if (item === "Discount") {
        this.$router.push("/admin/discount");
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  height: 100vh;
  overflow-y: auto;
}

.sidebar h1 {
  font-size: 1.8em;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar ul li {
  margin: 10px 0;
}

.sidebar ul li a,
.sidebar ul li button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  color: inherit;
  text-decoration: none;
  background: none;
  border: none;
  font: inherit;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.sidebar ul li a:hover,
.sidebar ul li button:hover {
  background-color: #34495e;
}

.dropdown {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown i:last-child {
  margin-left: auto;
}

.dropdown-menu {
  margin-top: 8px;
  background-color: #34495e;
  border-radius: 5px;
  list-style-type: none;
  padding: 0;
}

.dropdown-menu li {
  padding: 10px 15px;
  cursor: pointer;
  color: #ecf0f1;
  transition: background-color 0.3s ease;
}

.dropdown-menu li:hover {
  background-color: #3b5360;
}

.content {
  flex: 1;
  margin-left: 270px;
  padding: 20px;
  overflow-y: auto;
}

</style>
