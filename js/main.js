(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch (e) {}
    if (toggle) toggle.setAttribute("aria-pressed", t === "dark" ? "true" : "false");
    window.dispatchEvent(new CustomEvent("themechange", { detail: t }));
  }
  if (!root.getAttribute("data-theme")) setTheme("light");
  if (toggle) {
    toggle.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  window.addEventListener("load", function () {
    document.querySelectorAll(".hero h1 .ln i").forEach(function (el) {
      if (reduce) { el.style.transform = "none"; return; }
      el.style.transition = "transform .9s cubic-bezier(.22,1,.36,1)";
      el.style.transitionDelay = getComputedStyle(el).getPropertyValue("--d");
      requestAnimationFrame(function () { el.style.transform = "translateY(0)"; });
    });
  });

  var reveals = document.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 0.07) + "s";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  var bar = document.getElementById("progress");
  function upd() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max * 100) : 0) + "%";
  }
  document.addEventListener("scroll", upd, { passive: true });
  upd();

  if (!reduce && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    var cur = document.createElement("div");
    cur.className = "cursor";
    document.body.appendChild(cur);
    var cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy, shown = false;
    document.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; cur.classList.add("on"); }
    }, { passive: true });
    document.addEventListener("pointerover", function (e) {
      cur.classList.toggle("hov", !!e.target.closest("a,button,.logo,.feature,.contact-links a,.nav-links a"));
    }, { passive: true });
    document.addEventListener("mouseleave", function () { cur.classList.remove("on"); shown = false; });
    var ccap = 0;
    (function loop() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cur.style.left = cx + "px"; cur.style.top = cy + "px";
      if (!window.__CAP || ccap++ < 120) requestAnimationFrame(loop);
    })();
  }

  if (!reduce && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    document.querySelectorAll(".btn").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        b.style.transform = "translate(" + mx * 0.3 + "px," + my * 0.4 + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });

    var frame = document.querySelector(".portrait .frame");
    if (frame) {
      frame.style.willChange = "transform";
      window.addEventListener("scroll", function () {
        var r = frame.getBoundingClientRect();
        var off = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        frame.style.transform = "translateY(" + (off * -16) + "px)";
      }, { passive: true });
    }
  }

  var track = document.querySelector(".marquee-track");
  if (track && !reduce) {
    track.classList.add("js");
    var x = 0, vel = 0, half = 0, last = window.scrollY, base = 0.045, hover = false, prev = 0, mcap = 0;
    function measure() { half = track.scrollWidth / 2; }
    measure();
    window.addEventListener("load", measure);
    window.addEventListener("resize", measure, { passive: true });
    var box = track.closest(".marquee");
    if (box) {
      box.addEventListener("pointerenter", function () { hover = true; });
      box.addEventListener("pointerleave", function () { hover = false; });
    }
    window.addEventListener("scroll", function () {
      var y = window.scrollY; vel += Math.abs(y - last); last = y;
    }, { passive: true });
    function frame(t) {
      var dt = prev ? Math.min(t - prev, 50) : 16; prev = t;
      var speed = (hover ? base * 0.25 : base) * dt + vel * 0.9;
      x -= speed;
      vel *= 0.86;
      if (half) { while (x <= -half) x += half; while (x > 0) x -= half; }
      track.style.transform = "translateX(" + x + "px)";
      if (!window.__CAP || mcap++ < 200) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
