/* =============================================
   LUNCH BOX — by GrabCharles
   js/index.js
   ============================================= */

(function () {
    'use strict';

    /* ── DOM refs ───────────────────────────── */
    const wrapper    = document.getElementById('lunchboxWrapper');
    const hintText   = document.getElementById('hintText');
    const letter     = document.getElementById('letter');
    const heartBurst = document.getElementById('heartBurst');
    const bgMusic    = document.getElementById('bgMusic');
    const particles  = document.getElementById('particles');

    let isOpen = false;

    /* ── Particles ──────────────────────────── */
    const EMOJIS = ['🌸', '💕', '🍓', '✨', '🌷', '💖', '🍬', '⭐'];

    function spawnParticles(count) {
        for (let i = 0; i < count; i++) {
            const el = document.createElement('span');
            el.className = 'particle';
            el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
            el.style.setProperty('--dur',   (5 + Math.random() * 8) + 's');
            el.style.setProperty('--delay', (Math.random() * 6) + 's');
            el.style.left   = (Math.random() * 100) + '%';
            el.style.bottom = '-40px';
            el.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
            particles.appendChild(el);
        }
    }

    spawnParticles(28);

    /* ── Heart burst ────────────────────────── */
    function burstHearts(x, y) {
        const hearts = ['💕', '💖', '💗', '💓', '❤️', '🌸'];
        const count  = 14;

        for (let i = 0; i < count; i++) {
            const el = document.createElement('span');
            el.className = 'burst-heart';
            el.textContent = hearts[Math.floor(Math.random() * hearts.length)];

            const angle = (i / count) * 360;
            const dist  = 80 + Math.random() * 100;
            const rad   = (angle * Math.PI) / 180;
            const tx    = Math.cos(rad) * dist + 'px';
            const ty    = (Math.sin(rad) * dist - 40) + 'px';

            el.style.left = x + 'px';
            el.style.top  = y + 'px';
            el.style.setProperty('--tx', tx);
            el.style.setProperty('--ty', ty);
            el.style.animationDelay = (Math.random() * 0.2) + 's';
            el.style.fontSize = (0.9 + Math.random() * 0.8) + 'rem';

            heartBurst.appendChild(el);
            el.addEventListener('animationend', () => el.remove());
        }
    }

    /* ── Sparkle ring ───────────────────────── */
    function spawnRing(parent) {
        const ring = document.createElement('div');
        ring.className = 'sparkle-ring';
        parent.appendChild(ring);
        ring.addEventListener('animationend', () => ring.remove());
    }

    /* ── Music ──────────────────────────────── */
    function playMusic() {
        bgMusic.volume = 0;
        bgMusic.play().catch(() => {});

        let vol = 0;
        const fadeIn = setInterval(() => {
            vol = Math.min(vol + 0.05, 0.7);
            bgMusic.volume = vol;
            if (vol >= 0.7) clearInterval(fadeIn);
        }, 80);
    }

    function stopMusic() {
        let vol = bgMusic.volume;
        const fadeOut = setInterval(() => {
            vol = Math.max(vol - 0.05, 0);
            bgMusic.volume = vol;
            if (vol <= 0) {
                clearInterval(fadeOut);
                bgMusic.pause();
                bgMusic.currentTime = 0;
            }
        }, 80);
    }

    /* ── Open box ───────────────────────────── */
    function openBox(e) {
        if (isOpen) return;
        isOpen = true;

        const rect = wrapper.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;

        burstHearts(cx, cy);
        spawnRing(wrapper);

        wrapper.classList.add('opened');
        hintText.classList.add('hidden');

        playMusic();
    }

    /* ── Close box ──────────────────────────── */
    function closeBox() {
        if (!isOpen) return;
        isOpen = false;

        wrapper.classList.remove('opened');
        hintText.classList.remove('hidden');

        stopMusic();
    }

    /* ── Event listeners ─────────────────────*/
    // Click box body / lid to open
    wrapper.addEventListener('click', openBox);

    // Click the letter to close
    letter.addEventListener('click', (e) => {
        e.stopPropagation();
        closeBox();
    });

    /* ── Extra floating hearts while open ─── */
    setInterval(() => {
        if (!isOpen) return;
        const emojiPool = ['💕', '🌸', '✨', '💖'];
        const el = document.createElement('span');
        el.className = 'particle';
        el.textContent = emojiPool[Math.floor(Math.random() * emojiPool.length)];
        el.style.setProperty('--dur', (3 + Math.random() * 4) + 's');
        el.style.setProperty('--delay', '0s');
        el.style.left   = (20 + Math.random() * 60) + '%';
        el.style.bottom = '0px';
        el.style.fontSize = '1.2rem';
        particles.appendChild(el);
        setTimeout(() => el.remove(), 7000);
    }, 600);

})();