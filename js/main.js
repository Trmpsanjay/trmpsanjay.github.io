/**
 * Agentic AI Portfolio - Main JavaScript
 * Handles scroll animations, navigation, and micro-interactions
 */

(function() {
    'use strict';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const revealElements = document.querySelectorAll('.reveal');

    // ==========================================================================
    // Navbar Scroll Effect
    // ==========================================================================
    let lastScroll = 0;
    
    function handleNavbarScroll() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class based on scroll position
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }

    // ==========================================================================
    // Mobile Navigation Toggle
    // ==========================================================================
    function toggleMobileNav() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileNav() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ==========================================================================
    // Smooth Scroll for Navigation Links
    // ==========================================================================
    function handleNavLinkClick(e) {
        const href = this.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile nav if open
                closeMobileNav();
            }
        }
    }

    // ==========================================================================
    // Intersection Observer for Reveal Animations
    // ==========================================================================
    function createRevealObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
        
        return observer;
    }

    // ==========================================================================
    // Active Navigation Link Highlighting
    // ==========================================================================
    function highlightActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ==========================================================================
    // Typing Effect for Hero Title (Optional Enhancement)
    // ==========================================================================
    function initTypingEffect() {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (!heroSubtitle) return;
        
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        heroSubtitle.style.opacity = '1';
        
        let charIndex = 0;
        
        function type() {
            if (charIndex < text.length) {
                heroSubtitle.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(type, 50);
            }
        }
        
        // Start typing after reveal animation
        setTimeout(type, 800);
    }

    // ==========================================================================
    // Parallax Effect for Gradient Orbs
    // ==========================================================================
    function handleParallax() {
        const orbs = document.querySelectorAll('.gradient-orb');
        const scrolled = window.pageYOffset;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.1;
            const yPos = scrolled * speed;
            orb.style.transform = `translateY(${yPos}px)`;
        });
    }

    // ==========================================================================
    // Throttle Function for Performance
    // ==========================================================================
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ==========================================================================
    // Initialize
    // ==========================================================================
    function init() {
        // Initialize reveal observer
        createRevealObserver();
        
        // Event Listeners
        window.addEventListener('scroll', throttle(handleNavbarScroll, 10));
        window.addEventListener('scroll', throttle(highlightActiveNavLink, 100));
        window.addEventListener('scroll', throttle(handleParallax, 16));
        
        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileNav);
        }
        
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                closeMobileNav();
            }
        });

        // Handle escape key for mobile nav
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileNav();
            }
        });

        // Initial calls
        handleNavbarScroll();
        
        // Optional: Enable typing effect
        // initTypingEffect();
        
        console.log('🤖 Agentic AI Portfolio initialized');
    }

    // ==========================================================================
    // Run on DOM Ready
    // ==========================================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
