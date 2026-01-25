/**
 * MAIN.JS - Core Portfolio Functionality
 * Handles navigation, profile loading, and general interactions
 */

// ==========================================
// NAVIGATION & MOBILE MENU
// ==========================================

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');

// Toggle mobile menu on click
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ==========================================
// DARK MODE / LIGHT MODE TOGGLE
// ==========================================

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

/**
 * Initialize theme from localStorage or system preference
 */
function initializeTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }
}

/**
 * Set theme and update UI
 * @param {string} theme - 'light' or 'dark'
 */
function setTheme(theme) {
    if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun'; // Show sun icon in dark mode
        localStorage.setItem('theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon'; // Show moon icon in light mode
        localStorage.setItem('theme', 'light');
    }
}

/**
 * Toggle between light and dark mode
 */
function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    console.log('Theme toggled from', currentTheme, 'to', newTheme);
    setTheme(newTheme);
}

// Add click event to theme toggle button
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    console.log('Theme toggle button initialized');
} else {
    console.error('Theme toggle button not found!');
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// ==========================================
// SMOOTH SCROLLING & ACTIVE NAVIGATION
// ==========================================

// Update active navigation link based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('.section, .hero-section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
    
    // Add shadow to navbar on scroll
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 8px rgba(31, 41, 51, 0.12)';
    } else {
        navbar.style.boxShadow = '0 2px 4px rgba(31, 41, 51, 0.08)';
    }
});

// ==========================================
// LOAD PROFILE DATA
// ==========================================

/**
 * Fetch and display profile information from JSON
 * This includes: name, title, tagline, about, education, and contact info
 */
async function loadProfile() {
    try {
        const response = await fetch('data/profile.json');
        if (!response.ok) throw new Error('Failed to load profile data');
        
        const profile = await response.json();
        
        // Update hero section
        document.getElementById('profileName').textContent = profile.name || 'Your Name';
        document.getElementById('profileTitle').textContent = profile.title || 'Computer Science Student';
        document.getElementById('profileTagline').textContent = profile.tagline || '';
        
        // Update profile image
        const profileImage = document.getElementById('profileImage');
        if (profile.profileImage) {
            profileImage.src = profile.profileImage;
            profileImage.alt = `${profile.name} - Profile Photo`;
        }
        
        // Update about section
        const aboutContent = document.getElementById('aboutContent');
        if (profile.about) {
            aboutContent.innerHTML = profile.about
                .map(paragraph => `<p>${paragraph}</p>`)
                .join('');
        }
        
        // Update education section
        loadEducation(profile.education);
        
        // Update contact information
        if (profile.contact) {
            updateContactInfo(profile.contact);
        }
        
        // Update footer name
        document.getElementById('footerName').textContent = profile.name || 'Your Name';
        
    } catch (error) {
        console.error('Error loading profile:', error);
        // Show error messages in appropriate sections
        document.getElementById('profileName').textContent = 'Error Loading Profile';
        document.getElementById('aboutContent').innerHTML = '<p>Unable to load profile information.</p>';
    }
}

/**
 * Display education information
 */
function loadEducation(education) {
    const educationContent = document.getElementById('educationContent');
    
    if (!education || education.length === 0) {
        educationContent.innerHTML = '<p>No education information available.</p>';
        return;
    }
    
    educationContent.innerHTML = education.map(edu => `
        <div class="education-item">
            <h3 class="education-degree">${edu.degree}</h3>
            <p class="education-institution">${edu.institution}</p>
            <p class="education-year">${edu.year}</p>
            ${edu.coursework ? `
                <p class="education-coursework">
                    <strong>Relevant Coursework:</strong> ${edu.coursework.join(', ')}
                </p>
            ` : ''}
        </div>
    `).join('');
}

/**
 * Update contact information
 */
function updateContactInfo(contact) {
    if (contact.email) {
        const emailLink = document.getElementById('contactEmail');
        emailLink.textContent = contact.email;
        emailLink.href = `mailto:${contact.email}`;
    }
    
    if (contact.github) {
        const githubLink = document.getElementById('contactGithub');
        githubLink.textContent = contact.github.replace('https://github.com/', 'github.com/');
        githubLink.href = contact.github;
    }
    
    if (contact.linkedin) {
        const linkedinLink = document.getElementById('contactLinkedin');
        linkedinLink.textContent = contact.linkedin.replace('https://linkedin.com/in/', 'linkedin.com/in/');
        linkedinLink.href = contact.linkedin;
    }
}

// ==========================================
// CONTACT FORM HANDLING
// ==========================================

/**
 * Handle contact form submission (frontend only - no backend)
 * In a real scenario, you would integrate with a service like Formspree or EmailJS
 */
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        // Simulate form submission
        // TO INTEGRATE A REAL FORM SERVICE:
        // 1. Sign up for Formspree (https://formspree.io/) or EmailJS (https://www.emailjs.com/)
        // 2. Replace this simulation with actual API call
        // 3. Example with Formspree:
        //    fetch('https://formspree.io/f/YOUR_FORM_ID', {
        //        method: 'POST',
        //        headers: { 'Content-Type': 'application/json' },
        //        body: JSON.stringify(formData)
        //    })
        
        // Show success message (simulated)
        formMessage.className = 'form-message success';
        formMessage.textContent = 'Thank you for your message! I will get back to you soon.';
        
        // Reset form
        contactForm.reset();
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
        
        // Log form data to console (for demonstration)
        console.log('Form submitted:', formData);
    });
}

// ==========================================
// UTILITIES
// ==========================================

/**
 * Set current year in footer
 */
function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Intersection Observer for scroll animations
 * Adds fade-in effect to sections as they come into view
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// ==========================================
// INITIALIZE ON PAGE LOAD
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme first (before loading content)
    initializeTheme();
    
    // Load all dynamic content
    loadProfile();
    setCurrentYear();
    initScrollAnimations();
    
    console.log('Portfolio initialized successfully!');
    console.log('To update content, edit JSON files in the data/ folder');
});

// ==========================================
// ERROR HANDLING
// ==========================================

/**
 * Global error handler for fetch operations
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // You could display a user-friendly error message here
});