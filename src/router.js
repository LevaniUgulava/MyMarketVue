import { createWebHistory, createRouter } from "vue-router";
const routes = [
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFoundView.vue"),
  },
  {
    path: "/",
    component: () => import("@/views/MainlayoutView.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/Products/MainHomeView.vue"),
        meta:{
          title:"Lemale - მთავარი გვერდი",
          description:"გვერდი სადაც შეიძენთ ქალისა და კაცის ტანსაცმელს,ფეხსაცმელს,სათვალეს,შარვალი,კაბა,ორეული"
        }
      },
      {
        path: "product",
        name: "allproduct",
        component: () => import("@/views/Products/ProductsView.vue"),
        meta:{title:"პროდუქტები"}

      },
      {
        path: "/docs",
        component: () => import("@/components/Footer/DocumentComponent.vue"), 
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
        meta: {
          needsauth: true,
        },
        
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
      {
        path: "collection",
        name: "collectionlist",
        component: () =>
          import("@/views/CollectionView.vue"),
      },
      {
        path: "exclusive",
        name: "ExclusivePage",
        component: () => import("@/components/Status/ExclusivePage.vue"),
      },
  
      {
        path: "checkout",
        name: "checkout",
        component: () => import("@/views/CheckoutView.vue"),
      },
  
    ],
  },
  {
    path: "/reset/password/:id",
    component: () => import("@/views/Password/PasswordComponent.vue"),
    props: (route) => ({
      id: route.params.id,
      token: route.query.token,
    }),
  },
  {
    path: "/forget/password",
    name: "Forgetpassword",
    component: () => import("@/views/Password/ForgetPassword.vue"),
  },

  {
    path: "/email-verify/:id",
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
        path:"mainrelation",
        component: () =>
          import("@/components/Admin/MainCategoryRelation.vue"),
      },
       {
        path:"categoryrelation",
        component: () =>
          import("@/components/Admin/CategoryRelation.vue"),
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
        path: "brands",
        component: () =>
          import("@/components/Admin/Brands/BrandsComponent.vue"),
      },
      {
        path: "brands/action",
        component: () =>
          import("@/components/Admin/Brands/BrandActionComponent.vue"),
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
        path: "banner",
        name: "banner",
        component: () => import("@/components/Admin/banner/BannerComponent.vue"),
      },
      {
        path: "/banner/create",
        name: "bannercreate",
        component: () => import("@/components/Admin/banner/BannerCreateComponent.vue"),
      },
      {
        path: "docs",
        name: "docs",
        component: () => import("@/components/Admin/Documents/DocumentComponent.vue"),
      },
      {
        path: "docs/create",
        name: "docscreate",
        component: () => import("@/components/Admin/Documents/CreateDocuments.vue"),
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

router.afterEach((to,from) => {
  document.title = to.meta.title || "ნაგულისხმევი სათაური";
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', to.meta.description || "ნაგულისხმევი აღწერა");
  } else {
    const newMetaDescription = document.createElement('meta');
    newMetaDescription.name = "description";
    newMetaDescription.content = to.meta.description || "ნაგულისხმევი აღწერა";
    document.head.appendChild(newMetaDescription);
  }
  if (from.path !== to.path) {
    window.scrollTo(0, 0);
  }
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const roles = localStorage.getItem("roles");

  if (to.meta.needsauth) {
    if (to.path.startsWith('/admin')) {
      if (isAuthenticated && roles !== "default") {
        next();
      } else {
        next(`/admin/login`);
      }
    }
    else if (to.path.startsWith('/')) {
      if (isAuthenticated) {
        next();
      } else {
        localStorage.setItem("loginmodal", true);
        
       next(`/`);   
    }
    }
  } else {
    next();
  }
});



export default router;
