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

### 7. Projetos (galeria de pastas)
Os projetos ficam em `js/folders.js`, no array `PROJECTS`. Cada item tem `name`, `about` (descrição curta), `stack` (ícones devicon), `repo`, `cover` (print da capa) e `shots` (prints que aparecem dentro da pasta e no lightbox).

```js
{
  id: "meu-projeto",
  name: "Meu Projeto",
  about: "Uma frase sobre o que o projeto faz.",
  stack: [
    { name: "Spring Boot", icon: "devicon-spring-plain" },
    { name: "Angular", icon: "devicon-angular-plain" }
  ],
  repo: "https://github.com/RodrigoKuerten/...",
  cover: "assets/projects/meu-projeto/home.jpg",
  shots: [
    { src: "assets/projects/meu-projeto/home.jpg", name: "Home", meta: "Vitrine" }
  ]
}
```

Para adicionar um projeto, copie um bloco e coloque os prints em `assets/projects/<id>/`. A galeria rola na horizontal e a pasta mostra no máximo 5 prints (os últimos do array). Clique na pasta abre, clique num print abre o lightbox.

### 8. Links de contato
Em `#contact`, atualize os `href` (`mailto:`, GitHub, LinkedIn).

## Acessibilidade & performance

- Respeita `prefers-reduced-motion` (pausa marquee, reveals, cursor, 3D autônomo).
- Tema inicial segue `prefers-color-scheme` e fica salvo em `localStorage`.
- Foco de teclado visível, HTML semântico, skip link.