# Contributing to Vanilla Smart Select

**English** | [Português](CONTRIBUTING.pt-BR.md)

First off, thank you for considering contributing to Vanilla Smart Select! It's people like you that make Vanilla Smart Select such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**Before Submitting A Bug Report:**
- Check the documentation for a solution
- Search existing issues to avoid duplicates
- Try to reproduce the issue with the latest version
- Gather information about your environment (browser, OS, etc.)

**How Do I Submit A Good Bug Report?**

Bugs are tracked as GitHub issues. Create an issue and provide the following information:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** after following the steps
- **Explain which behavior you expected to see instead** and why
- **Include screenshots or animated GIFs** if applicable
- **Include your environment details:**
  - Browser name and version
  - Operating System
  - Vanilla Smart Select version
  - Relevant configuration options

**Example Bug Report:**

```markdown
## Bug: AJAX results not clearing when search is cleared

**Environment:**
- Browser: Chrome 120.0
- OS: macOS 14.0
- Vanilla Smart Select: 1.0.0

**Steps to Reproduce:**
1. Initialize select with AJAX configuration
2. Type search term "test"
3. Clear search input
4. Observe results don't clear

**Expected Behavior:**
Results should clear when search is cleared

**Actual Behavior:**
Previous results remain visible

**Configuration:**
```javascript
new VanillaSmartSelect('#select', {
  ajax: {
    url: 'https://api.example.com/search',
    delay: 300
  }
});
```

**Screenshots:**
[Attach screenshot]
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful** to most users
- **List some examples** of how it would be used
- **Mention if this is something you'd be willing to work on**

### Pull Requests

**Before Submitting a Pull Request:**

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding style** of the project
3. **Write tests** for your changes if applicable
4. **Update documentation** to reflect your changes
5. **Ensure all tests pass** and the build succeeds
6. **Write a clear commit message** following our conventions

**Pull Request Process:**

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes** following the style guide below

3. **Test your changes:**
   ```bash
   npm test
   npm run build
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   # or
   git commit -m "fix: resolve bug with XYZ"
   ```

5. **Push to your fork:**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request** against the `main` branch

**Pull Request Template:**

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe the tests you ran and how to reproduce them:
1. Test step 1
2. Test step 2

## Checklist
- [ ] My code follows the code style of this project
- [ ] I have updated the documentation accordingly
- [ ] I have added tests to cover my changes
- [ ] All new and existing tests passed
- [ ] I have updated the CHANGELOG.md
```

## Development Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AiltonOcchi/vanilla-smart-select.git
   cd vanilla-smart-select
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Run the build:**
   ```bash
   npm run build
   ```

## Project Structure

```
vanilla-smart-select/
├── src/
│   ├── VanillaSmartSelect.js          # Main entry point
│   ├── adapters/                  # Adapter classes
│   │   ├── BaseAdapter.js
│   │   ├── DataAdapter.js
│   │   ├── DropdownAdapter.js
│   │   ├── ResultsAdapter.js
│   │   ├── SelectionAdapter.js
│   │   └── AjaxAdapter.js
│   ├── components/                # UI components
│   │   ├── Container.js
│   │   ├── Selection.js
│   │   ├── Dropdown.js
│   │   ├── SearchBox.js
│   │   └── ResultsList.js
│   ├── managers/                  # Business logic
│   │   ├── OptionsManager.js
│   │   ├── SearchManager.js
│   │   └── AccessibilityManager.js
│   ├── constants/                 # Constants
│   │   ├── events.js
│   │   ├── defaults.js
│   │   └── i18n.js
│   ├── utils/                     # Utility functions
│   │   ├── dom.js
│   │   ├── debounce.js
│   │   └── uid.js
│   └── styles/
│       └── core.css               # Main styles
├── dist/                          # Built files (generated)
├── docs/                          # Documentation
└── tests/                         # Test files

```

## Coding Style

### JavaScript

We follow modern ES6+ JavaScript conventions:

**General Rules:**
- Use `const` for variables that won't be reassigned, `let` otherwise
- Never use `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Use destructuring when appropriate
- Prefer explicit over implicit
- Add JSDoc comments for public methods

**Naming Conventions:**
- Classes: `PascalCase` (e.g., `VanillaSmartSelect`, `DataAdapter`)
- Functions/Methods: `camelCase` (e.g., `getData`, `handleClick`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `EVENTS`, `DEFAULT_OPTIONS`)
- Private methods: Prefix with `_` (e.g., `_internalMethod`)
- Files: `PascalCase` for classes (e.g., `VanillaSmartSelect.js`), `camelCase` for utilities

**Example:**

```javascript
/**
 * Fetch data from remote source
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Results array
 */
async fetchData(params) {
  const { term, page = 1 } = params;

  try {
    const response = await fetch(`${this.url}?q=${term}&page=${page}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
```

### CSS

**General Rules:**
- Use BEM-like naming: `.vs-component__element--modifier`
- Prefix all classes with `vs-` to avoid conflicts
- Group related properties together
- Use CSS custom properties for theming
- Mobile-first responsive design

**Example:**

```css
/* Component base */
.vs-results {
  background: var(--vs-bg-color, #fff);
  border-radius: var(--vs-border-radius, 4px);
}

/* Element */
.vs-results__item {
  padding: 8px 12px;
  cursor: pointer;
}

/* Modifier */
.vs-results__item--highlighted {
  background: var(--vs-highlight-bg, #f0f0f0);
}

/* State */
.vs-results__item:hover {
  background: var(--vs-hover-bg, #f5f5f5);
}
```

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring (no functional changes)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling
- `ci`: CI/CD changes

**Examples:**

```bash
# Feature
feat(ajax): add custom transport function support

# Bug fix
fix(results): prevent duplicate items in multi-select

# Documentation
docs(readme): add pagination examples

# Refactoring
refactor(dropdown): simplify position calculation logic

# Breaking change
feat(api)!: change getSelected() return format

BREAKING CHANGE: getSelected() now returns array of objects instead of IDs
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write tests for all new features
- Write tests for bug fixes to prevent regressions
- Maintain or improve code coverage
- Test edge cases and error conditions

**Example Test:**

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

  it('should initialize with default options', () => {
    select = new VanillaSmartSelect(element);
    expect(select.options.get('multiple')).toBe(false);
    expect(select.options.get('placeholder')).toBe('Select an option');
  });

  it('should open dropdown on click', () => {
    select = new VanillaSmartSelect(element);
    const container = select.container.getElement();
    container.click();
    expect(select.isOpen()).toBe(true);
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments to all public methods
- Include parameter types and return types
- Add usage examples for complex methods
- Document thrown errors

### User Documentation

- Update README.md for user-facing changes
- Add examples to the documentation website
- Update API.md for API changes
- Add migration notes for breaking changes

## Release Process

Releases are handled by maintainers:

1. Update version in `package.json`
2. Update `CHANGELOG.md` with release notes
3. Create a git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Build distribution files: `npm run build`
6. Publish to npm: `npm publish`
7. Create GitHub release with notes

## Questions?

Feel free to open an issue with the `question` label, or reach out to the maintainers directly.

## License

By contributing to Vanilla Smart Select, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Vanilla Smart Select! 🎉
