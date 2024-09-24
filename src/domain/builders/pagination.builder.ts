import { PaginationDto } from "..";
import { envs } from "../../config";

export enum ResourceType {
  USERS = "users",
  MOVIES = "movies",
  GENRES = "genres",
}

export class PaginationBuilder {
  static build(
    paginationDto: PaginationDto,
    total: number,
    resourceType: ResourceType,
    filtersQuery?: string
  ): { next: string | null; prev: string | null } {
    const { page, limit } = paginationDto;

    const baseUrl = `${envs.WEBSERVICE_URL}/${resourceType}`;

    const next =
      limit * page < total
        ? `${baseUrl}?page=${page + 1}&limit=${limit}${filtersQuery}`
        : null;

    const prev =
      page > 1
        ? `${baseUrl}?page=${page - 1}&limit=${limit}${filtersQuery}`
        : null;

    return { next, prev };
  }
}