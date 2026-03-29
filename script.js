(function () {
  "use strict";

  var TITLE = "Мастера хот-догов";
  var waveContainer = document.getElementById("waveTitle");
  var hero = document.getElementById("hero");

  function buildWaveTitle() {
    if (!waveContainer) return;
    var frag = document.createDocumentFragment();
    var index = 0;
    for (var i = 0; i < TITLE.length; i++) {
      var ch = TITLE[i];
      if (ch === " ") {
        frag.appendChild(document.createTextNode("\u00A0"));
        continue;
      }
      var span = document.createElement("span");
      span.className = "wave-char";
      span.textContent = ch;
      span.style.setProperty("--wave-i", String(index));
      index++;
      frag.appendChild(span);
    }
    waveContainer.appendChild(frag);
  }

  function initReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    nodes.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initHeroCursorTrail() {
    if (!hero) return;

    var throttleMs = 32;
    var last = 0;

    hero.addEventListener(
      "mousemove",
      function (e) {
        var now = performance.now();
        if (now - last < throttleMs) return;
        last = now;

        var rect = hero.getBoundingClientRect();
        var x = e.clientX - rect.left - 4;
        var y = e.clientY - rect.top - 4;

        var dot = document.createElement("span");
        dot.className = "cursor-dot";
        dot.style.setProperty("--tx", String(x));
        dot.style.setProperty("--ty", String(y));
        hero.appendChild(dot);

        window.setTimeout(function () {
          if (dot.parentNode) dot.parentNode.removeChild(dot);
        }, 520);
      },
      { passive: true }
    );
  }

  buildWaveTitle();
  initReveal();
  initHeroCursorTrail();
})();

// ===================== SLIDER =====================
(function () {
  const track   = document.getElementById('sliderTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dots    = document.querySelectorAll('.dot');
  const total   = document.querySelectorAll('.slide').length;
  let current   = 0;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(Number(dot.dataset.index)));
  });
})();
// ===================== /SLIDER =====================

// ===================== HOTDOG DRAGGABLE =====================
(function () {
  var el = document.getElementById('hotdogEmoji');
  if (!el) return;

  var isDragging = false;
  var startX, startY, originLeft, originTop;

  // Инициализация позиции через left/top (fixed)
  el.style.left = '16px';
  el.style.top  = '16px';

  /* ——— Мышь ——— */
  el.addEventListener('mousedown', function (e) {
    e.preventDefault();
    isDragging = true;
    el.classList.add('dragging');

    var rect = el.getBoundingClientRect();
    startX     = e.clientX;
    startY     = e.clientY;
    originLeft = rect.left;
    originTop  = rect.top;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   onMouseUp);
  });

  function onMouseMove(e) {
    if (!isDragging) return;
    var dx = e.clientX - startX;
    var dy = e.clientY - startY;
    move(originLeft + dx, originTop + dy);
  }

  function onMouseUp() {
    isDragging = false;
    el.classList.remove('dragging');
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup',   onMouseUp);
  }

  /* ——— Тач (мобильные) ——— */
  el.addEventListener('touchstart', function (e) {
    var touch = e.touches[0];
    isDragging = true;
    el.classList.add('dragging');

    var rect = el.getBoundingClientRect();
    startX     = touch.clientX;
    startY     = touch.clientY;
    originLeft = rect.left;
    originTop  = rect.top;
  }, { passive: true });

  el.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    e.preventDefault();
    var touch = e.touches[0];
    var dx = touch.clientX - startX;
    var dy = touch.clientY - startY;
    move(originLeft + dx, originTop + dy);
  }, { passive: false });

  el.addEventListener('touchend', function () {
    isDragging = false;
    el.classList.remove('dragging');
  });

  /* ——— Общая функция перемещения с ограничением по экрану ——— */
  function move(x, y) {
    var maxX = window.innerWidth  - el.offsetWidth;
    var maxY = window.innerHeight - el.offsetHeight;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
  }
})();
// ===================== /HOTDOG DRAGGABLE =====================
