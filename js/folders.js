/* Galeria de projetos em pastas de vidro (vanilla, sem dependências).
   Os dados ficam em PROJECTS; cada pasta abre e os prints abrem num lightbox. */
(function () {
  "use strict";

  var PROJECTS = [
    {
      id: "skills-launcher",
      name: "Skills Launcher",
      about: "Gerenciador de skills para agentes de IA, com instalação, backup e rollback.",
      stack: [
        { name: "Tauri", icon: "devicon-tauri-plain" },
        { name: "React", icon: "devicon-react-original" },
        { name: "TypeScript", icon: "devicon-typescript-plain" },
        { name: "Rust", icon: "devicon-rust-plain" },
        { name: "Tailwind CSS", icon: "devicon-tailwindcss-plain" },
        { name: "SQLite", icon: "devicon-sqlite-plain" }
      ],
      repo: "https://github.com/RodrigoKuerten/skills-launcher",
      cover: "assets/projects/skills-launcher/home.png",
      shots: [
        { src: "assets/projects/skills-launcher/home.png", name: "Home", meta: "Início" },
        { src: "assets/projects/skills-launcher/explore.png", name: "Explore", meta: "Catálogo" },
        { src: "assets/projects/skills-launcher/library.png", name: "Library", meta: "Instaladas" },
        { src: "assets/projects/skills-launcher/settings.png", name: "Settings", meta: "Ajustes" }
      ]
    },
    {
      id: "eccomerce",
      name: "Ecommerce",
      about: "E-commerce fullstack com catálogo, carrinho e pedidos em Spring Boot e Angular.",
      stack: [
        { name: "Java", icon: "devicon-java-plain" },
        { name: "Spring Boot", icon: "devicon-spring-plain" },
        { name: "Angular", icon: "devicon-angular-plain" },
        { name: "TypeScript", icon: "devicon-typescript-plain" },
        { name: "Tailwind CSS", icon: "devicon-tailwindcss-plain" },
        { name: "MySQL", icon: "devicon-mysql-plain" }
      ],
      repo: "https://github.com/RodrigoKuerten/eccomerce",
      cover: "assets/projects/ecommerce/home.jpg",
      shots: [
        { src: "assets/projects/ecommerce/home.jpg", name: "Home", meta: "Vitrine" },
        { src: "assets/projects/ecommerce/catalog.jpg", name: "Catálogo", meta: "Produtos" },
        { src: "assets/projects/ecommerce/product.jpg", name: "Produto", meta: "Detalhe" },
        { src: "assets/projects/ecommerce/cart.jpg", name: "Carrinho", meta: "Checkout" },
        { src: "assets/projects/ecommerce/login.jpg", name: "Login", meta: "Conta" }
      ]
    }
  ];

  var rail = document.getElementById("folders");
  if (!rail) return;

  var W = 340;
  var H = 272;
  var FRONT_H = 198;
  var MAX_VISIBLE = 5;

  var BACK_PATH =
    "M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z";
  var FRONT_PATH =
    "M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 " +
    (FRONT_H - 22) +
    "A22 22 0 0 1 318 " +
    FRONT_H +
    "L22 " +
    FRONT_H +
    "A22 22 0 0 1 0 " +
    (FRONT_H - 22) +
    "Z";

  var roots = [];
  var openRoots = [];
  var section = document.getElementById("projects");

  // abre espaço para os prints: o título sobe quando alguma pasta está aberta
  function syncOpen() {
    if (section) section.classList.toggle("folder-open", openRoots.length > 0);
  }

  function slotOf(i, n) {
    return n <= 1 ? 0 : (i / (n - 1)) * 2 - 1;
  }

  function build(project, index) {
    var item = document.createElement("div");
    item.className = "folder-item";

    var root = document.createElement("div");
    root.className = "gf-root";
    root.setAttribute("data-place", "bottom-left");
    root.setAttribute("data-entered", "");
    root.setAttribute("data-project", project.id);

    var rid = "gf-rim-" + project.id;
    root.innerHTML =
      '<div class="gf-stage">' +
        '<div class="gf-tilt">' +
          '<div class="gf-shadow" aria-hidden="true"></div>' +
          '<div class="gf-back" aria-hidden="true" style="clip-path:path(\'' + BACK_PATH + '\')">' +
            '<img class="gf-art" alt="" draggable="false">' +
            '<div class="gf-back-sheen"></div>' +
          '</div>' +
          '<svg class="gf-rim gf-back-rim" viewBox="0 0 340 272" aria-hidden="true"><path d="' + BACK_PATH + '"/></svg>' +
          '<div class="gf-front" style="clip-path:path(\'' + FRONT_PATH + '\')">' +
            '<div class="gf-tint" aria-hidden="true"></div>' +
            '<div class="gf-spec" aria-hidden="true"></div>' +
            '<svg class="gf-rim gf-front-rim" viewBox="0 0 340 198" aria-hidden="true">' +
              '<defs><linearGradient id="' + rid + '" x1="0" y1="0" x2="0" y2="1">' +
                '<stop offset="0" stop-color="#fff" stop-opacity=".95"/>' +
                '<stop offset=".35" stop-color="#fff" stop-opacity=".35"/>' +
                '<stop offset="1" stop-color="#fff" stop-opacity=".12"/>' +
              '</linearGradient></defs>' +
              '<path d="' + FRONT_PATH + '" stroke="url(#' + rid + ')"/>' +
            '</svg>' +
            '<button type="button" class="gf-hit"></button>' +
            '<div class="gf-label">' +
              '<span class="gf-title"></span>' +
              '<span class="gf-desc"></span>' +
              '<span class="gf-stack"></span>' +
            '</div>' +
          '</div>' +
          '<div class="gf-files" role="list"></div>' +
        '</div>' +
      '</div>';

    var backImg = root.querySelector(".gf-art");
    backImg.src = project.cover;
    backImg.alt = "";
    backImg.decoding = "async";

    root.querySelector(".gf-title").textContent = project.name;
    root.querySelector(".gf-desc").textContent = project.about;

    var stackEl = root.querySelector(".gf-stack");
    project.stack.forEach(function (tech) {
      var icon = document.createElement("i");
      icon.className = tech.icon;
      icon.title = tech.name;
      icon.setAttribute("role", "img");
      icon.setAttribute("aria-label", tech.name);
      stackEl.appendChild(icon);
    });

    var filesEl = root.querySelector(".gf-files");
    filesEl.setAttribute("aria-label", project.name + " prints");
    filesEl.setAttribute("inert", "");

    var shots = project.shots.slice(-MAX_VISIBLE);
    var first = project.shots.length - shots.length;

    shots.forEach(function (shot, v) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "gf-sheet gf-sheet--art";
      b.setAttribute("data-shot", String(first + v));
      b.style.setProperty("--gf-slot", slotOf(v, shots.length).toFixed(3));
      b.style.setProperty("--gf-depth", shots.length - 1 - v);
      b.style.setProperty("--gf-jx", ((v * 3) % 7 - 3) + "px");
      b.style.setProperty("--gf-jr", ((v * 2.1) % 3 - 1.5).toFixed(2) + "deg");
      b.style.zIndex = v + 1;
      b.innerHTML =
        '<img class="gf-sheet-art" alt="" draggable="false" decoding="async">' +
        '<span class="gf-sheet-head"><span class="gf-sheet-name"></span><span class="gf-sheet-meta"></span></span>';
      var img = b.querySelector(".gf-sheet-art");
      img.src = shot.src;
      img.alt = project.name + " — " + shot.name;
      b.querySelector(".gf-sheet-name").textContent = shot.name;
      b.querySelector(".gf-sheet-meta").textContent = shot.meta;
      b.addEventListener("click", function () {
        openLightbox(project, first + v, b);
      });
      filesEl.appendChild(b);
    });

    var hit = root.querySelector(".gf-hit");
    hit.setAttribute("aria-label", "Abrir " + project.name + ", " + project.shots.length + " prints");
    hit.setAttribute("aria-expanded", "false");

    hit.addEventListener("click", function () {
      var next = !root.hasAttribute("data-open");
      root.toggleAttribute("data-open", next);
      hit.setAttribute("aria-expanded", String(next));
      filesEl.toggleAttribute("inert", !next);
      if (next) {
        openRoots.push(root);
      } else {
        openRoots = openRoots.filter(function (r) { return r !== root; });
      }
      syncOpen();
    });

    root.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.hasAttribute("data-open")) {
        root.removeAttribute("data-open");
        hit.setAttribute("aria-expanded", "false");
        filesEl.setAttribute("inert", "");
        hit.focus();
        openRoots = openRoots.filter(function (r) { return r !== root; });
        syncOpen();
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
        px = 0; py = 0;
        if (!raf) raf = requestAnimationFrame(write);
      });
    }

    rail.appendChild(item);
    item.appendChild(root);

    roots.push({ root: root, project: project, index: index });
    fit(root);

    if ("ResizeObserver" in window) {
      new ResizeObserver(function () { fit(root); }).observe(root);
    }
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
    roots.forEach(function (entry) {
      entry.root.setAttribute("data-tone", dark ? "dark" : "light");
    });
  }

  PROJECTS.forEach(build);
  // aquece o cache: os prints abrem no lightbox sem esperar download
  PROJECTS.forEach(function (project) {
    project.shots.forEach(function (shot) {
      var img = new Image();
      img.src = shot.src;
    });
  });
  applyTone();
  window.addEventListener("themechange", applyTone);

  // fecha pastas abertas ao clicar fora
  document.addEventListener("pointerdown", function (e) {
    if (lb && lb.contains(e.target)) return;
    openRoots.slice().forEach(function (root) {
      if (root.contains(e.target)) return;
      root.removeAttribute("data-open");
      var hit = root.querySelector(".gf-hit");
      hit.setAttribute("aria-expanded", "false");
      root.querySelector(".gf-files").setAttribute("inert", "");
      openRoots = openRoots.filter(function (r) { return r !== root; });
    });
    syncOpen();
  });

  // ---- lightbox -----------------------------------------------------------
  var lb = null;
  var lbProject = null;
  var lbIndex = 0;
  var lastFocus = null;
  var stepping = false;
  var lbToken = 0;

  function closeFolder(root) {
    if (!root) return;
    root.removeAttribute("data-open");
    root.querySelector(".gf-hit").setAttribute("aria-expanded", "false");
    root.querySelector(".gf-files").setAttribute("inert", "");
    openRoots = openRoots.filter(function (r) { return r !== root; });
    syncOpen();
  }

  function buildLightbox() {
    lb = document.createElement("div");
    lb.className = "lb";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML =
      '<button type="button" class="lb-close" aria-label="Fechar">&times;</button>' +
      '<button type="button" class="lb-nav lb-prev" aria-label="Print anterior">&#8592;</button>' +
      '<figure class="lb-fig">' +
        '<img alt="">' +
      '</figure>' +
      '<button type="button" class="lb-nav lb-next" aria-label="Próximo print">&#8594;</button>';
    document.body.appendChild(lb);

    lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
    lb.querySelector(".lb-prev").addEventListener("click", function () { step(-1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { step(1); });
    lb.addEventListener("pointerdown", function (e) {
      if (e.target === lb) closeLightbox();
    });
  }

  function setShot() {
    var shot = lbProject.shots[lbIndex];
    var img = lb.querySelector("img");
    img.src = shot.src;
    img.alt = lbProject.name + " — " + shot.name;
  }

  function sheetFor(project, index) {
    return document.querySelector(
      '.gf-root[data-project="' + project.id + '"] .gf-sheet[data-shot="' + index + '"]'
    );
  }

  function resetImg(img) {
    img.style.transition = "none";
    img.style.transform = "";
    img.style.transformOrigin = "";
    img.style.opacity = "";
  }

  var EASE = "cubic-bezier(.22,1,.36,1)";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function step(dir) {
    var n = lbProject.shots.length;
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

  function openLightbox(project, index, trigger) {
    if (!lb) buildLightbox();
    lbToken++;
    lbProject = project;
    lbIndex = index;
    lastFocus = trigger || document.activeElement;
    stepping = false;
    setShot();
    lb.classList.add("on");
    document.documentElement.classList.add("lb-open");

    var img = lb.querySelector("img");
    resetImg(img);
    var from = trigger || sheetFor(project, index);
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
    var to = sheetFor(lbProject, lbIndex) || lastFocus;
    var host =
      (to && to.closest && to.closest(".gf-root")) ||
      document.querySelector('.gf-root[data-project="' + lbProject.id + '"]');
    var token = ++lbToken;
    var wait = 0;
    lb.classList.remove("on");
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
