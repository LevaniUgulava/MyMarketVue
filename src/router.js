import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/views/MainlayoutView.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/HomeView.vue"),
      },
      {
        path: "cart",
        name: "Cart",
        component: () => import("@/views/CartView.vue"),
      },
      {
        path: "/profile",
        name: "Profile",
        component: () => import("@/views/ProfileView.vue"),
      },
      {
        path: "/product/:id",
        name: "single",
        component: () => import("@/views/SingleProductView.vue"),
        props: true,
      },
      {
        path: "/favorites",
        name: "favorite",
        component: () => import("@/views/FavoriteView.vue"),
      },
      {
        path: "/orders",
        name: "orders",
        component: () => import("@/views/OrderView.vue"),
      },
    ],
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
        path: "category",
        name: "Admincategory",
        component: () =>
          import("@/components/Admin/ManageCategoryComponent.vue"),
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
