<template>
    <NavBar></NavBar>
    <div class="container my-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-dark font-weight-bold">Quản lý sản phẩm</h2>
            <button class="btn btn-gradient-primary d-flex align-items-center" @click="showAddModal">
                <i class="fas fa-plus me-2"></i>Thêm sản phẩm
            </button>
        </div>

        <!-- Product Table -->
        <div class="table-responsive shadow-lg rounded">
            <table class="table table-striped table-hover table-bordered">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Hình ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Danh mục</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in products" :key="product.id">
                        <td>{{ product.id }}</td>
                        <td>
                            <img :src="product.image" alt="Product" class="img-fluid rounded-circle" style="width: 50px; height: 50px; object-fit: cover;">
                        </td>
                        <td>{{ product.name }}</td>
                        <td>{{ formatPrice(product.price) }}đ</td>
                        <td>
                            <span :class="{'badge bg-success': product.stock > 10, 'badge bg-warning': product.stock <= 10, 'badge bg-danger': product.stock === 0}">
                                {{ product.stock }}
                            </span>
                        </td>
                        <td>{{ product.category }}</td>
                        <td>
                            <button class="btn btn-sm btn-info me-2" @click="showEditModal(product)">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" @click="deleteProduct(product.id)">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Add/Edit Product Modal -->
        <div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới' }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveProduct">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Tên sản phẩm</label>
                                    <input type="text" class="form-control" v-model="currentProduct.name" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Danh mục</label>
                                    <select class="form-select" v-model="currentProduct.category" required>
                                        <option v-for="category in categories" :key="category.id" :value="category.name">
                                            {{ category.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Giá</label>
                                    <input type="number" class="form-control" v-model="currentProduct.price" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Số lượng</label>
                                    <input type="number" class="form-control" v-model="currentProduct.stock" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Mô tả</label>
                                <textarea class="form-control" v-model="currentProduct.description" rows="3" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Hình ảnh chính</label>
                                <input type="text" class="form-control" v-model="currentProduct.image" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Thông số kỹ thuật</label>
                                <div v-for="(spec, index) in specificationsList" :key="index" class="row mb-2">
                                    <div class="col-md-5">
                                        <input type="text" class="form-control" v-model="spec.key" placeholder="Tên thông số" required>
                                    </div>
                                    <div class="col-md-5">
                                        <input type="text" class="form-control" v-model="spec.value" placeholder="Giá trị" required>
                                    </div>
                                    <div class="col-md-2">
                                        <button class="btn btn-danger" @click="removeSpecification(index)">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <button class="btn btn-secondary" @click="addSpecification">Thêm thông số</button>
                            </div>
                            <div class="text-end">
                                <button type="button" class="btn btn-outline-secondary me-2" data-bs-dismiss="modal">Hủy</button>
                                <button type="submit" class="btn btn-gradient-primary">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer></Footer>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import NavBar from "./NavBar.vue";
import Footer from "./Footer.vue";
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

const products = ref([]);
const categories = ref([]);
const isEdit = ref(false);
const productModal = ref(null);
const currentProduct = ref({
    name: '',
    price: 0,
    description: '',
    image: '',
    stock: 0,
    category: '',
    specifications: {}
});
const specificationsList = ref([]);

// Format price with commas
const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0';
};

// Fetch products and categories
const fetchData = async () => {
    try {
        const [productsRes, categoriesRes] = await Promise.all([
            fetch('http://localhost:3000/products'),
            fetch('http://localhost:3000/categories')
        ]);
        products.value = await productsRes.json();
        categories.value = await categoriesRes.json();
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

// Convert specifications object to array
const updateSpecificationsList = () => {
    specificationsList.value = Object.entries(currentProduct.value.specifications || {}).map(([key, value]) => ({
        key,
        value
    }));
};

// Update specifications object from array
const updateSpecificationsObject = () => {
    currentProduct.value.specifications = specificationsList.value.reduce((acc, { key, value }) => {
        if (key) {
            acc[key] = value;
        }
        return acc;
    }, {});
};

// Show add modal
const showAddModal = async () => {
    isEdit.value = false;
    currentProduct.value = {
        name: '',
        price: 0,
        description: '',
        image: '',
        stock: 0,
        category: '',
        specifications: {}
    };
    specificationsList.value = [];
    await nextTick();
    if (productModal.value) {
        productModal.value.show();
    }
};

// Show edit modal
const showEditModal = async (product) => {
    isEdit.value = true;
    currentProduct.value = { ...product };
    updateSpecificationsList();
    await nextTick();
    if (productModal.value) {
        productModal.value.show();
    }
};

// Add specification
const addSpecification = () => {
    specificationsList.value.push({
        key: `Thông số ${specificationsList.value.length + 1}`,
        value: ''
    });
};

// Remove specification
const removeSpecification = (index) => {
    specificationsList.value.splice(index, 1);
};

// Save product
const saveProduct = async () => {
    try {
        updateSpecificationsObject();
        const url = isEdit.value 
            ? `http://localhost:3000/products/${currentProduct.value.id}`
            : 'http://localhost:3000/products';
        
        const method = isEdit.value ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentProduct.value)
        });

        if (response.ok) {
            if (productModal.value) {
                productModal.value.hide();
            }
            await fetchData();
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: `Sản phẩm đã được ${isEdit.value ? 'cập nhật' : 'thêm'} thành công`,
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error('Error saving product:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Không thể lưu sản phẩm',
            confirmButtonText: 'OK'
        });
    }
};

// Delete product
const deleteProduct = async (id) => {
    try {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Bạn không thể hoàn tác hành động này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, xóa sản phẩm!'
        });

        if (result.isConfirmed) {
            const response = await fetch(`http://localhost:3000/products/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchData();
                Swal.fire(
                    'Đã xóa!',
                    'Sản phẩm đã được xóa thành công.',
                    'success'
                );
            }
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Không thể xóa sản phẩm',
            confirmButtonText: 'OK'
        });
    }
};

onMounted(async () => {
    await fetchData();
    await nextTick();
    const modalElement = document.getElementById('productModal');
    if (modalElement) {
        productModal.value = new Modal(modalElement);
    }
});
</script>

<style scoped>
.table th, .table td {
    vertical-align: middle;
}

.table-striped tbody tr:nth-of-type(odd) {
    background-color: #f9f9f9;
}

.table-hover tbody tr:hover {
    background-color: #f1f1f1;
}

.table-bordered {
    border: 1px solid #ddd;
}

.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
}

.modal-lg {
    max-width: 800px;
}

.btn-gradient-primary {
    background: linear-gradient(45deg, #6f42c1, #2d9cdb);
    color: white;
}

.btn-outline-secondary {
    border-color: #6c757d;
}

.btn-outline-secondary:hover {
    background-color: #6c757d;
    color: white;
}

.badge {
    font-size: 0.875rem;
}

.img-fluid {
    object-fit: cover;
}
</style>
