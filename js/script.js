document.addEventListener('DOMContentLoaded', () => {

    // ===== Animated Mesh Background (index page only) =====
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles, animId;

        function resize() {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        }

        function createParticles() {
            const count = Math.min(60, Math.floor((width * height) / 15000));
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    r: Math.random() * 2 + 1,
                    color: Math.random() > 0.5
                        ? `rgba(108, 92, 231, ${Math.random() * 0.4 + 0.1})`
                        : `rgba(0, 206, 201, ${Math.random() * 0.3 + 0.1})`,
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(108, 92, 231, ${0.06 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            animId = requestAnimationFrame(draw);
        }

        resize();
        createParticles();
        draw();

        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });

        const heroObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                if (!animId) draw();
            } else {
                cancelAnimationFrame(animId);
                animId = null;
            }
        }, { threshold: 0 });
        heroObserver.observe(canvas);
    }

    // ===== Cursor Glow =====
    const glow = document.getElementById('cursorGlow');
    if (glow && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }

    // ===== Navigation =====
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navMobile = document.getElementById('navMobile');

    if (nav && !document.body.classList.contains('page-body')) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    if (navToggle && navMobile) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMobile.classList.toggle('open');
        });

        document.querySelectorAll('.nav-mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMobile.classList.remove('open');
            });
        });
    }

    // ===== Scroll Reveal =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        revealObserver.observe(el);
    });

    // ===== Travel Gallery =====
    const travelGrid = document.getElementById('travelGrid');
    const travelToggle = document.getElementById('travelToggle');
    if (travelGrid && travelToggle) {
        const toggleText = travelToggle.querySelector('span');
        travelToggle.addEventListener('click', () => {
            const expanded = travelToggle.getAttribute('aria-expanded') === 'true';
            travelToggle.setAttribute('aria-expanded', String(!expanded));
            travelGrid.classList.toggle('expanded', !expanded);
            toggleText.textContent = expanded ? 'View all 19 photos' : 'Show selected photos';
        });
    }

    const lightbox = document.getElementById('photoLightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('img');
        const lightboxCaption = lightbox.querySelector('figcaption');
        const closeButton = lightbox.querySelector('.photo-lightbox-close');

        document.querySelectorAll('.travel-photo').forEach(photo => {
            photo.addEventListener('click', () => {
                const thumbnail = photo.querySelector('img');
                lightboxImage.src = photo.dataset.full;
                lightboxImage.alt = thumbnail.alt;
                lightboxCaption.textContent = photo.dataset.caption;
                lightbox.showModal();
            });
        });

        closeButton.addEventListener('click', () => lightbox.close());
        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) lightbox.close();
        });
    }
});
