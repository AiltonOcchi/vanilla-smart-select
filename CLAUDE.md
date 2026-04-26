# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

`vanilla-smart-select` é uma biblioteca JavaScript sem dependências que aprimora elementos `<select>` nativos com busca, AJAX, multi-seleção, tagging, i18n (EN/PT-BR/ES), templates customizados e acessibilidade completa (teclado/ARIA). É publicada no npm e consumida tanto como módulo bundleado (ESM/CJS) quanto como build UMD via `<script>` que injeta os estilos.

## Stack e ferramentas

- **Linguagem:** JavaScript vanilla ES2021+ (sem TypeScript). `"type": "module"`.
- **Bundler:** Rollup 4 ([rollup.config.js](rollup.config.js)) com Babel (`@babel/preset-env`), `node-resolve`, `commonjs`, `terser` e `rollup-plugin-postcss` (com autoprefixer).
- **Testes:** Jest 29 + `jest-environment-jsdom`. Atenção: não há arquivo de configuração do Jest nem arquivos de teste no repositório — `npm test` reporta "no tests found".
- **Lint/format:** ESLint 9 ([.eslintrc.js](.eslintrc.js), formato legado — estende `eslint:recommended`) e Prettier 3.
- **Gerenciador de pacotes:** npm (lockfile commitado). Node `>=18`.

## Estrutura de pastas

```
src/
  index.js              # Entry público dos builds ESM/CJS (sem import de CSS)
  index.browser.js      # Entry UMD (também importa styles/vanilla-smart-select.css)
  core/                 # Classe VanillaSmartSelect, EventEmitter, Options
  adapters/             # Adapters Data/Ajax/Selection/Dropdown/Results (BaseAdapter define o contrato)
  components/           # Dropdown, ResultsList, SearchBox, Selection (unidades de render DOM)
  managers/             # KeyboardManager, AccessibilityManager, SearchManager (comportamento transversal)
  constants/            # events.js, aria.js, keys.js, defaults.js
  i18n/                 # en.js, es.js, pt-BR.js, index.js (com auto-detecção)
  utils/                # dom, debounce, decorators, diacritics, template, validation
  styles/               # core.css, themes/, vanilla-smart-select.css (entry)
dist/                   # GERADO pelo Rollup — não editar
docs/                   # Documentação do projeto
examples/, examples-bootstrap/   # Demos HTML estáticos servidos via `npm run serve`
```

## API pública

- Definida em [src/index.js](src/index.js). O default export é a classe `VanillaSmartSelect`; os named exports re-expõem `EventEmitter`, `Options`, os bags de constantes `EVENTS`/`ARIA`/`KEYS`/`DEFAULTS`, os namespaces utilitários `dom`/`decorators`, helpers de `diacritics` e o namespace `i18n`.
- [src/index.browser.js](src/index.browser.js) envolve o `index.js` e adicionalmente importa o CSS — usado apenas pelo build UMD, que também atribui `window.VanillaSmartSelect`.
- O campo `exports` no `package.json` mapeia `.` para os builds ESM/CJS/browser e expõe `./style.css`. Qualquer alteração nos entry exports, nos bags de constantes, na superfície de eventos em `constants/events.js`, ou em classes CSS / data attributes consumidos por integradores é **breaking change** e exige bump major.
- Documentação pública e exemplos vivem em [README.md](README.md), [README.pt-BR.md](README.pt-BR.md) e [API.md](API.md) — mantenha-os sincronizados quando a superfície pública mudar.

## Comandos

