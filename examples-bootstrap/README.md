# Vanilla Smart Select + Bootstrap 5

## 🎯 Sobre esta Pasta

Esta pasta contém exemplos do **Vanilla Smart Select** integrado com **Bootstrap 5**, demonstrando a compatibilidade completa entre os dois frameworks.

## ✅ Compatibilidade Testada

O Vanilla Smart Select é **totalmente compatível** com Bootstrap 5! Você pode usar:

- ✓ Classes de formulário do Bootstrap (`form-select`, `form-label`)
- ✓ Grid system do Bootstrap
- ✓ Componentes do Bootstrap (cards, alerts, buttons)
- ✓ Utilitários do Bootstrap (margins, padding, colors)
- ✓ JavaScript do Bootstrap (sem conflitos)

## 📁 Exemplos Disponíveis

### 1. basic.html
Exemplo básico mostrando todos os recursos principais:
- Single select com busca
- Multi-select
- Grupos (optgroups)
- Clear button
- Validação HTML5
- Atalhos de teclado

### 2. custom-templates.html
Templates personalizados com imagens e dados complexos:
- Countries com bandeiras (flags)
- Produtos com imagens e preços
- Usuários com avatares
- Badges e status coloridos
- `templateResult` e `templateSelection`

### 3. ajax-basic.html
Integração com AJAX e APIs:
- Busca de repositórios no GitHub
- Busca de usuários no GitHub
- Debounce e loading states
- Paginação infinita
- Tratamento de erros

### 4. tags.html
Modo tags para criação dinâmica de itens:
- Criação de tags sob demanda
- Validação de formato
- Multi-select com tags
- Adicionar/remover dinamicamente

### 5. pagination.html
Scroll infinito com dados remotos:
- GitHub API com scroll infinito
- Paginação automática
- Loading indicators
- 3 exemplos práticos

### 6. max-selection-length.html
Limite de seleção em multi-select:
- Limite de 2, 3, 4 ou 5 itens
- Mensagens customizadas
- Evento `vs:selectionLimitReached`
- Exemplos com e sem limite

### 7. custom-templates-simple.html
Templates usando apenas emojis (sem imagens externas):
- Países com flags emoji
- Usuários com avatares emoji
- Produtos com ícones emoji
- Tasks com status
- Categorias com contadores

### 8. api-programmatic.html
API programática completa:
- `val()`, `select()`, `unselect()`, `clear()`
- `getSelected()`, `addOption()`, `removeOption()`
- `open()`, `close()`, `toggle()`, `focus()`
- `enable()`, `disable()`, `isOpen()`
- Tabela de referência completa

### 9. i18n.html
Internacionalização (i18n):
- Detecção automática de idioma
- Suporte a pt-BR, en, es
- Troca dinâmica de idioma
- Mensagens customizadas
- Método `updateLanguage()`

### 10. validation-advanced.html
Validação avançada de formulários:
- Validação HTML5 nativa
- Atributo `required`
- `checkValidity()` e `reportValidity()`
- Feedback visual automático
- Helper opcional para validação customizada

## 🚀 Como Usar

1. **Incluir os arquivos na ordem correta:**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <!-- Bootstrap 5 CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

  <!-- Vanilla Smart Select CSS -->
  <link rel="stylesheet" href="../dist/vanilla-smart-select.css">
</head>
<body>
  <!-- Seu conteúdo aqui -->

  <!-- Bootstrap 5 JS Bundle -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

  <!-- Vanilla Smart Select JS -->
  <script src="../dist/vanilla-smart-select.js"></script>

  <!-- Seu código de inicialização -->
  <script>
    const select = new VanillaSmartSelect('#meu-select', {
      searchable: true
    });
  </script>
</body>
</html>
```

2. **Usar classes do Bootstrap nos elementos:**

```html
<div class="mb-3">
  <label for="example1" class="form-label">Selecione uma opção:</label>
  <select id="example1" class="form-select">
    <option value="">Escolha...</option>
    <option value="1">Opção 1</option>
    <option value="2">Opção 2</option>
  </select>
</div>
```

3. **Inicializar o Vanilla Smart Select:**

```javascript
const select = new VanillaSmartSelect('#example1', {
  searchable: true,
  placeholder: 'Selecione uma opção...'
});
```

## 🎨 Estilização

O Vanilla Smart Select respeita as classes do Bootstrap e adiciona suas próprias classes para funcionalidades avançadas:

### Classes Bootstrap Suportadas
- `form-select` - Estilo de select do Bootstrap
- `form-label` - Estilo de label do Bootstrap
- `mb-3`, `mt-2` - Utilitários de margem
- `btn`, `btn-primary` - Botões
- `card`, `card-body` - Cards
- `alert` - Alertas

### Classes Vanilla Smart Select
O plugin adiciona suas próprias classes que não conflitam com Bootstrap:
- `vs-container` - Container principal
- `vs-selection` - Área de seleção
- `vs-dropdown` - Dropdown de opções
- `vs-search` - Campo de busca
- `vs-results` - Lista de resultados

## ⚠️ Observações Importantes

1. **Ordem de Carregamento**: Sempre carregue o Bootstrap JS **antes** do Vanilla Smart Select JS
2. **Classes**: Você pode combinar classes do Bootstrap com as do Vanilla Smart Select
3. **Eventos**: Não há conflito entre eventos do Bootstrap e do Vanilla Smart Select
4. **Responsividade**: O Vanilla Smart Select herda a responsividade do Bootstrap automaticamente

## 🔧 Personalização

Você pode sobrescrever estilos do Bootstrap ou do Vanilla Smart Select conforme necessário:

```css
/* Exemplo: customizar cores para combinar com tema Bootstrap */
.vs-container {
  --vs-primary: #0d6efd; /* Primary do Bootstrap 5 */
  --vs-border-color: #dee2e6; /* Border color do Bootstrap */
}
```

## 📝 Notas de Compatibilidade

### ✅ Funciona Bem
- Formulários do Bootstrap
- Validação do Bootstrap
- Grid system
- Componentes (modals, cards, etc)
- Temas do Bootstrap
- Bootstrap Icons

### ⚠️ Atenção
- Se usar `form-select` do Bootstrap, o Vanilla Smart Select irá sobrescrever a aparência padrão (comportamento esperado)
- Certifique-se de que ambos os CSS estão carregados na ordem correta

## 🐛 Problemas Conhecidos

Nenhum problema de compatibilidade conhecido até o momento. Se encontrar algum, por favor reporte em: https://github.com/yourusername/vanilla-smart-select/issues

## 📚 Recursos Adicionais

- [Documentação do Vanilla Smart Select](../README.md)
- [Documentação do Bootstrap 5](https://getbootstrap.com/docs/5.3/)
- [Exemplos sem Bootstrap](../examples/)

---

**Versão Testada:** Bootstrap 5.3.2
**Data:** Dezembro 2025
