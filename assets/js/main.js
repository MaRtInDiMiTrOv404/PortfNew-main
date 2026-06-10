// Меню: показване/скриване
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        navToggle.setAttribute('aria-expanded', navMenu.classList.contains('show'));
    });

    // Затваряне при клик върху overlay (тъмната зона)
    navMenu.addEventListener('click', (e) => {
        if (e.target === navMenu) {
            navMenu.classList.remove('show');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Затваряне на менюто при избор на линк (мобилно)
document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('show');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Активен линк при скрол с debounce
const sections = document.querySelectorAll('section[id]');
let scrollTimeout;
function scrollActive() {
    const scrollY = window.scrollY;
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 58;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']');
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active-link');
            } else {
                navLink.classList.remove('active-link');
            }
        }
    });
}
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(scrollActive, 50);
});

// ScrollReveal анимации
if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
        origin: 'top',
        distance: '60px',
        duration: 600,
        delay: 80,
        reset: false
    });
    sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text', {});
    sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img', { delay: 200 });
    sr.reveal('.home__social-icon', { interval: 200 });
    sr.reveal('.skills__data, .work__img, .contact__input', { interval: 120 });
}

// Тема: светла / тъмна с локално запазване
const themeToggleButton = document.getElementById('theme-toggle');
const darkThemeClass = 'dark-theme';
const selectedTheme = localStorage.getItem('selected-theme');

const getCurrentTheme = () =>
    document.body.classList.contains(darkThemeClass) ? 'dark' : 'light';

if (selectedTheme) {
    if (selectedTheme === 'dark') {
        document.body.classList.add(darkThemeClass);
    } else {
        document.body.classList.remove(darkThemeClass);
    }
}

if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle(darkThemeClass);
        localStorage.setItem('selected-theme', getCurrentTheme());
    });
}


