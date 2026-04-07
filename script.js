document.addEventListener('DOMContentLoaded', () => {
    /* ========== Mobile Menu Toggle ========== */
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
             // Simple toggle for mobile view. Real implementation might need a slide-out drawer or absolute positioning.
             // We'll rely on a basic toggle class for now.
             navLinks.classList.toggle('mobile-only');
             navLinks.classList.toggle('desktop-only');
             // Quick hack: toggle display block
             if(navLinks.style.display === 'flex') {
                 navLinks.style.display = 'none';
             } else {
                 navLinks.style.display = 'flex';
                 navLinks.style.flexDirection = 'column';
                 navLinks.style.position = 'absolute';
                 navLinks.style.top = '80px';
                 navLinks.style.left = '0';
                 navLinks.style.width = '100%';
                 navLinks.style.backgroundColor = '#fff';
                 navLinks.style.padding = '20px';
                 navLinks.style.borderBottom = '1px solid #e5e7eb';
                 navLinks.style.zIndex = '100';
             }
        });
    }

    /* ========== Hero Gallery ========== */
    const mainImg = document.getElementById('hero-main-img');
    const thumbs = Array.from(document.querySelectorAll('.thumb'));
    const heroPrev = document.getElementById('hero-prev');
    const heroNext = document.getElementById('hero-next');
    
    if (mainImg && thumbs.length > 0) {
        let currentIndex = 0;

        const updateMainImage = (index) => {
            thumbs.forEach(t => t.classList.remove('active'));
            thumbs[index].classList.add('active');
            let src = thumbs[index].getAttribute('data-src');
            // Support either data-src attribute or child img source
            if (!src || !src.startsWith('http') && !src.startsWith('assets')) {
                const imgTag = thumbs[index].querySelector('img');
                if (imgTag) src = imgTag.src;
            }
            if (src) {
                mainImg.src = src;
                const res = document.getElementById('zoom-result');
                if (res) res.style.backgroundImage = `url("${src}")`;
            }
        };

        document.querySelectorAll('.thumb').forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                currentIndex = index;
                updateMainImage(currentIndex);
            });
        });

        if (heroPrev) {
            heroPrev.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : thumbs.length - 1;
                updateMainImage(currentIndex);
            });
        }

        if (heroNext) {
            heroNext.addEventListener('click', () => {
                currentIndex = (currentIndex < thumbs.length - 1) ? currentIndex + 1 : 0;
                updateMainImage(currentIndex);
            });
        }

        /* ========== Hero Image Zoom ========== */
        const container = document.getElementById('hero-main-container');
        const lens = document.getElementById('zoom-lens');
        const result = document.getElementById('zoom-result');
        const resultContainer = document.getElementById('zoom-result-container');

        if (container && lens && result && resultContainer) {
            container.addEventListener('mouseenter', () => {
                lens.style.display = 'block';
                resultContainer.style.display = 'block';
                result.style.backgroundImage = `url("${mainImg.src}")`;
            });

            container.addEventListener('mouseleave', () => {
                lens.style.display = 'none';
                resultContainer.style.display = 'none';
            });

            container.addEventListener('mousemove', (e) => {
                if (e.target.closest('.carousel-btn')) {
                    lens.style.display = 'none';
                    resultContainer.style.display = 'none';
                    return;
                } else {
                    lens.style.display = 'block';
                    resultContainer.style.display = 'block';
                }
                const rect = container.getBoundingClientRect();
                const containerWidth = rect.width;
                const containerHeight = rect.height;

                const lensWidth = lens.offsetWidth;
                const lensHeight = lens.offsetHeight;

                let x = e.clientX - rect.left - (lensWidth / 2);
                let y = e.clientY - rect.top - (lensHeight / 2);

                if (x < 0) x = 0;
                if (y < 0) y = 0;
                if (x > containerWidth - lensWidth) x = containerWidth - lensWidth;
                if (y > containerHeight - lensHeight) y = containerHeight - lensHeight;

                lens.style.left = x + 'px';
                lens.style.top = y + 'px';

                const cx = result.offsetWidth / lensWidth;
                const cy = result.offsetHeight / lensHeight;

                result.style.backgroundSize = (containerWidth * cx) + 'px ' + (containerHeight * cy) + 'px';
                result.style.backgroundPosition = '-' + (x * cx) + 'px -' + (y * cy) + 'px';
            });
        }
    }

    /* ========== FAQ Accordion ========== */
    const faqBtns = document.querySelectorAll('.faq-btn');
    
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other faqs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Toggle current
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    /* ========== Process Tabs ========== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const processPrev = document.getElementById('process-prev');
    const processNext = document.getElementById('process-next');
    if (processPrev && processNext) {
        const navFooter = document.querySelector('.process-nav-footer');
        
        const attachNavToActiveImage = (contentEl) => {
            if (!contentEl || !navFooter) return;
            const imgEl = contentEl.querySelector('.process-image');
            if (imgEl) {
                imgEl.appendChild(navFooter);
            }
        };

        // Initialize natively
        attachNavToActiveImage(document.querySelector('.process-content-area.active'));

        const switchTab = (index) => {
            if (index < 0 || index >= tabBtns.length) return;
            
            const btn = tabBtns[index];
            const targetId = btn.getAttribute('data-target');
            
            // Update buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update content areas
            document.querySelectorAll('.process-content-area').forEach(content => {
                content.classList.remove('active');
            });
            
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
                attachNavToActiveImage(targetContent);
            }
            
            // Ensure active tab button scrolls into view (horizontal scroll container)
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        };

        tabBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => switchTab(index));
        });

        processPrev.addEventListener('click', () => {
            let currentIndex = Array.from(tabBtns).findIndex(btn => btn.classList.contains('active'));
            switchTab(currentIndex > 0 ? currentIndex - 1 : tabBtns.length - 1); // Loop to end if at start
        });
        
        processNext.addEventListener('click', () => {
            let currentIndex = Array.from(tabBtns).findIndex(btn => btn.classList.contains('active'));
            switchTab(currentIndex < tabBtns.length - 1 ? currentIndex + 1 : 0); // Loop to start if at end
        });
    }

    const openBtn = document.getElementById('open-catalogue-btn');
const modal = document.getElementById('catalogue-modal');
const closeBtn = document.getElementById('modal-close');

if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
        modal.classList.add('open');
    });
}

if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
    });
}

// Close when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('open');
    }
});

const quoteBtns = document.querySelectorAll('.quote-btn');
const quoteModal = document.getElementById('quote-modal');
const quoteClose = document.getElementById('quote-close');

// Open modal for ANY quote button
quoteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        quoteModal.classList.add('open');
    });
});

// Close modal
if (quoteClose) {
    quoteClose.addEventListener('click', () => {
        quoteModal.classList.remove('open');
    });
}

// Close on outside click
window.addEventListener('click', (e) => {
    if (e.target === quoteModal) {
        quoteModal.classList.remove('open');
    }
});

        /* ========== Applications Carousel ========== */
