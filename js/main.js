// NEONpulseTechshop - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Generate Hydraulic Pipes Background (from reference)
    const hydraulicBackground = document.getElementById('hydraulic-background');
    const pipesCount = 12;
    
    // Create horizontal pipes
    for (let i = 0; i < pipesCount; i++) {
        const pipe = document.createElement('div');
        pipe.className = 'pipe pipe-horizontal';
        pipe.style.top = `${Math.random() * 100}%`;
        pipe.style.left = '0';
        pipe.style.width = `${Math.random() * 30 + 20}%`;
        hydraulicBackground.appendChild(pipe);
        
        // Add connector
        const connector = document.createElement('div');
        connector.className = 'connector';
        connector.style.top = '-5px';
        connector.style.right = '-10px';
        pipe.appendChild(connector);
    }
    
    // Create vertical pipes
    for (let i = 0; i < pipesCount; i++) {
        const pipe = document.createElement('div');
        pipe.className = 'pipe pipe-vertical';
        pipe.style.left = `${Math.random() * 100}%`;
        pipe.style.top = '0';
        pipe.style.height = `${Math.random() * 30 + 20}%`;
        hydraulicBackground.appendChild(pipe);
        
        // Add connector
        const connector = document.createElement('div');
        connector.className = 'connector';
        connector.style.left = '-5px';
        connector.style.bottom = '-10px';
        pipe.appendChild(connector);
    }
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
    
    // Add active class to current page nav link
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (linkPath === currentLocation || 
            (currentLocation.includes(linkPath) && linkPath !== '/')) {
            link.classList.add('active');
        }
    });
    
    // Animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    
    // Run once on load
    animateOnScroll();
});