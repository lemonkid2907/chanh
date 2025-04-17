<template>
    <footer class="footer-container text-white pt-5 pb-4 mt-5">
      <div class="container text-md-left">
        <div class="row text-md-left">
  
          <!-- Cột 1: Logo + mô tả -->
          <div class="col-md-4 col-lg-4 col-xl-4 mx-auto mb-4">
            <h5 class="fw-bold text-uppercase mb-4">
              <i class="fas fa-microchip me-2"></i>TechStore
            </h5>
            <p>
              TechStore cung cấp sản phẩm công nghệ chính hãng, uy tín và chất lượng hàng đầu Việt Nam.
            </p>
          </div>
  
          <!-- Cột 2: Liên kết -->
          <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4">Liên kết</h6>
            <p><router-link to="/" class="footer-link">Trang chủ</router-link></p>
            <p><router-link to="/products" class="footer-link">Sản phẩm</router-link></p>
            <p><router-link to="/contact" class="footer-link">Liên hệ</router-link></p>
            <p><router-link to="/about" class="footer-link">Về chúng tôi</router-link></p>
          </div>
  
          <!-- Cột 3: Liên hệ -->
          <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            <h6 class="text-uppercase fw-bold mb-4">Liên hệ</h6>
            <p><i class="fas fa-home me-2"></i> 123 Nguyễn Huệ, Q.1, TP.HCM</p>
            <p><i class="fas fa-envelope me-2"></i> support@techstore.vn</p>
            <p><i class="fas fa-phone me-2"></i> 0909 999 999</p>
          </div>
        </div>
  
        <!-- Dòng chia -->
        <hr class="my-4 border-light" />
  
        <!-- Mạng xã hội -->
        <div class="text-center mb-3">
          <a href="#" class="text-white me-4 social-icon"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="text-white me-4 social-icon"><i class="fab fa-instagram"></i></a>
          <a href="#" class="text-white me-4 social-icon"><i class="fab fa-twitter"></i></a>
          <a href="#" class="text-white me-4 social-icon"><i class="fab fa-youtube"></i></a>
        </div>
  
        <!-- Bản quyền -->
        <div class="text-center small">
          &copy; 2025 TechStore. Đã đăng ký bản quyền.
        </div>
      </div>
    </footer>
  </template>
  
  <style scoped>
  .footer-container {
    background-color: #121212;
    color: #f1f1f1;
    animation: fadeInUp 0.8s;
  }
  
  .footer-link {
    text-decoration: none;
    color: #cccccc;
    transition: color 0.3s ease;
  }
  
  .footer-link:hover {
    color: #ffffff;
    text-decoration: underline;
  }
  
  .social-icon {
    font-size: 20px;
    transition: transform 0.3s ease, color 0.3s;
  }
  
  .social-icon:hover {
    color: #ffd700;
    transform: scale(1.2);
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  