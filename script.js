/**
 * Shared JavaScript logic for Shritej Patil Portfolio - Hero Section Only
 */

// Initialize Lenis
const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    smoothTouch: true
});

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

document.addEventListener("DOMContentLoaded", () => {
    // GSAP register
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // ========================================
    // REVEAL ENTRY ANIMATION
    // ========================================
    const bars = document.querySelectorAll(".bars-container .bar");
    if (bars.length > 0) {
        // We slide the bars up to reveal the hero section
        gsap.to(bars, {
            yPercent: -100,
            stagger: 0.1,
            duration: 0.8,
            ease: "power4.inOut",
            delay: 0.1 // tiny delay right after load
        });
    }

    // ========================================
    // PREMIUM LETTER-REVEAL HOVER
    // ========================================
    function splitTextIntoChars(text) {
        return text.split('').map(char => {
            if (char === ' ') {
                return '<span class="btn-char is-space">&nbsp;</span>';
            }
            return `<span class="btn-char">${char}</span>`;
        }).join('');
    }

    document.querySelectorAll('.btn-hover-reveal').forEach(btn => {
        const hoverText = btn.getAttribute('data-hover-text');
        if (!hoverText) return;

        const extras = [];
        btn.querySelectorAll('sup').forEach(el => {
            extras.push(el.outerHTML);
        });

        const charsHTML = splitTextIntoChars(hoverText);

        btn.innerHTML = `
            <span class="btn-text-wrapper">
                <span class="btn-text-row original-row">${charsHTML}</span>
                <span class="btn-text-row clone-row">${charsHTML}</span>
            </span>
            ${extras.join('')}
        `;
    });

    // ========================================
    // HERO MARQUEE LOGIC
    // ========================================
    const marquee = document.getElementById("hero-marquee");
    if (marquee) {
        gsap.to(marquee, {
            xPercent: -50,
            repeat: -1,
            duration: 15,
            ease: "none"
        });
    }
    // ========================================
    // SCRUBBED TEXT REVEAL ANIMATION
    // ========================================
    function wrapWordsForReveal(element) {
        const nodes = Array.from(element.childNodes);
        element.innerHTML = '';
        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const words = node.nodeValue.split(/(\s+)/);
                words.forEach(word => {
                    if (word.trim().length > 0) {
                        const span = document.createElement('span');
                        span.className = 'gsap-word';
                        span.style.opacity = '0.2';
                        span.textContent = word;
                        element.appendChild(span);
                    } else if (word.length > 0) {
                        element.appendChild(document.createTextNode(word));
                    }
                });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName.toLowerCase() === 'br') {
                    element.appendChild(node);
                } else {
                    const span = document.createElement('span');
                    span.className = 'gsap-word';
                    span.style.opacity = '0.2';
                    span.style.display = 'inline-block';
                    span.appendChild(node);
                    element.appendChild(span);
                }
            }
        });
    }

    document.querySelectorAll('.about-text').forEach(el => {
        wrapWordsForReveal(el);
        gsap.to(el.querySelectorAll('.gsap-word'), {
            opacity: 1,
            stagger: 0.1,
            scrollTrigger: {
                trigger: el,
                start: "top 80%",
                end: "bottom 50%",
                scrub: true
            }
        });
    });

    // ========================================
    // INSPIRED TEXT REVEAL
    // ========================================
    const inspiredText = document.querySelector('.inspired-text');
    if (inspiredText) {
        wrapWordsForReveal(inspiredText);
        gsap.fromTo(inspiredText.querySelectorAll('.gsap-word'), 
            { y: 50, opacity: 0 }, 
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.05,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: inspiredText,
                    start: "top 90%"
                }
            }
        );
    }

    // ========================================
    // PROJECT PAGE ANIMATIONS
    // ========================================
    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach((el) => {
        gsap.fromTo(el, { y: 100, opacity: 0 }, {
            y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" }
        });
    });

    const parallaxImgs = document.querySelectorAll(".parallax-img");
    if (parallaxImgs.length > 0) {
        gsap.to(".parallax-img", {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: ".parallax-img",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // ========================================
    // WORK PAGE HOVER REVEAL LOGIC
    // ========================================
    const workItems = document.querySelectorAll('.work-list-item');
    const revealContainer = document.getElementById('hover-reveal-container');
    const revealImg = document.getElementById('hover-reveal-img');

    if (workItems.length > 0 && revealContainer && revealImg) {
        // We use GSAP quickTo for smooth cursor following
        const xTo = gsap.quickTo(revealContainer, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(revealContainer, "y", { duration: 0.4, ease: "power3" });

        workItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (document.querySelector('.work-list')?.classList.contains('grid-view')) return;
                const imgSrc = item.getAttribute('data-image');
                if (imgSrc) {
                    revealImg.src = imgSrc;
                }
                
                gsap.to(revealContainer, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(revealContainer, {
                    opacity: 0,
                    scale: 0.5,
                    duration: 0.3,
                    ease: "power2.in"
                });
            });

            item.addEventListener('mousemove', (e) => {
                if (document.querySelector('.work-list')?.classList.contains('grid-view')) return;
                // Center the image container on cursor
                // Container width is 400, height is 300 (defined in classes)
                xTo(e.clientX - 200);
                yTo(e.clientY - 150);
            });
        });
    }

    // ========================================
    // FULLSCREEN MENU LOGIC (LIQUID DROPDOWN)
    // ========================================
    const menuToggleBtn = document.getElementById('menu-toggle');
    const closeMenuBtn = document.getElementById('close-menu');
    const fullscreenMenu = document.getElementById('fullscreen-menu');
    const liquidPath = document.getElementById('liquid-path');
    const menuContent = document.getElementById('menu-content');
    
    if (menuToggleBtn && closeMenuBtn && fullscreenMenu && liquidPath) {
        const menuTimeline = gsap.timeline({ paused: true });
        
        // Ensure menu is always 'visible' but clipped to 0
        gsap.set(liquidPath, { attr: { d: "M 0 0 L 1 0 L 1 0 Q 0.5 0 0 0 Z" } });
        gsap.set(menuContent, { opacity: 0, y: 50 });
        
        // Setup liquid drop timeline
        menuTimeline
            .to(fullscreenMenu, { pointerEvents: "auto", duration: 0 })
            .to(liquidPath, {
                attr: { d: "M 0 0 L 1 0 L 1 0.7 Q 0.5 1.2 0 0.7 Z" },
                duration: 0.4,
                ease: "power2.in"
            })
            .to(liquidPath, {
                attr: { d: "M 0 0 L 1 0 L 1 1 Q 0.5 1 0 1 Z" },
                duration: 0.4,
                ease: "power2.out"
            })
            .to(menuContent, {
                opacity: 1,
                y: 0,
                pointerEvents: "auto",
                duration: 0.5,
                ease: "power3.out"
            }, "-=0.3"); // Overlap fade-in with the end of the liquid splash
        
        menuToggleBtn.addEventListener('click', () => {
            menuTimeline.play();
        });
        
        closeMenuBtn.addEventListener('click', () => {
            menuTimeline.reverse();
        });
    }

    // ========================================
    // AUDIO TOGGLE LOGIC
    // ========================================
    const audioToggle = document.getElementById('audio-toggle');
    const bgAudio = document.getElementById('bg-audio');
    const audioText = document.getElementById('audio-text');
    const audioIcon = document.getElementById('audio-icon');

    if (audioToggle && bgAudio) {
        audioToggle.addEventListener('click', () => {
            if (bgAudio.paused) {
                bgAudio.play();
                audioText.innerText = 'On';
                audioIcon.classList.add('playing');
            } else {
                bgAudio.pause();
                audioText.innerText = 'Off';
                audioIcon.classList.remove('playing');
            }
        });
    }

    // ========================================
    // SKIPER17 STICKY CARDS ANIMATION
    // ========================================
    const skiperCards = document.querySelectorAll('.skiper-card');
    if (skiperCards.length > 0) {
        const totalCards = skiperCards.length;

        // Initialize positions
        gsap.set(skiperCards[0], { y: "0%", scale: 1, rotation: 0 });
        for (let i = 1; i < totalCards; i++) {
            gsap.set(skiperCards[i], { y: "100%", scale: 1, rotation: 0 });
        }

        const scrollTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".sticky-cards",
                start: "top top",
                end: `+=${window.innerHeight * (totalCards - 1)}`,
                pin: true,
                scrub: 0.5,
                pinSpacing: true,
            },
        });

        for (let i = 0; i < totalCards - 1; i++) {
            const currentCard = skiperCards[i];
            const nextCard = skiperCards[i + 1];
            const position = i;

            scrollTimeline.to(
                currentCard,
                {
                    scale: 0.7,
                    rotation: 5,
                    duration: 1,
                    ease: "none",
                },
                position
            );

            scrollTimeline.to(
                nextCard,
                {
                    y: "0%",
                    duration: 1,
                    ease: "none",
                },
                position
            );
        }
    }


    // ========================================
    // WORK PAGE FILTERS & VIEW TOGGLE
    // ========================================
    const filterAll = document.getElementById('btn-filter-all');
    const filterDesign = document.getElementById('btn-filter-design');
    const filterDev = document.getElementById('btn-filter-dev');
    
    const viewList = document.getElementById('btn-view-list');
    const viewGrid = document.getElementById('btn-view-grid');
    const workList = document.querySelector('.work-list');
    
    if (filterAll && workList) {
        const items = workList.querySelectorAll('.work-list-item');
        
        // Add images for grid view
        items.forEach(item => {
            const imgSrc = item.getAttribute('data-image');
            if (imgSrc) {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'work-grid-img-container';
                const img = document.createElement('img');
                img.src = imgSrc;
                img.className = 'work-grid-img';
                imgContainer.appendChild(img);
                item.insertBefore(imgContainer, item.firstChild);
            }
        });

        const filterBtns = [filterAll, filterDesign, filterDev];
        
        const setActiveFilter = (activeBtn) => {
            filterBtns.forEach(btn => {
                btn.className = "bg-transparent border border-[#E1E0CC]/30 text-[#E1E0CC] px-8 py-3 rounded-full text-sm font-medium hover:bg-[#E1E0CC]/10 transition-colors";
            });
            activeBtn.className = "bg-[#E1E0CC] text-black px-8 py-3 rounded-full text-sm font-medium hover:bg-white transition-colors";
        };

        filterAll.addEventListener('click', () => {
            setActiveFilter(filterAll);
            items.forEach(item => item.classList.remove('hidden'));
        });

        filterDesign.addEventListener('click', () => {
            setActiveFilter(filterDesign);
            items.forEach(item => {
                const category = item.querySelector('.w-\\[30\\%\\]').textContent;
                if (category.includes('Design')) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });

        filterDev.addEventListener('click', () => {
            setActiveFilter(filterDev);
            items.forEach(item => {
                const category = item.querySelector('.w-\\[30\\%\\]').textContent;
                if (category.includes('Development')) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });

        const setActiveView = (activeBtn, isGrid) => {
            [viewList, viewGrid].forEach(btn => {
                btn.className = "w-12 h-12 rounded-full bg-transparent border border-[#E1E0CC]/30 flex items-center justify-center hover:bg-[#E1E0CC]/10 transition-colors";
            });
            activeBtn.className = "w-12 h-12 rounded-full bg-[#111] border border-[#E1E0CC]/20 flex items-center justify-center hover:bg-[#222] transition-colors";
            
            if (isGrid) {
                workList.classList.add('grid-view');
            } else {
                workList.classList.remove('grid-view');
            }
        };

        viewList.addEventListener('click', () => setActiveView(viewList, false));
        viewGrid.addEventListener('click', () => setActiveView(viewGrid, true));
    }
});
