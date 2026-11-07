/**
 * MONOCHROME EDITORIAL MODEL PORTFOLIO
 * Model: ASHFAQUE
 * Powered by @fiddle-digital/string-tune
 * 
 * Choreography:
 * Hero Opposing Typography -> Introduction & Specs -> 
 * Portrait Photos Collection (FlexCarousel with Liquid Preset & Deal Entrance) ->
 * Standing Poses Section (Spatial Editorial Canvas with StringTune Scroll-Driven Motion) ->
 * Minimal Footer
 */

// ============================================================================
// CONFIGURABLE MODEL SETTINGS
// ============================================================================
export const MODEL_CONFIG = {
  name: 'ASHFAQUE',
  tagline: 'GRAPHIC DESIGNER',
  secondaryText: 'UIUX DESIGNER',
  additionalRoles: ['VIDEO EDITER', 'BRANDING']
};

// ============================================================================
// PROJECT CAROUSEL DATA
// ============================================================================
export const portraitItems = [
  {
    src: 'images/projects/zentro-branding.jpeg',
    alt: 'Zentro brand identity on a blue and white cityscape design',
    title: 'ZENTRO',
    subtitle: 'Brand Identity',
    href: 'https://www.behance.net/gallery/253218093/zento'
  },
  {
    src: 'images/projects/nike-campaign.jpeg',
    alt: 'Monochrome Nike Air campaign with suspended sneakers',
    title: 'NIKE',
    subtitle: 'Campaign Design',
    href: 'https://www.behance.net/gallery/257970221/NIKE-DASHBOARD'
  },
  {
    src: 'images/projects/farmora-branding.jpeg',
    alt: 'Farmora green agricultural brand illustration',
    title: 'FARMORA',
    subtitle: 'Brand Identity',
    href: 'https://www.behance.net/gallery/257967849/FARMORA'
  },
  {
    src: 'images/projects/brewora-branding.jpeg',
    alt: 'Brewora coffee and croissant brand campaign',
    title: 'BREWORA',
    subtitle: 'Brand Identity',
    href: 'https://www.behance.net/gallery/257969699/BREWORA'
  }
];

// ============================================================================
// REDUCED MOTION DETECTION
// ============================================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================================================
// HELPER UTILITIES: Easing & Math
// ============================================================================
function clamp(val, min = 0, max = 1) {
  return Math.min(Math.max(val, min), max);
}

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

// Calculate section scroll progress [0..1]
function getSectionProgress(element) {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const trackHeight = element.offsetHeight - windowHeight;

  if (trackHeight <= 0) return 0;
  const scrollOffset = -rect.top;
  return clamp(scrollOffset / trackHeight, 0, 1);
}

// Smooth cubic and sine easing for ultra-silky spatial transitions
function easeOutCubic(t) {
  return 1 - Math.pow(1 - clamp(t), 3);
}

