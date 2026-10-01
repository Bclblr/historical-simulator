export interface CitationPageRange {
  startPage: number;
  endPage: number;
}

export type CitationPages = number | CitationPageRange;

function validatePage(page: number, field: string): void {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error(`${field} must be a positive integer.`);
  }
}

export function createCitationPages(
  startPage: number,
  endPage?: number,
): CitationPages {
  validatePage(startPage, 'Citation startPage');

  if (endPage === undefined || endPage === startPage) {
    return startPage;
  }

  validatePage(endPage, 'Citation endPage');

  if (endPage < startPage) {
    throw new Error('Citation endPage cannot be before startPage.');
  }

  return { startPage, endPage };
}

export function formatCitationPages(pages: CitationPages): string {
  return typeof pages === 'number'
    ? `p. ${pages}`
    : `pp. ${pages.startPage}–${pages.endPage}`;
}
