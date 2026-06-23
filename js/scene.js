(function () {
  "use strict";
  if (typeof THREE === "undefined" || window.__NOGL) return;

  var canvas = document.getElementById("scene");
  if (!canvas) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function cssColor(name, fb) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (!v) return fb;
    if (v.indexOf(",") > -1) { var p = v.split(",").map(Number); return (p[0] << 16) | (p[1] << 8) | p[2]; }
    return new THREE.Color(v).getHex();
  }
  var BONE = cssColor("--3d", 0xf0eee9);
  var INK = cssColor("--ink", 0x111111);
  var ACCENT = 0xff5a00;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(BONE, 5.5, 12);

  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.z = 7;

  var group = new THREE.Group();
  scene.add(group);

  var geometry = new THREE.TorusKnotGeometry(1.55, 0.5, 220, 32, 2, 3);

  var wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(geometry),
    new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.42 })
  );
  group.add(wire);

  var shell = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: BONE, transparent: true, opacity: 0.32 })
  );
  shell.scale.setScalar(0.985);
  group.add(shell);

  var points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({ color: INK, size: 0.022, transparent: true, opacity: 0.5 })
  );
  group.add(points);

  window.addEventListener("themechange", function () {
    var bone = cssColor("--3d", 0xf0eee9);
    var ink = cssColor("--ink", 0x111111);
    scene.fog.color.setHex(bone);
    shell.material.color.setHex(bone);
    points.material.color.setHex(ink);
  });

  function layout() {
    var w = canvas.clientWidth || window.innerWidth;
    var h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (window.innerWidth < 720) { group.position.set(0, 1.2, 0); }
    else { group.position.set(2.5, 0, 0); }
  }
  layout();
  window.addEventListener("resize", layout, { passive: true });

  var scrollN = 0, target = 0;
  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    target = max > 0 ? window.scrollY / max : 0;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var mx = 0, my = 0, tmx = 0, tmy = 0;
  if (!reduce) {
    window.addEventListener("pointermove", function (e) {
      tmx = (e.clientX / window.innerWidth - 0.5) * 0.5;
      tmy = (e.clientY / window.innerHeight - 0.5) * 0.5;
    }, { passive: true });
  }

  var TWO_PI = Math.PI * 2;
  var capFrames = 0;

  function render() {
    scrollN += (target - scrollN) * 0.07;
    mx += (tmx - mx) * 0.05;
    my += (tmy - my) * 0.05;

    var idle = reduce ? 0 : performance.now() * 0.00004;

    group.rotation.y = scrollN * TWO_PI * 2 + idle + mx;
    group.rotation.x = scrollN * Math.PI * 0.9 + my;
    group.rotation.z = scrollN * Math.PI * 0.4;

    var base = window.innerWidth < 720 ? 0.72 : 1;
    group.scale.setScalar(base * (1 + scrollN * 0.35));

    wire.material.opacity = 0.42 - scrollN * 0.18;
    points.material.opacity = 0.5 - scrollN * 0.2;

    renderer.render(scene, camera);
    if (!window.__CAP || capFrames++ < 160) requestAnimationFrame(render);
  }
  render();
})();
