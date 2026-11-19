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
O conteúdo fica no `index.html`, dentro de `#folders`. Cada projeto é um `<div class="folder-item">` com um `.gf-root` marcado por `data-project`. Título (`h3.gf-title`), descrição (`.gf-desc`), stacks (ícones devicon), prints (`.gf-sheet`) e o link do repo (`.gf-repo`) estão no HTML — isso mantém o conteúdo indexável e visível sem JS. O `js/folders.js` só hidrata o comportamento (abrir/fechar, lightbox, medidas e paralaxe). **Adicionar projeto não exige mexer no JS.**

A galeria rola na horizontal; a dica “arraste” some sozinha quando as pastas cabem na tela. Clique na pasta abre, clique num print abre o lightbox (clique na imagem dá zoom 2×).

#### Adicionar uma pasta nova
1. Crie `assets/projects/<id>/` e coloque os prints em **WebP com ~960 px de largura** (qualidade ~80). Um deles será a capa. Nomes descritivos ajudam: `home.webp`, `catalogo.webp`, `carrinho.webp`.
2. No `index.html`, copie um `<div class="folder-item"> … </div>` inteiro (do `<div class="folder-item">` até o `</div>` que fecha a pasta) e cole como último filho de `#folders`.
3. Troque, dentro do bloco copiado:
   - `data-project="<id>"` (mesmo `<id>` da pasta de imagens);
   - o `id` do gradiente `gf-rim-<id>` e o `stroke="url(#gf-rim-<id>)"` (precisa ser único);
   - `<h3 class="gf-title">Nome do projeto</h3>`;
   - `<span class="gf-desc">Uma ou duas frases sobre o que o projeto faz.</span>`;
   - os ícones de stack: `<i class="devicon-...-plain" title="Nome" role="img" aria-label="Nome"></i>`;
   - o `href` do `.gf-repo` e o `aria-label` do `.gf-hit` (ex.: `Abrir Meu Projeto, 4 prints`);
   - a capa em `.gf-art` (`src` e `alt`).
4. Ajuste os prints. Cada print é um `<button class="gf-sheet gf-sheet--art" data-shot="N">` com `<img class="gf-sheet-art" loading="lazy" …>` e o cabeçalho:
   ```html
   <button type="button" class="gf-sheet gf-sheet--art" data-shot="0"
           style="--gf-slot: -1; --gf-depth: 3; --gf-jx: -3px; --gf-jr: -1.5deg; z-index: 1">
     <img class="gf-sheet-art" alt="Meu Projeto — Home" draggable="false" decoding="async"
          loading="lazy" src="assets/projects/meu-projeto/home.webp">
     <span class="gf-sheet-head">
       <span class="gf-sheet-name">Home</span>
       <span class="gf-sheet-meta">Início</span>
     </span>
   </button>
   ```
   A ordem no HTML é a ordem do lightbox. Use 4 ou 5 prints (mais que isso lota o leque).
5. Ajuste o leque com as variáveis inline de cada print:

   | Nº de prints | `--gf-slot` (por print) | `--gf-depth` | `z-index` |
   |---|---|---|---|
   | 4 | `-1`, `-0.333`, `0.333`, `1` | `3`, `2`, `1`, `0` | `1` a `4` |
   | 5 | `-1`, `-0.5`, `0`, `0.5`, `1` | `4`, `3`, `2`, `1`, `0` | `1` a `5` |

   `--gf-jx` (deslocamento horizontal) e `--gf-jr` (rotação) são só jitter visual; pode repetir os valores do projeto copiado. Os `style` de `height`/`transform` no `.gf-root`/`.gf-stage` também podem ficar os do bloco copiado: o JS recalcula no load e no resize.

Pronto: a pasta, os prints e o lightbox passam a funcionar automaticamente (nada de `PROJECTS`).

#### Adicionar um print a uma pasta existente
1. Salve o print em WebP dentro de `assets/projects/<id>/`.
2. Copie um `<button class="gf-sheet …">` da mesma pasta e cole depois do último.
3. Atualize `data-shot`, `src`, `alt`, `--gf-slot`, `--gf-depth` e `z-index` de **todos** os prints da pasta conforme a tabela acima (mudar de 4 para 5 reajusta o leque).
4. Acima, em `.gf-label`, nada muda; no `.gf-hit`, ajuste o `aria-label` para o novo total.

Se o print for também a capa, troque o `src` do `.gf-art`.

### 8. Links de contato
Em `#contact`, atualize os `href` (`mailto:`, GitHub, LinkedIn).

## Acessibilidade & performance

- Respeita `prefers-reduced-motion` (pausa marquee, reveals, cursor, 3D autônomo).
- Tema inicial segue `prefers-color-scheme` e fica salvo em `localStorage`.
- Foco de teclado visível, HTML semântico, skip link.