const track = document.getElementById('app-track');
const prevBtn = document.getElementById('app-prev');
const nextBtn = document.getElementById('app-next');

if (track && prevBtn && nextBtn) {
    let isAnimating = false;

    const getScrollAmount = () => {
        const card = track.querySelector('.app-card');
        if (!card) return 320;
        const cardWidth = card.getBoundingClientRect().width;
        const gap = parseInt(window.getComputedStyle(track).gap) || 20;
        return cardWidth + gap;
    };

    nextBtn.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        const scrollAmount = getScrollAmount();

        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${scrollAmount}px)`;

        setTimeout(() => {
            track.style.transition = 'none';
            track.appendChild(track.firstElementChild);
            track.style.transform = 'translateX(0)';
            isAnimating = false;
        }, 500);
    });

    prevBtn.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        const scrollAmount = getScrollAmount();

        track.style.transition = 'none';
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        track.style.transform = `translateX(-${scrollAmount}px)`;

        // Force browser layout reflow before reenabling transition
        void track.offsetWidth;

        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = 'translateX(0)';
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    });
}
    });

window.addEventListener('scroll', () => {
    const stickyBar = document.getElementById('sticky-product-bar');
    const heroSection = document.querySelector('.hero-section');
    
    // Show bar after scrolling 600px
    if (window.scrollY > 600) {
        stickyBar.classList.add('visible');
    } else {
        stickyBar.classList.remove('visible');
    }
});