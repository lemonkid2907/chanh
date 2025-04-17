import { createRouter, createWebHistory } from "vue-router";
import Index from "@/views/Index.vue";
import Login from "@/views/Login.vue";
import Detail from "@/views/Detail.vue";
import Register from "@/views/Register.vue";
import Cart from "@/views/Cart.vue";
import Checkout from "@/views/Checkout.vue";
import Swal from "sweetalert2";
import ChangePass from "@/views/ChangePass.vue";
import Admin from "@/views/Admin.vue";
import ProductList from "../views/ProductList.vue";

const isAuthenticated = !!localStorage.getItem("logUser");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Index,
    },
    { path: "/products", 
      name: "product",
      component: ProductList},
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
    },
    {
      path: "/product/:id",
      name: "ProductDetail",
      component: Detail,
    },
    {
      path: "/cart",
      name: "Cart",
      component: Cart,
    },
    {
      path: "/checkout",
      name: "Checkout",
      component: Checkout,
      meta: { requiresAuth: true },
    },
    {
      path: "/changePass",
      name: "ChangePass",
      component: ChangePass,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin",
      name: "Admin",
      component: Admin,
      meta: { requiresAuth: true },
    },
    {
      path: "/products",
      name: "Products",
      component: () => import("@/views/ProductList.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    Swal.fire({
      icon: "error",
      title: "Thất bại!",
      text: "Bạn phải đăng nhập để tiếp tục",
      confirmButtonText: "OK",
    }).then(() => {
      next({ name: "Login" });
    });
  } else {
    next(); // Cho phép tiếp tục điều hướng
  }
});

export default router;
