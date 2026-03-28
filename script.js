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
