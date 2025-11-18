// Loader Animation
document.addEventListener('DOMContentLoaded', () => {
    const loaderText = document.getElementById('loader-text');
    const loaderBar = document.getElementById('loader-bar');
    const loader = document.getElementById('loader');
    const wrapper = loaderText ? loaderText.parentElement : null;
    const text =
        (wrapper && wrapper.getAttribute('data-text')) ||
        "Initializing Alfred Games System...";
    let i = 0;

    function hideLoader() {
        if (!loader) {
            document.body.classList.add('loaded');
            return;
        }

        if (window.anime) {
            window.anime({
                targets: '#loader',
                opacity: 0,
                duration: 500,
                complete: () => {
                    loader.style.display = 'none';
                    document.body.classList.add('loaded');
                }
            });
        } else {
            loader.style.opacity = 0;
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.classList.add('loaded');
            }, 500);
        }
    }

    function finishLoader() {
        if (!loaderBar) {
            hideLoader();
            return;
        }

        if (window.anime) {
            window.anime({
                targets: '#loader-bar',
                width: '100%',
                easing: 'easeInOutQuad',
                duration: 600,
                complete: hideLoader
            });
        } else {
            loaderBar.style.width = '100%';
            setTimeout(hideLoader, 600);
        }
    }

    function typeWriter() {
        if (!loaderText) {
            finishLoader();
            return;
        }

        if (i < text.length) {
            loaderText.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 20);
        } else {
            finishLoader();
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
if (gameSection) scoreObserver.observe(gameSection);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    if (window.scrollY > 50) {
        nav.classList.add('py-2');
        nav.classList.remove('p-4');
    } else {
        nav.classList.add('p-4');
        nav.classList.remove('py-2');
    }
});

// Game Info Modal logic (for legacy markup)
const openGameInfoBtn = document.getElementById('open-game-info');
const gameInfoModal = document.getElementById('game-info-modal');
const gameInfoPanel = document.getElementById('game-info-panel');
const closeGameInfoBtn = document.getElementById('close-game-info');

if (openGameInfoBtn && gameInfoModal && closeGameInfoBtn && gameInfoPanel) {
    const openGameInfo = () => {
        gameInfoModal.classList.remove('hidden');
        gameInfoModal.classList.add('flex');

        gameInfoModal.classList.add('modal-fade-in');
        gameInfoPanel.classList.add('panel-slide-in-right');

        gameInfoModal.addEventListener('animationend', () => {
            gameInfoModal.classList.remove('modal-fade-in');
        }, { once: true });

        gameInfoPanel.addEventListener('animationend', () => {
            gameInfoPanel.classList.remove('panel-slide-in-right');
        }, { once: true });
    };

    const closeGameInfo = () => {
        gameInfoModal.classList.remove('modal-fade-in');
        gameInfoPanel.classList.remove('panel-slide-in-right');
        gameInfoModal.classList.add('hidden');
        gameInfoModal.classList.remove('flex');
    };

    openGameInfoBtn.addEventListener('click', openGameInfo);
    closeGameInfoBtn.addEventListener('click', closeGameInfo);

    gameInfoModal.addEventListener('click', (e) => {
        if (e.target === gameInfoModal) {
            closeGameInfo();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !gameInfoModal.classList.contains('hidden')) {
            closeGameInfo();
        }
    });
}

// Neural Network Canvas Background
{
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w;
        let h;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        const mouse = { x: null, y: null };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y + window.scrollY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.baseColor = '#45A29E';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;

                if (mouse.x != null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (150 - distance) / 150;
                        const directionX = forceDirectionX * force * 2;
                        const directionY = forceDirectionY * force * 2;
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }

            draw() {
                ctx.fillStyle = this.baseColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const particleCount = Math.min(window.innerWidth / 10, 100);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(69, 162, 158, ${1 - distance / 100})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }
}

