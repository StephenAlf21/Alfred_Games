// Loader Animation
document.addEventListener('DOMContentLoaded', () => {
    const text = "Initializing Alfred Games System...";
    const loaderText = document.getElementById('loader-text');
    const loaderBar = document.getElementById('loader-bar');
    const loader = document.getElementById('loader');
    let i = 0;

    // Typing effect
    function typeWriter() {
        if (i < text.length) {
            loaderText.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 30);
        } else {
            // Fill bar
            loaderBar.style.width = '100%';
            setTimeout(() => {
                // Fade out loader
                loader.style.opacity = 0;
                setTimeout(() => {
                    loader.style.display = 'none';
                    document.body.classList.add('loaded');
                }, 500);
            }, 800);
        }
    }

    typeWriter();
});

// Score counter animation logic (Simulated)
const scoreObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = document.querySelector('.count-up');
            if (el) {
                let score = 0;
                const interval = setInterval(() => {
                    score += 125;
                    if (score >= 12500) {
                        score = 12500;
                        clearInterval(interval);
                    }
                    el.innerHTML = score.toString().padStart(4, '0');
                }, 20);
            }
            scoreObserver.unobserve(entry.target);
        }
    });
});

const gameSection = document.querySelector('.game-scene');
if(gameSection) scoreObserver.observe(gameSection);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('py-2');
        nav.classList.remove('p-4');
    } else {
        nav.classList.add('p-4');
        nav.classList.remove('py-2');
    }
});