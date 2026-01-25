/**
 * MAIN.JS - Core Portfolio Functionality
 * Handles navigation, profile loading, and general interactions
 */

// ==========================================
// INITIALIZE ON PAGE LOAD - MOVED TO TOP
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio initializing...');
    
    // Initialize theme FIRST
    initializeTheme();
    
    // Initialize navigation
    initNavigation();
    
    // Load all dynamic content
    loadProfile();
    setCurrentYear();
    initScrollAnimations();
    initContactForm();
    
    console.log('✅ Portfolio initialized successfully!');
    console.log('To update content, edit JSON files in the data/ folder');
});

// ==========================================
// DARK MODE / LIGHT MODE TOGGLE
// ==========================================

function initializeTheme() {
    console.log('Initializing theme system...');
    
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;
    
    // Check if elements exist
    if (!themeToggle) {
        console.error('❌ Theme toggle button not found!');
        return;
    }
    
    if (!themeIcon) {
        console.error('❌ Theme icon not found!');
        return;
    }
    
    console.log('✅ Theme toggle elements found');
    
    // Function to set theme
    function setTheme(theme) {
        console.log('Setting theme to:', theme);
        
        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            html.setAttribute('data-theme', 'light');
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        }
        
        console.log('✅ Theme set to:', theme);
        console.log('Current data-theme attribute:', html.getAttribute('data-theme'));
    }
    
    // Function to toggle theme
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        console.log('🌓 Toggling theme from', currentTheme, 'to', newTheme);
        setTheme(newTheme);
    }
    
    // Add click event listener
    themeToggle.addEventListener('click', function(e) {
        console.log('🖱️ Theme button clicked!');
        e.preventDefault();
        toggleTheme();
    });
    
    console.log('✅ Theme toggle event listener added');
    
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        console.log('Found saved theme:', savedTheme);
        setTheme(savedTheme);
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('System prefers dark mode:', prefersDark);
        setTheme(prefersDark ? 'dark' : 'light');
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// ==========================================
// NAVIGATION & MOBILE MENU
// ==========================================

function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
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
}

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
    
    educationContent.innerHTML = education.map((edu, index) => `
        <div class="education-item" style="animation-delay: ${index * 0.1}s">
            <div class="education-header">
                <div>
                    <h3 class="education-degree">${edu.degree}</h3>
                    <p class="education-institution">
                        <i class="fas fa-university"></i> ${edu.institution}
                    </p>
                </div>
                <div class="education-meta">
                    <p class="education-year">
                        <i class="far fa-calendar"></i> ${edu.year}
                    </p>
                    ${edu.location ? `
                        <p class="education-location">
                            <i class="fas fa-map-marker-alt"></i> ${edu.location}
                        </p>
                    ` : ''}
                    ${edu.gpa ? `
                        <p class="education-gpa">
                            <i class="fas fa-star"></i> GPA: ${edu.gpa}
                        </p>
                    ` : ''}
                </div>
            </div>
            
            ${edu.coursework && edu.coursework.length > 0 ? `
                <div class="education-details">
                    <h4><i class="fas fa-book"></i> Relevant Coursework</h4>
                    <div class="coursework-tags">
                        ${edu.coursework.map(course => `
                            <span class="coursework-tag">${course}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${edu.achievements && edu.achievements.length > 0 ? `
                <div class="education-details">
                    <h4><i class="fas fa-trophy"></i> Achievements</h4>
                    <ul class="achievements-list">
                        ${edu.achievements.map(achievement => `
                            <li>${achievement}</li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `).join('');
    
    console.log(`Loaded ${education.length} education entries`);
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
// CONTACT FORM HANDLING - WITH FORMSPREE
// ==========================================

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            try {
                // Send to Formspree
                const response = await fetch('https://formspree.io/f/mgoagvqo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    // Success!
                    formMessage.className = 'form-message success';
                    formMessage.textContent = '✅ Thank you! Your message has been sent successfully. I\'ll get back to you soon!';
                    
                    // Reset form
                    contactForm.reset();
                    
                    console.log('✅ Email sent successfully via Formspree!');
                } else {
                    throw new Error('Form submission failed');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                formMessage.className = 'form-message error';
                formMessage.textContent = '❌ Oops! Something went wrong. Please try again or email me directly.';
            } finally {
                // Restore button
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        });
    }
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
// ERROR HANDLING
// ==========================================

/**
 * Global error handler for fetch operations
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});