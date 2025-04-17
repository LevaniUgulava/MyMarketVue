<template>

  <head>
    <!-- Other head content -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
  </head>

  <div class="container">
    <div class="sidebar">
      <ul>
        <li><a href="/admin/dashboard"><i class="fas fa-tachometer-alt"></i> მთავარი</a></li>
        <li><a href="/admin/orders"><i class="fas fa-box"></i> შეკვეთები</a></li>
        <li>
          <button @click="toggleDropproduct" class="dropdown">
            <i class="fas fa-boxes"></i>პროდუქტების მართვა
          </button>
          <ul v-if="isOpenproduct" class="dropdown-menu">
            <li v-for="item in itemsproduct" :key="item" @click="selectItemproduct(item)">
              {{ item }}
            </li>
          </ul>
        </li>
        <li><a href="/admin/statuses"><i class="fas fa-user-check"></i>სტატუსების მართვა</a></li>
        <li><a href="/admin/collection"><i class="fas fa-layer-group"></i>კოლექციები და ბრენდები</a></li>
        <li><a href="/admin/banner"><i class="fa-solid fa-flag"></i>ბანერები</a></li>
        <li><a href="/admin/category"><i class="fas fa-tags"></i>კატეგორიების მართვა</a></li>

        <li v-if="isadmin"><a href="/admin/roles"><i class="fas fa-user-cog"></i>როლების მართვა</a></li>
        <!-- <li><a href="/admin/logs"><i class="fas fa-clipboard-list"></i>ჩანაწერები</a></li> -->
        <li><a href="/admin/docs"><i class="fa-solid fa-file"></i>დოკუმენტები</a></li>
        <li><a href="#other"><i class="fas fa-ellipsis-h"></i>სხვა</a></li>
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
      itemsproduct: ["დამატება", "ფასდაკლებები", "მოქმედებები"],
      isadmin: localStorage.getItem("roles") === "admin"
    };
  },
  methods: {
    toggleDropproduct() {
      this.isOpenproduct = !this.isOpenproduct;
    },
    selectItemproduct(item) {
      if (item === "დამატება") {
        this.$router.push("/admin/create");
      } else if (item === "მოქმედებები") {
        this.$router.push("/admin/actions");
      } else if (item === "ფასდაკლებები") {
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
  padding: 10px;
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
  font-size: 1rem;
  overflow-y: auto;
}

.sidebar ul {
  list-style-type: none;
  font-size: 12px;
  padding: 0;
}

.sidebar ul li {
  margin: 10px 0;
}

.sidebar ul li a,
.sidebar ul li button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  color: inherit;
  text-decoration: none;
  font-size: 13px;
  background: none;
  border: none;
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
  justify-content: center;
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
