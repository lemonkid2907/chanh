<template>
    <NavBar></NavBar>
  
    <div class="register-container d-flex justify-content-center align-items-center">
      <div class="card register-card shadow-lg">
        <h3 class="text-center mb-4 text-gradient">Đăng Ký</h3>
        <form @submit.prevent="checkRegister" class="animate__animated animate__fadeInUp">
          <div class="mb-3">
            <label for="username" class="form-label">Tên tài khoản:</label>
            <input type="text" class="form-control" id="username" v-model="username" required />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Mật khẩu:</label>
            <input type="password" class="form-control" id="password" v-model="password" required />
          </div>
          <div class="mb-3">
            <label for="repassword" class="form-label">Nhập lại mật khẩu:</label>
            <input type="password" class="form-control" id="repassword" v-model="repassword" required />
          </div>
          <p v-if="errorMessage" class="text-danger text-center">{{ errorMessage }}</p>
          <button type="submit" class="btn-gradient w-100 mt-3">🚀 Đăng Ký</button>
          <div class="text-center mt-3">
            <router-link to="/login" class="text-secondary">⬅ Quay lại đăng nhập</router-link>
          </div>
        </form>
      </div>
    </div>
  
    <Footer></Footer>
  </template>
  
  <script setup>
  import Swal from "sweetalert2";
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import NavBar from "./NavBar.vue";
  import Footer from "./Footer.vue";
  
  const route = useRouter();
  
  const username = ref("");
  const password = ref("");
  const repassword = ref("");
  const errorMessage = ref("");
  
  const checkRegister = () => {
    if (password.value !== repassword.value) {
      errorMessage.value = "Mật khẩu không khớp, vui lòng kiểm tra lại";
      return;
    }
  
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
  
    const existingUser = registeredUsers.find((user) => user.username === username.value);
    if (existingUser) {
      errorMessage.value = "Tên tài khoản đã tồn tại. Vui lòng chọn tên khác.";
      return;
    }
  
    registeredUsers.push({ id: registeredUsers.length + 1, username: username.value, password: password.value });
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
  
    Swal.fire({
      icon: "success",
      title: "Thành công!",
      text: "Đăng ký thành công.",
      confirmButtonText: "OK"
    });
    route.push("/login");
  };
  </script>
  
  <style scoped>
  @import "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css";
  
  .register-container {
    min-height: 100vh;
    padding: 2rem;
    background: linear-gradient(135deg, #e0f7fa, #e1bee7);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .register-card {
    background-color: #ffffff;
    border-radius: 20px;
    padding: 2.5rem;
    max-width: 420px;
    width: 100%;
    animation: fadeIn 1s ease-in-out;
  }
  
  .text-gradient {
    background: linear-gradient(90deg, #007bff, #8e2de2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
  }
  
  input.form-control {
    border-radius: 10px;
    padding: 0.75rem;
    transition: all 0.3s ease;
    border: 1px solid #ccc;
  }
  
  input.form-control:focus {
    border-color: #8e2de2;
    box-shadow: 0 0 5px rgba(142, 45, 226, 0.3);
  }
  
  .btn-gradient {
    padding: 0.75rem;
    background: linear-gradient(90deg, #007bff, #8e2de2);
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: bold;
    font-size: 1rem;
    transition: transform 0.2s ease-in-out;
  }
  
  .btn-gradient:hover {
    transform: scale(1.03);
    box-shadow: 0 6px 15px rgba(142, 45, 226, 0.4);
    background: linear-gradient(90deg, #0056b3, #6a1b9a);
  }
  
  .text-secondary {
    color: #6c757d;
    text-decoration: none;
    font-weight: 500;
  }
  
  .text-secondary:hover {
    text-decoration: underline;
    color: #8e2de2;
  }
  
  .text-danger {
    font-size: 0.875rem;
    margin-top: 10px;
    color: #ff4d4f;
  }
  </style>
  