export type PaginatedResponse<T> = {
  total: number;
  total_pages: number;
  page: number;
  page_size: number;
  data: T[];
};

export function paginatedResponseUtil<T>(
    {data,total,page,page_size}: 
    {  data: T[],
        total: number,
        page: number,
        page_size: number}
    ): PaginatedResponse<T> {

  const total_pages = Math.ceil(total / page_size);

  return {
    total: Number(total),
    total_pages: Number(total_pages),
    page: Number(page),
    page_size: Number(page_size),
    data,
  };
}
