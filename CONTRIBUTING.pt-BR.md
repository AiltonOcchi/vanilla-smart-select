# Contribuindo para o Vanilla Smart Select

[English](CONTRIBUTING.md) | **Português**

Antes de tudo, obrigado por considerar contribuir para o Vanilla Smart Select! São pessoas como você que tornam o Vanilla Smart Select uma ferramenta tão ótima.

## Código de Conduta

Este projeto e todos que participam dele são regidos pelo nosso Código de Conduta. Ao participar, espera-se que você mantenha este código. Por favor, reporte comportamento inaceitável aos mantenedores do projeto.

## Como Posso Contribuir?

### Reportando Bugs

Antes de criar relatórios de bugs, por favor verifique as issues existentes, pois você pode descobrir que não precisa criar uma nova. Ao criar um relatório de bug, por favor inclua o máximo de detalhes possível:

**Antes de Submeter um Relatório de Bug:**
- Verifique a documentação para uma solução
- Pesquise issues existentes para evitar duplicatas
- Tente reproduzir o problema com a versão mais recente
- Reúna informações sobre seu ambiente (navegador, SO, etc.)

**Como Submeto um Bom Relatório de Bug?**

Bugs são rastreados como issues do GitHub. Crie uma issue e forneça as seguintes informações:

- **Use um título claro e descritivo**
- **Descreva os passos exatos para reproduzir o problema**
- **Forneça exemplos específicos** para demonstrar os passos
- **Descreva o comportamento que você observou** após seguir os passos
- **Explique qual comportamento você esperava ver** e por quê
- **Inclua screenshots ou GIFs animados** se aplicável
- **Inclua detalhes do seu ambiente:**
  - Nome e versão do navegador
  - Sistema Operacional
  - Versão do Vanilla Smart Select
  - Opções de configuração relevantes

**Exemplo de Relatório de Bug:**

```markdown
## Bug: Resultados AJAX não limpam quando a busca é limpa

**Ambiente:**
- Navegador: Chrome 120.0
- SO: macOS 14.0
- Vanilla Smart Select: 1.0.0

**Passos para Reproduzir:**
1. Inicialize select com configuração AJAX
2. Digite o termo de busca "test"
3. Limpe o input de busca
4. Observe que os resultados não limpam

**Comportamento Esperado:**
Os resultados devem limpar quando a busca é limpa

**Comportamento Atual:**
Os resultados anteriores permanecem visíveis

**Configuração:**
```javascript
new VanillaSmartSelect('#select', {
  ajax: {
    url: 'https://api.example.com/search',
    delay: 300
  }
});
```

**Screenshots:**
[Anexar screenshot]
```

### Sugerindo Melhorias

Sugestões de melhorias são rastreadas como issues do GitHub. Ao criar uma sugestão de melhoria, por favor inclua:

- **Use um título claro e descritivo**
- **Forneça uma descrição detalhada** da melhoria sugerida
- **Explique por que esta melhoria seria útil** para a maioria dos usuários
- **Liste alguns exemplos** de como seria usado
- **Mencione se isso é algo em que você estaria disposto a trabalhar**

### Pull Requests

**Antes de Submeter um Pull Request:**

1. **Faça fork do repositório** e crie seu branch a partir do `main`
2. **Siga o estilo de código** do projeto
3. **Escreva testes** para suas alterações, se aplicável
4. **Atualize a documentação** para refletir suas alterações
5. **Garanta que todos os testes passem** e o build seja bem-sucedido
6. **Escreva uma mensagem de commit clara** seguindo nossas convenções

**Processo de Pull Request:**

1. **Crie um branch de feature:**
   ```bash
   git checkout -b feature/recurso-incrivel
   # ou
   git checkout -b fix/descricao-do-bug
   ```

2. **Faça suas alterações** seguindo o guia de estilo abaixo

3. **Teste suas alterações:**
   ```bash
   npm test
   npm run build
   ```

4. **Commit suas alterações:**
   ```bash
   git add .
   git commit -m "feat: adiciona recurso incrível"
   # ou
   git commit -m "fix: resolve bug com XYZ"
   ```

