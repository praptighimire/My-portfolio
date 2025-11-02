// Navigation functionality
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
        // For external links like contact.html, allow default navigation

        // Close mobile menu
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    }
});

// Fetch GitHub repos and populate projects
async function fetchRepos() {
    try {
        const response = await fetch('https://api.github.com/users/praptighimire/repos?sort=updated&per_page=100');
        const repos = await response.json();

        // Filter out repos with "chatbot" or "project" in the name
        const filteredRepos = repos.filter(repo =>
            !repo.name.toLowerCase().includes('chatbot') &&
            !repo.name.toLowerCase().includes('project')
        );

        displayProjects(filteredRepos);
    } catch (error) {
        console.error('Error fetching repos:', error);
        const projectGrid = document.getElementById('project-grid');
        if (projectGrid) {
            projectGrid.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
        }
    }
}

// Display projects in the grid
function displayProjects(repos) {
    const projectGrid = document.getElementById('project-grid');
    if (!projectGrid) return;

    projectGrid.innerHTML = '';

    repos.forEach(repo => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || 'No description available'}</p>
            <div class="meta">
                <span>${repo.language || 'N/A'}</span>
                <span>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</span>
            </div>
        `;

        projectCard.addEventListener('click', () => openModal(repo));
        projectGrid.appendChild(projectCard);
    });
}

// Filter projects by language
function filterProjects(language) {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        const lang = card.querySelector('.meta span:first-child').textContent;
        if (language === 'all' || lang === language) {
            card.style.display = 'block';
        } else if (language === 'Digital Marketing') {
            // Open PDF for Digital Marketing
            window.open('Prapti Portfolio_compressed_250714_142435.pdf', '_blank');
            // Reset filter to 'all'
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.filter-btn[data-language="all"]').classList.add('active');
            filterProjects('all');
        } else {
            card.style.display = 'none';
        }
    });
}

// Open work modal when "View My Work" is clicked
function openWorkModal() {
    const modal = document.getElementById('work-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Close work modal
function closeWorkModal() {
    const modal = document.getElementById('work-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const workModal = document.getElementById('work-modal');
    if (e.target === workModal) {
        closeWorkModal();
    }
});

// Open modal with project details
function openModal(repo) {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalLanguage = document.getElementById('modal-language');
    const modalStars = document.getElementById('modal-stars');
    const modalForks = document.getElementById('modal-forks');
    const modalLink = document.getElementById('modal-link');

    if (modal && modalTitle && modalDescription && modalLanguage && modalStars && modalForks && modalLink) {
        modalTitle.textContent = repo.name;
        modalDescription.textContent = repo.description || 'No description available';
        modalLanguage.textContent = repo.language || 'N/A';
        modalStars.textContent = repo.stargazers_count;
        modalForks.textContent = repo.forks_count;
        modalLink.href = repo.html_url;

        modal.style.display = 'block';
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Contact form handling
function handleContactForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Basic form validation
    if (!data.name || !data.email || !data.message) {
        alert('Please fill in all required fields.');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Here you would typically send the data to a server
    // For now, we'll just show a success message
    alert('Thank you for your message! I will get back to you soon.');
    e.target.reset();
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage || (currentPage === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Fetch repos if on projects page
    if (document.getElementById('project-grid')) {
        fetchRepos();
    }

    // Filter button event listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProjects(btn.dataset.language);
        });
    });

    // Modal close event listeners
    const modal = document.getElementById('project-modal');
    if (modal) {
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Add animation observers
    const animateElements = document.querySelectorAll('.project-card, .skill-item, .about-text, .contact-form, .contact-info');
    animateElements.forEach(el => observer.observe(el));

    // Typing effect for hero description
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) {
        const text = heroDescription.textContent;
        heroDescription.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                heroDescription.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }

        setTimeout(typeWriter, 1000);
    }

    // Removed parallax effect to prevent hero buttons from being hidden on scroll

    // Smooth reveal animations
    const revealElements = document.querySelectorAll('.about-section, .projects-section, .contact-section');
    revealElements.forEach(el => observer.observe(el));
});