| Comando            | Função                                                                   |
|--------------------|--------------------------------------------------------------------------|
| `npm run build`    | Build Rollup → `dist/` (UMD, UMD min, ESM, CJS, mais CSS e CSS min).     |
| `npm run dev`      | Rollup em modo watch.                                                    |
| `npm test`         | Jest (env jsdom). Sem testes ainda — veja Perguntas em aberto.           |
| `npm run test:watch` | Jest em modo watch.                                                    |
| `npm run lint`     | ESLint sobre `src/**/*.js`.                                              |
| `npm run format`   | Prettier write sobre `src/**/*.js`.                                      |
| `npm run serve`    | `http-server` na porta 8080 — usado para abrir `examples/` no navegador. |
| `npm run prepublishOnly` | Roda `build` automaticamente antes do `npm publish`.               |

## Convenções

- Indentação de 2 espaços, aspas simples, ponto e vírgula, sem trailing comma, fim de linha LF, `prefer-const`, proibido `var`. `console.warn`/`console.error` permitidos; `console.log` cru cai no lint. Argumentos não usados só são ignorados quando prefixados com `_`.
- Uma classe por arquivo, nome do arquivo casa com a classe (PascalCase). Módulos utilitários em camelCase. Métodos internos prefixados com `_`.
- Classes/atributos DOM usam prefixo `vs-` / `data-vs-`.
- Todas as constantes vêm de `src/constants/` — não hardcode nomes de eventos, atributos ARIA, key codes ou valores default de opções inline.
- Criação/consulta de DOM passa por `utils/dom.js` (`createElement`, `querySelector`, etc.) em vez de chamadas diretas a `document.*`.
- Strings exibidas ao usuário passam pela camada de i18n; novas chaves devem ser adicionadas a **todos** os locales em `src/i18n/`.

## Notas de arquitetura

- `VanillaSmartSelect` (em `core/VanillaSmartSelect.js`) estende `EventEmitter` e orquestra tudo. É dono de `Options`, instancia os cinco adapters (`DataAdapter` ou `AjaxAdapter` conforme config, mais `Selection`/`Dropdown`/`Results`) e os managers `KeyboardManager` + `AccessibilityManager`. Os componentes em `components/` são unidades puras de render DOM; managers contêm comportamento transversal; adapters são a camada-contrato substituível (ver `BaseAdapter`).
- O `<select>` original permanece no DOM como fonte da verdade — a lib lê/escreve nele e espelha seu estado na UI renderizada. Cada instância se armazena no elemento via `element._vanillaSmartSelect`; reinicializar destrói a instância anterior.
- Eventos emitidos pela instância (via `EventEmitter`) e as constantes em `constants/events.js` fazem parte do contrato público.

## Cuidados

- **Não edite `dist/`** — é regerado pelo Rollup. Bump de `version` no `package.json` deve vir acompanhado de rebuild antes de publicar (o `prepublishOnly` cuida disso no `npm publish`).
- **Zero dependências de runtime é restrição rígida** — nunca adicione nada em `dependencies` ou `peerDependencies`. Novos `devDependencies` são ok.
- Mantenha o bundle pequeno (o README anuncia ~15 KB gzipped). Prefira estender módulos existentes a puxar helpers externos.
- Existem dois entry points por um motivo: só `index.browser.js` deve importar CSS. Não adicione import de CSS no `index.js` nem em nada alcançável a partir dele — consumidores via bundler importam `./style.css` separadamente pelo mapa `exports`.
- A config do ESLint está no formato legado `.eslintrc.js` enquanto o ESLint 9 já usa flat config por padrão — `npm run lint` pode precisar de `ESLINT_USE_FLAT_CONFIG=false` ou migração. Se o lint quebrar de cara, é por isso.
- Os targets de browser são definidos pelo campo `browserslist` — não use sintaxe que o Babel + essa lista não consigam transpilar.

## Perguntas em aberto

- **Testes:** `npm test` está apontando para Jest com jsdom mas não há arquivos de teste nem config do Jest. Os testes estão deliberadamente adiados, ou novos trabalhos devem incluir um diretório `__tests__/` e um `jest.config.*`?
- **Fluxo de release:** não existem scripts `version`/`release` nem CHANGELOG. A publicação é feita manualmente via `npm version` + `npm publish`?
