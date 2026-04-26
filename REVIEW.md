# Revisão técnica — vanilla-smart-select

## Resumo executivo

A biblioteca tem arquitetura clara (core + adapters + components + managers) e uma superfície pública bem definida. A maioria dos achados é de natureza pontual: **bugs reais de comparação de tipos** que quebram caminhos comuns (remover tag em multi-select com IDs numéricos, sincronização do `<select>` original), **um método duplicado** que sobrescreve o comportamento desejado (`ResultsList.clear`), **gerenciamento frágil de "loading more"** em scroll infinito, e **ausência total de testes** apesar do `npm test` estar configurado para Jest. ESLint v9 com config legada também tende a quebrar de cara. Não há sinais de problemas estruturais profundos, apenas pontos a refinar.

---

## 🔴 Crítico

### 1. ✅ `ResultsList.clear()` está definido duas vezes — a segunda definição vence

[src/components/ResultsList.js:158-165](src/components/ResultsList.js#L158-L165) define um `clear()` que zera `this.results`, `this.flatResults` e `this.highlightedIndex`. Logo abaixo, [src/components/ResultsList.js:213-220](src/components/ResultsList.js#L213-L220) redefine `clear()` sem zerar `flatResults`. Como JS deixa a última declaração vencer, a primeira é morta.

**Impacto:** Após `clear()`, `flatResults` ainda referencia os itens anteriores. `getHighlighted()` ([L199-L208](src/components/ResultsList.js#L199-L208)) pode retornar item "fantasma" e `KeyboardManager._navigate` pode operar sobre estado incorreto. Também invalida o uso explícito feito em [ResultsAdapter.update()](src/adapters/ResultsAdapter.js#L171) para o caminho de "input too short".

**Sugestão:** Remover a segunda definição e manter apenas a versão completa (que zera `flatResults`).

**Resolvido** no commit `fix: remove duplicate ResultsList.clear() definition (REVIEW item 1)`. O lint (`no-dupe-class-members`) flagrou o bug durante a migração do ESLint (Lote 1) e o fix foi adiantado. Lote 3 do plano de execução fica **absorvido pelo Lote 1**; numeração dos lotes seguintes é mantida.

---

### 2. ✅ Remoção de tag em multi-select falha para IDs numéricos

Em [src/adapters/SelectionAdapter.js:86](src/adapters/SelectionAdapter.js#L86):

```js
const item = this.dataAdapter.current().find((item) => item.id === id);
```

`id` vem de `e.target.dataset.id`, que é **sempre string**. Se `item.id` for número (caso comum em dados vindos de API), o `===` nunca casa e o item não é removido — mas o handler já chamou `e.stopPropagation()`, então o clique também não reabre o dropdown. Resultado: a "✕" simplesmente não funciona.

Os outros pontos do código que comparam id pelo dataset usam `String(item.id) === String(id)` (ex.: [VanillaSmartSelect._findItemById](src/core/VanillaSmartSelect.js#L699), [ResultsAdapter._findItemById](src/adapters/ResultsAdapter.js#L423)).

**Impacto:** Botão de remover quebrado para datasets reais; UX bloqueada sem erro no console.

**Sugestão:** Padronizar comparação por `String(item.id) === String(id)` aqui também.

**Resolvido** no commit `fix: coerce ids to string when crossing dataset/option.value boundaries`. Teste de regressão em [__tests__/numeric-ids.test.js](__tests__/numeric-ids.test.js) caso (a).

---

### 3. ✅ `DataAdapter._updateElement` desselecciona opções com IDs numéricos

Em [src/adapters/DataAdapter.js:298-310](src/adapters/DataAdapter.js#L298-L310):

```js
const selectedIds = this.selection.map((item) => item.id);
options.forEach((option) => {
  const value = option.value || option.text;
  option.selected = selectedIds.includes(value);
});
```

`option.value` é sempre string; `selectedIds` pode conter números (vide normalização em [_normalizeItem](src/adapters/DataAdapter.js#L147), que mantém o `id` original). `Array.prototype.includes` faz comparação estrita, então `[1].includes("1")` é `false`.

**Impacto:** Quando dados são fornecidos via `data: [{id: 1, text: ...}]`, o `<select>` original (fonte da verdade prometida no CLAUDE.md) **nunca recebe `selected=true`**. Frameworks que leem `element.value` ou `serializeArray()` em formulários recebem valor errado, e `checkValidity()` para `required` falha mesmo quando há seleção.

Também há um `value || option.text` redundante e divergente da lógica em `_normalizeOption`.

**Sugestão:** Coagir para string nos dois lados (`selectedIds.map(String).includes(option.value)`) e remover o fallback divergente.

**Resolvido** no commit `fix: coerce ids to string when crossing dataset/option.value boundaries`. O fallback `|| option.text` foi removido junto: investigação confirmou que era dead code (HTMLOptionElement.value já cai no text por spec, e options com `value=""` são filtradas como placeholder antes de chegar na seleção). Teste de regressão em [__tests__/numeric-ids.test.js](__tests__/numeric-ids.test.js) caso (d).

---

### 4. `loadMore()` esconde o spinner por timer fixo de 500 ms, independente da resposta AJAX

[src/adapters/ResultsAdapter.js:347-372](src/adapters/ResultsAdapter.js#L347-L372):

```js
this._updateWithAjax(this.currentSearchTerm, true);
...
this._loadMoreTimeout = setTimeout(() => {
  this.hideLoadingMore();
  this.isLoadingMore = false;
}, 500);
```

O spinner é escondido em 500 ms fixos. Se a API responde em 200 ms, o usuário vê o "loading more..." por 300 ms a mais sem motivo. Se responde em 1.5 s, o spinner some, **mas `isLoadingMore` também é resetado** — um novo scroll-near-bottom dispara outro `loadMore()` antes da página anterior chegar, levando a páginas duplicadas/perdidas e race condition (o `currentSearchToken` não cobre o caso de `append=true`).

> **Nota (race do `currentSearchToken`):** `currentSearchToken` ([ResultsAdapter.js:264](src/adapters/ResultsAdapter.js#L264)) é regenerado a cada chamada de `_updateWithAjax`, inclusive em `loadMore()`. Se o usuário pressionar tecla durante uma página em voo, a página em voo é descartada via token, mas `isLoadingMore` permanece `true` por causa do timer fixo. Os dois bugs interagem e devem ser corrigidos juntos.

**Impacto:** Resultados duplicados ou pulados em scroll infinito sob latência maior que 500 ms; flicker visual em latências baixas.

**Sugestão:** Resetar `isLoadingMore` e esconder o spinner no `.then()`/`.catch()` de `_updateWithAjax` (passando uma flag/promise back), não em `setTimeout`. Tratar token + estado de loading na mesma estrutura.

---

### 5. Listener `invalid` no `<select>` original nunca é removido em `destroy`

[src/core/VanillaSmartSelect.js:257-259](src/core/VanillaSmartSelect.js#L257-L259) registra `this.element.addEventListener("invalid", ...)` mas o handler não é guardado nem removido no [destroy](src/core/VanillaSmartSelect.js#L820-L876). Como `destroy()` mantém o `<select>` original no DOM (só remove o container customizado), múltiplos ciclos `init → destroy → init` (ex.: SPAs que reaproveitam markup) acumulam handlers e estado obsoleto continua respondendo.

**Impacto:** Memory leak silencioso em SPAs; comportamento errático ao re-instanciar.

**Sugestão:** Salvar a referência do handler em propriedade e fazer `removeEventListener` em `destroy()`.

---

## 🟡 Importante

### 6. `VanillaSmartSelect.open()` emite `OPEN` antes do dropdown estar realmente aberto

[src/core/VanillaSmartSelect.js:413-417](src/core/VanillaSmartSelect.js#L413-L417):

```js
this.emit(EVENTS.OPENING);   // → DropdownAdapter abre
this.emit(EVENTS.OPEN);      // → ResultsAdapter dispara AJAX baseado em isOpen
this.trigger(this.element, EVENTS.OPEN);
```

Hoje funciona porque `DropdownAdapter` registra-se em `OPENING` e abre síncrono — então quando `OPEN` é emitido, `isOpen()` já retorna `true`. Mas o contrato `OPENING` (preparando) → abre → `OPEN` (aberto) está invertido: a abertura efetiva é colateral ao evento de "preparação". Qualquer listener externo que prevenir `OPENING` para impedir abertura **não funcionará** (os handlers internos rodam antes ou ao mesmo tempo) e a dependência de ordem dentro do `EventEmitter` é frágil.

Some-se a isso que a mesma rotina mistura DOM event cancelável (`trigger(... OPENING ...)`) com `emit(OPENING)` interno — listeners DOM que chamam `preventDefault` cancelam, mas `emit` ignora o resultado.

**Impacto:** Dívida arquitetural; API pública de `vs:opening` cancelável é parcialmente teórica; race conditions latentes se a abertura virar assíncrona no futuro (animação, etc.).

**Sugestão:** Inverter responsabilidades: `open()` chama explicitamente `dropdownAdapter.open()` e só depois emite `OPEN`. `OPENING` fica como evento informativo cancelável (já é via `trigger`). Mesma lógica para `close`.

---

### 7. `escapeMarkup` declarado no defaults mas nunca consumido — templates com string vão direto para `innerHTML`

[utils/template.js:41](src/utils/template.js#L41) seta `targetElement.innerHTML = customContent` com comentário "developers are responsible for sanitizing". A opção `escapeMarkup` ([defaults.js:35](src/constants/defaults.js#L35)) está nas defaults mas **não é consumida em lugar algum** do código. O usuário que confia no nome da opção espera escape automático e não recebe.

**Impacto:** XSS plausível com template + dados não confiáveis (resposta AJAX não sanitizada interpolada em `templateResult` retornando string); opção morta no defaults induz a erro de uso.

**Decisão tomada — opção híbrida (compat-first, plano de migração para v2.0):**

Contexto: a lib está em v1.0.4 e a documentação pública promete explicitamente "string HTML ou DOM" como retornos válidos de template. Trocar o default para escape real agora seria breaking change silenciosa em minor.

Critérios de implementação:
1. **`applyTemplate` passa a consumir `escapeMarkup`**: quando o template retorna string, aplicar `escapeMarkup(customContent)` antes do `targetElement.innerHTML = ...`. A função é injetada via parâmetro `options` (ou via referência ao `instance options`, conforme já estiver fluindo no resto do código — decido ao reler).
2. **Default atual mantido em `defaults.js`**: `escapeMarkup: (markup) => markup` (identidade) — comportamento idêntico ao v1.x. Zero quebra para quem já usa.
3. **Documentação imediata**: adicionar à seção "Convenções" do `CLAUDE.md` uma nota: *"templates que retornam string passam por `escapeMarkup`; default é identidade por compatibilidade com v1.x; v2.0 irá trocar para escape real"*.
4. **Documentação pública (README, API.md) NÃO é atualizada agora** — só registramos como pendência da v2.0 (ver "Pendências para v2.0" abaixo).

**Resultado prático:**
- v1.x: comportamento inalterado por default, mas integradores conscientes podem passar `escapeMarkup: (s) => s.replace(/[&<>"']/g, ...)` e ficar seguros.
- v2.0: trocar default para escape real (breaking change, com bump major previsto).

---

### 8. `_updateWithAjax(term, append=false)` reescreve `dataAdapter.setData` com a página atual

[ResultsAdapter.js:290](src/adapters/ResultsAdapter.js#L290): `this.dataAdapter.setData(this.accumulatedResults)`. Quando o usuário busca um termo novo, `accumulatedResults = results` (só a página 1). Itens previamente selecionados em buscas anteriores **somem do data store**, mas continuam em `dataAdapter.selection` — o que significa que `getSelected()` retorna o item, mas `_updateElement` não encontra a `<option>` correspondente e o `<select>` original perde o valor. A própria seleção visual continua funcionando porque `Selection` renderiza a partir de `selection`, mas a fonte da verdade diverge.

**Impacto:** Em forms tradicionais com AJAX + multi-select, o submit envia conjunto incompleto.

**Sugestão:** Mesclar (não substituir) os resultados AJAX no `dataAdapter`, ou criar `<option>` no `<select>` para itens selecionados que não estão na página atual.

---

### 9. `loadFromElement` reordena options/optgroups: grupos sempre vêm antes

[DataAdapter.js:38-81](src/adapters/DataAdapter.js#L38-L81) processa **primeiro** todos os `<optgroup>` e **depois** todas as `<option>` standalone. Se o HTML tiver standalone antes de optgroup, a ordem é invertida na renderização.

**Impacto:** UX inconsistente com o `<select>` nativo; quebra expectativa de quem mantém ordem semântica no HTML.

**Sugestão:** Iterar `this.$element.children` em ordem de documento e tratar cada nó conforme `tagName`.

---

### 10. `addOption` muta o array retornado por `query()`

[VanillaSmartSelect.js:639-659](src/core/VanillaSmartSelect.js#L639-L659):

```js
const currentData = this.dataAdapter.query({ term: "" });
currentData.push(option);
this.dataAdapter.setData(currentData);
```

`DataAdapter.query` retorna **a referência interna** `this.data` ([DataAdapter.js:180](src/adapters/DataAdapter.js#L180)). O `push` muta o estado interno antes do `setData`. `setData` reconstrói via `_normalizeItem`, mas qualquer listener síncrono de `DATA_LOADED` que tenha guardado a referência anterior já vê o array contaminado.

**Impacto:** Acoplamento por referência mutável — bug latente quando alguém otimizar `setData` ou usuário fizer comparação por igualdade de array.

**Sugestão:** `query()` retornar cópia, ou `addOption` usar `[...current, option]`.

---

### 11. Handlers globais (`document` click, `window` resize/scroll) são únicos por instância — sem desduplicação

Cada instância de `VanillaSmartSelect` adiciona seus próprios listeners em `document`/`window` ([DropdownAdapter.js:144-148](src/adapters/DropdownAdapter.js#L144-L148)). Em páginas com 50+ selects (comum em formulários grandes), isso significa 50× listeners de `scroll` (com `capture: true`) chamados em cada pixel de scroll.

**Impacto:** Performance perceptível em scroll de páginas com muitos selects — cada handler chama `getBoundingClientRect` no anchor. O `_handleScroll` reposiciona apenas se aberto (curto-circuito), mas a chamada do handler ainda é paga.

**Sugestão:** Listener compartilhado (singleton estático na classe ou módulo) que itera só sobre instâncias com dropdown aberto.

---

### 12. `DropdownAdapter.close()` força `focus()` no anchor mesmo quando o dropdown fechou por blur fora do componente

[DropdownAdapter.js:241](src/adapters/DropdownAdapter.js#L241): `this.anchorElement.focus()`. Se o usuário clicou em outro input para abandonar o componente, esse `focus()` rouba o foco de volta para o select.

**Impacto:** Quebra de Tab natural em formulários — o usuário sai do select com Tab, dropdown fecha, foco volta, segundo Tab vai para o próximo campo. Atrito real.

**Sugestão:** Só forçar foco se o evento de fechamento veio do teclado (ESC) ou se o foco atual está dentro do dropdown.

---

### 13. `BaseAdapter.trigger` descarta silenciosamente o 4º argumento (event options)

[BaseAdapter.trigger](src/adapters/BaseAdapter.js#L45-L49) aceita `(element, eventName, detail)` — apenas 3 parâmetros. `EventEmitter.trigger` aceita um quarto `options` (para configurar `bubbles`, `cancelable`, etc.). Adapters que tentem passar opções via `this.trigger(...)` têm o argumento descartado sem aviso.

**Impacto:** Inconsistência de API entre `instance.trigger(...)` e `adapter.trigger(...)`; configurar `bubbles: false` num adapter falha silenciosamente.

**Sugestão:** Encaminhar `...args` em `BaseAdapter.trigger`, ou documentar explicitamente que adapters usam apenas a forma simples.

---

## 🔵 Sugestão

### 14. Ausência total de testes apesar de Jest configurado

`npm test` roda mas reporta 0 testes; não há `__tests__/` nem `jest.config.*`; `package.json` declara `jest-environment-jsdom`. As regras de comparação de ID em vários pontos (achados 2, 3, 10) são exatamente o tipo de bug que um teste unitário simples pegaria.

**Sugestão:** Adicionar pelo menos uma suíte mínima cobrindo: seleção/clear, multi-select com IDs numéricos, AJAX append/replace, navegação por teclado em grupos, ciclo `init → destroy → init`.

---

### 15. ESLint v9 com config legada (`.eslintrc.js`)

ESLint 9 já usa flat config por padrão. O CLAUDE.md inclusive sinaliza isso. `npm run lint` provavelmente quebra sem `ESLINT_USE_FLAT_CONFIG=false`.

> **Nota (variáveis declaradas e não usadas):** ESLint funcionando pegaria automaticamente os pontos abaixo, sem precisar de itens separados:
> - [ResultsAdapter.js:89](src/adapters/ResultsAdapter.js#L89): `const index = parseInt(resultEl.dataset.index, 10);` declarado no `_clickHandler` mas não usado (dead code).
> - [ResultsList._renderItem](src/components/ResultsList.js#L128): `defaultText: item._isTag ? item.text : item.text` — ternário redundante (provavelmente vestígio de feature incompleta tipo `"Create '<tag>'"`).
> - [SearchBox.js:6](src/components/SearchBox.js#L6): `emptyElement` importado e não usado.

**Sugestão:** Migrar para `eslint.config.js`. Fazer este item primeiro destrava o feedback automático e absorve os nitpicks acima.

---

### 16. `cancelable: true` redundante em chamadas de `trigger`

[EventEmitter.trigger](src/core/EventEmitter.js#L109-L124) já default `cancelable: true`. Chamadas em `VanillaSmartSelect` passando `{cancelable: true}` explicitamente ([open](src/core/VanillaSmartSelect.js#L407), [close](src/core/VanillaSmartSelect.js#L439), [clear](src/core/VanillaSmartSelect.js#L530)) são redundantes. Nitpick — sem impacto funcional.

---

### 17. `template.js` importa `createElement` para um caminho onde `textContent` bastaria

Não é bug, mas o helper `_renderDefault` poderia usar `targetElement.textContent = text` no caso "with-wrapper" também (criando um span só quando necessário). Evita um import.

---

### 18. ID gerado para grupos pode colidir com IDs de itens

[DataAdapter.js:46](src/adapters/DataAdapter.js#L46): `id: \`group-${index}-${optgroup.label}\``. Se o usuário selecionar um item homônimo de um grupo (ex.: alguém faz `select("group-0-Frutas")`), o `_findItemById` casa com o grupo (que tem `children`) e tenta selecioná-lo como item. Improvável mas possível.

**Sugestão:** IDs de grupo prefixados com algo não-conflitante (ex.: `__group__0`) e excluí-los em `_findItemById` para `select()`.

---

### 19. `BaseAdapter.$element` viola convenção sem jQuery

A property é prefixada com `$` (convenção jQuery) embora seja `HTMLElement` puro. Pode confundir contribuidores.

**Sugestão:** Renomear para `element` ou `el`.

---

### 20. UI: SVG do indicador de dropdown com `stroke="#888"` hardcoded

[Selection.js:165](src/components/Selection.js#L165): `stroke="#888"`. Não respeita o tema (default/material/etc.) nem `currentColor`, então em fundo escuro fica invisível e em tema customizado destoa.

**Sugestão:** Trocar por `stroke="currentColor"` e controlar via CSS (`.vs-selection__arrow svg { color: ... }`).

---

### 21. UX: `placeholder` vazio + nenhuma seleção = combobox renderiza só a seta, sem affordance textual

`renderPlaceholder` ([Selection.js:40-60](src/components/Selection.js#L40-L60)) só adiciona o placeholder se `placeholder` truthy. Para `placeholder: ""` (default) o usuário vê uma caixa vazia com a seta — ergonomia ruim e quebra altura quando comparado ao select nativo.

**Sugestão:** Render mínimo com `&nbsp;` ou `min-height` no CSS para garantir altura consistente.

---

### 22. `aria-hidden="true"` no `<select>` original com `display:none` é redundante

[VanillaSmartSelect.js:155-156](src/core/VanillaSmartSelect.js#L155-L156). Elementos com `display:none` já são removidos da árvore acessível; `aria-hidden` adicional é ruído.

---

### 23. Mistura de strings literais e funções nos language packs com fallbacks hardcoded em inglês

Várias chaves do language pack são strings em alguns locales e funções em outros. Há fallbacks `|| "Loading..."`, `|| "1 result available"` espalhados pelo código quando a chave não existe ou não é função no locale escolhido.

**Sugestão:** Consolidar contrato: todas as chaves são strings ou funções; fallback único centralizado.

---

## Perguntas / pontos a investigar

- **Busca exclui itens `disabled`** ([SearchManager.js:43-46](src/managers/SearchManager.js#L43-L46) retorna `false` se `item.disabled`): combina mal com `KeyboardManager._navigate` (que pula disabled mas espera vê-los na lista) e com `ResultsList._renderItem` (que renderiza com classe visual). Ao filtrar, o usuário não vê o item disabled — pode ser intencional (busca = relevância) ou um bug de UX. Decidir contrato e documentar.
- **`closeOnSelect` em multi-select**: O comportamento atual mantém o dropdown aberto independentemente da opção em multi-select ([ResultsAdapter.js:610-619](src/adapters/ResultsAdapter.js#L610-L619)). Isso é intencional, ou deveria-se respeitar `closeOnSelect: true` mesmo em multi?
- **`val(null)` vs `val("")`**: Ambos chamam `clear()` ([VanillaSmartSelect.js:352](src/core/VanillaSmartSelect.js#L352)), o que pode ser surpreendente quando `""` é um valor válido de uma `<option value="">Nenhum</option>`. É proposital?
- **`_isPlaceholder` e `id === ""`**: A mesma lógica de placeholder considera `id === ""` placeholder, mas em multi-select com tagging seria possível querer um ID empty?
- **`focus()` automático após fechamento** (item 12): confirmar se há um teste manual ou intenção que justifica devolver foco mesmo quando o dropdown fecha por clique fora.
- **`maximumSelectionLength` exibe mensagem via `_showLimitMessage` mas só em multi-select**: e se um dia limitar single via `_validate`?

---

## Achados durante execução

- **Refinamento opcional do `eslint.config.js`** (Lote 1): `globals.jest` está aplicado a todos os arquivos. Refinamento futuro — separar em blocos por `files: ['src/**/*.js']` e `files: ['__tests__/**/*.js']` para isolar globals de teste do código de produção. Não bloqueante.
- **Smoke test acopla a propriedades com prefixo `_`** (Lote 1): `__tests__/smoke.test.js` afirma sobre `_isInitialized` e `_vanillaSmartSelect` (convenção de privados). Aceitável para smoke, mas precisa revisita se qualquer lote futuro renomear essas propriedades.
- **Prettier vs ESLint — formatação delegada ao Prettier** (Lote 1): a config legada do ESLint declarava 9 regras de formatação que conflitavam com a saída do Prettier (`indent`, `quotes`, `semi`, `comma-dangle`, `linebreak-style`, `array-bracket-spacing`, `object-curly-spacing`, `space-before-function-paren`, `arrow-spacing`). `npm run lint` nunca passou limpo nesse estado. Removidas no flat config; ESLint agora cuida só de qualidade. **Pendência:** garantir `prettier --check` em CI ou pre-commit hook para evitar drift de formatação. Considerar `eslint-config-prettier` como devDep numa próxima rodada.
- ✅ **Chave `dropdownCssClass` duplicada em `defaults.js`** (Lote 1): linhas 13 e 40 declaravam o mesmo default (string vazia). JS pegava só a última. Resolvido removendo a duplicata (linha 40).
- **`showError(error)` engolia o erro AJAX silenciosamente** (Lote 1): parâmetro recebido mas nunca logado. `_updateWithAjax` catch nunca pega o erro original porque `AjaxAdapter` resolve com `{results: [], pagination}` mesmo em falha — então o único caminho com o erro real era `showError`. Resolvido com `console.error("AJAX error:", error)` no início da função.
- **Regex em `removeDiacritics` dispara `no-control-regex`** (Lote 1): a range usada como pre-filter inclui o caractere NUL (codepoint 0) por design — é um filtro barato pra pular ASCII básico antes de consultar o map de diacríticos. Comportamento intencional (emojis e scripts não-latinos passam intactos via `|| char`). Resolvido com `eslint-disable-next-line` + comentário explicativo no JSDoc.
- **`scrollIntoView` não implementado em jsdom** (Lote 1B): qualquer teste que toque `ResultsList.highlight` (e por consequência `KeyboardManager._navigate`, auto-highlight em `update`, etc.) precisa do stub adicionado em [__tests__/setup.js](__tests__/setup.js). Não é bug da lib (browsers reais implementam) — nota operacional para escrever testes futuros.
- ✅ **`unselect(id)` público falha em IDs com tipo divergente** (Lote 2): [VanillaSmartSelect.js:606](src/core/VanillaSmartSelect.js#L606) usava `i.id === id`. Mesmo padrão do REVIEW item 2 mas em outra entrada da API pública (chamar `unselect("1")` com `data:[{id:1, ...}]` não removia). Resolvido junto com item 2 no commit `fix: coerce ids to string when crossing dataset/option.value boundaries`. Regressão em [__tests__/numeric-ids.test.js](__tests__/numeric-ids.test.js) caso (b).
- ✅ **`_removeItemById` usa `==` (loose equality)** (Lote 2): [VanillaSmartSelect.js:725](src/core/VanillaSmartSelect.js#L725). Funciona para IDs típicos mas destoa do padrão `String(...) === String(...)` usado no resto do mesmo arquivo, e abre brecha para edge cases de coerção (ex.: `0 == ""`). Resolvido junto. Cobertura (sem regressão estrita, já passa com `==`) em [__tests__/numeric-ids.test.js](__tests__/numeric-ids.test.js) caso (c).

---

## Pendências para v2.0 (breaking changes registradas)

- **`escapeMarkup` default → escape real** (item 7). Em v1.x manteremos identidade por compatibilidade; v2.0 troca o default para uma função que escapa `& < > " '`, atualiza README/API.md e remove o comentário "developers are responsible for sanitizing" do código. Bump major obrigatório.
