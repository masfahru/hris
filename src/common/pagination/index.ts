type PaginationResult<T> = {
  page: number;
  limit: number;
  totalItem: number;
  totalPage: number;
  items: T[];
};

export const generatePaginationResult = <T>(
  page: number,
  limit: number,
  totalItem: number,
  items: T[],
): PaginationResult<T> => ({
  page,
  limit,
  totalItem,
  totalPage: Math.ceil(totalItem / limit),
  items,
});
