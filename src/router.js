import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/:lang(en|ka)",
    component: () => import("@/views/MainlayoutView.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/Products/MainHomeView.vue"),
      },
      {
        path: "product",
        name: "allproduct",
        component: () => import("@/views/Products/ProductsView.vue"),
      },
      {
        path: "cart",
        name: "Cart",
        component: () => import("@/views/CartView.vue"),
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/ProfileView.vue"),
      },
      {
        path: "product/:id",
        name: "single",
        component: () => import("@/views/SingleProductView.vue"),
        props: true,
      },
      {
        path: "favorites",
        name: "favorite",
        component: () => import("@/views/FavoriteView.vue"),
      },
      {
        path: "orders",
        name: "ordersuser",
        component: () => import("@/views/OrderView.vue"),
      },
      {
        path: "collection/:id",
        name: "productsinglecollection",
        component: () => import("@/components/CollectionsingleComponent.vue"),
        props: true,
      },
    ],
  },
  {
    path: "/:lang(en|ka)/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/:lang(en|ka)/register",
    name: "Register",
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    path: "/email/verification",
    component: () =>
      import("@/components/Verify/VerificationMessageComponent.vue"),
  },
  {
    path: "/:lang(en|ka)/email-verify/:id",
    component: () => import("@/components/Verify/VerificationComponent.vue"),
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("@/components/Admin/SideBar.vue"),
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
        path: "collection",
        name: "collection",
        component: () =>
          import("@/components/Admin/Collection/CollectionComponent.vue"),
      },
      {
        path: "collection/create",
        name: "collectioncreate",
        component: () =>
          import("@/components/Admin/Collection/CollectionCreateComponent.vue"),
      },
      {
        path: "collection/display/:id",
        name: "singlecollection",
        component: () =>
          import("@/components/Admin/Collection/CollectionsingleComponent.vue"),
        props: true,
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
      {
        path: "orders",
        name: "orders",
        component: () => import("@/components/Admin/orders/OrderView.vue"),
      },
      {
        path: "orders/:id",
        name: "SingleOrder",
        component: () => import("@/components/Admin/orders/SingleView.vue"),
        props: true,
      },
      {
        path: "logs",
        name: "logs",
        component: () => import("@/views/Admin/LoggerView.vue"),
      },

      {
        path: "statuses",
        name: "status",
        component: () => import("@/views/Status/StatusView.vue"),
        children: [
          {
            path: "",
            name: "statuses",
            component: () =>
              import("@/components/Status/StatusesComponent.vue"),
          },
          {
            path: ":id(\\d+)",
            name: "singlestatus",
            component: () =>
              import("@/components/Status/SingleStatusComponent.vue"),
            props: true,
          },
          {
            path: "eligible/:id(\\d+)",
            name: "singleeligiblestatus",
            component: () =>
              import("@/components/Status/EligibleproductComponent.vue"),
            props: true,
          },
          {
            path: "seteligible/:id(\\d+)",
            name: "productseligible",
            component: () =>
              import("@/components/Status/StatusProductsComponent.vue"),
            props: true,
          },
        ],
      },
    ],
  },
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: () => import("@/views/Admin/AdminLoginView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const roles = localStorage.getItem("roles");

  if (to.path.startsWith("/admin")) {
    if (to.meta.needsauth) {
      if (isAuthenticated && roles !== "default") {
        next();
      } else {
        next(`/admin/login`);
      }
    } else {
      next();
    }
  } else {
    if (!to.params.lang) {
      next({ path: "/ka" });
    } else {
      next();
    }
  }
});

export default router;
