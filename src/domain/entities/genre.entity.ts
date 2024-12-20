import { PartialMovieEntity } from '..';

export class GenreEntity {
  constructor(
    public genre_id: number,
    public name: string,
    public image: string,
    public movies?: PartialMovieEntity[],
  ) {}
}
