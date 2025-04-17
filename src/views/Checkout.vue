<template>
    <NavBar></NavBar>
    <div class="container my-4">
        <div class="row">
            <!-- Shipping Information -->
            <div class="col-md-8">
                <div class="card mb-4">
                    <div class="card-body">
                        <h3 class="card-title mb-4">Thông tin giao hàng</h3>
                        <form @submit.prevent="submitOrder">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="firstName" class="form-label">Họ</label>
                                    <input type="text" class="form-control" id="firstName" v-model="shippingInfo.firstName" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="lastName" class="form-label">Tên</label>
                                    <input type="text" class="form-control" id="lastName" v-model="shippingInfo.lastName" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" v-model="shippingInfo.email" required>
                            </div>
                            <div class="mb-3">
                                <label for="phone" class="form-label">Số điện thoại</label>
                                <input type="tel" class="form-control" id="phone" v-model="shippingInfo.phone" required>
                            </div>
                            <div class="mb-3">
                                <label for="address" class="form-label">Địa chỉ</label>
                                <input type="text" class="form-control" id="address" v-model="shippingInfo.address" required>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="city" class="form-label">Thành phố</label>
                                    <input type="text" class="form-control" id="city" v-model="shippingInfo.city" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="district" class="form-label">Quận/Huyện</label>
                                    <input type="text" class="form-control" id="district" v-model="shippingInfo.district" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="note" class="form-label">Ghi chú</label>
                                <textarea class="form-control" id="note" rows="3" v-model="shippingInfo.note"></textarea>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Payment Method -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h3 class="card-title mb-4">Phương thức thanh toán</h3>
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="radio" name="paymentMethod" id="cod" value="cod" v-model="paymentMethod">
                            <label class="form-check-label" for="cod">
                                Thanh toán khi nhận hàng (COD)
                            </label>
                        </div>
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="radio" name="paymentMethod" id="bank" value="bank" v-model="paymentMethod">
                            <label class="form-check-label" for="bank">
                                Chuyển khoản ngân hàng
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="paymentMethod" id="momo" value="momo" v-model="paymentMethod">
                            <label class="form-check-label" for="momo">
                                Ví điện tử Momo
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order Summary -->
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title mb-4">Đơn hàng</h3>
                        <div v-for="(item, index) in cart" :key="index" class="d-flex justify-content-between mb-2">
                            <div>
                                <span>{{ item.name }}</span>
                                <small class="text-muted"> x {{ item.quantity }}</small>
                            </div>
                            <span>{{ formatPrice(item.price * item.quantity) }}đ</span>
                        </div>
                        <hr>
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
                        <button class="btn btn-primary w-100" @click="submitOrder">
                            Đặt hàng
                        </button>
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
const cart = ref(JSON.parse(localStorage.getItem('cart')) || []);
const shippingFee = ref(30000);
const discount = ref(0);
const paymentMethod = ref('cod');

const shippingInfo = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    note: ''
});

// Computed properties
const subtotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const total = computed(() => {
    return subtotal.value + shippingFee.value - discount.value;
});

// Format price with commas
const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Submit order
const submitOrder = () => {
    if (cart.value.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Giỏ hàng của bạn đang trống',
            confirmButtonText: 'OK'
        });
        return;
    }

    const order = {
        ...shippingInfo.value,
        paymentMethod: paymentMethod.value,
        items: cart.value,
        total: total.value,
        date: new Date().toISOString()
    };

    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem('cart');
    cart.value = [];

    Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đơn hàng của bạn đã được đặt thành công',
        confirmButtonText: 'OK'
    }).then(() => {
        router.push('/');
    });
};
</script> 