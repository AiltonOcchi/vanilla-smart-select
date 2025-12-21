# 🎯 Vanilla Smart Select

**English** | [Português](README.pt-BR.md)

Modern, complete, lightweight, and powerful dropdown enhancement library written in pure vanilla JavaScript - **no jQuery required**.

[![npm version](https://img.shields.io/npm/v/vanilla-smart-select.svg)](https://www.npmjs.com/package/vanilla-smart-select)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/vanilla-smart-select)](https://bundlephobia.com/package/vanilla-smart-select)

> Transform native `<select>` elements into powerful, searchable dropdowns with AJAX support, custom templates, internationalization, and more - all with zero dependencies.

## 📑 Quick Navigation

- [Features](#-features) • [Installation](#-installation) • [Quick Start](#-quick-start)
- [Documentation](#-documentation) • [API Reference](#api-reference) • [Events](#events)
- [Browser Support](#browser-support) • [Contributing](#contributing)

---

## ✨ What You Get

Transform this basic select:
```html
<select>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

Into a powerful dropdown with:
- 🔍 **Live Search** - Find options instantly as you type
- ⌨️ **Keyboard Navigation** - Arrow keys, Enter, Escape, Tab
- 🎯 **Multi-Select** - Select multiple items with tags
- 🌐 **AJAX Loading** - Load data from APIs dynamically
- 📱 **Mobile Friendly** - Touch-optimized interface
- ♿ **Accessible** - Screen reader compatible, WCAG compliant
- 🎨 **Customizable** - Full control over styling and templates

All with **just 3 lines of JavaScript**!

---

## ✨ Features

- 🚀 **Zero Dependencies** - Pure vanilla JavaScript, no jQuery required
- 📦 **Lightweight** - ~50KB minified, ~15KB gzipped
- ♿ **Accessible** - WCAG 2.1 Level AA compliant with full ARIA support
- 🔍 **Smart Search** - Real-time search with diacritics support
- 🌍 **Internationalization** - Multi-language support (EN, PT-BR, ES) with auto-detection
- 🎨 **Custom Templates** - Full control over item rendering with HTML/CSS
- 🔄 **AJAX Support** - Remote data loading with debounce and caching
- 📜 **Infinite Scroll** - Automatic pagination for large datasets
- 🏷️ **Tagging** - Create new options dynamically
- ⌨️ **Keyboard Navigation** - Full keyboard accessibility
- 🎯 **Multi-Select** - Select multiple items with optional limits
- 📊 **Optgroups** - Organize options into groups
- 🎨 **Themeable** - Easy to customize with CSS variables
- 📱 **Responsive** - Works perfectly on desktop and mobile
- 🅱️ **Bootstrap Compatible** - Works seamlessly with Bootstrap 5

---

## 🤔 Why Vanilla Smart Select?

**Problem:** Native `<select>` elements are limited and hard to style. Most enhancement libraries require heavy dependencies like jQuery.

**Solution:** Vanilla Smart Select provides powerful dropdown functionality with:
- ✅ **Zero Dependencies** - Pure vanilla JavaScript, no jQuery or other libraries needed
- ✅ **Lightweight** - Small bundle size (~15KB gzipped) vs bloated alternatives
- ✅ **Modern Architecture** - Built with ES6+ and modern web standards
- ✅ **Better Performance** - Optimized rendering and smart caching
- ✅ **Rich Features** - i18n, AJAX, tagging, custom templates, and more

**Perfect for:** Modern web apps, React/Vue/Angular projects, Progressive Web Apps, and any project that values performance and clean code.

---

## 📦 Installation

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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vanilla-smart-select@1.0.1/dist/vanilla-smart-select.min.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/vanilla-smart-select@1.0.1/dist/vanilla-smart-select.min.js"></script>
```

### ES Modules
```javascript
import VanillaSmartSelect from 'vanilla-smart-select';
import 'vanilla-smart-select/dist/vanilla-smart-select.min.css';
```

---

## 🚀 Quick Start

### 1. Include the files

```html
<!-- CSS -->
<link rel="stylesheet" href="node_modules/vanilla-smart-select/dist/vanilla-smart-select.min.css">

<!-- JavaScript -->
<script src="node_modules/vanilla-smart-select/dist/vanilla-smart-select.min.js"></script>
```

### 2. Create your HTML

```html
<select id="mySelect">
  <option value="">Choose an option...</option>
  <option value="1">JavaScript</option>
  <option value="2">Python</option>
  <option value="3">Ruby</option>
  <option value="4">Go</option>
</select>
```

### 3. Initialize

```javascript
const select = new VanillaSmartSelect('#mySelect', {
  searchable: true,
  placeholder: 'Select a language...'
});
```

**That's it!** Your select is now enhanced with search, keyboard navigation, and better styling.

---

## 💡 Basic Usage Examples

### Simple Searchable Select
```html
<select id="countries">
  <option value="">Select a country...</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
  <option value="br">Brazil</option>
</select>

<script>
  new VanillaSmartSelect('#countries', {
    searchable: true
  });
</script>
```

### With Data Array
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
  placeholder: 'Select a language...'
});
```

---

## 📖 Documentation

### Table of Contents
- [Core Features](#core-features-1)
  - [Single Select](#single-select)
  - [Multi-Select](#multi-select)
  - [Search & Filtering](#search--filtering)
  - [Optgroups](#optgroups)
- [Advanced Features](#advanced-features)
  - [Internationalization (i18n)](#internationalization-i18n)
  - [Custom Templates](#custom-templates)
  - [AJAX Loading](#ajax-loading)
  - [Tagging](#tagging)
  - [Pagination / Infinite Scroll](#pagination--infinite-scroll)
- [API Reference](#api-reference)
- [Events](#events)
- [Configuration Options](#configuration-options)

---

## Core Features

### Single Select

Simple dropdown with search and clear button:

```javascript
const select = new VanillaSmartSelect('#single-select', {
  placeholder: 'Choose an option...',
  allowClear: true,
  searchable: true
});
```

### Multi-Select

Select multiple options with optional selection limit:

```javascript
const select = new VanillaSmartSelect('#multi-select', {
  multiple: true,
  placeholder: 'Select multiple items...',
  maximumSelectionLength: 5 // Optional limit
});
```

### Search & Filtering

Powerful search with diacritics support and custom matchers:

```javascript
const select = new VanillaSmartSelect('#searchable-select', {
  searchable: true,
  searchMinimumLength: 2,
  searchDelay: 250,
  matchStrategy: 'contains', // 'startsWith' | 'contains' | 'exact'

  // Custom matcher
  matcher: (params, item) => {
    const term = params.term.toLowerCase();
    const text = item.text.toLowerCase();
    return text.includes(term);
  }
});
```

### Optgroups

Organize options into groups:

```javascript
const select = new VanillaSmartSelect('#grouped-select', {
  data: [
    {
      text: 'Fruits',
      children: [
        { id: 'apple', text: 'Apple' },
        { id: 'banana', text: 'Banana' }
      ]
    },
    {
      text: 'Vegetables',
      children: [
        { id: 'carrot', text: 'Carrot' },
        { id: 'lettuce', text: 'Lettuce' }
      ]
    }
  ]
});
```

---

## Advanced Features

### Internationalization (i18n)

Built-in support for multiple languages with auto-detection:

```javascript
import { getLanguage } from 'vanilla-smart-select/i18n';

// Auto-detect browser language (EN, PT-BR, or ES)
const select = new VanillaSmartSelect('#i18n-select'); // Auto-detects

// Or set manually
const select = new VanillaSmartSelect('#i18n-select', {
  language: getLanguage('pt-BR')
});

// Change language dynamically
select.updateLanguage(getLanguage('es'));
```

**Supported Languages:**
- 🇺🇸 English (en)
- 🇧🇷 Portuguese - Brazil (pt-BR)
- 🇪🇸 Spanish (es)

**Custom Messages:**
```javascript
const select = new VanillaSmartSelect('#select', {
  language: {
    noResults: 'No results found',
    searching: 'Searching...',
    loading: 'Loading...',
    errorLoading: 'Error loading results',
    inputTooShort: (args) => `Type ${args.minimum} more characters`,
    maximumSelected: (args) => `Maximum ${args.maximum} items`
  }
});
```

### Custom Templates

Full control over how items are rendered:

```javascript
const select = new VanillaSmartSelect('#custom-template', {
  data: [
    {
      id: 1,
      text: 'John Doe',
      avatar: 'https://i.pravatar.cc/32?img=1',
      email: 'john@example.com'
    }
  ],

  // Customize dropdown items
  templateResult: (item) => {
    if (item._isTag) {
      return `<div style="color: #007bff;">➕ Create: ${item.text}</div>`;
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

  // Customize selected items
  templateSelection: (item) => {
    return `<img src="${item.avatar}" style="width: 16px; border-radius: 50%;"> ${item.text}`;
  }
});
```

**Template Functions:**
- **templateResult** - Customizes items in dropdown list
- **templateSelection** - Customizes selected items display
- Return: `HTMLElement` or `string` (HTML)

### AJAX Loading

Load data from remote sources with debouncing and caching:

```javascript
const select = new VanillaSmartSelect('#ajax-select', {
  placeholder: 'Search GitHub repositories...',
  ajax: {
    url: 'https://api.github.com/search/repositories',
    method: 'GET',
    delay: 300, // Debounce delay
    cache: true, // Enable caching

    // Transform request parameters
    data: (params) => ({
      q: params.term,
      page: params.page,
      per_page: 10
    }),

    // Process response
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

    // Custom headers
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN'
    },

    // Custom transport (optional)
    transport: (params, config) => {
      return fetch(config.url + '?' + new URLSearchParams(params))
        .then(r => r.json());
    }
  }
});
```

**AJAX Events:**
```javascript
element.addEventListener('vs:ajaxLoading', (e) => {
  console.log('Loading...', e.detail.params);
});

element.addEventListener('vs:ajaxSuccess', (e) => {
  console.log('Loaded:', e.detail.results);
});

element.addEventListener('vs:ajaxError', (e) => {
  console.error('Error:', e.detail.error);
});
```

### Tagging

Allow users to create new options dynamically:

```javascript
const select = new VanillaSmartSelect('#tags-select', {
  tags: true,
  multiple: true,
  placeholder: 'Type to add tags...',

  // Validate and create tag
  createTag: (params) => {
    const term = params.term.trim();
    if (!term) return null;

    // Email validation example
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(term)) {
      return null;
    }

    return {
      id: term,
      text: term
    };
  },

  // Control tag insertion position
  insertTag: (data, tag) => {
    data.unshift(tag); // Add to beginning
  },

  // Custom template for tag creation option
  templateResult: (item) => {
    if (item._isTag) {
      return `<div style="color: #28a745;">✨ Create tag: "${item.text}"</div>`;
    }
    return item.text;
  }
});
```

**Use Cases:**
- Email recipients
- Keywords/Categories
- User mentions (@username)
- Custom filters

### Pagination / Infinite Scroll

Automatically load more results as user scrolls:

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
        more: data.items.length >= 15 // Has more pages
      }
    })
  }
});
```

**How it works:**
- Scroll to bottom → automatically loads next page
- Results are accumulated (page 1 + page 2 + page 3...)
- "Loading more..." indicator shown during loading
- Search term change resets pagination

---

## API Reference

### Methods

#### Value Management
```javascript
// Get current value
const value = select.val();

// Set value (single select)
select.val('option-id');

// Set value (multi-select)
select.val(['id1', 'id2', 'id3']);

// Clear selection
select.clear();
```

#### Programmatic Selection
```javascript
// Select item by ID
select.select('item-id');

// Unselect item (multi-select only)
select.unselect('item-id');

// Get selected item(s) with full data
const selected = select.getSelected();
// Returns: { id, text, ...customData } or [{ id, text }, ...]
```

#### Data Management
```javascript
// Get all data
const data = select.data();

// Set/Replace data
select.data([
  { id: 1, text: 'New Option 1' },
  { id: 2, text: 'New Option 2' }
]);

// Add single option
select.addOption({ id: 'new', text: 'New Option' });

// Remove option by ID
select.removeOption('option-id');
```

#### Dropdown Control
```javascript
// Open dropdown
select.open();

// Close dropdown
select.close();

// Toggle dropdown
select.toggle();

// Check if open
const isOpen = select.isOpen(); // boolean

// Focus on select
select.focus();
```

#### Enable/Disable
```javascript
// Disable select
select.disable();

// Enable select
select.enable();
```

#### HTML5 Validation
```javascript
// Check if valid
const isValid = select.checkValidity(); // boolean

// Show validation message
const isValid = select.reportValidity(); // boolean

// Set custom error
select.setCustomValidity('Please select an option');
select.setCustomValidity(''); // Clear error

// Get validation message
const message = select.validationMessage();

// Check if will be validated
const willValidate = select.willValidate();
```

#### Internationalization
```javascript
import { getLanguage } from 'vanilla-smart-select/i18n';

// Change language dynamically
select.updateLanguage(getLanguage('pt-BR'));
```

#### Cleanup
```javascript
// Destroy instance and cleanup
select.destroy();
```

---

## Events

All events are prefixed with `vs:` to avoid conflicts.

### Basic Events
```javascript
const element = document.querySelector('#mySelect');

// Selection events
element.addEventListener('vs:select', (e) => {
  console.log('Selected:', e.detail.data);
});

element.addEventListener('vs:unselect', (e) => {
  console.log('Unselected:', e.detail.data);
});

element.addEventListener('vs:change', (e) => {
  console.log('Value changed:', e.detail.value);
});

element.addEventListener('vs:clear', (e) => {
  console.log('Selection cleared');
});

// Dropdown events
element.addEventListener('vs:open', () => {
  console.log('Dropdown opened');
});

element.addEventListener('vs:close', () => {
  console.log('Dropdown closed');
});

// Search events
element.addEventListener('vs:query', (e) => {
  console.log('Search term:', e.detail.term);
});

element.addEventListener('vs:results', (e) => {
  console.log('Results:', e.detail.results);
});

// Lifecycle events
element.addEventListener('vs:init', () => {
  console.log('Initialized');
});

element.addEventListener('vs:destroy', () => {
  console.log('Destroyed');
});
```

### Advanced Events
```javascript
// Selection limit (multi-select)
element.addEventListener('vs:selectionLimitReached', (e) => {
  console.log('Limit reached:', e.detail.maximum);
  console.log('Message:', e.detail.message);
});

// AJAX events
element.addEventListener('vs:ajaxLoading', (e) => {
  console.log('Loading data...', e.detail.params);
});

element.addEventListener('vs:ajaxSuccess', (e) => {
  console.log('Data loaded:', e.detail.results);
});

element.addEventListener('vs:ajaxError', (e) => {
  console.error('Error loading data:', e.detail.error);
});

// Data events
element.addEventListener('vs:dataLoaded', (e) => {
  console.log('Data loaded:', e.detail.data);
});
```

### Preventable Events
```javascript
// These events can be prevented with e.preventDefault()

element.addEventListener('vs:selecting', (e) => {
  if (shouldPrevent) {
    e.preventDefault(); // Cancel selection
  }
});

element.addEventListener('vs:unselecting', (e) => {
  e.preventDefault(); // Cancel unselection
});

element.addEventListener('vs:clearing', (e) => {
  e.preventDefault(); // Cancel clear
});

element.addEventListener('vs:opening', (e) => {
  e.preventDefault(); // Prevent dropdown from opening
});

element.addEventListener('vs:closing', (e) => {
  e.preventDefault(); // Prevent dropdown from closing
});
```

---

## Configuration Options

Complete list of all available options:

```javascript
{
  // ===== Display Options =====
  placeholder: '',              // Placeholder text
  theme: 'default',             // Theme name
  width: '100%',                // Select width
  containerCssClass: '',        // Custom CSS class for container
  dropdownCssClass: '',         // Custom CSS class for dropdown

  // ===== Behavior Options =====
  multiple: false,              // Enable multi-select
  searchable: true,             // Enable search
  allowClear: false,            // Show clear button (single select)
  disabled: false,              // Disable select
  closeOnSelect: true,          // Close dropdown after selection

  // ===== Data Options =====
  data: null,                   // Data array (alternative to <option> elements)

  // ===== Search Options =====
  searchMinimumLength: 0,       // Minimum characters to search
  searchDelay: 250,             // Debounce delay (ms)
  searchPlaceholder: null,      // Search input placeholder
  matcher: null,                // Custom matcher function
  matchStrategy: 'contains',    // 'startsWith' | 'contains' | 'exact'

  // ===== Template Options =====
  templateResult: null,         // Function: (item) => HTMLElement | string
  templateSelection: null,      // Function: (item) => HTMLElement | string
  escapeMarkup: (markup) => markup, // Function to sanitize HTML

  // ===== Dropdown Options =====
  dropdownParent: null,         // Parent element for dropdown
  dropdownAutoWidth: false,     // Auto width dropdown

  // ===== AJAX Options =====
  ajax: null,                   // AJAX configuration object
  /*
  ajax: {
    url: '',                    // API URL
    method: 'GET',              // HTTP method
    dataType: 'json',           // Response type: 'json' | 'text' | 'blob'
    delay: 250,                 // Debounce delay (ms)
    cache: false,               // Enable caching
    headers: {},                // Custom headers
    data: (params) => params,   // Transform request params
    processResults: (data) => ({ results: data }), // Process response
    transport: null             // Custom fetch function
  }
  */

  // ===== Tagging Options =====
  tags: false,                  // Enable tagging
  createTag: (params) => {      // Create tag function
    const term = params.term?.trim();
    if (!term) return null;
    return { id: term, text: term };
  },
  insertTag: (data, tag) => {   // Insert tag function
    data.unshift(tag);
  },

  // ===== Language/i18n Options =====
  language: {                   // Language object or auto-detect
    noResults: 'No results found',
    searching: 'Searching...',
    searchPlaceholder: 'Search...',
    loading: 'Loading...',
    loadingMore: 'Loading more results...',
    errorLoading: 'The results could not be loaded',
    inputTooShort: (args) => `Please enter ${args.minimum} or more characters`,
    inputTooLong: (args) => `Please delete ${args.excess} characters`,
    maximumSelected: (args) => `You can only select ${args.maximum} items`,
    createNewTag: (args) => `Create tag: "${args.term}"`,
    loadMore: 'Load more results'
  },

  // ===== Accessibility Options =====
  ariaLabel: null,              // ARIA label
  ariaDescribedBy: null,        // ARIA described by

  // ===== Selection Options =====
  maximumSelectionLength: 0,    // Maximum selections (0 = unlimited, multi-select only)

  // ===== Event Callbacks =====
  onOpen: null,                 // Function called when opened
  onClose: null,                // Function called when closed
  onChange: null,               // Function called when value changes
  onSelect: null,               // Function called when item selected
  onUnselect: null,             // Function called when item unselected
  onClear: null,                // Function called when cleared

  // ===== Debug =====
  debug: false                  // Enable debug mode
}
```

---

## Browser Support

- ✅ Chrome/Edge (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Opera (last 2 versions)
- ❌ Internet Explorer (not supported)

**Minimum Requirements:**
- ES6+ support
- Fetch API
- CSS Grid
- CSS Custom Properties (variables)

---

## Performance

- **Bundle Size:** ~50KB minified, ~15KB gzipped
- **Zero Dependencies:** No external libraries required
- **Optimized Rendering:** Virtual DOM concepts for performance
- **Smart Caching:** AJAX responses cached automatically
- **Debounced Search:** Reduced API calls

---

## 🚀 Future Enhancements

Ideas being considered for future versions:
- Virtual scrolling for 10k+ items
- Drag & drop to reorder selections
- Advanced theming system
- TypeScript definitions
- Plugin/Extension API

Suggestions? [Open a discussion](https://github.com/AiltonOcchi/vanilla-smart-select/discussions)!

---

## 🤝 Contributing

Contributions are welcome! Whether it's bug fixes, new features, documentation improvements, or examples.

**How to contribute:**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (run examples, check compatibility)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

**Areas where help is appreciated:**
- 🐛 Bug fixes
- 📝 Documentation improvements
- 🌍 Additional language translations
- 💡 New examples
- 🎨 Themes
- ✅ Tests

### Development Setup

```bash
# Clone the repository
git clone https://github.com/AiltonOcchi/vanilla-smart-select.git
cd vanilla-smart-select

# Install dependencies
npm install

# Start development mode (auto-rebuild on changes)
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

---

## License

MIT License - see [LICENSE](LICENSE) file for details

---

## 💬 Support & Community

- 📚 **Documentation**: You're reading it!
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/AiltonOcchi/vanilla-smart-select/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/AiltonOcchi/vanilla-smart-select/discussions)
- ⭐ **Show Support**: Star the project on GitHub!

---
