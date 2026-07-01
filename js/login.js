// Login Page JavaScript with Firebase Authentication
import {
    auth,
    googleProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail
} from './firebase-config.js';

// Check if user is already logged in
onAuthStateChanged(auth, (user) => {
    if (user && window.location.pathname.includes('login.html')) {
        // User is signed in, redirect to main app
        window.location.href = 'index.html';
    }
});

// Google Sign-In
document.getElementById('googleSignIn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const btn = e.currentTarget;
    btn.classList.add('loading');
    btn.disabled = true;
    
    try {
        // Configure Google provider with additional settings
        googleProvider.setCustomParameters({
            prompt: 'select_account'
        });
        
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Save user data
        const userData = {
            name: user.displayName || 'User',
            email: user.email,
            loginMethod: 'google',
            uid: user.uid,
            photoURL: user.photoURL
        };
        
        saveUserData(userData);
        showSuccess('Login successful! Redirecting...');
        
        // Redirect to main app
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        btn.classList.remove('loading');
        btn.disabled = false;
        
        if (error.code === 'auth/popup-closed-by-user') {
            showError('Sign-in cancelled');
        } else if (error.code === 'auth/popup-blocked') {
            showError('Popup blocked. Please allow popups for this site.');
        } else if (error.code === 'auth/unauthorized-domain') {
            showError('This domain is not authorized. Please add it to Firebase Console.');
        } else if (error.code === 'auth/operation-not-allowed') {
            showError('Google sign-in is not enabled. Please enable it in Firebase Console.');
        } else if (error.code === 'auth/cancelled-popup-request') {
            showError('Another popup is already open. Please close it and try again.');
        } else {
            showError(`Failed to sign in with Google: ${error.message}`);
        }
    }
});

// Email/Password Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const btn = e.target.querySelector('.login-btn');
    
    // Validate inputs
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    btn.classList.add('loading');
    btn.disabled = true;
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Save user data
        const userData = {
            name: user.displayName || email.split('@')[0],
            email: user.email,
            loginMethod: 'email',
            uid: user.uid
        };
        
        saveUserData(userData);
        showSuccess('Login successful! Redirecting...');
        
        // Redirect to main app
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login Error:', error);
        btn.classList.remove('loading');
        btn.disabled = false;
        
        if (error.code === 'auth/user-not-found') {
            showError('No account found with this email');
        } else if (error.code === 'auth/wrong-password') {
            showError('Incorrect password');
        } else if (error.code === 'auth/invalid-email') {
            showError('Invalid email address');
        } else if (error.code === 'auth/too-many-requests') {
            showError('Too many failed attempts. Please try again later.');
        } else {
            showError('Login failed. Please try again.');
        }
    }
});

// Single Sign-On
document.getElementById('singleSignOn')?.addEventListener('click', (e) => {
    e.preventDefault();
    showError('Single Sign-On feature coming soon!');
});

// Reset Password
document.getElementById('resetPassword')?.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const email = prompt('Enter your email address to reset password:');
    if (!email) return;
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    try {
        await sendPasswordResetEmail(auth, email);
        showSuccess(`Password reset link has been sent to ${email}`);
    } catch (error) {
        console.error('Password Reset Error:', error);
        
        if (error.code === 'auth/user-not-found') {
            showError('No account found with this email');
        } else {
            showError('Failed to send reset email. Please try again.');
        }
    }
});

// Helper Functions
function saveUserData(userData) {
    // Save to localStorage
    localStorage.setItem('spt_logged_in', 'true');
    localStorage.setItem('spt_user', JSON.stringify(userData));
    
    // Save to profile
    const profile = {
        name: userData.name,
        email: userData.email
    };
    localStorage.setItem('spt_profile', JSON.stringify(profile));
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(239, 68, 68, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function showSuccess(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 217, 168, 0.9);
        color: #0a0a0a;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
