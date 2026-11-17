/** ASHFAQUE cinematic name assembly intro. */
(function initNameLoader() {
  'use strict';
  const loader = document.getElementById('luka-loader');
  if (!loader) return;

  document.documentElement.classList.add('luka-loading');
  document.body.classList.add('luka-loading');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  const letters = 'ASHFAQUE'.split('');
  const target = loader.querySelector('.luka-target-word');
  const flyingLayer = loader.querySelector('.luka-flying-letters');
  letters.forEach((letter, index) => {
    const slot = document.createElement('span');
    slot.className = 'luka-target-slot';
    slot.dataset.slot = index;
    slot.textContent = letter;
    target.appendChild(slot);

    const flying = document.createElement('span');
    flying.className = 'luka-flying-letter';
    flying.dataset.slot = index;
    flying.textContent = letter;
    flyingLayer.appendChild(flying);
  });

  function finish() {
    document.documentElement.classList.remove('luka-loading');
    document.body.classList.remove('luka-loading');
    loader.remove();
  }

  function completeIntro() {
    finish();
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function animate(gsap) {
    const slots = [...loader.querySelectorAll('.luka-target-slot')];
    const flying = [...loader.querySelectorAll('.luka-flying-letter')];
    const rects = slots.map(slot => slot.getBoundingClientRect());
    const width = window.innerWidth;
    const height = window.innerHeight;
    const baseline = rects[0].top;
    const pad = Math.max(rects[0].left, width * .035);
    const top = Math.max(height * .06, 24);
    flying.forEach((letter, index) => {
      const rect = rects[index];
      const right = width - rect.width - pad;
      gsap.set(letter, {
        x: index % 2 ? right : pad,
        y: index < 4 ? top : baseline,
        rotationX: index % 2 ? -35 : 35,
        rotationY: index % 2 ? 18 : -18,
        scale: .72,
        opacity: 1,
        visibility: 'visible'
      });
    });
    const timeline = gsap.timeline({ onComplete: completeIntro });
    flying.forEach((letter, index) => {
      timeline.to(letter, {
        x: rects[index].left,
        y: baseline,
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        duration: .9,
        ease: 'power3.out'
      }, index * .1);
    });
    timeline.to(loader, { yPercent: -100, duration: .95, ease: 'power3.inOut' }, '+=.4');
  }

  function animateWithoutGsap() {
    const slots = [...loader.querySelectorAll('.luka-target-slot')];
    const flying = [...loader.querySelectorAll('.luka-flying-letter')];
    const rects = slots.map(slot => slot.getBoundingClientRect());
    const width = window.innerWidth;
    const height = window.innerHeight;
    const baseline = rects[0].top;
    const pad = Math.max(rects[0].left, width * .035);
    const flights = flying.map((letter, index) => {
      const rect = rects[index];
      const startX = index % 2 ? width - rect.width - pad : pad;
      const startY = index < 4 ? Math.max(height * .06, 24) : baseline;
      const start = `translate3d(${startX}px, ${startY}px, 0) rotateX(${index % 2 ? -35 : 35}deg) scale(.72)`;
      const end = `translate3d(${rect.left}px, ${baseline}px, 0) rotateX(0deg) rotateY(0deg) scale(1)`;
      letter.style.opacity = '0';
      letter.style.visibility = 'visible';
      return letter.animate([
        { opacity: 0, transform: start },
        { opacity: 1, transform: end }
      ], {
        duration: 900,
        delay: index * 100,
        easing: 'cubic-bezier(.16, 1, .3, 1)',
        fill: 'forwards'
      });
    });

    Promise.all(flights.map(flight => flight.finished.catch(() => undefined))).then(() => {
      const exit = loader.animate(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }],
        { duration: 950, delay: 350, easing: 'cubic-bezier(.76, 0, .24, 1)', fill: 'forwards' }
      );
      exit.finished.then(completeIntro).catch(completeIntro);
    });
  }

  if (window.gsap) animate(window.gsap);
  else if (flyingLayer.animate) animateWithoutGsap();
  else finish();
})();
