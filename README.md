## Estrutura

```
.
├── index.html        # conteúdo e estrutura da página
├── css/
│   └── styles.css     # todos os estilos + tokens de tema (:root)
└── js/
    ├── main.js        # tema, scroll reveals, cursor, magnetic, marquee
    ├── scene.js       # animação 3D (Three.js) dirigida pelo scroll
    └── three.min.js   # biblioteca Three.js (vendor — não editar)
```
## Rodar localmente

Por usar `fetch`/módulos e a lib local, abra via servidor (não pelo `file://`):

```bash
# dentro da pasta do projeto
python -m http.server 8080
# abrir http://localhost:8080
```

Ou a extensão **Live Server** do VS Code.

## Como mudar as partes principais

### 1. Cores e tema (tokens)
Tudo vive em `css/styles.css`, no topo. O tema é controlado por variáveis CSS.

```css
:root{
  --bone:#f0eee9;   /* fundo (claro) */
  --ink:#111;       /* texto (claro) */
  --accent:#ff5a00; /* acento único — troque aqui para mudar a marca toda */
}
html[data-theme="dark"]{
  --bone:#0d0c0b;   /* fundo (escuro) */
  --ink:#f2efe9;    /* texto (escuro) */
  --accent:#ff6a1a; /* acento no escuro */
}
```

Mudar `--accent` recolore botões, links, cross-marks, cursor e o 3D de uma vez.

### 2. Textos
Direto no `index.html`. Seções marcadas por `id`:
- `#top` — hero (nome, eyebrow, lead, CTAs, meta)
- `#about` — Sobre mim (bio, ficha, interesses, assinatura)
- `#stacks` — Tecnologias (logos)
- `#projects` — Projeto em destaque
- `#journey` — Trajetória
- `#contact` — Contato (e-mail, GitHub, LinkedIn)

### 4. Logos das stacks
Em `#stacks`, cada item é:

```html
<span class="logo"><i class="devicon-java-plain"></i><b>Java</b></span>
```

Troque a classe `devicon-*` e o nome. Catálogo: <https://devicon.dev>.

### 5. Barra rolante (marquee)
Os termos ficam no `index.html`, dentro de `.marquee-track` (duplicados duas vezes — mantenha as duas listas iguais para o loop ser contínuo).
A velocidade base e a reação ao scroll estão em `js/main.js`:

```js
var base = 0.045;   // velocidade contínua (maior = mais rápido)
... vel * 0.9       // quanto o scroll acelera (maior = mais sensível)
```

### 6. Animação 3D (hero)
Em `js/scene.js`:

```js
var geometry = new THREE.TorusKnotGeometry(1.55, 0.5, 220, 32, 2, 3); // forma
group.position.set(2.5, 0, 0);  // posição (direita)
```

Para desativar o 3D: remova `<canvas id="scene">` e a tag `<script src="js/scene.js">` do `index.html`.

### 7. Projeto em destaque
Em `#projects`, edite título, descrição, a `.spec` (tabela) e o link do GitHub. Para listar mais projetos, duplique o bloco `<article class="feature">`.

### 8. Links de contato
Em `#contact`, atualize os `href` (`mailto:`, GitHub, LinkedIn).

## Acessibilidade & performance

- Respeita `prefers-reduced-motion` (pausa marquee, reveals, cursor, 3D autônomo).
- Tema inicial segue `prefers-color-scheme` e fica salvo em `localStorage`.
- Foco de teclado visível, HTML semântico, skip link.