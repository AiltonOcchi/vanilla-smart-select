# 🎯 Vanilla Smart Select

[English](README.md) | **Português**

Biblioteca moderna, completa, leve e poderosa de aprimoramento de dropdown escrita em vanilla JavaScript puro - **sem necessidade de jQuery**.

[![npm version](https://img.shields.io/npm/v/vanilla-smart-select.svg)](https://www.npmjs.com/package/vanilla-smart-select)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/vanilla-smart-select)](https://bundlephobia.com/package/vanilla-smart-select)

> Transforme elementos nativos `<select>` em dropdowns poderosos e pesquisáveis com suporte AJAX, templates customizados, internacionalização e muito mais - tudo sem dependências.

## 📑 Navegação Rápida

- [Recursos](#-recursos) • [Instalação](#-instalação) • [Início Rápido](#-início-rápido)
- [Documentação](#-documentação) • [Referência da API](#referência-da-api) • [Eventos](#eventos)
- [Suporte a Navegadores](#suporte-a-navegadores) • [Contribuindo](#contribuindo)

---

## ✨ O Que Você Ganha

Transforme este select básico:
```html
<select>
  <option>Opção 1</option>
  <option>Opção 2</option>
</select>
```

Em um dropdown poderoso com:
- 🔍 **Busca ao Vivo** - Encontre opções instantaneamente enquanto digita
- ⌨️ **Navegação por Teclado** - Setas, Enter, Escape, Tab
- 🎯 **Multi-Seleção** - Selecione múltiplos itens com tags
- 🌐 **Carregamento AJAX** - Carregue dados de APIs dinamicamente
- 📱 **Mobile Friendly** - Interface otimizada para toque
- ♿ **Acessível** - Compatível com leitores de tela, em conformidade com WCAG
- 🎨 **Customizável** - Controle total sobre estilos e templates

Tudo com **apenas 3 linhas de JavaScript**!

---

## ✨ Recursos

- 🚀 **Zero Dependências** - Vanilla JavaScript puro, sem necessidade de jQuery
- 📦 **Leve** - ~50KB minificado, ~15KB gzipped
- ♿ **Acessível** - Compatível com WCAG 2.1 Nível AA com suporte ARIA completo
- 🔍 **Busca Inteligente** - Busca em tempo real com suporte a diacríticos
- 🌍 **Internacionalização** - Suporte multi-idioma (EN, PT-BR, ES) com detecção automática
- 🎨 **Templates Customizados** - Controle total sobre renderização de itens com HTML/CSS
- 🔄 **Suporte AJAX** - Carregamento de dados remotos com debounce e cache
- 📜 **Scroll Infinito** - Paginação automática para grandes conjuntos de dados
- 🏷️ **Tagging** - Crie novas opções dinamicamente
- ⌨️ **Navegação por Teclado** - Acessibilidade completa por teclado
- 🎯 **Multi-Seleção** - Selecione múltiplos itens com limites opcionais
- 📊 **Optgroups** - Organize opções em grupos
- 🎨 **Temas** - Fácil de customizar com variáveis CSS
- 📱 **Responsivo** - Funciona perfeitamente em desktop e mobile
- 🅱️ **Compatível com Bootstrap** - Funciona perfeitamente com Bootstrap 5

---

## 🤔 Por Que Vanilla Smart Select?

**Problema:** Elementos nativos `<select>` são limitados e difíceis de estilizar. A maioria das bibliotecas de aprimoramento requer dependências pesadas como jQuery.

**Solução:** Vanilla Smart Select fornece funcionalidade poderosa de dropdown com:
- ✅ **Zero Dependências** - Vanilla JavaScript puro, sem jQuery ou outras bibliotecas
- ✅ **Leve** - Tamanho de bundle pequeno (~15KB gzipped) vs alternativas pesadas
- ✅ **Arquitetura Moderna** - Construído com ES6+ e padrões web modernos
- ✅ **Melhor Performance** - Renderização otimizada e cache inteligente
- ✅ **Recursos Ricos** - i18n, AJAX, tagging, templates customizados e muito mais

**Perfeito para:** Aplicações web modernas, projetos React/Vue/Angular, Progressive Web Apps e qualquer projeto que valorize performance e código limpo.

---

## 📦 Instalação

### NPM
```bash
npm install vanilla-smart-select
```

### Yarn
```bash
yarn add vanilla-smart-select
```

### CDN
```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/vanilla-smart-select/dist/vanilla-smart-select.min.css">

<!-- JavaScript -->
<script src="https://unpkg.com/vanilla-smart-select/dist/vanilla-smart-select.min.js"></script>
```

### ES Modules
```javascript
import VanillaSmartSelect from 'vanilla-smart-select';
import 'vanilla-smart-select/dist/vanilla-smart-select.min.css';
```

---

## 🚀 Início Rápido

### 1. Inclua os arquivos

```html
<!-- CSS -->
<link rel="stylesheet" href="node_modules/vanilla-smart-select/dist/vanilla-smart-select.min.css">

<!-- JavaScript -->
<script src="node_modules/vanilla-smart-select/dist/vanilla-smart-select.min.js"></script>
```

### 2. Crie seu HTML

```html
<select id="mySelect">
  <option value="">Escolha uma opção...</option>
  <option value="1">JavaScript</option>
  <option value="2">Python</option>
  <option value="3">Ruby</option>
  <option value="4">Go</option>
</select>
```

### 3. Inicialize

```javascript
const select = new VanillaSmartSelect('#mySelect', {
  searchable: true,
  placeholder: 'Selecione uma linguagem...'
});
```

**É isso!** Seu select agora está aprimorado com busca, navegação por teclado e melhor estilização.

---

## 💡 Exemplos de Uso Básico

### Select Pesquisável Simples
```html
<select id="countries">
  <option value="">Selecione um país...</option>
  <option value="us">Estados Unidos</option>
  <option value="ca">Canadá</option>
  <option value="br">Brasil</option>
</select>

<script>
  new VanillaSmartSelect('#countries', {
    searchable: true
  });
</script>
```

### Com Array de Dados
```javascript
const select = new VanillaSmartSelect('#mySelect', {
  data: [
    { id: 1, text: 'JavaScript' },
    { id: 2, text: 'Python' },
    { id: 3, text: 'Ruby', disabled: true },
    {
      text: 'Frontend',
      children: [
        { id: 4, text: 'React' },
        { id: 5, text: 'Vue' },
        { id: 6, text: 'Angular' }
      ]
    }
  ],
  placeholder: 'Selecione uma linguagem...'
});
```

---

## 📖 Documentação

### Índice
- [Recursos Principais](#recursos-principais-1)
  - [Seleção Única](#seleção-única)
  - [Multi-Seleção](#multi-seleção)
  - [Busca e Filtragem](#busca-e-filtragem)
  - [Optgroups](#optgroups)
- [Recursos Avançados](#recursos-avançados)
  - [Internacionalização (i18n)](#internacionalização-i18n)
  - [Templates Customizados](#templates-customizados)
  - [Carregamento AJAX](#carregamento-ajax)
  - [Tagging](#tagging)
  - [Paginação / Scroll Infinito](#paginação--scroll-infinito)
- [Referência da API](#referência-da-api)
- [Eventos](#eventos)
- [Opções de Configuração](#opções-de-configuração)

---

## Recursos Principais

### Seleção Única

Dropdown simples com busca e botão de limpar:

```javascript
const select = new VanillaSmartSelect('#single-select', {
  placeholder: 'Escolha uma opção...',
  allowClear: true,
  searchable: true
});
```

### Multi-Seleção

Selecione múltiplas opções com limite opcional de seleção:

```javascript
const select = new VanillaSmartSelect('#multi-select', {
  multiple: true,
  placeholder: 'Selecione múltiplos itens...',
  maximumSelectionLength: 5 // Limite opcional
});
```

### Busca e Filtragem

Busca poderosa com suporte a diacríticos e matchers customizados:

```javascript
const select = new VanillaSmartSelect('#searchable-select', {
  searchable: true,
  searchMinimumLength: 2,
  searchDelay: 250,
  matchStrategy: 'contains', // 'startsWith' | 'contains' | 'exact'

  // Matcher customizado
  matcher: (params, item) => {
    const term = params.term.toLowerCase();
    const text = item.text.toLowerCase();
    return text.includes(term);
  }
});
```

### Optgroups

Organize opções em grupos:

```javascript
const select = new VanillaSmartSelect('#grouped-select', {
  data: [
    {
      text: 'Frutas',
      children: [
        { id: 'apple', text: 'Maçã' },
        { id: 'banana', text: 'Banana' }
      ]
    },
    {
      text: 'Vegetais',
      children: [
        { id: 'carrot', text: 'Cenoura' },
        { id: 'lettuce', text: 'Alface' }
      ]
    }
  ]
});
```

---

## Recursos Avançados

### Internacionalização (i18n)

Suporte integrado para múltiplos idiomas com detecção automática:

```javascript
import { getLanguage } from 'vanilla-smart-select/i18n';

// Detectar idioma do navegador automaticamente (EN, PT-BR ou ES)
const select = new VanillaSmartSelect('#i18n-select'); // Detecta automaticamente

// Ou definir manualmente
const select = new VanillaSmartSelect('#i18n-select', {
  language: getLanguage('pt-BR')
});

// Alterar idioma dinamicamente
select.updateLanguage(getLanguage('es'));
```

**Idiomas Suportados:**
- 🇺🇸 Inglês (en)
- 🇧🇷 Português - Brasil (pt-BR)
- 🇪🇸 Espanhol (es)

**Mensagens Customizadas:**
```javascript
const select = new VanillaSmartSelect('#select', {
  language: {
    noResults: 'Nenhum resultado encontrado',
    searching: 'Buscando...',
    loading: 'Carregando...',
    errorLoading: 'Erro ao carregar resultados',
    inputTooShort: (args) => `Digite mais ${args.minimum} caracteres`,
    maximumSelected: (args) => `Máximo de ${args.maximum} itens`
  }
});
```

### Templates Customizados

Controle total sobre como os itens são renderizados:

```javascript
const select = new VanillaSmartSelect('#custom-template', {
  data: [
    {
      id: 1,
      text: 'João Silva',
      avatar: 'https://i.pravatar.cc/32?img=1',
      email: 'joao@exemplo.com'
    }
  ],

  // Customizar itens do dropdown
  templateResult: (item) => {
    if (item._isTag) {
      return `<div style="color: #007bff;">➕ Criar: ${item.text}</div>`;
    }

    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.gap = '10px';
    div.innerHTML = `
      <img src="${item.avatar}" style="width: 32px; height: 32px; border-radius: 50%;">
      <div>
        <div style="font-weight: 500;">${item.text}</div>
        <div style="font-size: 12px; color: #666;">${item.email}</div>
      </div>
    `;
    return div;
  },

  // Customizar itens selecionados
  templateSelection: (item) => {
    return `<img src="${item.avatar}" style="width: 16px; border-radius: 50%;"> ${item.text}`;
  }
});
```

**Funções de Template:**
- **templateResult** - Customiza itens na lista dropdown
- **templateSelection** - Customiza exibição de itens selecionados
- Retorno: `HTMLElement` ou `string` (HTML)

### Carregamento AJAX

Carregue dados de fontes remotas com debouncing e cache:

```javascript
const select = new VanillaSmartSelect('#ajax-select', {
  placeholder: 'Buscar repositórios do GitHub...',
  ajax: {
    url: 'https://api.github.com/search/repositories',
    method: 'GET',
    delay: 300, // Delay de debounce
    cache: true, // Habilitar cache

    // Transformar parâmetros da requisição
    data: (params) => ({
      q: params.term,
      page: params.page,
      per_page: 10
    }),

    // Processar resposta
    processResults: (data, params) => ({
      results: data.items.map(repo => ({
        id: repo.id,
        text: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count
      })),
      pagination: {
        more: data.items.length >= 10
      }
    }),

    // Headers customizados
    headers: {
      'Authorization': 'Bearer SEU_TOKEN'
    },

    // Transport customizado (opcional)
    transport: (params, config) => {
      return fetch(config.url + '?' + new URLSearchParams(params))
        .then(r => r.json());
    }
  }
});
```

**Eventos AJAX:**
```javascript
element.addEventListener('vs:ajaxLoading', (e) => {
  console.log('Carregando...', e.detail.params);
});

element.addEventListener('vs:ajaxSuccess', (e) => {
  console.log('Carregado:', e.detail.results);
});

element.addEventListener('vs:ajaxError', (e) => {
  console.error('Erro:', e.detail.error);
});
```

### Tagging

Permita que usuários criem novas opções dinamicamente:

```javascript
const select = new VanillaSmartSelect('#tags-select', {
  tags: true,
  multiple: true,
  placeholder: 'Digite para adicionar tags...',

  // Validar e criar tag
  createTag: (params) => {
    const term = params.term.trim();
    if (!term) return null;

    // Exemplo de validação de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(term)) {
      return null;
    }

    return {
      id: term,
      text: term
    };
  },

  // Controlar posição de inserção da tag
  insertTag: (data, tag) => {
    data.unshift(tag); // Adicionar no início
  },

  // Template customizado para opção de criação de tag
  templateResult: (item) => {
    if (item._isTag) {
      return `<div style="color: #28a745;">✨ Criar tag: "${item.text}"</div>`;
    }
    return item.text;
  }
});
```

**Casos de Uso:**
- Destinatários de email
- Palavras-chave/Categorias
- Menções de usuário (@usuario)
- Filtros customizados

### Paginação / Scroll Infinito

Carregue automaticamente mais resultados conforme o usuário rola:

```javascript
const select = new VanillaSmartSelect('#pagination-select', {
  ajax: {
    url: 'https://api.github.com/search/users',
    data: (params) => ({
      q: params.term || 'john',
      page: params.page || 1,
      per_page: 15
    }),
    processResults: (data, params) => ({
      results: data.items.map(user => ({
        id: user.id,
        text: user.login,
        avatar: user.avatar_url
      })),
      pagination: {
        more: data.items.length >= 15 // Tem mais páginas
      }
    })
  }
});
```

**Como funciona:**
- Role até o final → carrega automaticamente a próxima página
- Resultados são acumulados (página 1 + página 2 + página 3...)
- Indicador "Carregando mais..." mostrado durante o carregamento
- Mudança no termo de busca reseta a paginação

---

## Referência da API

### Métodos

#### Gerenciamento de Valor
```javascript
// Obter valor atual
const value = select.val();

// Definir valor (seleção única)
select.val('option-id');

// Definir valor (multi-seleção)
select.val(['id1', 'id2', 'id3']);

// Limpar seleção
select.clear();
```

#### Seleção Programática
```javascript
// Selecionar item por ID
select.select('item-id');

// Desselecionar item (apenas multi-seleção)
select.unselect('item-id');

// Obter item(s) selecionado(s) com dados completos
const selected = select.getSelected();
// Retorna: { id, text, ...customData } ou [{ id, text }, ...]
```

#### Gerenciamento de Dados
```javascript
// Obter todos os dados
const data = select.data();

// Definir/Substituir dados
select.data([
  { id: 1, text: 'Nova Opção 1' },
  { id: 2, text: 'Nova Opção 2' }
]);

// Adicionar opção única
select.addOption({ id: 'new', text: 'Nova Opção' });

// Remover opção por ID
select.removeOption('option-id');
```

#### Controle do Dropdown
```javascript
// Abrir dropdown
select.open();

// Fechar dropdown
select.close();

// Alternar dropdown
select.toggle();

// Verificar se está aberto
const isOpen = select.isOpen(); // boolean

// Focar no select
select.focus();
```

#### Habilitar/Desabilitar
```javascript
// Desabilitar select
select.disable();

// Habilitar select
select.enable();
```

#### Validação HTML5
```javascript
// Verificar se é válido
const isValid = select.checkValidity(); // boolean

// Mostrar mensagem de validação
const isValid = select.reportValidity(); // boolean

// Definir erro customizado
select.setCustomValidity('Por favor, selecione uma opção');
select.setCustomValidity(''); // Limpar erro

// Obter mensagem de validação
const message = select.validationMessage();

// Verificar se será validado
const willValidate = select.willValidate();
```

#### Internacionalização
```javascript
import { getLanguage } from 'vanilla-smart-select/i18n';

// Alterar idioma dinamicamente
select.updateLanguage(getLanguage('pt-BR'));
```

#### Limpeza
```javascript
// Destruir instância e limpar
select.destroy();
```

---

## Eventos

Todos os eventos são prefixados com `vs:` para evitar conflitos.

### Eventos Básicos
```javascript
const element = document.querySelector('#mySelect');

// Eventos de seleção
element.addEventListener('vs:select', (e) => {
  console.log('Selecionado:', e.detail.data);
});

element.addEventListener('vs:unselect', (e) => {
  console.log('Desselecionado:', e.detail.data);
});

element.addEventListener('vs:change', (e) => {
  console.log('Valor alterado:', e.detail.value);
});

element.addEventListener('vs:clear', (e) => {
  console.log('Seleção limpa');
});

// Eventos do dropdown
element.addEventListener('vs:open', () => {
  console.log('Dropdown aberto');
});

element.addEventListener('vs:close', () => {
  console.log('Dropdown fechado');
});

// Eventos de busca
element.addEventListener('vs:query', (e) => {
  console.log('Termo de busca:', e.detail.term);
});

element.addEventListener('vs:results', (e) => {
  console.log('Resultados:', e.detail.results);
});

// Eventos de ciclo de vida
element.addEventListener('vs:init', () => {
  console.log('Inicializado');
});

element.addEventListener('vs:destroy', () => {
  console.log('Destruído');
});
```

### Eventos Avançados
```javascript
// Limite de seleção (multi-seleção)
element.addEventListener('vs:selectionLimitReached', (e) => {
  console.log('Limite atingido:', e.detail.maximum);
  console.log('Mensagem:', e.detail.message);
});

// Eventos AJAX
element.addEventListener('vs:ajaxLoading', (e) => {
  console.log('Carregando dados...', e.detail.params);
});

element.addEventListener('vs:ajaxSuccess', (e) => {
  console.log('Dados carregados:', e.detail.results);
});

element.addEventListener('vs:ajaxError', (e) => {
  console.error('Erro ao carregar dados:', e.detail.error);
});

// Eventos de dados
element.addEventListener('vs:dataLoaded', (e) => {
  console.log('Dados carregados:', e.detail.data);
});
```

### Eventos Preveníveis
```javascript
// Estes eventos podem ser prevenidos com e.preventDefault()

element.addEventListener('vs:selecting', (e) => {
  if (shouldPrevent) {
    e.preventDefault(); // Cancelar seleção
  }
});

element.addEventListener('vs:unselecting', (e) => {
  e.preventDefault(); // Cancelar desseleção
});

element.addEventListener('vs:clearing', (e) => {
  e.preventDefault(); // Cancelar limpeza
});

element.addEventListener('vs:opening', (e) => {
  e.preventDefault(); // Prevenir abertura do dropdown
});

element.addEventListener('vs:closing', (e) => {
  e.preventDefault(); // Prevenir fechamento do dropdown
});
```

---

## Opções de Configuração

Lista completa de todas as opções disponíveis:

```javascript
{
  // ===== Opções de Exibição =====
  placeholder: '',              // Texto placeholder
  theme: 'default',             // Nome do tema
  width: '100%',                // Largura do select
  containerCssClass: '',        // Classe CSS customizada para container
  dropdownCssClass: '',         // Classe CSS customizada para dropdown

  // ===== Opções de Comportamento =====
  multiple: false,              // Habilitar multi-seleção
  searchable: true,             // Habilitar busca
  allowClear: false,            // Mostrar botão limpar (seleção única)
  disabled: false,              // Desabilitar select
  closeOnSelect: true,          // Fechar dropdown após seleção

  // ===== Opções de Dados =====
  data: null,                   // Array de dados (alternativa a elementos <option>)

  // ===== Opções de Busca =====
  searchMinimumLength: 0,       // Caracteres mínimos para buscar
  searchDelay: 250,             // Delay de debounce (ms)
  searchPlaceholder: null,      // Placeholder do input de busca
  matcher: null,                // Função matcher customizada
  matchStrategy: 'contains',    // 'startsWith' | 'contains' | 'exact'

  // ===== Opções de Template =====
  templateResult: null,         // Função: (item) => HTMLElement | string
  templateSelection: null,      // Função: (item) => HTMLElement | string
  escapeMarkup: (markup) => markup, // Função para sanitizar HTML

  // ===== Opções do Dropdown =====
  dropdownParent: null,         // Elemento pai para o dropdown
  dropdownAutoWidth: false,     // Largura automática do dropdown

  // ===== Opções AJAX =====
  ajax: null,                   // Objeto de configuração AJAX
  /*
  ajax: {
    url: '',                    // URL da API
    method: 'GET',              // Método HTTP
    dataType: 'json',           // Tipo de resposta: 'json' | 'text' | 'blob'
    delay: 250,                 // Delay de debounce (ms)
    cache: false,               // Habilitar cache
    headers: {},                // Headers customizados
    data: (params) => params,   // Transformar parâmetros da requisição
    processResults: (data) => ({ results: data }), // Processar resposta
    transport: null             // Função fetch customizada
  }
  */

  // ===== Opções de Tagging =====
  tags: false,                  // Habilitar tagging
  createTag: (params) => {      // Função criar tag
    const term = params.term?.trim();
    if (!term) return null;
    return { id: term, text: term };
  },
  insertTag: (data, tag) => {   // Função inserir tag
    data.unshift(tag);
  },

  // ===== Opções de Idioma/i18n =====
  language: {                   // Objeto de idioma ou detecção automática
    noResults: 'Nenhum resultado encontrado',
    searching: 'Buscando...',
    searchPlaceholder: 'Buscar...',
    loading: 'Carregando...',
    loadingMore: 'Carregando mais resultados...',
    errorLoading: 'Os resultados não puderam ser carregados',
    inputTooShort: (args) => `Por favor, digite ${args.minimum} ou mais caracteres`,
    inputTooLong: (args) => `Por favor, delete ${args.excess} caracteres`,
    maximumSelected: (args) => `Você só pode selecionar ${args.maximum} itens`,
    createNewTag: (args) => `Criar tag: "${args.term}"`,
    loadMore: 'Carregar mais resultados'
  },

  // ===== Opções de Acessibilidade =====
  ariaLabel: null,              // Label ARIA
  ariaDescribedBy: null,        // ARIA described by

  // ===== Opções de Seleção =====
  maximumSelectionLength: 0,    // Seleções máximas (0 = ilimitado, apenas multi-seleção)

  // ===== Callbacks de Eventos =====
  onOpen: null,                 // Função chamada ao abrir
  onClose: null,                // Função chamada ao fechar
  onChange: null,               // Função chamada ao alterar valor
  onSelect: null,               // Função chamada ao selecionar item
  onUnselect: null,             // Função chamada ao desselecionar item
  onClear: null,                // Função chamada ao limpar

  // ===== Debug =====
  debug: false                  // Habilitar modo debug
}
```

---

## Suporte a Navegadores

- ✅ Chrome/Edge (últimas 2 versões)
- ✅ Firefox (últimas 2 versões)
- ✅ Safari (últimas 2 versões)
- ✅ Opera (últimas 2 versões)
- ❌ Internet Explorer (não suportado)

**Requisitos Mínimos:**
- Suporte ES6+
- Fetch API
- CSS Grid
- CSS Custom Properties (variáveis)

---

## Performance

- **Tamanho do Bundle:** ~50KB minificado, ~15KB gzipped
- **Zero Dependências:** Nenhuma biblioteca externa necessária
- **Renderização Otimizada:** Conceitos de Virtual DOM para performance
- **Cache Inteligente:** Respostas AJAX cacheadas automaticamente
- **Busca com Debounce:** Chamadas de API reduzidas

---

## 🚀 Melhorias Futuras

Ideias sendo consideradas para versões futuras:
- Virtual scrolling para 10k+ itens
- Drag & drop para reordenar seleções
- Sistema de temas avançado
- Definições TypeScript
- API de Plugin/Extensão

Sugestões? [Abra uma discussão](https://github.com/AiltonOcchi/vanilla-smart-select/discussions)!

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Seja correções de bugs, novos recursos, melhorias na documentação ou exemplos.

**Como contribuir:**

1. Faça um fork do repositório
2. Crie um branch de feature (`git checkout -b feature/recurso-incrivel`)
3. Faça suas alterações
4. Teste minuciosamente (execute exemplos, verifique compatibilidade)
5. Commit suas alterações (`git commit -m 'Adiciona recurso incrível'`)
6. Push para o branch (`git push origin feature/recurso-incrivel`)
7. Abra um Pull Request

**Áreas onde ajuda é apreciada:**
- 🐛 Correção de bugs
- 📝 Melhorias na documentação
- 🌍 Traduções de idiomas adicionais
- 💡 Novos exemplos
- 🎨 Temas
- ✅ Testes

### Configuração de Desenvolvimento

```bash
# Clonar o repositório
git clone https://github.com/AiltonOcchi/vanilla-smart-select.git
cd vanilla-smart-select

# Instalar dependências
npm install

# Iniciar modo de desenvolvimento (rebuild automático em alterações)
npm run dev

# Build para produção
npm run build

# Executar testes
npm test
```

---

## Licença

Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes

---

## 💬 Suporte e Comunidade

- 📚 **Documentação**: Você está lendo!
- 🐛 **Relatórios de Bug**: [GitHub Issues](https://github.com/AiltonOcchi/vanilla-smart-select/issues)
- 💡 **Solicitações de Recursos**: [GitHub Discussions](https://github.com/AiltonOcchi/vanilla-smart-select/discussions)
- ⭐ **Mostre Apoio**: Dê uma estrela ao projeto no GitHub!

---
