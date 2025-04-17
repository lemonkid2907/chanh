<template>
  <NavBar></NavBar>
  <div class="container my-4">
    <div v-if="product" class="row">
      <!-- Hình ảnh sản phẩm -->
      <div class="col-md-6">
        <div class="card">
          <!-- Ảnh chính: thêm dấu "/" để truy xuất đúng từ public -->
          <img :src="`/${product.image}`" class="card-img-top main-image" alt="Product Image" />
          <div v-if="product.images && product.images.length > 0" class="card-body">
            <div class="row">
              <div class="col-3" v-for="(image, index) in product.images" :key="index">
                <!-- Ảnh thumbnail: cũng thêm "/" -->
                <img :src="`/${image}`" class="img-thumbnail thumbnail-image" alt="Product Image Thumbnail" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Thông tin sản phẩm -->
      <div class="col-md-6">
        <h1 class="mb-3 text-primary">{{ product.name }}</h1>
        <p class="text-muted">Danh mục: {{ getCategoryName(product.categoryId) }}</p>

        <div class="d-flex align-items-center mb-3">
          <h2 class="text-danger me-3">{{ formatPrice(product.price) }}đ</h2>
          <span class="badge bg-success" v-if="product.stock > 0">Còn hàng</span>
          <span class="badge bg-danger" v-else>Hết hàng</span>
        </div>

        <div class="mb-3">
          <h5>Mô tả sản phẩm:</h5>
          <p class="fade-in">{{ product.description }}</p>
        </div>

        <div v-if="product.specifications" class="mb-3">
          <h5>Thông số kỹ thuật:</h5>
          <ul class="list-group">
            <li class="list-group-item" v-for="(spec, key) in product.specifications" :key="key">
              <strong>{{ key }}:</strong> {{ spec }}
            </li>
          </ul>
        </div>

        <div class="mb-3">
          <h5>Số lượng:</h5>
          <div class="input-group w-50">
            <button class="btn btn-outline-secondary" type="button" @click="decreaseQuantity">-</button>
            <input type="number" class="form-control text-center" v-model="quantity" min="1" :max="product.stock" />
            <button class="btn btn-outline-secondary" type="button" @click="increaseQuantity">+</button>
          </div>
        </div>

        <div class="d-grid gap-2">
          <button class="btn btn-primary btn-lg btn-hover" @click="addToCart" :disabled="product.stock === 0">
            <i class="fas fa-shopping-cart me-2"></i>Thêm vào giỏ hàng
          </button>
          <button class="btn btn-outline-primary btn-lg btn-hover" @click="buyNow" :disabled="product.stock === 0">
            <i class="fas fa-bolt me-2"></i>Mua ngay
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Đang tải thông tin sản phẩm...</p>
    </div>

    <!-- Sản phẩm liên quan -->
    <div v-if="relatedProducts.length > 0" class="row mt-5">
      <h3 class="mb-4">Sản phẩm liên quan</h3>
      <div class="col-md-3 mb-4" v-for="(relatedProduct, index) in relatedProducts" :key="index">
        <div class="card h-100 shadow-lg card-hover">
          <!-- Cập nhật đường dẫn ảnh cho sản phẩm liên quan -->
          <img :src="`/${relatedProduct.image}`" class="card-img-top" alt="Related Product" />
          <div class="card-body">
            <h5 class="card-title">{{ relatedProduct.name }}</h5>
            <p class="card-text text-danger"><strong>{{ formatPrice(relatedProduct.price) }}đ</strong></p>
            <router-link :to="`/product/${relatedProduct.id}`" class="btn btn-outline-primary">Xem chi tiết</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const productId = ref(route.params.id);
const quantity = ref(1);
const product = ref(null);
const relatedProducts = ref([]);
const categories = ref([]);

// Fetch sản phẩm
const fetchProduct = async () => {
  try {
    const response = await fetch(`http://localhost:3000/products/${productId.value}`);
    if (!response.ok) throw new Error('Product not found');

    product.value = await response.json();

    // Lấy toàn bộ sản phẩm
    const allProductsResponse = await fetch('http://localhost:3000/products');
    const allProducts = await allProductsResponse.json();

    // Lấy sản phẩm liên quan (cùng categoryId)
    relatedProducts.value = allProducts
      .filter(p => p.id !== product.value.id && p.categoryId === product.value.categoryId)
      .slice(0, 4);
  } catch (error) {
    console.error('Lỗi khi tải sản phẩm:', error);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: 'Không thể tải thông tin sản phẩm',
      confirmButtonText: 'OK',
    }).then(() => {
      router.back();
    });
  }
};

// Fetch categories
const fetchCategories = async () => {
  const response = await fetch('http://localhost:3000/categories');
  categories.value = await response.json();
};

const getCategoryName = (id) => {
  const category = categories.value.find(c => c.id === id);
  return category ? category.name : '';
};

const formatPrice = (price) => {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0';
};

const increaseQuantity = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++;
  }
};
const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

const addToCart = () => {
  if (!product.value) return;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProduct = cart.find(item => item.id === product.value.id);

  if (existingProduct) {
    existingProduct.quantity += quantity.value;
  } else {
    cart.push({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      image: product.value.image,
      quantity: quantity.value
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  Swal.fire({
    icon: 'success',
    title: 'Thành công!',
    text: 'Sản phẩm đã được thêm vào giỏ hàng',
    confirmButtonText: 'OK'
  });
};

const buyNow = () => {
  addToCart();
  router.push('/checkout');
};

onMounted(() => {
  fetchProduct();
  fetchCategories();
});

// Watch thay đổi id trong route để tải lại dữ liệu sản phẩm mới
watch(
  () => route.params.id,
  (newId) => {
    productId.value = newId;
    quantity.value = 1;
    fetchProduct();
  }
);
</script>

<style scoped>
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 10px;
}
.card-hover:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}
.thumbnail-image {
  transition: transform 0.3s ease;
  cursor: pointer;
}
.thumbnail-image:hover {
  transform: scale(1.05);
}
.main-image {
  transition: transform 0.3s ease;
}
.main-image:hover {
  transform: scale(1.05);
}
.btn-hover {
  transition: background-color 0.3s ease, color 0.3s ease;
}
.btn-hover:hover {
  background-color: #0275d8;
  color: #fff;
}
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.list-group-item {
  transition: background-color 0.3s ease;
}
.list-group-item:hover {
  background-color: #f1f1f1;
}
</style>
