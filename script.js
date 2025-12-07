let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// Load products
async function loadProducts() {
  try {
    const response = await fetch('products.json');
    products = await response.json();
    renderProducts(products);
    renderTestimonials(products);
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Render products
function renderProducts(products) {
  const container = document.getElementById('products');
  container.innerHTML = products.map(product => `
    <div class="product" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <h3>${product.name}</h3>
      <div class="price">$${product.price}</div>
      ${product.oldPrice ? `<div class="old-price">$${product.oldPrice}</div>` : ''}
      <ul class="specs">
        ${product.specs.map(spec => `<li>${spec}</li>`).join('')}
      </ul>
      ${product.stock < 5 ? `<span class="stock-badge">Low Stock! (${product.stock} left)</span>` : ''}
      <div class="rating">⭐ ${computeAvgRating(product.reviews).toFixed(1)} (${product.reviews.length} reviews)</div>
      <button class="buy-btn" onclick="addToCart(${product.id})">Add to Cart</button>
    </div>
  `).join('');
}

// Compute average rating
function computeAvgRating(reviews) {
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

// Render testimonials
function renderTestimonials(products) {
  const allReviews = products.flatMap(p => p.reviews.map(r => ({...r, product: p.name})));
  const container = document.getElementById('testimonials');
  const testimonials = allReviews.slice(0, 6); // Top 6
  container.innerHTML = testimonials.map(review => `
    <div class="testimonial">
      <p>"${review.text}"</p>
      <div><strong>${review.user}</strong> - ${review.product}</div>
      <div>⭐ ${review.rating}</div>
    </div>
  `).join('');
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return alert('Product not found');
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({...product, quantity: 1});
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  // Visual feedback
  const btn = event.target;
  btn.textContent = 'Added!';
  setTimeout(() => btn.textContent = 'Add to Cart', 1000);
}

// Update cart UI
function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Cart modal
const cartModal = document.getElementById('cart-modal');
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.querySelector('.close-cart');
const checkoutBtn = document.getElementById('checkout-btn');

cartBtn.onclick = () => cartModal.style.display = 'flex';
closeCart.onclick = () => cartModal.style.display = 'none';
window.onclick = (e) => { if (e.target === cartModal) cartModal.style.display = 'none'; };

checkoutBtn.onclick = () => {
  localStorage.setItem('cart', JSON.stringify(cart)); // Persist
  window.location.href = 'checkout.html';
};

// Render cart items in modal
function renderCartItems() {
  const container = document.getElementById('cart-items');
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty</p>';
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.name} x${item.quantity}</span>
      <span>$${ (item.price * item.quantity).toFixed(2) }</span>
      <button onclick="removeFromCart(${item.id})" style="background:#f00;color:#fff;border:none;padding:5px 10px;">Remove</button>
    </div>
  `).join('');
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  renderCartItems();
}

// Urgency timer (global sale)
function startSaleTimer() {
  const endTime = new Date(Date.now() + 24*60*60*1000).getTime(); // 24h
  const timer = setInterval(() => {
    const now = Date.now();
    const distance = endTime - now;
    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // Add to header or something
    if (distance < 0) {
      clearInterval(timer);
    }
  }, 1000);
}

// Init
document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  updateCartUI();
  renderCartItems();
  startSaleTimer();
});
