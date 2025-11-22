export class PaginationDto {
  page?: number = 1;
  take?: number = 20;
  status?: string;
  sort?: 'asc' | 'desc' = 'desc'; // by createdAt
}
