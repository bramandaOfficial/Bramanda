// Admin Authentication
const ADMIN_PASSWORD = "bramanda2024"; // Change this to your desired password
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Check if user is already logged in
function checkAuth() {
    const loginTime = localStorage.getItem('adminLoginTime');
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    
    if (isLoggedIn === 'true' && loginTime) {
        const timeSinceLogin = Date.now() - parseInt(loginTime);
        if (timeSinceLogin < SESSION_TIMEOUT) {
            showAdminContent();
            return true;
        } else {
            logout();
        }
    }
    return false;
}

// Login function
function login(password) {
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminLoginTime', Date.now().toString());
        showAdminContent();
        return true;
    }
    return false;
}

// Logout function
function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    window.location.reload();
}

// Show admin content
function showAdminContent() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminContent').style.display = 'block';
    loadAdminData();
}

// Initialize admin page
document.addEventListener('DOMContentLoaded', () => {
    // Check if already authenticated
    if (!checkAuth()) {
        // Set up login form
        const loginForm = document.getElementById('loginForm');
        const passwordInput = document.getElementById('adminPassword');
        const errorMessage = document.getElementById('loginError');
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = passwordInput.value.trim();
            
            if (login(password)) {
                errorMessage.style.display = 'none';
            } else {
                errorMessage.textContent = 'Invalid password. Please try again.';
                errorMessage.style.display = 'block';
                passwordInput.value = '';
            }
        });
        
        // Focus on password input
        passwordInput.focus();
    }
});

// Auto-logout after session timeout
setInterval(() => {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        const loginTime = localStorage.getItem('adminLoginTime');
        if (loginTime && (Date.now() - parseInt(loginTime)) > SESSION_TIMEOUT) {
            logout();
        }
    }
}, 60000); // Check every minute

// Rest of your existing admin.js code continues...
function loadAdminData() {
    // Load visits from localStorage
    const visits = localStorage.getItem('pageVisits') || '0';
    document.getElementById('totalVisits').textContent = parseInt(visits).toLocaleString();
    
    // Load products count
    const products = JSON.parse(localStorage.getItem('products')) || [];
    document.getElementById('totalProducts').textContent = products.length;
    
    // Load orders and revenue
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    document.getElementById('totalOrders').textContent = orders.length;
    
    const revenue = orders.reduce((total, order) => total + order.total, 0);
    document.getElementById('totalRevenue').textContent = '$' + revenue.toFixed(2);
    
    // Load activity log
    loadActivityLog();
    loadProductsList();
}

function loadActivityLog() {
    const activityLog = document.getElementById('activityLog');
    const activities = JSON.parse(localStorage.getItem('adminActivities')) || [];
    
    if (activities.length === 0) {
        activities.push(
            { action: 'System', details: 'Admin panel initialized', timestamp: new Date().toLocaleString() }
        );
        localStorage.setItem('adminActivities', JSON.stringify(activities));
    }
    
    activityLog.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <strong>${activity.action}</strong>: ${activity.details}
            <span class="activity-time">${activity.timestamp}</span>
        </div>
    `).join('');
}

function loadProductsList() {
    const productsList = document.getElementById('productsList');
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (products.length === 0) {
        productsList.innerHTML = '<p>No products added yet.</p>';
        return;
    }
    
    productsList.innerHTML = products.map(product => `
        <div class="product-admin-item">
            <h4>${product.name}</h4>
            <p>Price: $${product.price} | Stock: ${product.stock || 'N/A'}</p>
            <button onclick="editProduct(${product.id})">Edit</button>
            <button onclick="deleteProduct(${product.id})" class="delete-btn">Delete</button>
        </div>
    `).join('');
}

function addSampleProduct() {
    if (!checkAuth()) return;
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const newProduct = {
        id: Date.now(),
        name: `Sample Product ${products.length + 1}`,
        price: 99.99,
        stock: 10,
        description: 'This is a sample product added from admin panel'
    };
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    // Add to activity log
    const activities = JSON.parse(localStorage.getItem('adminActivities')) || [];
    activities.unshift({
        action: 'Product Added',
        details: `Added "${newProduct.name}"`,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('adminActivities', JSON.stringify(activities));
    
    loadProductsList();
    loadAdminData();
}

function logActivity(action, details) {
    const activities = JSON.parse(localStorage.getItem('adminActivities')) || [];
    activities.unshift({
        action,
        details,
        timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('adminActivities', JSON.stringify(activities));
}