5. **Push para seu fork:**
   ```bash
   git push origin feature/recurso-incrivel
   ```

6. **Abra um Pull Request** contra o branch `main`

**Template de Pull Request:**

```markdown
## Descrição
Breve descrição do que este PR faz

## Tipo de Alteração
- [ ] Correção de bug (alteração sem quebra que corrige uma issue)
- [ ] Novo recurso (alteração sem quebra que adiciona funcionalidade)
- [ ] Alteração com quebra (correção ou recurso que causaria mudança na funcionalidade existente)
- [ ] Atualização de documentação

## Issues Relacionadas
Corrige #(número da issue)

## Alterações Realizadas
- Alteração 1
- Alteração 2
- Alteração 3

## Testes
Descreva os testes que você executou e como reproduzi-los:
1. Passo de teste 1
2. Passo de teste 2

## Checklist
- [ ] Meu código segue o estilo de código deste projeto
- [ ] Atualizei a documentação de acordo
- [ ] Adicionei testes para cobrir minhas alterações
- [ ] Todos os testes novos e existentes passaram
- [ ] Atualizei o CHANGELOG.md
```

## Configuração de Desenvolvimento

### Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn

### Começando

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/AiltonOcchi/vanilla-smart-select.git
   cd vanilla-smart-select
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Execute o build:**
   ```bash
   npm run build
   ```

## Estrutura do Projeto

```
vanilla-smart-select/
├── src/
│   ├── VanillaSmartSelect.js          # Ponto de entrada principal
│   ├── adapters/                  # Classes adaptadoras
│   │   ├── BaseAdapter.js
│   │   ├── DataAdapter.js
│   │   ├── DropdownAdapter.js
│   │   ├── ResultsAdapter.js
│   │   ├── SelectionAdapter.js
│   │   └── AjaxAdapter.js
│   ├── components/                # Componentes UI
│   │   ├── Container.js
│   │   ├── Selection.js
│   │   ├── Dropdown.js
│   │   ├── SearchBox.js
│   │   └── ResultsList.js
│   ├── managers/                  # Lógica de negócio
│   │   ├── OptionsManager.js
│   │   ├── SearchManager.js
│   │   └── AccessibilityManager.js
│   ├── constants/                 # Constantes
│   │   ├── events.js
│   │   ├── defaults.js
│   │   └── i18n.js
│   ├── utils/                     # Funções utilitárias
│   │   ├── dom.js
│   │   ├── debounce.js
│   │   └── uid.js
│   └── styles/
│       └── core.css               # Estilos principais
├── dist/                          # Arquivos compilados (gerados)
├── docs/                          # Documentação
└── tests/                         # Arquivos de teste

```

## Estilo de Código

### JavaScript

Seguimos convenções modernas de JavaScript ES6+:

**Regras Gerais:**
- Use `const` para variáveis que não serão reatribuídas, `let` caso contrário
- Nunca use `var`
- Use arrow functions para callbacks
- Use template literals para interpolação de strings
- Use destructuring quando apropriado
- Prefira explícito ao invés de implícito
- Adicione comentários JSDoc para métodos públicos

**Convenções de Nomenclatura:**
- Classes: `PascalCase` (ex: `VanillaSmartSelect`, `DataAdapter`)
- Funções/Métodos: `camelCase` (ex: `getData`, `handleClick`)
- Constantes: `SCREAMING_SNAKE_CASE` (ex: `EVENTS`, `DEFAULT_OPTIONS`)
- Métodos privados: Prefixo com `_` (ex: `_internalMethod`)
- Arquivos: `PascalCase` para classes (ex: `VanillaSmartSelect.js`), `camelCase` para utilitários

**Exemplo:**

