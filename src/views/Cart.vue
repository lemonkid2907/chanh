<template>
    <NavBar></NavBar>
    <div class="container my-4">
      <h1 class="mb-4">Giỏ hàng</h1>
      
      <!-- Giỏ hàng trống -->
      <div v-if="cart.length === 0" class="text-center py-5">
        <i class="fas fa-shopping-cart fa-5x text-muted mb-3"></i>
        <h3>Giỏ hàng của bạn đang trống</h3>
        <p class="text-muted">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
        <router-link to="/" class="btn btn-primary">Tiếp tục mua sắm</router-link>
      </div>
  
      <!-- Giỏ hàng có sản phẩm -->
      <div v-else>
        <div class="row">
          <!-- Danh sách sản phẩm trong giỏ hàng -->
          <div class="col-md-8">
            <div class="card mb-4">
              <div class="card-body">
                <div 
                  v-for="(item, index) in cart" 
                  :key="index" 
                  class="row mb-3 pb-3 border-bottom align-items-center"
                >
                  <div class="col-md-2">
                    <!-- Nếu dữ liệu ảnh lưu dạng "img/xxx.jpg", thêm dấu "/" để load từ public -->
                    <img :src="`/${item.image}`" class="img-fluid" style="height: 100px; object-fit: cover;" alt="Product Image">
                  </div>
                  <div class="col-md-6">
                    <h5>{{ item.name }}</h5>
                    <!-- Nếu sản phẩm có mô tả, hiển thị (nếu không thì bạn có thể bỏ dòng này) -->
                    <p class="text-muted">{{ item.description }}</p>
                  </div>
                  <div class="col-md-2">
                    <div class="input-group">
                      <button class="btn btn-outline-secondary" @click="decreaseQuantity(item)">-</button>
                      <input 
                        type="number" 
                        class="form-control text-center" 
                        v-model.number="item.quantity" 
                        min="1" 
                        @change="updateQuantity(item)"
                      >
                      <button class="btn btn-outline-secondary" @click="increaseQuantity(item)">+</button>
                    </div>
                  </div>
                  <div class="col-md-2 text-end">
                    <h5 class="text-danger">{{ formatPrice(item.price * item.quantity) }}đ</h5>
                    <button class="btn btn-outline-danger btn-sm" @click="removeItem(index)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Nút xóa tất cả sản phẩm -->
            <div class="mb-3">
              <button class="btn btn-outline-danger" @click="clearCart">
                <i class="fas fa-trash"></i> Xóa tất cả sản phẩm
              </button>
            </div>
  
            <!-- Xóa sản phẩm theo danh mục -->
            <div v-if="categoriesInCart.length > 0" class="mb-3">
              <h5>Xóa theo danh mục:</h5>
              <div v-for="catId in categoriesInCart" :key="catId" class="mb-2">
                <span>{{ getCategoryName(catId) }}</span>
                <button class="btn btn-sm btn-outline-danger ms-2" @click="removeByCategory(catId)">
                  Xóa tất cả
                </button>
              </div>
            </div>
          </div>
  
          <!-- Order Summary -->
          <div class="col-md-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Tổng đơn hàng</h5>
                <div class="d-flex justify-content-between mb-2">
                  <span>Tạm tính:</span>
                  <span>{{ formatPrice(subtotal) }}đ</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Phí vận chuyển:</span>
                  <span>{{ formatPrice(shippingFee) }}đ</span>
                </div>
                <div class="d-flex justify-content-between mb-3">
                  <span>Giảm giá:</span>
                  <span class="text-danger">-{{ formatPrice(discount) }}đ</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between mb-3">
                  <strong>Tổng cộng:</strong>
                  <strong class="text-danger">{{ formatPrice(total) }}đ</strong>
                </div>
                <button class="btn btn-primary w-100" @click="checkout">
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import NavBar from "./NavBar.vue";
  import Footer from "./Footer.vue";
  import Swal from 'sweetalert2';
  
  const router = useRouter();
  // Đọc dữ liệu giỏ hàng từ localStorage, nếu chưa có sẽ là mảng rỗng
  const cart = ref(JSON.parse(localStorage.getItem('cart')) || []);
  
  // Phí vận chuyển và giảm giá có thể thay đổi theo logic của bạn
  const shippingFee = ref(30000);
  const discount = ref(0);
  
  // Computed: Tính tổng tạm tính của giỏ hàng
  const subtotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });
  
  // Computed: Tổng đơn hàng = tạm tính + phí vận chuyển - giảm giá
  const total = computed(() => {
    return subtotal.value + shippingFee.value - discount.value;
  });
  
  // Hàm định dạng giá, thêm dấu phẩy vào số
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Các hàm xử lý giỏ hàng
  const increaseQuantity = (item) => {
    item.quantity++;
    updateCart();
  };
  
  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      item.quantity--;
      updateCart();
    }
  };
  
  const updateQuantity = (item) => {
    if (item.quantity < 1) item.quantity = 1;
    updateCart();
  };
  
  const removeItem = (index) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: "Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, xóa sản phẩm'
    }).then((result) => {
      if (result.isConfirmed) {
        cart.value.splice(index, 1);
        updateCart();
        Swal.fire('Đã xóa!', 'Sản phẩm đã được xóa khỏi giỏ hàng.', 'success');
      }
    });
  };
  
  // Hàm cập nhật giỏ hàng vào localStorage
  const updateCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart.value));
  };
  
  // Hàm xóa tất cả sản phẩm trong giỏ hàng
  const clearCart = () => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Xóa tất cả sản phẩm khỏi giỏ hàng?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xóa tất cả'
    }).then((result) => {
      if (result.isConfirmed) {
        cart.value = [];
        updateCart();
        Swal.fire('Đã xóa!', 'Giỏ hàng của bạn đã được xóa hết.', 'success');
      }
    });
  };
  
  // Hàm xóa các sản phẩm theo danh mục
  const removeByCategory = (catId) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: `Xóa tất cả sản phẩm thuộc danh mục ${getCategoryName(catId)} khỏi giỏ hàng?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xóa tất cả'
    }).then((result) => {
      if (result.isConfirmed) {
        cart.value = cart.value.filter(item => item.categoryId !== catId);
        updateCart();
        Swal.fire('Đã xóa!', 'Sản phẩm trong danh mục đã được xóa.', 'success');
      }
    });
  };
  
  // Computed: Trả về danh sách các danh mục (categoryId) hiện có trong giỏ hàng (unique)
  const categoriesInCart = computed(() => {
    const unique = {};
    cart.value.forEach(item => {
      if (item.categoryId) {
        unique[item.categoryId] = true;
      }
    });
    return Object.keys(unique);
  });
  
  // Giả sử bạn có sẵn danh sách danh mục, hoặc có thể load từ API nếu cần.
  const allCategories = ref([
    { id: "1", name: "Điện thoại" },
    { id: "2", name: "Laptop" },
    { id: "3", name: "Phụ kiện" },
    { id: "4", name: "Đồ gia dụng" }
  ]);
  
  // Lấy tên danh mục dựa trên categoryId
  const getCategoryName = (id) => {
    const category = allCategories.value.find(c => c.id === id);
    return category ? category.name : '';
  };
  
  // Hàm chuyển hướng thanh toán
  const checkout = () => {
    router.push('/checkout');
  };
  </script>
  
  <style scoped>
  /* Bạn có thể tùy chỉnh CSS theo ý thích */
  .card {
    margin-bottom: 1rem;
  }
  .img-fluid {
    border-radius: 4px;
  }
  .input-group > .btn,
  .input-group > .form-control {
    min-width: 2.5rem;
  }
  .btn-outline-danger {
    margin-top: 0.5rem;
  }
  </style>
  