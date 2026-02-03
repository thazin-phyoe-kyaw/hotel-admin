export const getPaginationNumbers = (
  page: number,
  totalPages: number
): (number | string)[] => {
  const pages: (number | string)[] = [];

  pages.push(1);

  if (page > 3) {
    pages.push("...");
  }

  for (let p = page - 1; p <= page + 1; p++) {
    if (p > 1 && p < totalPages) {
      pages.push(p);
    }
  }

  if (page < totalPages - 2) {
    pages.push("...");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
};
