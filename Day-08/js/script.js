const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
    }
}

function setTheme(theme) {
    if (theme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.checked = false;
    });
});

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const successMessage = document.getElementById('success-message');

const validationRules = {
    name: {
        validate: (value) => value.trim().length >= 2,
        errorMsg: 'Name must be at least 2 characters long'
    },
    email: {
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        errorMsg: 'Please enter a valid email address'
    },
    message: {
        validate: (value) => value.trim().length >= 10,
        errorMsg: 'Message must be at least 10 characters long'
    }
};

function validateField(field) {
    const fieldName = field.name;
    const rule = validationRules[fieldName];
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (rule && !rule.validate(field.value)) {
        errorElement.textContent = rule.errorMsg;
        field.setAttribute('aria-invalid', 'true');
        return false;
    } else {
        errorElement.textContent = '';
        field.setAttribute('aria-invalid', 'false');
        return true;
    }
}

nameInput.addEventListener('blur', () => validateField(nameInput));
emailInput.addEventListener('blur', () => validateField(emailInput));
messageInput.addEventListener('blur', () => validateField(messageInput));

nameInput.addEventListener('input', () => {
    if (nameInput.getAttribute('aria-invalid') === 'true') {
        validateField(nameInput);
    }
});

emailInput.addEventListener('input', () => {
    if (emailInput.getAttribute('aria-invalid') === 'true') {
        validateField(emailInput);
    }
});

messageInput.addEventListener('input', () => {
    if (messageInput.getAttribute('aria-invalid') === 'true') {
        validateField(messageInput);
    }
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isNameValid = validateField(nameInput);
    const isEmailValid = validateField(emailInput);
    const isMessageValid = validateField(messageInput);
    
    if (isNameValid && isEmailValid && isMessageValid) {
        showSuccessMessage();
        contactForm.reset();
        
        console.log('Form submitted:', {
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value
        });
    }
});

function showSuccessMessage() {
    successMessage.textContent = '✓ Message sent successfully! Thank you for reaching out.';
    successMessage.classList.add('show');
    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section, article').forEach(element => {
    observer.observe(element);
});

const skillCards = document.querySelectorAll('.skill-card');

skillCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        skillCards.forEach(c => {
            if (c !== card) {
                c.style.opacity = '0.6';
            }
        });
    });
    
    card.addEventListener('mouseleave', () => {
        skillCards.forEach(c => {
            c.style.opacity = '1';
        });
    });
});

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.zIndex = '10';
    });
});

function animateProficiencyBars() {
    const bars = document.querySelectorAll('.proficiency-bar');
    
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                
                entry.target.offsetHeight;
                entry.target.style.width = width;
                
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    bars.forEach(bar => barObserver.observe(bar));
}

window.addEventListener('load', animateProficiencyBars);

const createScrollToTop = () => {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollButton);
    
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 99;
            transition: all 250ms ease-in-out;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
        
        .scroll-to-top.show {
            display: flex;
        }
        
        .scroll-to-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
        }
        
        @media (max-width: 768px) {
            .scroll-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
                font-size: 20px;
            }
        }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('show');
        } else {
            scrollButton.classList.remove('show');
        }
    });
    
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

window.addEventListener('DOMContentLoaded', createScrollToTop);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navToggle.checked = false;
    }
});

if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    
    document.body.classList.remove('loading');
    
    console.log('Portfolio website initialized successfully');
});

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