function easeInOutCubic(t) {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// Ultra-smooth cosine S-curve easing (zero derivative at t=0 and t=1)
function easeInOutSine(t) {
  return 0.5 * (1 - Math.cos(Math.PI * clamp(t)));
}

// ============================================================================
// INITIALIZE EDITORIAL APP
// ============================================================================
async function initPortfolio() {
  const siteNav = document.querySelector('.site-nav');
  const navMenuToggle = siteNav?.querySelector('.nav-menu-toggle');
  const mainNavigation = siteNav?.querySelector('#main-navigation');

  if (siteNav && navMenuToggle && mainNavigation) {
    const setMenuOpen = (isOpen) => {
      siteNav.classList.toggle('is-menu-open', isOpen);
      navMenuToggle.setAttribute('aria-expanded', String(isOpen));
      navMenuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    };

    navMenuToggle.addEventListener('click', () => {
      setMenuOpen(navMenuToggle.getAttribute('aria-expanded') !== 'true');
    });
    mainNavigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    });
    document.addEventListener('pointerdown', (event) => {
      if (!siteNav.contains(event.target)) setMenuOpen(false);
    });
  }

  // 1. Sync Configurable Model Name across the DOM
  document.querySelectorAll('.hero-title-main, .footer-model-name, .model-name-sync').forEach(el => {
    el.textContent = MODEL_CONFIG.name;
  });

  // Reveal the Services heading and accordion rows as they enter the viewport.
  const serviceMotionItems = [...document.querySelectorAll('.services-heading, .service-accordion-item')];
  if (serviceMotionItems.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      serviceMotionItems.forEach(item => item.classList.add('is-visible'));
    } else {
      document.body.classList.add('services-motion-ready');
      const serviceObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          serviceObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      serviceMotionItems.forEach(item => serviceObserver.observe(item));
    }
  }

  // Replay the Landing Pages entrance each time its fan enters the viewport.
  const landingFan = document.querySelector('.landing-fan');
  if (landingFan) {
    const landingSection = landingFan.closest('.landing-pages-section');
    if (landingSection) landingSection.classList.add('is-motion-ready');

    const revealLandingFan = () => {
      if (landingSection) landingSection.classList.add('is-visible');
      // Commit the hidden starting pose before switching into the settled grid.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => landingFan.classList.add('is-fanned'));
      });
    };

    document.body.classList.add('landing-motion-ready');
    if (!('IntersectionObserver' in window)) {
      revealLandingFan();
    } else {
      const landingObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            revealLandingFan();
          } else {
            landingFan.classList.remove('is-fanned');
            if (landingSection) landingSection.classList.remove('is-visible');
          }
        });
      }, { threshold: 0.08 });
      landingObserver.observe(landingFan);
    }

    if (!prefersReducedMotion) {
      const cards = [...landingFan.querySelectorAll('.landing-fan-card')];
      const resetActiveCard = () => {
        landingFan.classList.remove('is-interacting');
        cards.forEach(card => {
          card.classList.remove('is-active');
          card.style.removeProperty('--tilt-x');
          card.style.removeProperty('--tilt-y');
        });
      };

      cards.forEach(card => {
        card.addEventListener('pointerenter', event => {
          if (event.pointerType !== 'mouse') return;
          landingFan.classList.add('is-interacting');
          cards.forEach(other => other.classList.toggle('is-active', other === card));
        });

        card.addEventListener('pointermove', event => {
          if (event.pointerType !== 'mouse') return;
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.setProperty('--tilt-y', `${(x * 12).toFixed(2)}deg`);
          card.style.setProperty('--tilt-x', `${(-y * 10).toFixed(2)}deg`);
        });
      });

      landingFan.addEventListener('pointerleave', resetActiveCard);
      landingFan.addEventListener('focusin', event => {
        const card = event.target.closest('.landing-fan-card');
        if (!card) return;
        landingFan.classList.add('is-interacting');
        cards.forEach(other => other.classList.toggle('is-active', other === card));
      });
      landingFan.addEventListener('focusout', event => {
        if (!landingFan.contains(event.relatedTarget)) resetActiveCard();
      });

      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let frame = 0;
        landingFan.addEventListener('pointermove', event => {
          if (event.target.closest('.landing-fan-card')) return;
          const rect = landingFan.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          if (frame) cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => {
            landingFan.style.setProperty('--parallax-x', `${(-x * 10).toFixed(1)}px`);
            landingFan.style.setProperty('--parallax-y', `${(-y * 6).toFixed(1)}px`);
            frame = 0;
          });
        });
        landingFan.addEventListener('pointerleave', () => {
          landingFan.style.setProperty('--parallax-x', '0px');
          landingFan.style.setProperty('--parallax-y', '0px');
        });
      }
    }
  }

  // 2. Resolve StringTune Runtime
  let StringTuneClass = null;
  let StringProgress = null;
  let StringProgressPart = null;
  let StringParallax = null;
  let StringLerp = null;
  let StringSplit = null;

  try {
    const mod = await import('./assets/string-tune.mjs');
    StringTuneClass = mod.StringTune || mod.default;
    StringProgress = mod.StringProgress;
    StringProgressPart = mod.StringProgressPart;
    StringParallax = mod.StringParallax;
    StringLerp = mod.StringLerp;
    StringSplit = mod.StringSplit;
  } catch (err) {
    console.warn('[StringTune] Falling back to global window.StringTune:', err);
    const ST = window.StringTune?.StringTune || window.StringTune;
    if (ST) {
      StringTuneClass = ST;
      StringProgress = window.StringTune.StringProgress || ST.StringProgress;
      StringProgressPart = window.StringTune.StringProgressPart || ST.StringProgressPart;
      StringParallax = window.StringParallax || ST.StringParallax;
      StringLerp = window.StringLerp || ST.StringLerp;
      StringSplit = window.StringSplit || ST.StringSplit;
    }
  }

  let stringTune = null;
  if (StringTuneClass) {
    stringTune = typeof StringTuneClass.getInstance === 'function'
      ? StringTuneClass.getInstance()
      : StringTuneClass;

    stringTune.scrollDesktopMode = 'default';
    stringTune.scrollMobileMode = 'default';

    if (StringProgress) stringTune.use(StringProgress);
    if (StringProgressPart) stringTune.use(StringProgressPart);
    if (StringParallax) stringTune.use(StringParallax);
    if (StringLerp) stringTune.use(StringLerp);
    if (StringSplit) stringTune.use(StringSplit);

    try {
      stringTune.start(60);
    } catch (e) {
      // Runtime already started
    }

    stringTune.scrollDesktopMode = 'default';
    stringTune.scrollMobileMode = 'default';
  }

  // 3. Cache DOM Elements for Motion Choreography
  const heroTrack = document.getElementById('hero');
  const heroMainRow = document.getElementById('hero-main-row');
  const heroSubRow = document.getElementById('hero-sub-row');
  const heroCursive = document.getElementById('hero-cursive');
  const heroModel = document.getElementById('hero-model');

  // Section 01: Introduction & Specs
  const introTrack = document.getElementById('intro-section');
  const introImg = document.getElementById('intro-img');
  const introText = document.getElementById('intro-text');
  const introSpecs = document.getElementById('intro-specs');

  // Section 02: Portraits Collection (FlexCarousel Host)
  const portraitsEl = document.getElementById('portraits-carousel');
  if (portraitsEl) {
    const galleryGroup = portraitsEl.querySelector('.project-gallery-group');
    const projectLinks = Array.from(galleryGroup?.querySelectorAll('.project-gallery-link') || []);
    let projectTimer;

    const setFeaturedProject = (featuredLink) => {
      if (!galleryGroup || !featuredLink || !projectLinks.length) return;

      const featuredIndex = projectLinks.indexOf(featuredLink);
      const positions = ['far-left', 'left', 'center', 'right', 'far-right'];
      projectLinks.forEach((link, index) => {
        const offset = ((index - featuredIndex + projectLinks.length / 2) % projectLinks.length + projectLinks.length) % projectLinks.length - projectLinks.length / 2;
        const positionIndex = Math.round(offset + 2);
        link.dataset.position = positions[positionIndex] || 'center';
        link.classList.toggle('is-featured', link === featuredLink);
      });
    };

    const featureNextProject = () => {
      const currentIndex = projectLinks.findIndex((link) => link.classList.contains('is-featured'));
      const nextIndex = (currentIndex + 1) % projectLinks.length;
      setFeaturedProject(projectLinks[nextIndex]);
    };

    const restartProjectTimer = () => {
      window.clearInterval(projectTimer);
      projectTimer = window.setInterval(featureNextProject, 2000);
    };

    if (projectLinks.length) {
      setFeaturedProject(projectLinks[0]);
      restartProjectTimer();

      portraitsEl.addEventListener('mouseenter', () => window.clearInterval(projectTimer));
      portraitsEl.addEventListener('mouseleave', restartProjectTimer);
      portraitsEl.addEventListener('focusin', () => window.clearInterval(projectTimer));
      portraitsEl.addEventListener('focusout', restartProjectTimer);

      galleryGroup.addEventListener('click', (event) => {
        const clickedLink = event.target.closest('.project-gallery-link');
        if (!clickedLink || clickedLink.classList.contains('is-featured')) return;

        event.preventDefault();
        window.clearInterval(projectTimer);
        setFeaturedProject(clickedLink);
        restartProjectTimer();
      });
    }

    portraitsEl.classList.add('project-gallery-ready');
  }

  // Section 03: Standing Poses Spatial Showcase (StringTune Scroll-Driven)
  const standingTrack = document.getElementById('standing-section');
  const standingIntroBlock = document.getElementById('standing-intro-block');
  const poseCard1 = document.getElementById('pose-card-1');
  const poseCard2 = document.getElementById('pose-card-2');
  const poseCard3 = document.getElementById('pose-card-3');
  const poseCard4 = document.getElementById('pose-card-4');
  const poseCaption1 = document.getElementById('pose-caption-1');
  const poseCaption2 = document.getElementById('pose-caption-2');
  const poseCaption3 = document.getElementById('pose-caption-3');
  const poseCaption4 = document.getElementById('pose-caption-4');
  const spatialTypo = document.getElementById('standing-spatial-typo');
  const standingTypoRow1 = document.getElementById('standing-typo-row-1');
  const standingTypoRow2 = document.getElementById('standing-typo-row-2');
  const trackerNum = document.getElementById('standing-tracker-num');

  // Section 04: Runway Track (Scroll-Driven Full Screen)
  const runwayTrack = document.getElementById('runway-section');
  const runwaySlides = Array.from(document.querySelectorAll('.runway-slide'));
  const runwayDots = Array.from(document.querySelectorAll('.runway-dot'));
  const runwayCounterNums = document.getElementById('runway-counter-nums');
  let currentRunwayPage = 1;

  // Cache Runway DOM elements outside renderFrame to prevent query overhead
  const runwayElements = runwaySlides.map(slide => ({
    slide,
    leftHalf: slide.querySelector('.runway-half-left'),
    rightHalf: slide.querySelector('.runway-half-right')
  }));

  // Footer
  const footerSection = document.getElementById('footer');
  const footerWrap = document.getElementById('footer-wrap');

  // Animation Physics State
  const state = {
    hero: { current: 0, target: 0 },
    intro: { current: 0, target: 0 },
    standing: { current: 0, target: 0 },
    runway: { current: 0, target: 0 },
    footer: { current: 0, target: 0 }
  };

  const LERP_FACTOR = 0.085; // Silky editorial inertia
  const RUNWAY_LERP_FACTOR = 0.14; // Snappier, responsive inertia for runway transitions

  // 4. Kinetic Animation Loop
  function renderFrame() {
    if (!prefersReducedMotion) {
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const isDesktop = winW > 900;

      // Measure targets from scroll positions
      state.hero.target = getSectionProgress(heroTrack);
      state.intro.target = getSectionProgress(introTrack);
      state.standing.target = getSectionProgress(standingTrack);
      state.runway.target = getSectionProgress(runwayTrack);
      state.footer.target = getSectionProgress(footerSection);

      // Lerp states toward targets
      state.hero.current = lerp(state.hero.current, state.hero.target, LERP_FACTOR);
      state.intro.current = lerp(state.intro.current, state.intro.target, LERP_FACTOR);
      state.standing.current = lerp(state.standing.current, state.standing.target, LERP_FACTOR);
      state.runway.current = lerp(state.runway.current, state.runway.target, RUNWAY_LERP_FACTOR);
      state.footer.current = lerp(state.footer.current, state.footer.target, LERP_FACTOR);

      // ----------------------------------------------------------------------
      // HERO INTERACTION: OPPOSING TEXT MOVEMENT
      // ----------------------------------------------------------------------
      const pHero = state.hero.current;
      const mainTravelX = -pHero * (winW * 0.75);
      const subTravelX = pHero * (winW * 0.55);
      const cursiveTravelX = -pHero * (winW * 0.22);

      if (heroMainRow) {
        heroMainRow.style.transform = `translate3d(${mainTravelX.toFixed(2)}px, 0, 0)`;
      }
      if (heroSubRow) {
        heroSubRow.style.transform = `translate3d(${subTravelX.toFixed(2)}px, 0, 0)`;
      }
      if (heroCursive) {
        heroCursive.style.transform = `translate3d(${cursiveTravelX.toFixed(2)}px, 0, 0)`;
      }

      // Keep hero model fixed in position while text moves behind
      if (heroModel) {
        heroModel.style.transform = 'translate3d(0, 0, 0) scale(1)';
        heroModel.style.opacity = '1';
      }

      // ----------------------------------------------------------------------
      // SECTION 01: INTRODUCTION & SPECS (CLOSE-UP + KINETIC BACKDROP)
      // ----------------------------------------------------------------------
      const pIntro = state.intro.current;
      if (introText) {
        const textTravelX = -pIntro * (winW * 0.55);
        introText.style.transform = `translate3d(${textTravelX.toFixed(2)}px, 0, 0)`;
      }
      if (introImg) {
        // Keep close-up cutout image completely fixed in position while texts move behind
        introImg.style.transform = 'none';
      }
      if (introSpecs) {
        // Keep specs and identification fixed in place along with the image
        introSpecs.style.transform = 'none';
      }

      // ----------------------------------------------------------------------
      // SECTION 03: STANDING POSES (SPATIAL EDITORIAL CANVAS VIA STRINGTUNE)
      // True scroll-driven spatial journeys with individual diagonal trajectories
      // ----------------------------------------------------------------------
      if (isDesktop && standingTrack) {
        const pS = state.standing.current;

        // 03. Section Introduction Reveal & Exit Transition
        if (standingIntroBlock) {
          if (pS < 0.22) {
            // Elegant entrance & subtle drift
            const introFade = clamp(1 - (pS - 0.12) / 0.1, 0, 1);
            const introY = -pS * 80;
            const introX = -pS * 40;
            standingIntroBlock.style.transform = `translate3d(${introX.toFixed(2)}px, ${introY.toFixed(2)}px, 0)`;
            standingIntroBlock.style.opacity = introFade.toFixed(3);
          } else {
            standingIntroBlock.style.opacity = '0';
          }
        }

        // Active tracker index calculation
        if (trackerNum) {
          let activeIndex = 1;
          if (pS >= 0.72) activeIndex = 4;
          else if (pS >= 0.46) activeIndex = 3;
          else if (pS >= 0.22) activeIndex = 2;
          trackerNum.textContent = `0${activeIndex} / 04`;
        }

        // Opposing Lateral Background Typography Interlude (Row 1 moves LEFT, Row 2 moves RIGHT)
        if (standingTypoRow1) {
          const travel1 = Math.max(winW * 0.4, standingTypoRow1.scrollWidth - winW);
          const x1 = -pS * travel1;
          standingTypoRow1.style.transform = `translate3d(${x1.toFixed(2)}px, 0, 0)`;
        }
        if (standingTypoRow2) {
          const travel2 = Math.max(winW * 0.4, standingTypoRow2.scrollWidth - winW);
          const x2 = -travel2 + pS * travel2;
          standingTypoRow2.style.transform = `translate3d(${x2.toFixed(2)}px, 0, 0)`;
        }

        // --------------------------------------------------------------------
        // POSE 01: Relaxed stance with three-quarter turn
        // Centers on entry [0.00..0.15], holds focus [0.15..0.22], glides toward upper-left with smooth fade out [0.22..0.44]
        // --------------------------------------------------------------------
        if (poseCard1) {
          let x, y, scale = 1, opacity = 1;
          const startX = winW * 0.48;
          const startY = winH * 0.16;

          if (pS < 0.22) {
            const tIn = easeInOutSine(pS / 0.14);
            x = lerp(winW * 0.62, startX, tIn);
            y = lerp(winH * 0.24, startY, tIn);
            scale = lerp(0.96, 1.0, tIn);
            opacity = easeInOutSine(pS / 0.08);
          } else {
            const tExit = easeInOutSine((pS - 0.22) / 0.22);
            x = lerp(startX, -winW * 0.35, tExit);
            y = lerp(startY, -winH * 0.20, tExit);
            scale = lerp(1.0, 0.88, tExit);
            opacity = 1 - easeInOutSine((pS - 0.22) / 0.22);
          }
          poseCard1.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
          poseCard1.style.opacity = opacity.toFixed(3);

          if (poseCaption1) {
            const capX = (pS - 0.15) * 35;
            poseCaption1.style.transform = `translate3d(${capX.toFixed(2)}px, 0, 0)`;
          }
        }

        // --------------------------------------------------------------------
        // POSE 02: Full-length, straight-on studio pose
        // Enters with smooth fade-in [0.16..0.32], holds left-center focus [0.32..0.48], glides lower-left with smooth fade-out [0.48..0.70]
        // --------------------------------------------------------------------
        if (poseCard2) {
          let x, y, scale = 1, opacity = 1;
          const focusX = winW * 0.18;
          const focusY = winH * 0.18;

          if (pS < 0.16) {
            opacity = 0;
            x = winW * 0.95;
            y = winH * 0.25;
            scale = 0.92;
          } else if (pS < 0.48) {
            const tIn = easeInOutSine((pS - 0.16) / 0.18);
            x = lerp(winW * 0.95, focusX, tIn);
            y = lerp(winH * 0.25, focusY, tIn);
            scale = lerp(0.92, 1.02, tIn);
            opacity = easeInOutSine((pS - 0.16) / 0.16);
          } else {
            const tExit = easeInOutSine((pS - 0.48) / 0.22);
            x = lerp(focusX, -winW * 0.30, tExit);
            y = lerp(focusY, winH * 0.65, tExit);
            scale = lerp(1.02, 0.90, tExit);
            opacity = 1 - easeInOutSine((pS - 0.48) / 0.22);
          }
          poseCard2.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
          poseCard2.style.opacity = opacity.toFixed(3);

          if (poseCaption2) {
            const capY = (pS - 0.35) * -45;
            poseCaption2.style.transform = `translate3d(0, ${capY.toFixed(2)}px, 0)`;
          }
        }

        // --------------------------------------------------------------------
        // POSE 03: Poised standing composition in tailored styling
        // Ascends with smooth fade-in [0.38..0.54], dominates center [0.54..0.72], ascends upper-right with smooth fade-out [0.72..0.92]
        // --------------------------------------------------------------------
        if (poseCard3) {
          let x, y, scale = 1, opacity = 1;
          const focusX = winW * 0.48;
          const focusY = winH * 0.15;

          if (pS < 0.38) {
            opacity = 0;
            x = winW * 0.65;
            y = winH * 0.95;
            scale = 0.90;
          } else if (pS < 0.72) {
            const tIn = easeInOutSine((pS - 0.38) / 0.18);
            x = lerp(winW * 0.65, focusX, tIn);
            y = lerp(winH * 0.95, focusY, tIn);
            scale = lerp(0.90, 1.03, tIn);
            opacity = easeInOutSine((pS - 0.38) / 0.16);
          } else {
            const tExit = easeInOutSine((pS - 0.72) / 0.20);
            x = lerp(focusX, winW * 1.05, tExit);
            y = lerp(focusY, -winH * 0.25, tExit);
            scale = lerp(1.03, 0.92, tExit);
            opacity = 1 - easeInOutSine((pS - 0.72) / 0.20);
          }
          poseCard3.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
          poseCard3.style.opacity = opacity.toFixed(3);

          if (poseCaption3) {
            const capX = (pS - 0.58) * -40;
            poseCaption3.style.transform = `translate3d(${capX.toFixed(2)}px, 0, 0)`;
          }
        }

        // --------------------------------------------------------------------
        // POSE 04: Full-body pose framed by generous negative space
        // Emerges smoothly from left with fade-in [0.60..0.78], holds majestic focal stance through closing [0.78..1.00]
        // --------------------------------------------------------------------
        if (poseCard4) {
          let x, y, scale = 1, opacity = 1;
          const focusX = winW * 0.32;
          const focusY = winH * 0.16;

          if (pS < 0.60) {
            opacity = 0;
            x = -winW * 0.28;
            y = winH * 0.28;
            scale = 0.92;
          } else {
            const tIn = easeInOutSine((pS - 0.60) / 0.20);
            x = lerp(-winW * 0.28, focusX, tIn);
            y = lerp(winH * 0.28, focusY, tIn);
            scale = lerp(0.92, 1.02, tIn);
            opacity = easeInOutSine((pS - 0.60) / 0.18);
          }
          poseCard4.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
          poseCard4.style.opacity = opacity.toFixed(3);

          if (poseCaption4) {
            const capX = (1 - pS) * 30;
            poseCaption4.style.transform = `translate3d(${capX.toFixed(2)}px, 0, 0)`;
          }
        }
      }

      // ----------------------------------------------------------------------
      // SECTION 04: RUNWAY / RAMP WALK (SCROLL-DRIVEN DUAL-SPLIT CHOREOGRAPHY)
      // Locks full-screen; progresses through Looks 1, 2, 3 as user scrolls;
      // then continues smoothly to footer.
      // ----------------------------------------------------------------------
      const pR = state.runway.current;
      if (runwayElements.length === 3) {
        // Look 1 active from 0.00 to 0.20
        // Transition 1 -> 2 from 0.20 to 0.44
        // Look 2 resting from 0.44 to 0.56
        // Transition 2 -> 3 from 0.56 to 0.80
        // Look 3 resting from 0.80 to 1.00
        let t12 = clamp((pR - 0.20) / 0.24, 0, 1);
        let t23 = clamp((pR - 0.56) / 0.24, 0, 1);

        // Smooth cosine S-curve easing
        t12 = easeInOutSine(t12);
        t23 = easeInOutSine(t23);

        const s1 = runwayElements[0];
        const s2 = runwayElements[1];
        const s3 = runwayElements[2];

        // Slide 1:
        // Left half moves 0 -> -100% on t12
        // Right half moves 0 -> 100% on t12
        if (s1.leftHalf) s1.leftHalf.style.transform = `translate3d(0, ${(-t12 * 100).toFixed(2)}%, 0)`;
        if (s1.rightHalf) s1.rightHalf.style.transform = `translate3d(0, ${(t12 * 100).toFixed(2)}%, 0)`;

        // Slide 2:
        // Enters on t12: Left from 100% to 0, Right from -100% to 0
        // Exits on t23: Left from 0 to -100%, Right from 0 to 100%
        const s2L_Y = (1 - t12) * 100 - t23 * 100;
        const s2R_Y = -(1 - t12) * 100 + t23 * 100;
        if (s2.leftHalf) s2.leftHalf.style.transform = `translate3d(0, ${s2L_Y.toFixed(2)}%, 0)`;
        if (s2.rightHalf) s2.rightHalf.style.transform = `translate3d(0, ${s2R_Y.toFixed(2)}%, 0)`;

        // Slide 3:
        // Enters on t23: Left from 100% to 0, Right from -100% to 0
        const s3L_Y = (1 - t23) * 100;
        const s3R_Y = -(1 - t23) * 100;
        if (s3.leftHalf) s3.leftHalf.style.transform = `translate3d(0, ${s3L_Y.toFixed(2)}%, 0)`;
        if (s3.rightHalf) s3.rightHalf.style.transform = `translate3d(0, ${s3R_Y.toFixed(2)}%, 0)`;

        // Update active page dots and counter
        let activePage = 1;
        if (pR >= 0.68) activePage = 3;
        else if (pR >= 0.32) activePage = 2;

        if (activePage !== currentRunwayPage) {
          currentRunwayPage = activePage;
          runwayDots.forEach((dot, idx) => {
            const isActive = idx + 1 === activePage;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
          });
          if (runwayCounterNums) {
            runwayCounterNums.textContent = `0${activePage} / 03`;
          }
        }
      }

      // ----------------------------------------------------------------------
      // FOOTER: ONLY THE MODEL'S NAME
      // ----------------------------------------------------------------------
      const pF = state.footer.current;
      if (footerWrap) {
        const footerY = (1 - pF) * 35;
        const footerScale = 0.96 + pF * 0.04;
        footerWrap.style.transform = `translate3d(0, ${footerY.toFixed(2)}px, 0) scale(${footerScale.toFixed(3)})`;
      }
    }

    requestAnimationFrame(renderFrame);
  }

  // 5. Kick off render loop
  requestAnimationFrame(renderFrame);

  // 6. Dot click interactions for Runway
  initRunwayAdventure();

  // 7. Initialize Exact ParallaxComponent (GSAP Timeline + ScrollTrigger)
  initParallaxComponent();

  // 8. Handle viewport resizes smoothly
  window.addEventListener('resize', () => {
    if (stringTune && typeof stringTune.onResize === 'function') {
      stringTune.onResize(true);
    }
  }, { passive: true });
}

