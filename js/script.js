/* ===== HERO SECTION FUNCTIONALITY ===== */

// Smooth scroll to section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Animated counter for stats
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// Initialize counters when they come into view
const observerOptions = {
  threshold: 0.5,
  rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
      const target = parseInt(entry.target.dataset.target);
      animateCounter(entry.target, target);
      entry.target.classList.add('animated');
    }
  });
}, observerOptions);

// Observe all stat numbers
document.addEventListener('DOMContentLoaded', function() {
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(number => {
    counterObserver.observe(number);
  });
});

/* ===== INTERACTIVE 3D CUBE ===== */
const heroCube = document.getElementById("heroCube");
const cubeContainer = document.querySelector(".cube-container");

if (heroCube && cubeContainer) {
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  
  cubeContainer.addEventListener("mousemove", (e) => {
    const rect = cubeContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX = (e.clientX - centerX) / 20;
    mouseY = (e.clientY - centerY) / 20;
  });
  
  cubeContainer.addEventListener("mouseleave", () => {
    mouseX = 0;
    mouseY = 0;
  });
  
  function animateCube() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;
    
    heroCube.style.transform = `
      rotateX(${-15 + currentY}deg) 
      rotateY(${currentX}deg)
    `;
    
    requestAnimationFrame(animateCube);
  }
  
  // Override the CSS animation when hovering
  cubeContainer.addEventListener("mouseenter", () => {
    heroCube.style.animation = "none";
    animateCube();
  });
  
  cubeContainer.addEventListener("mouseleave", () => {
    heroCube.style.animation = "rotateGlass 15s infinite linear";
  });
}

/* ===== CONTACT FORM FUNCTIONALITY ===== */
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const message = formData.get('message');
      
      // Basic validation
      if (!name || !email || !phone || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }
      
      // Phone validation (basic)
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(phone) || phone.length < 10) {
        showNotification('Please enter a valid phone number', 'error');
        return;
      }
      
      // Show loading state
      const submitBtn = contactForm.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.classList.add('loading');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Simulate form submission (replace with actual backend logic)
      setTimeout(() => {
        // Create mailto link
        const subject = encodeURIComponent('New Contact Form Submission');
        const body = encodeURIComponent(
          `Name: ${name}\n` +
          `Email: ${email}\n` +
          `Phone: ${phone}\n\n` +
          `Message:\n${message}`
        );
        
        const mailtoLink = `mailto:devcubetech@gmail.com?subject=${subject}&body=${body}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Reset form
        contactForm.reset();
        
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Message sent successfully! Your email client has been opened.', 'success');
      }, 1500);
    });
  }
});

/* ===== NOTIFICATION SYSTEM ===== */
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#4444ff'};
    color: white;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 5000);
}

document.addEventListener('DOMContentLoaded', function () {
  const monoForm = document.getElementById('monochromeContactForm');
  if (monoForm) {
    monoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('.contact-btn');
      const successMsg = document.getElementById('successMsg');

      btn.textContent = 'SENDING…';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = 'SENT ✓';
        successMsg.style.display = 'block';

        // reset fields
        this.reset();

        // after 2.5 sec revert button & hide message
        setTimeout(() => {
          btn.textContent = 'SEND MESSAGE';
          btn.disabled = false;
          successMsg.style.display = 'none';
        }, 2200);
      }, 1000);
    });
  }
});
