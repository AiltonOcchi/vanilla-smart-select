/**
 * Portuguese - Brazil (pt-BR) language strings for Vanilla Smart Select
 */

export const PT_BR = {
  // Results display
  noResults: "Nenhum resultado encontrado",

  // Search
  searching: "Buscando...",
  searchPlaceholder: "Buscar...",
  inputTooShort: (args) =>
    `Por favor, digite ${args.minimum} ou mais caracteres`,
  inputTooLong: (args) => `Por favor, delete ${args.excess} caracteres`,

  // Selection limits
  maximumSelected: (args) =>
    `Você só pode selecionar ${args.maximum} ${args.maximum === 1 ? "item" : "itens"}`,

  // AJAX (Phase 2)
  loading: "Carregando...",
  loadingMore: "Carregando mais resultados...",
  errorLoading: "Os resultados não puderam ser carregados",

  // Tagging (Phase 2)
  createNewTag: (args) => `Criar tag: "${args.term}"`,
  tagAdded: (args) => `Tag "${args.text}" adicionada`,

  // Pagination (Phase 2)
  loadMore: "Carregar mais resultados",

  // Accessibility (ARIA labels)
  searchLabel: "Buscar opções",
  clearSelection: "Limpar seleção",
  removeItem: (args) => `Remover ${args.text}`,
  selectOptions: "Selecionar opções",

  // Screen reader announcements
  noResultsAvailable: "Nenhum resultado encontrado",
  resultsAvailable: {
    one: "1 resultado disponível",
    other: (args) => `${args.count} resultados disponíveis`,
  },
  selected: (args) => `Selecionado: ${args.text}`,
};

export default PT_BR;
