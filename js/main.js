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
    // Smooth Flight-like Scroll Animation
    // ==========================================================================
    
    // Custom easing function for smooth flight effect
    function easeInOutCubic(t) {
        return t < 0.5 
            ? 4 * t * t * t 
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    // Smooth scroll with custom easing
    function smoothScrollTo(targetPosition, duration = 1200) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
    
    // Landing effect - highlight section when arrived
    function addLandingEffect(target) {
        // Add landing class for visual feedback
        target.classList.add('section-landing');
        
        // Create ripple effect element
        const ripple = document.createElement('div');
        ripple.className = 'landing-ripple';
        target.appendChild(ripple);
        
        // Remove effects after animation
        setTimeout(() => {
            target.classList.remove('section-landing');
            ripple.remove();
        }, 1000);
    }
    
    function handleNavLinkClick(e) {
        const href = this.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                // Add flying class to body for potential effects
                document.body.classList.add('is-scrolling');
                
                // Smooth flight scroll
                smoothScrollTo(offsetTop, 1000);
                
                // Add landing effect after scroll completes
                setTimeout(() => {
                    document.body.classList.remove('is-scrolling');
                    addLandingEffect(target);
                }, 1000);
                
                // Close mobile nav if open
                closeMobileNav();
                
                // Update URL hash without jumping
                history.pushState(null, null, href);
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
    // Role Cycler - Typing Animation for AI Specializations
    // ==========================================================================
    const roles = [
        'Agentic AI Systems',
        'Multi-Agent Workflows',
        'RAG Pipelines',
        'LLM-Powered Automation',
        'Autonomous Decision Engines',
        'AI Orchestration Platforms',
        'Intelligent Chatbots',
        'Enterprise AI Solutions',
        'Real-time Tool Calling',
        'GenAI Applications'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeRole() {
        const roleCycler = document.getElementById('role-cycler');
        if (!roleCycler) return;

        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Deleting characters
            roleCycler.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            // Typing characters
            roleCycler.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        // Check if word is complete
        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at end of word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Move to next word
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(typeRole, typingSpeed);
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
        
        let charIdx = 0;
        
        function type() {
            if (charIdx < text.length) {
                heroSubtitle.textContent += text.charAt(charIdx);
                charIdx++;
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
        
        // Also apply smooth scroll to all internal anchor links (CTA buttons, etc.)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            if (!anchor.classList.contains('nav-link')) {
                anchor.addEventListener('click', handleNavLinkClick);
            }
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
        
        // Start role cycler animation after a short delay
        setTimeout(typeRole, 1500);
        
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
