<template>
  <nav class="navbar navbar-expand-lg bg-dark navbar-dark shadow-lg sticky-top">
    <div class="container py-2">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand d-flex align-items-center text-white logo-hover">
        <span class="fw-bold fs-4">TechStore</span>
      </router-link>

      <!-- Toggle -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar content -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto ms-4">
          <li class="nav-item"><router-link to="/" class="nav-link fw-semibold">Trang chủ</router-link></li>
          <li class="nav-item"><router-link to="/products" class="nav-link fw-semibold">Sản phẩm</router-link></li>
          <li class="nav-item"><router-link to="/deals" class="nav-link fw-semibold">Khuyến mãi</router-link></li>
          <li class="nav-item"><router-link to="/contact" class="nav-link fw-semibold">Liên hệ</router-link></li>
        </ul>

        <!-- Search -->
        <div class="input-group search-box me-3">
          <input type="text" class="form-control border-0 shadow-sm" placeholder="Tìm kiếm sản phẩm..." />
          <button class="btn btn-light shadow-sm btn-hover">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        <!-- Cart -->
        <router-link to="/cart" @click.prevent="handleCartClick"
                     class="nav-link position-relative me-3 text-white cart-icon-hover">
          <i class="fas fa-shopping-cart fa-lg"></i>
          <span v-if="cartCount > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger animate__animated animate__bounce">
            {{ cartCount }}
          </span>
        </router-link>

        <!-- Avatar dropdown -->
        <div class="dropdown" ref="avatarDropdown">
          <a class="nav-link dropdown-toggle d-flex align-items-center text-white avatar-hover" href="#"
             data-bs-toggle="dropdown" aria-expanded="false">
            <img src="/img/avatar.png" alt="Avatar" class="rounded-circle" />
          </a>
          <ul class="dropdown-menu dropdown-menu-end animate__animated animate__fadeIn">
            <template v-if="!isLoggedIn">
              <li><router-link to="/login" class="dropdown-item">Đăng nhập</router-link></li>
              <li><router-link to="/register" class="dropdown-item">Đăng ký</router-link></li>
            </template>
            <template v-else>
              <li><span class="dropdown-item disabled">👋 Xin chào, {{ username }}</span></li>
              <li><router-link to="/profile" class="dropdown-item">Tài khoản</router-link></li>
              <li><router-link to="/changePass" class="dropdown-item">Đổi mật khẩu</router-link></li>
              <li><hr class="dropdown-divider" /></li>
              <li><button @click="logout" class="dropdown-item">Đăng xuất</button></li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

const router = useRouter();
const cartCount = ref(0);
const user = ref(null);

const avatarDropdown = ref(null); // ref cho dropdown

const isLoggedIn = computed(() => user.value !== null);
const username = computed(() => user.value?.username || '');

const logout = () => {
  localStorage.removeItem('logUser');
  user.value = null;
  Swal.fire({
    icon: 'success',
    title: 'Thành công!',
    text: 'Đăng xuất thành công',
    confirmButtonText: 'OK'
  }).then(() => {
    router.push('/login');
  });
};

const updateCartCount = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartCount.value = cart.reduce((total, item) => total + item.quantity, 0);
};

const handleCartClick = () => {
  if (!isLoggedIn.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Cần đăng nhập',
      text: 'Vui lòng đăng nhập để truy cập giỏ hàng.',
      confirmButtonText: 'Đăng nhập'
    }).then(() => {
      router.push('/login');
    });
  } else {
    router.push('/cart');
  }
};

onMounted(() => {
  const storedUser = localStorage.getItem('logUser');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch {
      user.value = null;
    }
  }

  updateCartCount();
  window.addEventListener('storage', updateCartCount);

  // ⚠️ Khởi tạo dropdown đúng cách
  if (avatarDropdown.value) {
    const toggleEl = avatarDropdown.value.querySelector('[data-bs-toggle="dropdown"]');
    if (toggleEl) {
      new bootstrap.Dropdown(toggleEl);
    }
  }
});
</script>

<style scoped>
.nav-link {
  transition: color 0.3s, transform 0.3s;
}
.nav-link:hover {
  color: #d9ecff;
  transform: translateY(-2px);
}
.logo-hover:hover {
  transform: scale(1.05);
  transition: transform 0.4s ease;
}
.avatar-hover img {
  width: 40px;
  height: 40px;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}
.avatar-hover img:hover {
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}
.btn-hover:hover {
  background-color: #e1ecff;
  transform: scale(1.05);
}
.search-box input:focus {
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}
.dropdown-menu {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.badge {
  animation-duration: 1s;
  animation-iteration-count: infinite;
}
.cart-icon-hover {
  transition: transform 0.3s ease;
}
.cart-icon-hover:hover {
  transform: scale(1.1);
}
.search-box {
  max-width: 250px;
  width: 100%;
}
</style>
