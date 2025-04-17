<template>
  <NavBar></NavBar>
  <div class="container py-4 animate__animated animate__fadeIn">
    <h2 class="mb-4 text-primary fw-bold text-center">Tất cả sản phẩm</h2>

    <!-- Danh mục sản phẩm -->
    <div v-if="categories.length" class="mb-4 text-center">
      <button
        class="btn btn-outline-secondary btn-sm mx-1 mb-2"
        :class="{ active: selectedCategory === null }"
        @click="selectedCategory = null"
      >
        Tất cả
      </button>
      <button
        v-for="category in categories"
        :key="category.id"
        class="btn btn-outline-secondary btn-sm mx-1 mb-2"
        :class="{ active: selectedCategory === category.id }"
        @click="selectedCategory = category.id"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Đang tải dữ liệu...</p>
    </div>

    <!-- Danh sách sản phẩm -->
    <div v-else>
      <div class="row">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="col-sm-6 col-md-4 col-lg-3 mb-4"
        >
          <div class="card h-100 shadow-sm product-hover">
            <img
              :src="product.image"
              class="card-img-top"
              alt="Product Image"
            />
            <div class="card-body d-flex flex-column justify-content-between">
              <h5 class="card-title text-dark fw-semibold text-truncate">
                {{ product.name }}
              </h5>
              <p class="text-danger fw-bold mb-3">
                {{ formatPrice(product.price) }}
              </p>
              <router-link
                :to="'/product/' + product.id"
                class="btn btn-outline-primary btn-sm mt-auto"
              >
                Xem chi tiết
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import NavBar from './NavBar.vue'
import Footer from './Footer.vue'

const route = useRoute() // 👈 lấy route để đọc query

const categories = ref([])
const products = ref([])
const loading = ref(true)
const selectedCategory = ref(null)

// Lọc sản phẩm theo danh mục đã chọn
const filteredProducts = computed(() => {
  // Nếu không có danh mục đã chọn, hiển thị tất cả sản phẩm
  if (!selectedCategory.value) return products.value
  // Nếu có danh mục, lọc sản phẩm theo categoryId
  return products.value.filter(product => product.categoryId === selectedCategory.value)
})

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
}

const fetchData = async () => {
  try {
    const [catRes, prodRes] = await Promise.all([
      axios.get('http://localhost:3000/categories'),
      axios.get('http://localhost:3000/products')
    ])
    categories.value = catRes.data
    products.value = prodRes.data
  } catch (err) {
    console.error('Lỗi tải dữ liệu:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData().then(() => {
    // Kiểm tra nếu có category trong query, thì set selectedCategory
    const categoryFromQuery = route.query.category
    if (categoryFromQuery) {
      selectedCategory.value = parseInt(categoryFromQuery)
    }
  })
})

// Lắng nghe thay đổi khi query.category thay đổi
watch(() => route.query.category, (newCategoryId) => {
  if (newCategoryId) {
    selectedCategory.value = parseInt(newCategoryId)
  } else {
    selectedCategory.value = null // Nếu không có category trong query thì hiển thị tất cả sản phẩm
  }
})
</script>

<style scoped>
.product-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
}
.product-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}
.card-img-top {
  height: 200px;
  object-fit: cover;
}
.card-title {
  min-height: 45px;
}
.active {
  background-color: #0d6efd;
  color: white !important;
  border-color: #0d6efd;
}
</style>
