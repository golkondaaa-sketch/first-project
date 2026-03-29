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
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('hotdogEmoji');
  if (!el) return;

  var offsetX = 0;
  var offsetY = 0;
  var active  = false;

  /* ——— начало перетаскивания ——— */
  function startDrag(clientX, clientY) {
    var rect = el.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
    active  = true;
    el.classList.add('dragging');
  }

  /* ——— движение ——— */
  function duringDrag(clientX, clientY) {
    if (!active) return;
    var x = clientX - offsetX;
    var y = clientY - offsetY;
    var maxX = window.innerWidth  - el.offsetWidth;
    var maxY = window.innerHeight - el.offsetHeight;
    el.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    el.style.top  = Math.max(0, Math.min(y, maxY)) + 'px';
  }

  /* ——— конец перетаскивания ——— */
  function endDrag() {
    active = false;
    el.classList.remove('dragging');
  }

  /* ——— Мышь ——— */
  el.addEventListener('mousedown', function (e) {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  });

  document.addEventListener('mousemove', function (e) {
    duringDrag(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', endDrag);

  /* ——— Тач ——— */
  el.addEventListener('touchstart', function (e) {
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  document.addEventListener('touchmove', function (e) {
    if (!active) return;
    e.preventDefault();
    duringDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  document.addEventListener('touchend', endDrag);
});
// ===================== /HOTDOG DRAGGABLE =====================
