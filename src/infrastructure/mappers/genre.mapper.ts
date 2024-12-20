import { CustomError, GenreEntity } from '../../domain';
import { genreSchema, ZodAdapter } from '..';

export class GenreMapper {
  static genreEntityFromObject(object: Record<string, any>): GenreEntity {
    const { errors, validatedData } = ZodAdapter.validate(genreSchema, object);

    if (errors) throw CustomError.internalServer('Error processing genre data');

    const { genre_id, name, image, movies } = validatedData!;

    return new GenreEntity(genre_id, name, image, movies);
  }
}
