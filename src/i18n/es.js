/**
 * Spanish (es) language strings for Vanilla Smart Select
 */

export const ES = {
  // Results display
  noResults: "No se encontraron resultados",

  // Search
  searching: "Buscando...",
  searchPlaceholder: "Buscar...",
  inputTooShort: (args) =>
    `Por favor, ingrese ${args.minimum} o más caracteres`,
  inputTooLong: (args) => `Por favor, elimine ${args.excess} caracteres`,

  // Selection limits
  maximumSelected: (args) =>
    `Solo puede seleccionar ${args.maximum} ${args.maximum === 1 ? "elemento" : "elementos"}`,

  // AJAX (Phase 2)
  loading: "Cargando...",
  loadingMore: "Cargando más resultados...",
  errorLoading: "Los resultados no se pudieron cargar",

  // Tagging (Phase 2)
  createNewTag: (args) => `Crear etiqueta: "${args.term}"`,
  tagAdded: (args) => `Etiqueta "${args.text}" agregada`,

  // Pagination (Phase 2)
  loadMore: "Cargar más resultados",

  // Accessibility (ARIA labels)
  searchLabel: "Buscar opciones",
  clearSelection: "Limpiar selección",
  removeItem: (args) => `Eliminar ${args.text}`,
  selectOptions: "Seleccionar opciones",

  // Screen reader announcements
  noResultsAvailable: "No se encontraron resultados",
  resultsAvailable: {
    one: "1 resultado disponible",
    other: (args) => `${args.count} resultados disponibles`,
  },
  selected: (args) => `Seleccionado: ${args.text}`,
};

export default ES;
