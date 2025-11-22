// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Scroll Button Functionality
const scrollBtn = document.getElementById('scrollBtn');
const scrollIcon = scrollBtn.querySelector('i');

function updateScrollButton() {
    if (window.scrollY > 100) {
        scrollBtn.style.display = 'flex';
    } else {
        scrollBtn.style.display = 'flex';
    }

    // Change icon based on scroll position
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
        // At bottom of page
        scrollIcon.className = 'fas fa-arrow-up';
        scrollBtn.setAttribute('data-direction', 'up');
    } else if (window.scrollY === 0) {
        // At top of page
        scrollIcon.className = 'fas fa-arrow-down';
        scrollBtn.setAttribute('data-direction', 'down');
    }
}

scrollBtn.addEventListener('click', () => {
    const direction = scrollBtn.getAttribute('data-direction');
    
    if (direction === 'down') {
        // Scroll to bottom
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    } else {
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// Navbar scroll effect
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = window.scrollY;
    updateScrollButton();
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        alert(`Thank you for subscribing with: ${email}`);
        newsletterForm.reset();
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateScrollButton();
    
    // Track page visit for admin
    if (typeof(Storage) !== "undefined") {
        let visits = localStorage.getItem('pageVisits') || 0;
        visits = parseInt(visits) + 1;
        localStorage.setItem('pageVisits', visits);
    }
});

function setupAdminLink() {
    const adminLink = document.querySelector('.nav-link.admin');
    if (adminLink) {
        // Only show admin link if user is logged in as admin
        const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
        if (!isAdmin) {
            adminLink.style.display = 'none';
        } else {
            adminLink.style.display = 'block';
        }
    }
}

// Call this function when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    setupAdminLink();
    // ... rest of your existing code
});