```javascript
/**
 * Buscar dados de fonte remota
 * @param {Object} params - Parâmetros de consulta
 * @returns {Promise<Array>} Array de resultados
 */
async fetchData(params) {
  const { term, page = 1 } = params;

  try {
    const response = await fetch(`${this.url}?q=${term}&page=${page}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erro no fetch:', error);
    throw error;
  }
}
```

### CSS

**Regras Gerais:**
- Use nomenclatura tipo BEM: `.vs-component__element--modifier`
- Prefixe todas as classes com `vs-` para evitar conflitos
- Agrupe propriedades relacionadas juntas
- Use propriedades customizadas CSS para temas
- Design responsivo mobile-first

**Exemplo:**

```css
/* Base do componente */
.vs-results {
  background: var(--vs-bg-color, #fff);
  border-radius: var(--vs-border-radius, 4px);
}

/* Elemento */
.vs-results__item {
  padding: 8px 12px;
  cursor: pointer;
}

/* Modificador */
.vs-results__item--highlighted {
  background: var(--vs-highlight-bg, #f0f0f0);
}

/* Estado */
.vs-results__item:hover {
  background: var(--vs-hover-bg, #f5f5f5);
}
```

### Mensagens de Commit

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

**Formato:**
```
<tipo>(<escopo>): <assunto>

<corpo>

<rodapé>
```

**Tipos:**
- `feat`: Novo recurso
- `fix`: Correção de bug
- `docs`: Apenas documentação
- `style`: Alterações de estilo de código (formatação, ponto e vírgula, etc.)
- `refactor`: Refatoração de código (sem alterações funcionais)
- `perf`: Melhorias de performance
- `test`: Adição ou atualização de testes
- `chore`: Processo de build, dependências, ferramentas
- `ci`: Alterações de CI/CD

**Exemplos:**

```bash
# Recurso
feat(ajax): adiciona suporte a função transport customizada

# Correção de bug
fix(results): previne itens duplicados em multi-seleção

# Documentação
docs(readme): adiciona exemplos de paginação

# Refatoração
refactor(dropdown): simplifica lógica de cálculo de posição

# Alteração com quebra
feat(api)!: altera formato de retorno do getSelected()

BREAKING CHANGE: getSelected() agora retorna array de objetos ao invés de IDs
```

## Testes

### Executando Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

### Escrevendo Testes

- Escreva testes para todos os novos recursos
- Escreva testes para correções de bugs para prevenir regressões
- Mantenha ou melhore a cobertura de código
- Teste casos extremos e condições de erro

**Exemplo de Teste:**

```javascript
describe('VanillaSmartSelect', () => {
  let select;
  let element;

  beforeEach(() => {
    element = document.createElement('select');
    document.body.appendChild(element);
  });

  afterEach(() => {
    if (select) {
      select.destroy();
    }
    document.body.removeChild(element);
  });

  it('deve inicializar com opções padrão', () => {
    select = new VanillaSmartSelect(element);
    expect(select.options.get('multiple')).toBe(false);
    expect(select.options.get('placeholder')).toBe('Select an option');
  });

  it('deve abrir dropdown ao clicar', () => {
    select = new VanillaSmartSelect(element);
    const container = select.container.getElement();
    container.click();
    expect(select.isOpen()).toBe(true);
  });
});
```

## Documentação

### Documentação de Código

- Adicione comentários JSDoc a todos os métodos públicos
- Inclua tipos de parâmetros e tipos de retorno
- Adicione exemplos de uso para métodos complexos
- Documente erros lançados

### Documentação do Usuário

- Atualize README.md para alterações voltadas ao usuário
- Adicione exemplos ao site de documentação
- Atualize API.md para alterações na API
- Adicione notas de migração para alterações com quebra

## Processo de Release

Releases são gerenciados pelos mantenedores:

1. Atualizar versão no `package.json`
2. Atualizar `CHANGELOG.md` com notas de release
3. Criar uma tag git: `git tag v1.0.0`
4. Push da tag: `git push origin v1.0.0`
5. Build dos arquivos de distribuição: `npm run build`
6. Publicar no npm: `npm publish`
7. Criar release no GitHub com notas

## Dúvidas?

Sinta-se à vontade para abrir uma issue com a label `question`, ou entre em contato diretamente com os mantenedores.

## Licença

Ao contribuir para o Vanilla Smart Select, você concorda que suas contribuições serão licenciadas sob a Licença MIT.

---

Obrigado por contribuir para o Vanilla Smart Select! 🎉
