/* Pastas de vidro dos projetos.
   O conteúdo (títulos, descrições, prints e link do GitHub) está no HTML;
   aqui só ficam comportamento, medidas e o lightbox. */
(function () {
  "use strict";

  var rail = document.getElementById("folders");
  if (!rail) return;

  var W = 340;
  var H = 272;
  var section = document.getElementById("projects");
  var roots = [];
  var openRoots = [];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var EASE = "cubic-bezier(.22,1,.36,1)";

  function syncOpen() {
    if (section) section.classList.toggle("folder-open", openRoots.length > 0);
  }

  function fit(root) {
    var w = root.clientWidth;
    if (!w) return;
    var k = w / W;
    var stage = root.querySelector(".gf-stage");
    root.style.height = H * k + "px";
    stage.style.transform = "scale(" + k + ")";
  }

  function applyTone() {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    roots.forEach(function (root) {
      root.setAttribute("data-tone", dark ? "dark" : "light");
    });
  }

  function closeFolder(root) {
    if (!root) return;
    root.removeAttribute("data-open");
    root.querySelector(".gf-hit").setAttribute("aria-expanded", "false");
    root.querySelector(".gf-files").setAttribute("inert", "");
    openRoots = openRoots.filter(function (r) { return r !== root; });
    syncOpen();
  }

  function openFolder(root) {
    root.setAttribute("data-open", "");
    root.querySelector(".gf-hit").setAttribute("aria-expanded", "true");
    root.querySelector(".gf-files").removeAttribute("inert");
    if (openRoots.indexOf(root) < 0) openRoots.push(root);
    syncOpen();
  }

  // atualiza a dica "arraste" somente quando a rail realmente transborda
  function updateHint() {
    var noScroll = rail.scrollWidth <= rail.clientWidth + 1;
    rail.classList.toggle("no-scroll", noScroll);
  }

  // ---- carrossel infinito: blocos [clones | originais | clones]; a posição fica no bloco do meio
  var orig = Array.prototype.slice.call(rail.children);
  var lead = [];
  var trail = [];
  var loopOn = false;

  function cloneFolder(el, n) {
    var c = el.cloneNode(true);
    c.classList.add("is-clone");
    c.setAttribute("aria-hidden", "true");
    // clones precisam receber clique (inert bloqueia); fora da tabulação para não duplicar o foco
    c.querySelectorAll("button, a").forEach(function (x) { x.setAttribute("tabindex", "-1"); });
    c.querySelectorAll("[id]").forEach(function (x) { x.id = x.id + "-c" + n; });
    c.querySelectorAll("*").forEach(function (x) {
      Array.prototype.forEach.call(x.attributes, function (a) {
        if (a.value.indexOf("#gf-rim-") >= 0) {
          x.setAttribute(a.name, a.value.replace(/#(gf-rim-[\w-]+)/g, "#$1-c" + n));
        }
      });
    });
    return c;
  }

  if (orig.length && orig[orig.length - 1].getBoundingClientRect().right - orig[0].getBoundingClientRect().left > rail.clientWidth) {
    loopOn = true;
    rail.classList.add("is-loop"); // snap puxa a roda de volta para a pasta mais próxima
    lead =orig.map(function (el) { return cloneFolder(el, 1); });
    trail = orig.map(function (el) { return cloneFolder(el, 2); });
    lead.forEach(function (c) { rail.insertBefore(c, orig[0]); });
    trail.forEach(function (c) { rail.appendChild(c); });
  }

  // distância entre dois blocos iguais (independe do scroll)
  function blockWidth() {
    return orig[0].getBoundingClientRect().left - lead[0].getBoundingClientRect().left;
  }

  // devolve a posição para o bloco do meio; ajusta o arraste em andamento
  function recenter() {
    if (!loopOn) return;
    var w = blockWidth();
    if (!w) return;
    var before = rail.scrollLeft;
    if (before >= w && before < 2 * w) return;
    var r = (before - w) % w;
    if (r < 0) r += w;
    rail.scrollLeft = w + r;
    if (drag) drag.left += rail.scrollLeft - before;
  }

  Array.prototype.forEach.call(rail.querySelectorAll(".gf-root"), function (root, index) {
    var title = root.querySelector(".gf-title").textContent.trim();
    var filesEl = root.querySelector(".gf-files");
    var hit = root.querySelector(".gf-hit");
    var sheets = Array.prototype.slice.call(filesEl.querySelectorAll(".gf-sheet"));

    filesEl.setAttribute("aria-label", title + " prints");
    filesEl.setAttribute("inert", "");
    hit.setAttribute("aria-expanded", "false");

    sheets.forEach(function (sheet, i) {
      sheet.setAttribute("data-shot", String(i));
      sheet.addEventListener("click", function () {
        openLightbox(root, i, sheet);
      });
    });

    // cópias do loop abrem/fecham junto com a original (mesmo grupo)
    root.dataset.group = String(index % Math.max(1, orig.length || 1));
    var group = function () {
      return Array.prototype.slice.call(rail.querySelectorAll('.gf-root[data-group="' + root.dataset.group + '"]'));
    };

    hit.addEventListener("click", function () {
      var open = root.hasAttribute("data-open");
      group().forEach(function (r) { if (open) closeFolder(r); else openFolder(r); });
    });

    root.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.hasAttribute("data-open")) {
        group().forEach(closeFolder);
        hit.focus();
      }
    });

    // paralaxe leve do vidro seguindo o cursor
    if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      var raf = 0, px = 0, py = 0;
      var write = function () {
        raf = 0;
        root.style.setProperty("--gf-px", px.toFixed(3));
        root.style.setProperty("--gf-py", py.toFixed(3));
      };
      root.addEventListener("pointermove", function (e) {
        var r = root.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width) * 2 - 1;
        py = ((e.clientY - r.top) / r.height) * 2 - 1;
        if (!raf) raf = requestAnimationFrame(write);
      });
      root.addEventListener("pointerleave", function () {
        px = 0;
        py = 0;
        if (!raf) raf = requestAnimationFrame(write);
      });
    }

    fit(root);
    if ("ResizeObserver" in window) {
      new ResizeObserver(function () { fit(root); updateHint(); }).observe(root);
    }

    roots.push(root);
  });

  applyTone();
  updateHint();
  window.addEventListener("themechange", applyTone);
  window.addEventListener("resize", updateHint, { passive: true });

  // barra oculta: roda do mouse vira rolagem horizontal enquanto a rail tiver para onde ir
  rail.addEventListener("wheel", function (e) {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    if (!loopOn) {
      var max = rail.scrollWidth - rail.clientWidth;
      var next = rail.scrollLeft + e.deltaY;
      if (max <= 0 || (e.deltaY < 0 && rail.scrollLeft <= 0) || (e.deltaY > 0 && rail.scrollLeft >= max)) return;
      e.preventDefault();
      rail.scrollLeft = Math.max(0, Math.min(max, next));
      return;
    }
    // em loop não há ponta: a roda sempre rola a galeria
    e.preventDefault();
    rail.scrollLeft += e.deltaY;
    recenter();
  }, { passive: false });

  rail.addEventListener("scroll", recenter, { passive: true });
  window.addEventListener("resize", recenter, { passive: true });
  if (loopOn) rail.scrollLeft = blockWidth();

  // arrastar com o mouse (o hint "arraste" promete isso); clique só dispara se não houve arraste
  var drag = null;
  rail.addEventListener("pointerdown", function (e) {
    delete rail.dataset.justDragged; // um clique novo nunca herda o arraste anterior
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag = { x: e.clientX, left: rail.scrollLeft, moved: false };
  });
  window.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < 5) return;
    if (!drag.moved) {
      drag.moved = true;
      rail.classList.add("is-dragging");
    }
    rail.scrollLeft = drag.left - dx;
    recenter();
  });
  window.addEventListener("pointerup", function () {
    if (!drag) return;
    var moved = drag.moved;
    drag = null;
    rail.classList.remove("is-dragging");
    if (moved) rail.dataset.justDragged = "1";
  });
  rail.addEventListener("click", function (e) {
    if (rail.dataset.justDragged) {
      delete rail.dataset.justDragged;
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // fecha pastas abertas ao clicar fora (o lightbox é tratado à parte)
  document.addEventListener("pointerdown", function (e) {
    if (lb && lb.contains(e.target)) return;
    var inside = e.target.closest ? e.target.closest(".gf-root") : null;
    var keep = inside ? inside.dataset.group : null;
    openRoots.slice().forEach(function (root) {
      if (!root.contains(e.target) && root.dataset.group !== keep) closeFolder(root);
    });
  });

  // ---- lightbox -----------------------------------------------------------
  var lb = null;
  var lbRoot = null;
  var lbIndex = 0;
  var lastFocus = null;
  var stepping = false;
  var lbToken = 0;
  var zoomed = false;

  function buildLightbox() {
    lb = document.createElement("div");
    lb.className = "lb";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML =
      '<button type="button" class="lb-close" aria-label="Fechar">&times;</button>' +
      '<button type="button" class="lb-nav lb-prev" aria-label="Print anterior">&#8592;</button>' +
      '<figure class="lb-fig"><img alt=""></figure>' +
      '<button type="button" class="lb-nav lb-next" aria-label="Próximo print">&#8594;</button>';
    document.body.appendChild(lb);

    lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
    lb.querySelector(".lb-prev").addEventListener("click", function () { step(-1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { step(1); });
    lb.querySelector(".lb-fig img").addEventListener("click", function () {
      zoomed = !zoomed;
      lb.classList.toggle("zoomed", zoomed);
    });
    lb.addEventListener("pointerdown", function (e) {
      if (e.target === lb) closeLightbox();
    });
  }

  function sheetsOf(root) {
    return Array.prototype.slice.call(root.querySelectorAll(".gf-sheet"));
  }

  function setShot() {
    var sheet = sheetsOf(lbRoot)[lbIndex];
    var img = lb.querySelector("img");
    img.src = sheet.querySelector(".gf-sheet-art").getAttribute("src");
    img.alt = sheet.querySelector(".gf-sheet-art").getAttribute("alt") || "";
    zoomed = false;
    lb.classList.remove("zoomed");
  }

  function sheetFor(root, index) {
    return root.querySelector('.gf-sheet[data-shot="' + index + '"]');
  }

  function resetImg(img) {
    img.style.transition = "none";
    img.style.transform = "";
    img.style.transformOrigin = "";
    img.style.opacity = "";
  }

  function step(dir) {
    var n = sheetsOf(lbRoot).length;
    if (n < 2 || stepping) return;
    var img = lb.querySelector("img");
    if (reduceMotion.matches) {
      lbIndex = (lbIndex + dir + n) % n;
      setShot();
      return;
    }
    stepping = true;
    img.style.transition = "transform .18s ease-in,opacity .18s ease-in";
    img.style.transform = "translateX(" + -40 * dir + "px) scale(.97)";
    img.style.opacity = "0";
    setTimeout(function () {
      lbIndex = (lbIndex + dir + n) % n;
      setShot();
      img.style.transition = "none";
      img.style.transform = "translateX(" + 40 * dir + "px) scale(.97)";
      requestAnimationFrame(function () {
        img.style.transition = "transform .32s " + EASE + ",opacity .32s " + EASE;
        img.style.transform = "";
        img.style.opacity = "1";
        setTimeout(function () { stepping = false; }, 340);
      });
    }, 180);
  }

  function openLightbox(root, index, trigger) {
    if (!lb) buildLightbox();
    lbToken++;
    lbRoot = root;
    lbIndex = index;
    lastFocus = trigger || document.activeElement;
    stepping = false;
    zoomed = false;
    lb.classList.remove("zoomed");
    setShot();
    lb.classList.add("on");
    document.documentElement.classList.add("lb-open");

    var img = lb.querySelector("img");
    resetImg(img);
    var from = trigger || sheetFor(root, index);
    if (!reduceMotion.matches && from) {
      from.style.transition = "opacity .18s";
      from.style.opacity = "0";
      setTimeout(function () {
        from.style.opacity = "";
        from.style.transition = "";
      }, 560);
      var src = from.getBoundingClientRect();
      requestAnimationFrame(function () {
        var tgt = img.getBoundingClientRect();
        if (!tgt.width || !src.width) return;
        img.style.transformOrigin = "0 0";
        img.style.transform =
          "translate(" + (src.left - tgt.left) + "px," + (src.top - tgt.top) + "px) scale(" +
          src.width / tgt.width + "," + src.height / tgt.height + ")";
        img.style.opacity = "0.35";
        requestAnimationFrame(function () {
          img.style.transition = "transform .52s " + EASE + ",opacity .35s " + EASE;
          img.style.transform = "";
          img.style.opacity = "1";
        });
      });
    }
    lb.querySelector(".lb-close").focus();
  }

  function closeLightbox() {
    if (!lb.classList.contains("on")) return;
    var img = lb.querySelector("img");
    var to = sheetFor(lbRoot, lbIndex) || lastFocus;
    var host = (to && to.closest && to.closest(".gf-root")) || lbRoot;
    var token = ++lbToken;
    var wait = 0;
    lb.classList.remove("on");
    lb.classList.remove("zoomed");
    document.documentElement.classList.remove("lb-open");

    if (!reduceMotion.matches && to && to.getBoundingClientRect().width) {
      var tgt = img.getBoundingClientRect();
      var dst = to.getBoundingClientRect();
      to.style.transition = "opacity .18s";
      to.style.opacity = "0";
      img.style.transformOrigin = "0 0";
      img.style.transition = "transform .44s " + EASE + ",opacity .34s " + EASE;
      img.style.transform =
        "translate(" + (dst.left - tgt.left) + "px," + (dst.top - tgt.top) + "px) scale(" +
        dst.width / tgt.width + "," + dst.height / tgt.height + ")";
      img.style.opacity = "0";
      wait = 470;
    } else {
      resetImg(img);
    }

    // o print volta para a pasta e só então a pasta minimiza
    setTimeout(function () {
      if (to) {
        to.style.opacity = "";
        to.style.transition = "";
      }
      if (token !== lbToken) return;
      resetImg(img);
      closeFolder(host);
      var hit = host && host.querySelector(".gf-hit");
      if (hit) hit.focus();
      else if (lastFocus) lastFocus.focus();
    }, wait);
  }

  document.addEventListener("keydown", function (e) {
    if (!lb || !lb.classList.contains("on")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });
})();
