// ============================================
// CIONA TECH LLC - 3D EXPERIENCE ENGINE
// ============================================

// Global Variables
let scene, camera, renderer;
let particles, particleSystem;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let scrollProgress = 0;
let sections = [];

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initThreeJS();
    initParticles();
    initScrollTracking();
    initNavigation();
    initDynamicText();
    initStatsCounter();
    initServiceCards();
    initFAQ();
    initContactForm();
    initSmoothScroll();
    animate();
});

// Loading Screen
function initLoader() {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 2500);
}

// Three.js Setup
function initThreeJS() {
    const canvas = document.getElementById('webgl-canvas');
    
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.002);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x00ff88, 2, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x00d4ff, 2, 50);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);
    
    // Handle Resize
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
}

// Particle System
function initParticles() {
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 100;
        positions[i + 2] = (Math.random() - 0.5) * 100;
        
        // Neon green to blue gradient
        const colorType = Math.random();
        if (colorType > 0.6) {
            colors[i] = 0;     // R
            colors[i + 1] = 1; // G
            colors[i + 2] = 0.5; // B
        } else if (colorType > 0.3) {
            colors[i] = 0;
            colors[i + 1] = 0.8;
            colors[i + 2] = 1;
        } else {
            colors[i] = 0.5;
            colors[i + 1] = 0.2;
            colors[i + 2] = 1;
        }
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

// Window Resize Handler
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Mouse Move Handler
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
    
    // Update service card glow effect
    updateServiceCardGlow(event);
}

// Update Service Card Glow
function updateServiceCardGlow(event) {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    });
}

// Scroll Tracking
function initScrollTracking() {
    sections = document.querySelectorAll('.section');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = scrollY / maxScroll;
        
        // Update navbar
        const navbar = document.querySelector('.navbar');
        if (scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink(scrollY);
        
        // Animate elements on scroll
        animateOnScroll();
    });
}

// Update Active Nav Link
function updateActiveNavLink(scrollY) {
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Animate Elements on Scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .case-study-card, .testimonial-card, .pricing-card, .process-step');
    
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.8) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
}

// Navigation
function initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
    
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Dynamic Text Rotation
function initDynamicText() {
    const words = document.querySelectorAll('.dynamic-words .word');
    let currentIndex = 0;
    
    setInterval(() => {
        words[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % words.length;
        words[currentIndex].classList.add('active');
    }, 2000);
}

// Stats Counter Animation
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + range * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Service Cards Interaction
function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cards.forEach(c => {
                if (c !== card) {
                    c.style.opacity = '0.5';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            cards.forEach(c => {
                c.style.opacity = '1';
            });
        });
        
        card.addEventListener('click', () => {
            const service = card.getAttribute('data-service');
            // Could navigate to service detail page or show modal
            console.log('Service clicked:', service);
        });
    });
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show success message
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>MESSAGE SENT! ✓</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            form.reset();
        }, 3000);
        
        console.log('Form submitted:', data);
    });
}

// Smooth Scroll
function initSmoothScroll() {
    const buttons = document.querySelectorAll('button[href^="#"], .btn-primary, .cta-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href') || btn.closest('a')?.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Particle animation
    if (particleSystem) {
        particleSystem.rotation.y += 0.0005;
        particleSystem.rotation.x += 0.0002;
        
        // Gentle wave motion
        const time = Date.now() * 0.0001;
        particleSystem.position.y = Math.sin(time) * 0.5;
    }
    
    // Camera parallax based on mouse
    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;
    
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Camera movement based on scroll
    camera.position.z = 5 - scrollProgress * 2;
    
    renderer.render(scene, camera);
}

// Add floating animation to elements
function addFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.hologram, .hero-badge');
    
    floatingElements.forEach((el, index) => {
        const delay = index * 0.2;
        el.style.animation = `float 3s ease-in-out ${delay}s infinite`;
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .case-study-card, .testimonial-card, .pricing-card, .process-step');
    animatedElements.forEach(el => animationObserver.observe(el));
});

// Add gradient definition for SVG
function addSVGGradient() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.style.display = 'none';
    
    const defs = document.createElementNS(svgNS, "defs");
    const gradient = document.createElementNS(svgNS, "linearGradient");
    gradient.id = "gradient";
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "100%");
    gradient.setAttribute("y2", "100%");
    
    const stop1 = document.createElementNS(svgNS, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#00ff88");
    
    const stop2 = document.createElementNS(svgNS, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#00d4ff");
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);
    document.body.appendChild(svg);
}

// Initialize SVG gradient
addSVGGradient();

// Performance optimization - reduce particles on mobile
if (window.innerWidth < 768) {
    // Could reduce particle count or simplify effects
    console.log('Mobile detected - optimized effects');
}

// Add loaded class to body when everything is ready
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Console Easter Egg
console.log('%c CIONA TECH LLC ', 'background: linear-gradient(135deg, #00ff88, #00d4ff); color: #0a0a0f; font-size: 24px; font-weight: bold; padding: 10px 20px;');
console.log('%c Engineering Growth Through Digital Excellence ', 'color: #00ff88; font-size: 14px;');
console.log('%c Ready to scale? Contact us at info@cionatech.com ', 'color: #00d4ff; font-size: 12px;');
