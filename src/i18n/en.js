/**
 * English (en) language strings for Vanilla Smart Select
 */

export const EN = {
  // Results display
  noResults: "No results found",

  // Search
  searching: "Searching...",
  searchPlaceholder: "Search...",
  inputTooShort: (args) => `Please enter ${args.minimum} or more characters`,
  inputTooLong: (args) => `Please delete ${args.excess} characters`,

  // Selection limits
  maximumSelected: (args) => `You can only select ${args.maximum} items`,

  // AJAX (Phase 2)
  loading: "Loading...",
  loadingMore: "Loading more results...",
  errorLoading: "The results could not be loaded",

  // Tagging (Phase 2)
  createNewTag: (args) => `Create tag: "${args.term}"`,
  tagAdded: (args) => `Tag "${args.text}" added`,

  // Pagination (Phase 2)
  loadMore: "Load more results",

  // Accessibility (ARIA labels)
  searchLabel: "Search options",
  clearSelection: "Clear selection",
  removeItem: (args) => `Remove ${args.text}`,
  selectOptions: "Select options",

  // Screen reader announcements
  noResultsAvailable: "No results found",
  resultsAvailable: {
    one: "1 result available",
    other: (args) => `${args.count} results available`,
  },
  selected: (args) => `Selected: ${args.text}`,
};

export default EN;
