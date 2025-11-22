// Sample products data
const products = [
    {
        id: 1,
        name: "Minimalist Watch",
        price: 199.99,
        description: "Elegant black and white minimalist watch with leather strap",
        image: "assets/images/product1.jpg"
    },
    {
        id: 2,
        name: "Classic Sunglasses",
        price: 149.99,
        description: "Premium black frame sunglasses with UV protection",
        image: "assets/images/product2.jpg"
    },
    {
        id: 3,
        name: "Designer Handbag",
        price: 299.99,
        description: "Luxurious black leather handbag with silver accents",
        image: "assets/images/product3.jpg"
    },
    {
        id: 4,
        name: "Wireless Earbuds",
        price: 179.99,
        description: "High-quality white wireless earbuds with noise cancellation",
        image: "assets/images/product4.jpg"
    },
    {
        id: 5,
        name: "Smartphone Case",
        price: 49.99,
        description: "Sleek black marble pattern smartphone case",
        image: "assets/images/product5.jpg"
    },
    {
        id: 6,
        name: "Premium Notebook",
        price: 39.99,
        description: "Hardcover black notebook with premium paper",
        image: "assets/images/product6.jpg"
    },
    {
        id: 7,
        name: "Desk Lamp",
        price: 89.99,
        description: "Modern adjustable black desk lamp with touch controls",
        image: "assets/images/product7.jpg"
    },
    {
        id: 8,
        name: "Coffee Mug Set",
        price: 69.99,
        description: "Set of 4 black and white ceramic coffee mugs",
        image: "assets/images/product8.jpg"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize store
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
    setupCartFunctionality();
});

function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'store-product-card';
        productCard.innerHTML = `
            <div class="store-product-image"></div>
            <div class="store-product-info">
                <h3>${product.name}</h3>
                <p class="store-product-price">$${product.price}</p>
                <p class="store-product-description">${product.description}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
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
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="margin-left: 10px;">×</button>
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
    
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

function showAddToCartAnimation() {
    // Simple animation feedback
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
    }, 300);
}

// Checkout functionality
document.querySelector('.checkout-btn')?.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderDetails = cart.map(item => 
        `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    alert(`Order Summary:\n\n${orderDetails}\n\nTotal: $${total.toFixed(2)}\n\nThank you for your order!`);
    
    // Clear cart after order
    cart = [];
    updateCart();
    document.getElementById('cartSidebar').classList.remove('active');
    document.body.style.overflow = 'auto';
});