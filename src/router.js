import { createWebHistory, createRouter } from "vue-router";
import store from "./store";
import { useHead } from "@vueuse/head";

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
        path:"docs/service-terms",
        component:()=>import("@/components/Footer/ServiceTermsComponent.vue")
      },
      {
        path:"docs/privacy-policy",
        component:()=>import("@/components/Footer/ServiceTermsComponent.vue")
      },
      {
        path: "",
        name: "Home",
        component: () => import("@/views/Products/MainHomeView.vue"),
        meta:{
          title:"name - ტანსაცმელი, ფეხსაცმელი და აქსესუარები | ონლაინ მაღაზია | ბრენდები",
          description:"შეიძინეთ ქალისა და კაცის ტანსაცმელი, ფეხსაცმელი, აქსესუარები და ფეშენული ბრენდები საუკეთესო ფასად ჩვენს ონლაინ მაღაზიაში. გადახედეთ კოლექციას და გააკეთეთ არჩევანი!",
          ogtitle: "ტანსაცმელი, ფეხსაცმელი და აქსესუარები | ონლაინ მაღაზია | ბრენდები",
          ogdescription:"შეიძინეთ ქალისა და კაცის ტანსაცმელი, ფეხსაცმელი, აქსესუარები და ფეშენული ბრენდები საუკეთესო ფასად ჩვენს ონლაინ მაღაზიაში. ეწვიეთ ჩვენს მთავარ გვერდს და მოძებნეთ საუკეთესო პროდუქტები!"
        }
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
        meta:{
          title:"ჩემი კალათა - name"
        }
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/ProfileView.vue"),
        meta: {
          needsauth: true,
          title:"პირადი კაბინეტი - პირადი ინფორმაცია"
        },
        children:[
          {
          path: "info",
          name:"profile-info",
          component: () => import("@/components/profile/Components/PersonalInfo.vue")
          },
          {
        path: "orders",
        name: "ordersuser",
        component: () => import("@/views/OrderView.vue"),
         },
          {
          path: "address",
          name:"address-info",
          component: () => import("@/components/profile/Components/AddressComponent.vue"),
          meta:{
            title:"პირადი კაბინეტი - მისამართები"

          }
          },
          {
          path: "status",
          name:"status-info",
          component: () => import("@/components/UserStatusComponent.vue"),
           meta:{
            title:"პირადი კაბინეტი - სტატუსი"
          }
          
          },
          {
          path: "verification",
          name:"verification",
          component: () => import("@/components/profile/Components/VerificationComponent.vue")
          },
          {
          path: "reset",
          name:"reset",
          component: () => import("@/components/profile/Components/ResetpasswordComponent.vue"),
          meta:{
            title:"პირადი კაბინეტი - პაროლის შეცვლა"

          }
          },
          
          {
          path: "delete",
          name:"deleteacc",
          component: () => import("@/components/DeactivateComponent.vue")
          }
          
        ]
        
      },
      {
        path: "product/:maincategory/:category/:subcategory/:slug/:id",
        name: "single",
        component: () => import("@/views/SingleProductView.vue"),
        props: true,
      },
      {
        path: "favorites",
        name: "favorite",
        component: () => import("@/views/FavoriteView.vue"),
            meta:{
            title:"სურვილების სია - name"

          }
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
        meta:{
          title:"ექსკლუზიური პროდუქტების ჩამონათვალი",
          description: "ექსკლუზიური პროდუქტები, მომხმარებელზე მორგებული შეთავაზებები, ფასდაკლებები ტანსაცმელზე, ფეხსაცმელზე და აქსესუარებზე",
        }
      },
  
      {
        path: "checkout",
        name: "checkout",
        component: () => import("@/views/CheckoutView.vue"),
         meta: {
           needsauth: true,
         },
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
        path: "ai",
        name: "ai",
        component: () => import("@/components/Admin/ai/AiComponent.vue"),
      },  
      {
        path: "mail",
        name: "mail",
        component: () => import("@/components/Admin/Mail/MailComponent.vue"),
      },  
        {
        path: "mail/:id",
        name: "singlemail",
        component: () => import("@/components/Admin/Mail/SingleMailComponent.vue"),
        props:true
      },  
      {
        path: "chat",
        name: "Adminchat",
        component: () => import("@/components/Admin/AdminchatComponent.vue"),
      },    
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
    {
    path: "/camera",
    component: () => import("@/components/AudioSim.vue")
  },

  {
    path: "/chat",
    component: () => import("@/components/ChatModal.vue")
  },
  {
    path: "/tryon",
    component: () => import("@/components/Admin/ai/tryonComponent.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to,from) => {
  if (from.path !== to.path) {
    window.scrollTo(0, 0);
  }
    useHead({
    title: to.meta.title,
    meta: [
      { name: "description", content: to.meta.description },
      { name: "robots", content: "index, follow" },
      { name: "og:title'", content: to.meta.ogtitle },
      { property: 'og:description', content: to.meta.ogdescription || 'Default description for SEO purposes.' },
      { property: 'og:image', content: 'URL_TO_DEFAULT_IMAGE' },
      { property: 'og:url', content: window.location.href },

    ]
  });
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const roles = localStorage.getItem("roles");

  if (to.meta.needsauth) {
    if (to.path.startsWith('/admin')) {
      if (isAuthenticated && (roles !== "default" && roles !== null)) {
        next();
      } else {
        next(`/admin/login`);
      }
    }
    else if (to.path.startsWith('/')) {
      if (isAuthenticated) {
        next();
      } else {
        store.commit('modals/openmodal', 'loginmodal', { root: true });
       next(`/`);   
    }
    }
  } else {
    next();
  }
});



export default router;
