<template>
    <!-- <nav class="navbar navbar-expand-lg navbar-light bg-info shadow-sm sticky-top">
        <div class="container">
            <router-link to="/" class="navbar-brand">
                <img src="/img/logo-unbackground.png" alt="Logo" class="img-fluid" style="height: 75px;">
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a href="#" class="nav-link"><strong>Bài viết</strong></a>
                    </li>
                    <li class="nav-item">
                        <router-link to="/createPost" class="nav-link"><strong>Đăng bài</strong></router-link>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link"><strong>Bảng xếp hạng</strong></a>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link"><strong>Chuyển nhượng</strong></a>
                    </li>
                </ul>

                <div class="input-group w-auto ms-2">
                    <input type="text" class="form-control" placeholder="Tìm kiếm bài viết ...">
                    <button type="button" class="btn btn-secondary">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>

                <div class="dropdown ms-3">
                    <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                        <img src="/img/avatar.png" alt="Avatar" class="rounded-circle" style="width: 50px;">
                    </a>
                    <ul class="dropdown-menu">
                        <li>
                            <router-link to="/login" class="dropdown-item" v-if="!isAuthenticated()">
                                Đăng nhập
                            </router-link>
                            <button class="dropdown-item" :disabled="true" v-else>Đăng nhập</button>
                        </li>
                        <li><router-link to="/changePass" class="dropdown-item">Đổi mật khẩu</router-link></li>
                        <li><button @click="logout" class="dropdown-item">Đăng xuất</button></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav> -->
    <NavBar></NavBar>
    <div class="container my-4">
        <!-- Carousel -->
        <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" class="active"></button>
                <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2"></button>
            </div>
            <div class="carousel-inner">
                <div v-for="(banner, index) in banners" :key="index"
                    :class="['carousel-item', index === 0 ? 'active' : '']">
                    <img :src="banner.imageBanner" class="d-block w-100" style="height: 500px;">
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>

        <!-- Categories -->
        <!-- Danh mục sản phẩm -->
        <div class="my-4">
            <h2 class="text-center text-dark py-2 rounded-2 w-50 mx-auto mb-4">
                <strong>Danh mục sản phẩm</strong>
            </h2>
            <div class="d-flex flex-wrap justify-content-center gap-4">
                <div class="card" style="width: 18rem;" v-for="(category, index) in categories" :key="index">
                    <img :src="category.image" class="card-img-top" style="height: 200px; object-fit: cover;">
                    <div class="card-body text-center">
                        <h5 class="card-title">{{ category.name }}</h5>
                        <!-- Chuyển tới trang sản phẩm và truyền query category -->
                        <router-link :to="{ path: '/products', query: { category: category.id } }"
                            class="btn btn-primary">
                            Xem sản phẩm
                        </router-link>

                    </div>
                </div>
            </div>
        </div>



        <!-- Featured Products -->
        <div class="my-5">
            <h2 class="text-center text-dark py-2 rounded-2 w-50 mx-auto mb-4">
                <strong>Sản phẩm nổi bật</strong>
            </h2>
            <div class="row">
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" v-for="(product, index) in featuredProducts"
                    :key="index">
                    <div class="card h-100 shadow-sm border-0">
                        <img :src="product.image" class="card-img-top" style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title">{{ product.name }}</h5>
                                <p class="card-text text-danger fw-bold">{{ formatPrice(product.price) }}đ</p>
                                <p class="card-text text-muted text-truncate">{{ product.description }}</p>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <button class="btn btn-sm btn-primary" @click="addToCart(product)">Thêm vào giỏ</button>
                                <router-link :to="`/product/${product.id}`" class="btn btn-sm btn-outline-secondary">Chi
                                    tiết</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- New Arrivals -->
        <div class="my-5">
            <h2 class="text-center text-dark py-2 rounded-2 w-50 mx-auto mb-4">
                <strong>Sản phẩm mới</strong>
            </h2>
            <div class="row">
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" v-for="(product, index) in newProducts"
                    :key="index">
                    <div class="card h-100 shadow-sm border-0">
                        <img :src="product.image" class="card-img-top" style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title">{{ product.name }}</h5>
                                <p class="card-text text-danger fw-bold">{{ formatPrice(product.price) }}đ</p>
                                <p class="card-text text-muted text-truncate">{{ product.description }}</p>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mt-3">
                                <button class="btn btn-sm btn-primary" @click="addToCart(product)">Thêm vào giỏ</button>
                                <router-link :to="`/product/${product.id}`" class="btn btn-sm btn-outline-secondary">Chi
                                    tiết</router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <Footer></Footer>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NavBar from "./NavBar.vue";
import Footer from "./Footer.vue";
import Swal from 'sweetalert2';

const categories = ref([]);
const products = ref([]);
const featuredProducts = ref([]);
const newProducts = ref([]);
const banners = ref([
    {
        imageBanner: "img/1200x628_Banner-KM-3-1.jpg"
    },
    {
        imageBanner: "img/0f46925d57edde7840cd2bbbf22bee43.jpg"
    },
    {
        imageBanner: "img/banner_1200x628-800-resize.jpg"
    }
]);

// Format price with commas
const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0';
};

// Fetch data from JSON server
const fetchData = async () => {
    try {
        const [productsRes, categoriesRes] = await Promise.all([
            fetch('http://localhost:3000/products'),
            fetch('http://localhost:3000/categories')
        ]);

        products.value = await productsRes.json();
        categories.value = await categoriesRes.json();

        // Get featured products (first 4 products)
        featuredProducts.value = products.value.slice(0, 4);

        // Get new products (last 4 products)
        newProducts.value = products.value.slice(-4);
    } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Không thể tải dữ liệu',
            confirmButtonText: 'OK'
        });
    }
};

// Add to cart function
const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
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

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.btn-secondary {
    transition: background-color 0.3s;
}

.btn-secondary:hover {
    background-color: #4b4b4b;
}

.form-control:focus {
    border-color: #0056b3;
    box-shadow: 0 0 5px #0056b3;
}

.card {
    transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-title:hover {
    color: #007bff;
}

.carousel-inner img {
    transition: transform 0.3s;
}

.carousel-inner img:hover {
    transform: scale(1.05);
}
</style>