// ============================================================================
// SECTION 04: RUNWAY / RAMP WALK CONTROLS
// Allows clicking indicator dots to scroll smoothly to that look's position
// ============================================================================
function initRunwayAdventure() {
  const container = document.getElementById('runway-adventure');
  const runwayTrack = document.getElementById('runway-section');
  if (!container || !runwayTrack) return;

  const dots = Array.from(container.querySelectorAll('.runway-dot'));

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const page = parseInt(dot.getAttribute('data-page'), 10);
      if (!page) return;
      const rect = runwayTrack.getBoundingClientRect();
      const trackTop = window.scrollY + rect.top;
      const trackScrollable = runwayTrack.offsetHeight - window.innerHeight;
      
      // Target progress: Look 1 = 0.05, Look 2 = 0.50, Look 3 = 0.90
      let targetP = 0.05;
      if (page === 2) targetP = 0.50;
      if (page === 3) targetP = 0.90;

      const dest = trackTop + targetP * trackScrollable;
      window.scrollTo({ top: dest, behavior: 'smooth' });
    });
  });
}

// ============================================================================
// EXACT PARALLAX COMPONENT CONTROLLER (GSAP + ScrollTrigger)
// Replicates the exact component structure and animation timeline
// ============================================================================
function initParallaxComponent() {
  const triggerElement = document.querySelector('[data-parallax-layers]');
  if (!triggerElement) return;

  const gsapInstance = window.gsap;
  const ScrollTriggerInstance = window.ScrollTrigger;

  if (gsapInstance && ScrollTriggerInstance) {
    gsapInstance.registerPlugin(ScrollTriggerInstance);

    const tl = gsapInstance.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "0% 0%",
        end: "100% 0%",
        scrub: 0
      }
    });

    const layers = [
      { layer: "1", yPercent: 70 },
      { layer: "2", yPercent: 55 },
      { layer: "3", yPercent: 40 },
      { layer: "4", yPercent: 10 }
    ];

    layers.forEach((layerObj, idx) => {
      tl.to(
        triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
        {
          yPercent: layerObj.yPercent,
          ease: "none"
        },
        idx === 0 ? undefined : "<"
      );
    });

    // Optional Lenis smooth scrolling integration if available
    if (window.Lenis) {
      try {
        const lenis = new window.Lenis();
        lenis.on('scroll', ScrollTriggerInstance.update);
        gsapInstance.ticker.add((time) => { lenis.raf(time * 1000); });
        gsapInstance.ticker.lagSmoothing(0);
      } catch (e) {
        console.warn('[Lenis] initialization note:', e);
      }
    }
  }
}

// Boot application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
  initPortfolio();
}
