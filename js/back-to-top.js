/**
 * NEONpulseTechshop - Back to Top Button
 * 
 * This script adds a back-to-top button that appears when the user scrolls
 * down the page and smoothly scrolls back to the top when clicked.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create the back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top';
    backToTopButton.innerHTML = '<span class="arrow-up">↑</span>';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    backToTopButton.setAttribute('title', 'Back to top');
    document.body.appendChild(backToTopButton);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', function() {
        // For Safari compatibility
        const scrollToTop = () => {
            const c = document.documentElement.scrollTop || document.body.scrollTop;
            if (c > 0) {
                window.requestAnimationFrame(scrollToTop);
                window.scrollTo(0, c - c / 8);
            }
        };
        
        // Scroll back to top
        window.requestAnimationFrame(scrollToTop);
    });
});