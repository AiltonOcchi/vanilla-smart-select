# API Reference

Complete API documentation for Vanilla Smart Select.

## Table of Contents

- [Constructor](#constructor)
- [Configuration Options](#configuration-options)
- [Methods](#methods)
- [Events](#events)
- [Data Format](#data-format)
- [AJAX Configuration](#ajax-configuration)
- [Template Functions](#template-functions)
- [Internationalization](#internationalization)

---

## Constructor

### `new VanillaSmartSelect(element, options)`

Creates a new Vanilla Smart Select instance.

**Parameters:**
- `element` (String|HTMLElement) - CSS selector or DOM element
- `options` (Object) - Configuration options (optional)

**Returns:** VanillaSmartSelect instance

**Example:**

```javascript
// With selector
const select = new VanillaSmartSelect('#my-select', {
  placeholder: 'Choose an option',
  allowClear: true
});

// With DOM element
const element = document.getElementById('my-select');
const select = new VanillaSmartSelect(element, {
  multiple: true
});
```

---

## Configuration Options

### Core Options

#### `multiple`
- **Type:** `Boolean`
- **Default:** `false`
- **Description:** Enable multi-select mode

```javascript
new VanillaSmartSelect('#select', {
  multiple: true
});
```

#### `placeholder`
- **Type:** `String`
- **Default:** `'Select an option'`
- **Description:** Placeholder text when no selection

```javascript
new VanillaSmartSelect('#select', {
  placeholder: 'Choose a country...'
});
```

#### `allowClear`
- **Type:** `Boolean`
- **Default:** `false`
- **Description:** Show clear button to remove selection

```javascript
new VanillaSmartSelect('#select', {
  allowClear: true
});
```

#### `disabled`
- **Type:** `Boolean`
- **Default:** `false`
- **Description:** Disable the select

```javascript
new VanillaSmartSelect('#select', {
  disabled: true
});
```

#### `closeOnSelect`
- **Type:** `Boolean`
- **Default:** `true`
- **Description:** Close dropdown after selecting an item (single-select only)

```javascript
new VanillaSmartSelect('#select', {
  closeOnSelect: false
});
```

#### `width`
- **Type:** `String`
- **Default:** `'100%'`
- **Description:** Width of the select container

```javascript
new VanillaSmartSelect('#select', {
  width: '300px'
});
```

#### `data`
- **Type:** `Array<Object>`
- **Default:** `null`
- **Description:** Data source for options (alternative to HTML options)

```javascript
new VanillaSmartSelect('#select', {
  data: [
    { id: 1, text: 'Option 1' },
    { id: 2, text: 'Option 2' },
    { id: 3, text: 'Option 3', disabled: true }
  ]
});
```

### Search Options

#### `search`
- **Type:** `Boolean`
- **Default:** `true`
- **Description:** Enable search functionality

```javascript
new VanillaSmartSelect('#select', {
  search: false
});
```

#### `searchPlaceholder`
- **Type:** `String`
- **Default:** `'Search...'`
- **Description:** Placeholder text for search input

```javascript
new VanillaSmartSelect('#select', {
  searchPlaceholder: 'Type to search...'
});
```

#### `minimumInputLength`
- **Type:** `Number`
- **Default:** `0`
- **Description:** Minimum characters before search starts

```javascript
new VanillaSmartSelect('#select', {
  minimumInputLength: 2
});
```

### Selection Options

#### `maximumSelectionLength`
- **Type:** `Number`
- **Default:** `null`
- **Description:** Maximum number of selections allowed (multi-select only)

```javascript
new VanillaSmartSelect('#select', {
  multiple: true,
  maximumSelectionLength: 3
});
```

### AJAX Options

#### `ajax`
- **Type:** `Object`
- **Default:** `null`
- **Description:** AJAX configuration for remote data

See [AJAX Configuration](#ajax-configuration) for details.

### Template Options

#### `templateResult`
- **Type:** `Function`
- **Default:** `null`
- **Description:** Custom template for dropdown results

**Parameters:**
- `item` (Object) - Item data

**Returns:** String (HTML) or HTMLElement

```javascript
new VanillaSmartSelect('#select', {
  templateResult: (item) => {
    return `<div><strong>${item.text}</strong></div>`;
  }
});
```

#### `templateSelection`
- **Type:** `Function`
- **Default:** `null`
- **Description:** Custom template for selected item

**Parameters:**
- `item` (Object) - Item data

**Returns:** String (HTML) or HTMLElement

```javascript
new VanillaSmartSelect('#select', {
  templateSelection: (item) => {
    return `🎯 ${item.text}`;
  }
});
```

### Tag Options

#### `tags`
- **Type:** `Boolean`
- **Default:** `false`
- **Description:** Enable tag creation

```javascript
new VanillaSmartSelect('#select', {
  tags: true,
  multiple: true
});
```

#### `createTag`
- **Type:** `Function`
- **Default:** Default implementation
- **Description:** Function to create new tag from input

**Parameters:**
- `params` (Object) - `{ term: String }`

**Returns:** Object (tag data) or null

```javascript
new VanillaSmartSelect('#select', {
  tags: true,
  createTag: (params) => {
    const term = params.term?.trim();
    if (!term) return null;

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(term)) {
      return null;
    }

    return {
      id: term,
      text: term
    };
  }
});
```

#### `insertTag`
- **Type:** `Function`
- **Default:** Inserts at end
- **Description:** Function to control where tag is inserted

**Parameters:**
- `data` (Array) - Existing results
- `tag` (Object) - New tag to insert

```javascript
new VanillaSmartSelect('#select', {
  tags: true,
  insertTag: (data, tag) => {
    // Insert at beginning
    data.unshift(tag);
  }
});
```

### Internationalization Options

#### `language`
- **Type:** `String|Object`
- **Default:** `'en'`
- **Description:** Language code or custom language object

See [Internationalization](#internationalization) for details.

---

## Methods

### Selection Methods

#### `getSelected()`

Get currently selected items.

**Returns:** Array of selected items (objects)

**Example:**

```javascript
const selected = select.getSelected();
console.log(selected);
// [{ id: '1', text: 'Option 1' }]
```

#### `setSelected(ids)`

Set selected items by ID(s).

**Parameters:**
- `ids` (String|Number|Array) - ID or array of IDs to select

**Returns:** void

**Example:**

```javascript
// Single select
select.setSelected('1');

// Multi-select
select.setSelected(['1', '2', '3']);
```

#### `clear()`

Clear all selections.

**Returns:** void

**Example:**

```javascript
select.clear();
```

### Dropdown Methods

#### `open()`

Open the dropdown.

**Returns:** void

**Example:**

```javascript
select.open();
```

#### `close()`

Close the dropdown.

**Returns:** void

**Example:**

```javascript
select.close();
```

#### `toggle()`

Toggle dropdown open/close state.

**Returns:** void

**Example:**

```javascript
select.toggle();
```

#### `isOpen()`

Check if dropdown is open.

**Returns:** Boolean

**Example:**

```javascript
if (select.isOpen()) {
  console.log('Dropdown is open');
}
```

### State Methods

#### `enable()`

Enable the select.

**Returns:** void

**Example:**

```javascript
select.enable();
```

#### `disable()`

Disable the select.

**Returns:** void

**Example:**

```javascript
select.disable();
```

#### `isDisabled()`

Check if select is disabled.

**Returns:** Boolean

**Example:**

```javascript
if (select.isDisabled()) {
  console.log('Select is disabled');
}
```

### Data Methods

#### `getData()`

Get all available data/options.

**Returns:** Array of all items

**Example:**

```javascript
const allData = select.getData();
```

#### `setData(data)`

Replace all data/options.

**Parameters:**
- `data` (Array) - New data array

**Returns:** void

**Example:**

```javascript
select.setData([
  { id: 1, text: 'New Option 1' },
  { id: 2, text: 'New Option 2' }
]);
```

#### `addData(data)`

Add data/options to existing data.

**Parameters:**
- `data` (Array|Object) - Data to add

**Returns:** void

**Example:**

```javascript
select.addData({ id: 4, text: 'New Option' });

// Or multiple
select.addData([
  { id: 4, text: 'Option 4' },
  { id: 5, text: 'Option 5' }
]);
```

### Event Methods

#### `on(event, handler)`

Attach event listener.

**Parameters:**
- `event` (String) - Event name
- `handler` (Function) - Event handler function

**Returns:** void

**Example:**

```javascript
select.on('vs:select', (event) => {
  console.log('Selected:', event.detail.data);
});
```

#### `off(event, handler)`

Remove event listener.

**Parameters:**
- `event` (String) - Event name
- `handler` (Function) - Event handler function to remove

**Returns:** void

**Example:**

```javascript
const handler = (e) => console.log(e);
select.on('vs:select', handler);
select.off('vs:select', handler);
```

#### `emit(event, data)`

Emit custom event.

**Parameters:**
- `event` (String) - Event name
- `data` (Object) - Event data

**Returns:** void

**Example:**

```javascript
select.emit('custom:event', { myData: 'value' });
```

### Lifecycle Methods

#### `destroy()`

Destroy the instance and cleanup.

**Returns:** void

**Example:**

```javascript
select.destroy();
```

---

## Events

All events are prefixed with `vs:` and can be listened to using native `addEventListener` or the `on()` method.

### Core Events

#### `vs:open`

Fired when dropdown opens.

**Detail:** `{}`

```javascript
element.addEventListener('vs:open', (e) => {
  console.log('Dropdown opened');
});
```

#### `vs:close`

Fired when dropdown closes.

**Detail:** `{}`

```javascript
element.addEventListener('vs:close', (e) => {
  console.log('Dropdown closed');
});
```

#### `vs:select`

Fired when an item is selected.

**Detail:** `{ data: Object }` - Selected item

```javascript
element.addEventListener('vs:select', (e) => {
  console.log('Selected item:', e.detail.data);
});
```

#### `vs:unselect`

Fired when an item is unselected (multi-select).

**Detail:** `{ data: Object }` - Unselected item

```javascript
element.addEventListener('vs:unselect', (e) => {
  console.log('Unselected item:', e.detail.data);
});
```

#### `vs:change`

Fired when selection changes.

**Detail:** `{ selected: Array }` - All selected items

```javascript
element.addEventListener('vs:change', (e) => {
  console.log('Selection changed:', e.detail.selected);
});
```

#### `vs:clear`

Fired when selection is cleared.

**Detail:** `{}`

```javascript
element.addEventListener('vs:clear', (e) => {
  console.log('Selection cleared');
});
```

### Search Events

#### `vs:query`

Fired when search term changes.

**Detail:** `{ term: String }` - Search term

```javascript
element.addEventListener('vs:query', (e) => {
  console.log('Search term:', e.detail.term);
});
```

#### `vs:results`

Fired when results are updated.

**Detail:** `{ results: Array }` - Filtered results

```javascript
element.addEventListener('vs:results', (e) => {
  console.log('Results count:', e.detail.results.length);
});
```

### AJAX Events

#### `vs:ajaxLoading`

Fired when AJAX request starts.

**Detail:** `{ params: Object }` - Request parameters

```javascript
element.addEventListener('vs:ajaxLoading', (e) => {
  console.log('Loading page:', e.detail.params.page);
});
```

#### `vs:ajaxSuccess`

Fired when AJAX request succeeds.

**Detail:** `{ results: Object, params: Object }` - Results and parameters

```javascript
element.addEventListener('vs:ajaxSuccess', (e) => {
  console.log('Loaded:', e.detail.results.results.length, 'items');
});
```

#### `vs:ajaxError`

Fired when AJAX request fails.

**Detail:** `{ error: Error, params: Object }` - Error and parameters

```javascript
element.addEventListener('vs:ajaxError', (e) => {
  console.error('AJAX error:', e.detail.error);
});
```

### Selection Limit Events

#### `vs:selectionLimitReached`

Fired when selection limit is reached.

**Detail:** `{ message: String }` - Limit message

```javascript
element.addEventListener('vs:selectionLimitReached', (e) => {
  alert(e.detail.message);
});
```

---

## Data Format

### Item Object

Basic structure for data items:

```javascript
{
  id: String|Number,        // Required: Unique identifier
  text: String,             // Required: Display text
  disabled: Boolean,        // Optional: Disable this item
  selected: Boolean,        // Optional: Pre-select this item
  [custom]: Any            // Optional: Custom properties
}
```

**Example:**

```javascript
{
  id: 'us',
  text: 'United States',
  flag: '🇺🇸',
  population: 331000000,
  disabled: false,
  selected: true
}
```

### Optgroup Object

Structure for grouped options:

```javascript
{
  text: String,             // Required: Group label
  children: Array<Item>     // Required: Child items
}
```

**Example:**

```javascript
{
  text: 'North America',
  children: [
    { id: 'us', text: 'United States' },
    { id: 'ca', text: 'Canada' },
    { id: 'mx', text: 'Mexico' }
  ]
}
```

---

## AJAX Configuration

Complete AJAX configuration options:

```javascript
{
  ajax: {
    // Required: API endpoint URL
    url: String,

    // Optional: Delay before sending request (debounce)
    // Default: 250ms
    delay: Number,

    // Optional: Transform search parameters
    // Default: { term, page }
    data: (params) => Object,

    // Optional: Custom fetch function
    // Default: fetch with AbortController
    transport: (params, config) => Promise,

    // Optional: Transform API response
    // Default: identity function
    processResults: (data, params) => {
      results: Array,
      pagination: { more: Boolean }
    }
  }
}
```

### AJAX Examples

#### Basic Configuration

```javascript
new VanillaSmartSelect('#select', {
  ajax: {
    url: 'https://api.example.com/search',
    delay: 300
  }
});
```

#### Custom Data Parameters

```javascript
new VanillaSmartSelect('#select', {
  ajax: {
    url: 'https://api.github.com/search/repositories',
    data: (params) => ({
      q: params.term || 'javascript',
      page: params.page || 1,
      per_page: 10,
      sort: 'stars'
    })
  }
});
```

#### Custom Transport

```javascript
new VanillaSmartSelect('#select', {
  ajax: {
    url: 'https://api.example.com',
    transport: (params, config) => {
      const url = `${config.url}/${params.term}`;
      const abortController = new AbortController();

      const promise = fetch(url, {
        signal: abortController.signal,
        headers: {
          'Authorization': 'Bearer TOKEN'
        }
      }).then(r => r.json());

      promise.abort = () => abortController.abort();
      return promise;
    }
  }
});
```

#### Process Results

```javascript
new VanillaSmartSelect('#select', {
  ajax: {
    url: 'https://api.example.com/users',
    processResults: (data, params) => {
      return {
        results: data.items.map(user => ({
          id: user.id,
          text: user.name,
          email: user.email,
          avatar: user.avatar_url
        })),
        pagination: {
          more: data.total > (params.page * 10)
        }
      };
    }
  }
});
```

#### Complete Example

```javascript
new VanillaSmartSelect('#select', {
  ajax: {
    url: 'https://api.github.com/search/users',
    delay: 400,
    data: (params) => ({
      q: params.term || 'john',
      page: params.page || 1,
      per_page: 15
    }),
    processResults: (data, params) => ({
      results: data.items.map(user => ({
        id: user.id,
        text: user.login,
        avatar: user.avatar_url,
        url: user.html_url
      })),
      pagination: {
        more: data.items.length >= 15
      }
    })
  },
  templateResult: (item) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <img src="${item.avatar}" style="width: 32px; border-radius: 50%;" />
      <span>${item.text}</span>
    `;
    return div;
  }
});
```

---

## Template Functions

### templateResult

Customize how items appear in the dropdown results list.

**Signature:**
```javascript
(item: Object) => String|HTMLElement
```

**Parameters:**
- `item` - Item data object (includes all custom properties)

**Returns:** HTML string or DOM element

**Examples:**

```javascript
// Simple HTML string
templateResult: (item) => {
  return `<div class="custom-item">${item.text}</div>`;
}

// DOM element
templateResult: (item) => {
  const div = document.createElement('div');
  div.className = 'custom-item';
  div.textContent = item.text;
  return div;
}

// Rich content
templateResult: (item) => {
  return `
    <div class="user-item">
      <img src="${item.avatar}" alt="${item.text}" />
      <div>
        <strong>${item.text}</strong>
        <small>${item.email}</small>
      </div>
    </div>
  `;
}

// Conditional rendering
templateResult: (item) => {
  if (item._isTag) {
    return `<div class="create-tag">+ Create "${item.text}"</div>`;
  }
  return `<div>${item.text}</div>`;
}
```

### templateSelection

Customize how selected item appears in the selection container.

**Signature:**
```javascript
(item: Object) => String|HTMLElement
```

**Parameters:**
- `item` - Selected item data object

**Returns:** HTML string or DOM element

**Examples:**

```javascript
// Simple text
templateSelection: (item) => {
  return item.text;
}

// With icon
templateSelection: (item) => {
  return `${item.flag} ${item.text}`;
}

// Custom HTML
templateSelection: (item) => {
  return `<strong>${item.text}</strong> (${item.code})`;
}

// DOM element
templateSelection: (item) => {
  const span = document.createElement('span');
  span.innerHTML = `<img src="${item.icon}" /> ${item.text}`;
  return span;
}
```

---

## Internationalization

### Built-in Languages

- `'en'` - English (default)
- `'pt'` - Portuguese

### Language Object Structure

```javascript
{
  errorLoading: String,
  inputTooShort: Function,
  loading: String,
  loadingMore: String,
  maximumSelected: Function,
  noResults: String,
  searching: String,
  removeAllItems: String,
  removeItem: String,
  search: String
}
```

### Using Built-in Language

```javascript
new VanillaSmartSelect('#select', {
  language: 'pt'  // Portuguese
});
```

### Custom Language Object

```javascript
new VanillaSmartSelect('#select', {
  language: {
    errorLoading: 'Los resultados no se pudieron cargar',
    loading: 'Cargando...',
    loadingMore: 'Cargando más resultados...',
    noResults: 'No se encontraron resultados',
    searching: 'Buscando...',
    removeAllItems: 'Eliminar todos los elementos',
    removeItem: 'Eliminar elemento',
    search: 'Buscar',
    maximumSelected: (args) => {
      return `Solo puedes seleccionar ${args.maximum} elementos`;
    },
    inputTooShort: (args) => {
      const remaining = args.minimum - args.input;
      return `Por favor ingresa ${remaining} o más caracteres`;
    }
  }
});
```

### Complete Language Example

```javascript
// Spanish
const esLanguage = {
  errorLoading: 'Los resultados no se pudieron cargar',
  inputTooShort: (args) => {
    const remaining = args.minimum - args.input;
    return `Por favor ingresa ${remaining} o más caracteres`;
  },
  loading: 'Cargando...',
  loadingMore: 'Cargando más resultados...',
  maximumSelected: (args) => {
    const message = `Solo puedes seleccionar ${args.maximum}`;
    return args.maximum === 1 ? `${message} elemento` : `${message} elementos`;
  },
  noResults: 'No se encontraron resultados',
  searching: 'Buscando...',
  removeAllItems: 'Eliminar todos los elementos',
  removeItem: 'Eliminar elemento',
  search: 'Buscar'
};

new VanillaSmartSelect('#select', {
  language: esLanguage
});
```

---

## Advanced Usage

### Programmatic Control

```javascript
const select = new VanillaSmartSelect('#select', {
  data: [
    { id: 1, text: 'Option 1' },
    { id: 2, text: 'Option 2' },
    { id: 3, text: 'Option 3' }
  ]
});

// Open dropdown
document.getElementById('btn-open').addEventListener('click', () => {
  select.open();
});

// Select item
document.getElementById('btn-select').addEventListener('click', () => {
  select.setSelected('2');
});

// Get selection
document.getElementById('btn-get').addEventListener('click', () => {
  const selected = select.getSelected();
  console.log(selected);
});

// Clear selection
document.getElementById('btn-clear').addEventListener('click', () => {
  select.clear();
});
```

### Dynamic Data Update

```javascript
const select = new VanillaSmartSelect('#select');

// Fetch data and update
async function loadData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();

  select.setData(data.map(item => ({
    id: item.id,
    text: item.name
  })));
}

loadData();
```

### Multiple Instances

```javascript
// Create multiple independent instances
const select1 = new VanillaSmartSelect('#select1', {
  placeholder: 'Select country'
});

const select2 = new VanillaSmartSelect('#select2', {
  placeholder: 'Select city',
  disabled: true
});

// Enable city select when country is selected
select1.on('vs:select', (e) => {
  select2.enable();
  // Load cities for selected country
  loadCities(e.detail.data.id);
});
```

---

For more examples, see the [examples](./examples) directory.
