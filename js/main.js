// Main Application Initialization and Navigation

document.addEventListener('DOMContentLoaded', () => {
    // Initialize sample data
    Storage.initializeSampleData();

    // Initialize all modules
    Profile.init();
    Companies.init();
    Learning.init();
    Quiz.init();
    MockInterview.init();
    Resume.init();
    Resources.init();
    Dashboard.init();
    Dashboard.update();

    // Navigation setup
    setupNavigation();
    setupMobileMenu();
    
    // Display user name if logged in
    displayUserName();
});

// Display logged in user name
function displayUserName() {
    const user = JSON.parse(localStorage.getItem('spt_user') || '{}');
    if (user.name) {
        const navBrand = document.querySelector('.nav-brand span');
        if (navBrand) {
            navBrand.textContent = `Welcome, ${user.name}`;
        }
    }
}

// SPA Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link:not(.logout-link)');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');

            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show target section
            sections.forEach(s => s.classList.remove('active'));
            const target = document.getElementById(targetSection);
            if (target) {
                target.classList.add('active');
            }

            // Update dashboard when navigating to it
            if (targetSection === 'dashboard') {
                Dashboard.update();
            }


            // Close mobile menu if open
            const navMenu = document.getElementById('navMenu');
            navMenu.classList.remove('active');
        });
    });

    // Handle CTA button on landing page
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            const targetSection = ctaButton.getAttribute('data-section');
            const targetLink = document.querySelector(`.nav-link[data-section="${targetSection}"]`);
            if (targetLink) {
                targetLink.click();
            }
        });
    }
}

// Mobile menu toggle
function setupMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// Utility function to show success messages
function showSuccessMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.remove('hidden');
        setTimeout(() => {
            element.classList.add('hidden');
        }, 3000);
    }
}



