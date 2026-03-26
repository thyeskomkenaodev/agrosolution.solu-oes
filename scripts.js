document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);

    // --- Preloader Logic ---
    const preloader = document.getElementById('preloader');
    const bar = document.querySelector('.preloader-bar');
    const logo = document.querySelector('.preloader-logo');
    
    const tl = gsap.timeline();

    tl.to(logo, { opacity: 1, y: 0, duration: 1, ease: 'power4.out' })
      .to(bar, { width: '100%', duration: 1.5, ease: 'power2.inOut' }, "-=0.2")
      .to(preloader, { 
          yPercent: -100, 
          duration: 1, 
          ease: 'power4.inOut',
          onComplete: () => {
              preloader.style.display = 'none';
              initAnimations();
              ScrollTrigger.refresh();
          }
      });

    // --- Custom Cursor Logic (Immediate) ---
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;

    if (cursor && follower) {
        gsap.to({}, 0.016, {
            repeat: -1,
            onRepeat: () => {
                const diffX = mouseX - ballX;
                const diffY = mouseY - ballY;
                
                ballX += diffX / 8;
                ballY += diffY / 8;

                const angle = Math.atan2(diffY, diffX) * 180 / Math.PI;
                const movementScale = Math.min(1 + Math.abs(diffX + diffY) / 100, 1.25);

                gsap.set(cursor, { 
                    x: mouseX, 
                    y: mouseY,
                    rotate: angle, // Icons8 tractor points right, so angle works natively
                    scale: movementScale
                });

                // Spawn smoke if moving
                if (speed > 5 && Math.random() > 0.7) {
                    createSmoke();
                }

                gsap.set(follower, { x: ballX, y: ballY });
            }
        });

        function createSmoke() {
            const container = document.querySelector('.smoke-container');
            if(!container) return;
            const puff = document.createElement('div');
            puff.className = 'smoke-puff';
            container.appendChild(puff);
            
            gsap.to(puff, {
                x: -20 - Math.random() * 20,
                y: -10 - Math.random() * 20,
                opacity: 0,
                scale: 3,
                duration: 0.8,
                onComplete: () => puff.remove()
            });
        }

        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        console.log("Tractor Cursor Primed 🚜");
    }

    // Safety fallback
    setTimeout(() => {
        if (preloader.style.display !== 'none') {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                initAnimations();
                ScrollTrigger.refresh();
            }, 500);
        }
    }, 6000);

    function initAnimations() {
        // --- Hero Reveal ---
        const heroTl = gsap.timeline();
        heroTl.from('.hero-content h1', {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: 'power4.out'
        })
        .from('.hero-accent', {
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, "-=1")
        .from('.btn-group', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.7)'
        }, "-=0.8");

        // --- Advanced Text Reveal ---
        const splitTexts = document.querySelectorAll('.reveal-text');
        splitTexts.forEach(text => {
            const words = text.innerText.split(' ');
            text.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');
            
            gsap.from(text.querySelectorAll('span'), {
                scrollTrigger: {
                    trigger: text,
                    start: "top 90%"
                },
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power4.out"
            });
        });

        // --- Hero Parallax ---
        gsap.to('.hero', {
            backgroundPositionY: '30%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                scrub: true
            }
        });

        // --- Horizontal Scroll for Commerces ---
        const horizontalContent = document.querySelector('.horizontal-content');
        if (horizontalContent) {
            const wrapper = document.querySelector('.horizontal-wrapper');
            const scrollWidth = horizontalContent.offsetWidth - window.innerWidth;

            gsap.to(horizontalContent, {
                x: -scrollWidth,
                ease: "none",
                scrollTrigger: {
                    trigger: wrapper,
                    start: "top top",
                    end: "+=2000", // Length of scroll
                    scrub: 1,
                    pin: true,
                    invalidateOnRefresh: true
                }
            });
        }

        // --- Floating Background Blobs ---
        const blobs = document.querySelectorAll('.blob');
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 60;
            const yPos = (clientY / window.innerHeight - 0.5) * 60;

            blobs.forEach((blob, index) => {
                gsap.to(blob, {
                    x: xPos * (index + 1),
                    y: yPos * (index + 1),
                    duration: 2,
                    ease: 'power2.out'
                });
            });
        });

        // --- Scroll Revelations ---
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            ScrollTrigger.create({
                trigger: el,
                start: "top 85%",
                onEnter: () => el.classList.add('active'),
                once: true
            });
        });

        // --- Tilt Effect for Cards ---
        const tiltCards = document.querySelectorAll('.commerce-card, .gallery-item, .diff-item');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    scale: 1.05,
                    duration: 0.5,
                    ease: 'power2.out',
                    perspective: 1000
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });

        // Custom Cursor Listeners
        document.querySelectorAll('a, button, .commerce-card, .gallery-item').forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('active');
                gsap.to(cursor, { scale: 1.5, duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('active');
                gsap.to(cursor, { scale: 1, duration: 0.3 });
            });
        });
    }

    console.log("AgroSolution WOW Engine Active 🚀");
});
