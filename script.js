/* ===================================================================
   MEHEDUL PORTFOLIO — main script
   Vanilla JS + GSAP + ScrollTrigger + Lenis
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ------------------------------------------------------------
     1. LOADER
  ------------------------------------------------------------ */
  const loader = document.getElementById('loader');
  const loaderPercent = document.getElementById('loaderPercent');
  const loaderFill = document.getElementById('loaderFill');
  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initScrollAnimations();
        initTimeline();
      }, 300);
    }
    loaderPercent.textContent = progress;
    loaderFill.style.width = progress + '%';
  }, 120);
  document.body.style.overflow = 'hidden';

  /* ------------------------------------------------------------
     2. LENIS SMOOTH SCROLL + GSAP TICKER
  ------------------------------------------------------------ */
  let lenis;
  if (!prefersReducedMotion && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.gsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  // anchor links respect lenis
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          if (lenis) lenis.scrollTo(target, { offset: -20 });
          else target.scrollIntoView({ behavior: 'smooth' });
          document.getElementById('navMobile').classList.remove('open');
        }
      }
    });
  });

  /* ------------------------------------------------------------
     3. CUSTOM CURSOR
  ------------------------------------------------------------ */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if (window.matchMedia('(hover:hover)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top = my + 'px';
    });
    function ringLoop() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top = ry + 'px';
      requestAnimationFrame(ringLoop);
    }
    ringLoop();

    document.querySelectorAll('a, button, .project-card, [data-magnetic]').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  /* ------------------------------------------------------------
     4. MAGNETIC BUTTONS
  ------------------------------------------------------------ */
  if (!prefersReducedMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: x * 0.3, y: y * 0.4, duration: 0.4, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
      });
    });
  }

  /* ------------------------------------------------------------
     5. NAVBAR SCROLL STATE + MOBILE TOGGLE
  ------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
  document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navMobile').classList.toggle('open');
  });

  /* ------------------------------------------------------------
     6. SCRUB PROGRESS BAR (styled as video timeline scrubber)
  ------------------------------------------------------------ */
  const scrubFill = document.getElementById('scrubFill');
  const scrubPlayhead = document.getElementById('scrubPlayhead');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    scrubFill.style.width = pct + '%';
    scrubPlayhead.style.left = pct + '%';
  });

  /* ------------------------------------------------------------
     7. HERO ROLE ROTATOR
  ------------------------------------------------------------ */
  const roles = ['Video Editor', 'Motion Graphics Artist', 'Creative Storyteller'];
  const roleEl = document.getElementById('roleText');
  let roleIndex = 0;
  function cycleRole() {
    roleIndex = (roleIndex + 1) % roles.length;
    if (window.gsap) {
      gsap.to(roleEl, {
        opacity: 0, y: -10, duration: 0.35, onComplete: () => {
          roleEl.textContent = roles[roleIndex];
          gsap.fromTo(roleEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 });
        }
      });
    } else {
      roleEl.textContent = roles[roleIndex];
    }
  }
  setInterval(cycleRole, 2600);

  /* ------------------------------------------------------------
     8. HERO PARTICLES CANVAS
  ------------------------------------------------------------ */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  function initParticles() {
    resizeCanvas();
    const count = window.innerWidth < 768 ? 30 : 60;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      o: Math.random() * 0.5 + 0.15
    }));
  }
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(183,148,246,${p.o})`;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  initParticles();
  if (!prefersReducedMotion) drawParticles();
  window.addEventListener('resize', initParticles);

  /* ------------------------------------------------------------
     9. MOUSE PARALLAX ON HERO GLOWS
  ------------------------------------------------------------ */
  const glowA = document.getElementById('glowA');
  const glowB = document.getElementById('glowB');
  if (!prefersReducedMotion) {
    window.addEventListener('mousemove', (e) => {
      const px = (e.clientX / window.innerWidth - 0.5);
      const py = (e.clientY / window.innerHeight - 0.5);
      gsap.to(glowA, { x: px * 40, y: py * 40, duration: 1.2, ease: 'power2.out' });
      gsap.to(glowB, { x: px * -40, y: py * -40, duration: 1.2, ease: 'power2.out' });
    });
  }

  /* ------------------------------------------------------------
     10. PORTFOLIO DATA + RENDER
  ------------------------------------------------------------ */
  const projects = [
    { cat: 'commercial', label: 'Commercial', title: 'Nova Skincare — Launch Film', desc: '60s product launch ad built around light, texture, and a single confident cut.', grad: 'linear-gradient(135deg,#3a1c5e,#161022)', youtube: 'KPsSlEsVcsc' },
    { cat: 'youtube', label: 'YouTube', title: 'Tech Deep Dive: Flagship Review', desc: 'A 14-minute retention-optimized review with chaptered pacing and B-roll layering.', grad: 'linear-gradient(135deg,#1c3a5e,#0f1622)', youtube: 'DIe6Vq6J4RU' },
    { cat: 'motion', label: 'Motion Graphics', title: 'Aurora Studios — Logo Reveal', desc: 'Kinetic identity animation for a studio rebrand, built frame-by-frame in After Effects.', grad: 'linear-gradient(135deg,#5e1c46,#22101a)', youtube: 'tCwwrIIyo8M' },
    { cat: 'reels', label: 'Reels', title: 'Behind the Beat — Artist Reel', desc: 'A day-in-the-life reel for a recording artist, cut to the drop for maximum replay value.', grad: 'linear-gradient(135deg,#1c5e3a,#0f2216)', youtube: 'dQw4w9WgXcQ' },
    { cat: 'shorts', label: 'Shorts', title: 'The 3-Second Hook — Coffee Co.', desc: 'A short-form ad engineered to earn attention before the thumb can scroll past.', grad: 'linear-gradient(135deg,#5e4a1c,#221b0f)', youtube: 'dQw4w9WgXcQ' },
    { cat: 'commercial', label: 'Commercial', title: 'Vertex Fitness — Brand Film', desc: 'High-contrast commercial edit pairing gym footage with a driving sound design pass.', grad: 'linear-gradient(135deg,#241c5e,#100f22)', youtube: 'dQw4w9WgXcQ' },
    { cat: 'youtube', label: 'YouTube', title: 'Founder Story: Orbit Co.', desc: 'A founder interview woven with archival footage and motion-graphic data overlays.', grad: 'linear-gradient(135deg,#5e1c1c,#220f0f)', youtube: 'dQw4w9WgXcQ' },
    { cat: 'motion', label: 'Motion Graphics', title: 'Lumen — Explainer Animation', desc: 'A 90-second animated explainer translating a technical product into plain motion.', grad: 'linear-gradient(135deg,#1c4a5e,#0f1a22)', youtube: 'dQw4w9WgXcQ' },
    { cat: 'reels', label: 'Reels', title: 'Halo Skincare — Routine Reel', desc: 'A calm, ASMR-adjacent routine reel edited for long watch-through on Instagram.', grad: 'linear-gradient(135deg,#3a5e1c,#16220f)', youtube: 'dQw4w9WgXcQ' },
  ];

  const grid = document.getElementById('portfolioGrid');
  function playIconSVG() {
    return '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  }
  projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal-up';
    card.dataset.filter = p.cat;
    card.innerHTML = `
      <div class="thumb" style="--grad:${p.grad}"></div>
      <button class="play-btn" aria-label="Play preview">${playIconSVG()}</button>
      <div class="project-card-inner">
        <span class="project-cat">${p.label}</span>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </div>
    `;
    card.addEventListener('click', () => openModal(p));
    grid.appendChild(card);
  });

  /* filters */
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        const show = filter === 'all' || card.dataset.filter === filter;
        if (window.gsap) {
          gsap.to(card, { opacity: show ? 1 : 0, scale: show ? 1 : 0.9, duration: 0.35, onStart: () => { if (show) card.style.display = ''; }, onComplete: () => { card.style.display = show ? '' : 'none'; } });
        } else {
          card.style.display = show ? '' : 'none';
        }
      });
    });
  });

  /* tilt effect on project cards */
  if (!prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.project-card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotateY: px * 8, rotateX: -py * 8, transformPerspective: 600, duration: 0.4, ease: 'power2.out' });
    });
    document.querySelectorAll('.project-card').forEach ? null : null;
    grid.addEventListener('mouseleave', () => {}, true);
    document.addEventListener('mouseover', (e) => {
      if (!e.target.closest('.project-card')) {
        document.querySelectorAll('.project-card').forEach(c => gsap.to(c, { rotateX: 0, rotateY: 0, duration: 0.6 }));
      }
    });
  }

  /* modal */
  const modal = document.getElementById('portfolioModal');
  const modalVideo = document.getElementById('modalVideo');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalCategory = document.getElementById('modalCategory');
  function openModal(p) {
    modalTitle.textContent = p.title;
    modalDesc.textContent = p.desc;
    modalCategory.textContent = p.label;
    modalVideo.src = `https://www.youtube.com/embed/${p.youtube}?autoplay=1&rel=0&playsinline=1`;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    modalVideo.src = ''; /* clearing the src stops YouTube playback (iframes have no .pause()) */
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ------------------------------------------------------------
     11. CLIENTS MARQUEE — duplicate track for seamless loop
  ------------------------------------------------------------ */
  const track = document.getElementById('marqueeTrack');
  track.innerHTML += track.innerHTML;

  /* ------------------------------------------------------------
     12. TESTIMONIAL SLIDER
  ------------------------------------------------------------ */
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dotsWrap = document.getElementById('testimonialDots');
  let activeTestimonial = 0;
  testimonialCards.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => showTestimonial(i));
    dotsWrap.appendChild(dot);
  });
  function showTestimonial(i) {
    testimonialCards[activeTestimonial].classList.remove('active');
    dotsWrap.children[activeTestimonial].classList.remove('active');
    activeTestimonial = i;
    testimonialCards[activeTestimonial].classList.add('active');
    dotsWrap.children[activeTestimonial].classList.add('active');
  }
  setInterval(() => showTestimonial((activeTestimonial + 1) % testimonialCards.length), 5000);

  /* ------------------------------------------------------------
     13. CONTACT FORM
  ------------------------------------------------------------ */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.querySelector('.btn-text').textContent = 'Sending...';
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.querySelector('.btn-text').textContent = 'Send Message';
      submitBtn.disabled = false;
      formSuccess.classList.add('show');
      form.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 4000);
    }, 1100);
  });

  /* ------------------------------------------------------------
     14. BACK TO TOP
  ------------------------------------------------------------ */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.style.opacity = window.scrollY > 600 ? '1' : '0';
  });
  backToTop.style.transition = 'opacity .3s ease';
  backToTop.style.opacity = '0';
  backToTop.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------
     15. SCROLL-TRIGGERED ANIMATIONS (GSAP)
  ------------------------------------------------------------ */
  function initScrollAnimations() {
    if (!window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    gsap.timeline()
      .to('.hero .reveal-up', { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' });

    // Generic reveal-up for everything below the fold
    document.querySelectorAll('section:not(.hero) .reveal-up').forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });

    // Section titles / timecodes fade in
    gsap.utils.toArray('.section-title, .timecode').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    // Stat counters
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 1.6, ease: 'power2.out',
            onUpdate: () => el.textContent = Math.floor(obj.val) + suffix
          });
        }
      });
    });

    // Skill bars
    document.querySelectorAll('.skill-fill').forEach(el => {
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: () => el.style.width = el.dataset.width + '%'
      });
    });

    // Service + project cards stagger
    gsap.utils.toArray('.services-grid').forEach(grid => {
      gsap.to(grid.children, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: grid, start: 'top 85%' }
      });
    });
    gsap.utils.toArray('#portfolioGrid').forEach(g => {
      gsap.to(g.children, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out',
        scrollTrigger: { trigger: g, start: 'top 88%' }
      });
    });
  }

  /* ------------------------------------------------------------
     16. TIMELINE PROGRESS LINE
  ------------------------------------------------------------ */
  function initTimeline() {
    if (!window.gsap) return;
    gsap.to('#timelineProgress', {
      height: '100%', ease: 'none',
      scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 }
    });
  }

});