// Game Preview Simulation (Coin Catcher)
{
    const gameCanvas = document.getElementById('game-preview');
    if (gameCanvas) {
        const gCtx = gameCanvas.getContext('2d');
        let gW;
        let gH;
        let score = 0;
        const scoreEl = document.getElementById('game-score');

        function resizeGame() {
            const container = gameCanvas.parentElement;
            if (container) {
                gW = gameCanvas.width = container.clientWidth;
                gH = gameCanvas.height = container.clientHeight;
            }
        }

        window.addEventListener('resize', resizeGame);

        const player = { x: 50, y: 50, size: 20, speed: 4, color: '#00f0ff' };
        let coins = [];
        const particlesFx = [];

        function spawnCoin() {
            coins.push({
                x: Math.random() * (gW - 30) + 15,
                y: Math.random() * (gH - 30) + 15,
                radius: 6,
                color: '#fceebb'
            });
        }

        function createExplosion(x, y, color) {
            for (let i = 0; i < 8; i++) {
                particlesFx.push({
                    x,
                    y,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8,
                    life: 1,
                    color
                });
            }
        }

        function updateGame() {
            if (!gW) resizeGame();

            gCtx.fillStyle = '#111827';
            gCtx.fillRect(0, 0, gW, gH);

            gCtx.strokeStyle = '#1f2937';
            gCtx.lineWidth = 1;
            for (let x = 0; x < gW; x += 40) {
                gCtx.beginPath();
                gCtx.moveTo(x, 0);
                gCtx.lineTo(x, gH);
                gCtx.stroke();
            }
            for (let y = 0; y < gH; y += 40) {
                gCtx.beginPath();
                gCtx.moveTo(0, y);
                gCtx.lineTo(gW, y);
                gCtx.stroke();
            }

            if (coins.length === 0) spawnCoin();

            let target = coins[0];
            let minDst = Number.POSITIVE_INFINITY;

            coins.forEach((c) => {
                const d = Math.hypot(c.x - player.x, c.y - player.y);
                if (d < minDst) {
                    minDst = d;
                    target = c;
                }
            });

            if (target) {
                const dx = target.x - player.x;
                const dy = target.y - player.y;
                const angle = Math.atan2(dy, dx);
                player.x += Math.cos(angle) * player.speed;
                player.y += Math.sin(angle) * player.speed;
            }

            gCtx.shadowBlur = 15;
            gCtx.shadowColor = player.color;
            gCtx.fillStyle = player.color;
            gCtx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
            gCtx.shadowBlur = 0;

            coins.forEach((c, index) => {
                gCtx.beginPath();
                gCtx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
                gCtx.fillStyle = c.color;
                gCtx.shadowBlur = 10;
                gCtx.shadowColor = c.color;
                gCtx.fill();
                gCtx.shadowBlur = 0;

                const dist = Math.hypot(c.x - player.x, c.y - player.y);
                if (dist < player.size / 2 + c.radius) {
                    coins.splice(index, 1);
                    score += 100;
                    if (scoreEl) scoreEl.innerText = score.toString().padStart(4, '0');
                    createExplosion(c.x, c.y, c.color);
                    spawnCoin();
                    if (Math.random() > 0.7) spawnCoin();
                }
            });

            for (let i = particlesFx.length - 1; i >= 0; i--) {
                const p = particlesFx[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.05;
                gCtx.fillStyle = p.color;
                gCtx.globalAlpha = p.life;
                gCtx.fillRect(p.x, p.y, 3, 3);
                gCtx.globalAlpha = 1;
                if (p.life <= 0) particlesFx.splice(i, 1);
            }

            requestAnimationFrame(updateGame);
        }

        requestAnimationFrame(updateGame);
    }
}

// Mobile Menu Logic
{
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        if (!mobileMenu) return;
        const isHidden = mobileMenu.classList.contains('translate-x-full');
        if (isHidden) {
            mobileMenu.classList.remove('translate-x-full');
        } else {
            mobileMenu.classList.add('translate-x-full');
        }
    }

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach((link) => link.addEventListener('click', toggleMenu));
}

// 3D Tilt Effect (Philosophy Card)
{
    const card = document.getElementById('code-card');
    if (card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    }
}
