const API_BASE_URL = 'https://bramanda-backend.onrender.com/api';

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize store
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
    setupCartFunctionality();
});

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const products = await response.json();
        
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = '';

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'store-product-card';
            productCard.innerHTML = `
                <div class="store-product-image" style="background-image: url('${product.image}')"></div>
                <div class="store-product-info">
                    <h3>${product.name}</h3>
                    <p class="store-product-price">$${product.price}</p>
                    <p class="store-product-description">${product.description}</p>
                    <button class="add-to-cart-btn" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')">
                        Add to Cart
                    </button>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to local products if API fails
        loadLocalProducts();
    }
}

function loadLocalProducts() {
    const localProducts = [
        {
            id: '1',
            name: "Minimalist Watch",
            price: 199.99,
            description: "Elegant black and white minimalist watch with leather strap",
            image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400"
        },
        {
            id: '2', 
            name: "Classic Sunglasses",
            price: 149.99,
            description: "Premium black frame sunglasses with UV protection",
            image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"
        },
        {
            id: '3',
            name: "Designer Handbag", 
            price: 299.99,
            description: "Luxurious black leather handbag with silver accents",
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"
        }
    ];
    
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    localProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'store-product-card';
        productCard.innerHTML = `
            <div class="store-product-image" style="background-image: url('${product.image}')"></div>
            <div class="store-product-info">
                <h3>${product.name}</h3>
                <p class="store-product-price">$${product.price}</p>
                <p class="store-product-description">${product.description}</p>
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')">
                    Add to Cart
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

function addToCart(productId, productName, productPrice, productImage) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }

    updateCart();
    showAddToCartAnimation();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    cartItems.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${item.price} x ${item.quantity}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                <button class="quantity-btn" onclick="removeFromCart('${item.id}')" style="margin-left: 10px;">×</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
}

function setupCartFunctionality() {
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    
    if (cartBtn && cartSidebar && closeCart) {
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
}

function showAddToCartAnimation() {
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
    }, 300);
}

// Checkout functionality
document.querySelector('.checkout-btn')?.addEventListener('click', async () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Show checkout form
    showCheckoutForm();
});

function showCheckoutForm() {
    const checkoutForm = `
        <div class="checkout-overlay" id="checkoutOverlay">
            <div class="checkout-modal">
                <h3>Checkout</h3>
                <form id="checkoutForm">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="customerName" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="customerEmail" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" id="customerPhone" required>
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <textarea id="customerAddress" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Payment Method</label>
                        <select id="paymentMethod" required>
                            <option value="cod">Cash on Delivery</option>
                            <option value="esewa">eSewa</option>
                        </select>
                    </div>
                    <div class="checkout-buttons">
                        <button type="button" onclick="closeCheckout()">Cancel</button>
                        <button type="submit">Place Order</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', checkoutForm);
    
    document.getElementById('checkoutForm').addEventListener('submit', handleOrderSubmission);
}

function closeCheckout() {
    const overlay = document.getElementById('checkoutOverlay');
    if (overlay) {
        overlay.remove();
    }
}

async function handleOrderSubmission(e) {
    e.preventDefault();
    
    const orderData = {
        customerName: document.getElementById('customerName').value,
        customerEmail: document.getElementById('customerEmail').value,
        customerPhone: document.getElementById('customerPhone').value,
        customerAddress: document.getElementById('customerAddress').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        items: cart,
        totalAmount: getCartTotal()
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`Order placed successfully! Order ID: ${result.orderId}`);
            // Clear cart
            cart = [];
            updateCart();
            closeCheckout();
            // Close cart sidebar
            document.getElementById('cartSidebar').classList.remove('active');
            document.body.style.overflow = 'auto';
        } else {
            alert('Failed to place order. Please try again.');
        }
    } catch (error) {
        console.error('Order error:', error);
        alert('Order failed. Please check your connection and try again.');
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}
