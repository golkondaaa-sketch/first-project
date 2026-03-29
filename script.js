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

  // Смещение курсора внутри элемента в момент захвата
  var offsetX = 0;
  var offsetY = 0;

  /* ——— Мышь ——— */
  el.addEventListener('mousedown', function (e) {
    e.preventDefault();

    // Текущая позиция элемента
    var rect = el.getBoundingClientRect();

    // Смещение точки клика относительно левого верхнего угла элемента
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    el.classList.add('dragging');

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(e) {
    var x = e.clientX - offsetX;
    var y = e.clientY - offsetY;
    moveTo(x, y);
  }

  function onMouseUp() {
    el.classList.remove('dragging');
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  /* ——— Тач (мобильные) ——— */
  el.addEventListener('touchstart', function (e) {
    var touch = e.touches[0];
    var rect = el.getBoundingClientRect();

    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    el.classList.add('dragging');
  }, { passive: true });

  el.addEventListener('touchmove', function (e) {
    e.preventDefault();
    var touch = e.touches[0];
    var x = touch.clientX - offsetX;
    var y = touch.clientY - offsetY;
    moveTo(x, y);
  }, { passive: false });

  el.addEventListener('touchend', function () {
    el.classList.remove('dragging');
  });

  /* ——— Перемещение с ограничением по границам экрана ——— */
  function moveTo(x, y) {
    var maxX = window.innerWidth - el.offsetWidth;
    var maxY = window.innerHeight - el.offsetHeight;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
  }
})();
// ===================== /HOTDOG DRAGGABLE =====================
