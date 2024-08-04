import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    path: "/profile/update",
    name: "ProfileUpdate",
    component: () => import("@/views/ProfileUpdView.vue"),
  },
  {
    path: "/cart",
    name: "cart",
    component: () => import("@/views/CartView.vue"),
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("@/views/AdminView.vue"),
    meta: {
      needsauth: true,
    },
    children: [
      {
        path: "dashboard",
        name: "Admindashboard",
        component: () => import("@/components/Admin/DashboardComponent.vue"),
      },
      {
        path: "create",
        name: "Admincreate",
        component: () =>
          import("@/components/Admin/CreateProductComponent.vue"),
      },
      {
        path: "maincategory",
        name: "Adminmaincategory",
        component: () =>
          import(
            "@/components/Admin/maincategory/AddMainCategoryComponent.vue"
          ),
      },
      {
        path: "category",
        name: "Admincategory",
        component: () =>
          import("@/components/Admin/category/AddCategoryComponent.vue"),
      },
      {
        path: "subcategory",
        name: "Adminsubcategory",
        component: () =>
          import("@/components/Admin/subcategory/AddSubCategoryComponent.vue"),
      },
      {
        path: "roles",
        name: "roles",
        component: () => import("@/components/Admin/roles/RolesComponent.vue"),
      },
      {
        path: "actions",
        name: "actions",
        component: () =>
          import("@/components/Admin/ActiveProductComponent.vue"),
      },
      {
        path: "discount",
        name: "discount",
        component: () =>
          import("@/components/Admin/DiscountManageComponent.vue"),
      },
    ],
  },
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: () => import("@/views/AdminLoginView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const roles = localStorage.getItem("roles");

  console.log("isAuthenticated:", isAuthenticated);
  console.log("roles:", roles);

  if (to.meta.needsauth) {
    if (isAuthenticated && roles !== "default") {
      next();
    } else {
      next("/admin/login");
    }
  } else {
    next();
  }
});

export default router;
