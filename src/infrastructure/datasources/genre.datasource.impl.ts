import { GenreMapper } from "..";
import { prisma } from "../../data/postgres";
import {
  CreateGenreDto,
  CustomError,
  GenreDatasource,
  GenreEntity,
  GenreIdDto,
  PaginationDto,
  UpdateGenreDto,
} from "../../domain";

export class GenreDatasourceImpl implements GenreDatasource {
  async getGenres(paginationDto: PaginationDto): Promise<GenreEntity[]> {
    const { page, limit } = paginationDto;

    const genres = await prisma.genre.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    return genres.map(GenreMapper.genreEntityFromObject);
  }

  async getMoviesByGenre(genreIdDto: GenreIdDto): Promise<GenreEntity> {
    const genreWithMovies = await prisma.genre.findFirst({
      where: { genre_id: genreIdDto.genre_id },
      include: { movies: { include: { movie: true } } },
    });

    if (!genreWithMovies) throw CustomError.notFound("Genre not found");

    return GenreMapper.genreEntityFromObject({
      ...genreWithMovies,
      movies: genreWithMovies.movies.map(({ movie }) => movie),
    });
  }

  async getGenreById(genreIdDto: GenreIdDto): Promise<GenreEntity> {
    const genre = await prisma.genre.findFirst({
      where: { genre_id: genreIdDto.genre_id },
    });

    if (!genre) throw CustomError.notFound("Genre not found");

    return GenreMapper.genreEntityFromObject(genre);
  }

  async createGenre(createGenreDto: CreateGenreDto): Promise<GenreEntity> {
    const genreNameRegistered = await prisma.genre.findFirst({
      where: {
        name: { equals: createGenreDto.name, mode: "insensitive" },
      },
    });

    if (genreNameRegistered)
      throw CustomError.badRequest("This genre name already exists");

    const newGenre = await prisma.genre.create({
      data: createGenreDto,
    });

    return GenreMapper.genreEntityFromObject(newGenre);
  }

  async updateGenre(updateGenreDto: UpdateGenreDto): Promise<GenreEntity> {
    const { genre_id, ...updateGenreDtoData } = updateGenreDto;

    const genreFromDB = await this.getGenreById({ genre_id });

    if (
      updateGenreDto.name &&
      updateGenreDto.name.toLowerCase() !== genreFromDB.name.toLowerCase()
    ) {
      const genreNameRegistered = await prisma.genre.findFirst({
        where: {
          name: { equals: updateGenreDto.name, mode: "insensitive" },
        },
      });

      if (genreNameRegistered)
        throw CustomError.badRequest("This genre name already exists");
    }

    const updatedGenre = await prisma.genre.update({
      where: { genre_id },
      data: updateGenreDtoData,
    });

    return GenreMapper.genreEntityFromObject(updatedGenre);
  }

  async deleteGenre(genreIdDto: GenreIdDto): Promise<boolean> {
    const { genre_id } = genreIdDto;

    await this.getGenreById({ genre_id });

    const relatedMovies = await prisma.movie.findMany({
      where: { genres: { some: { genre_id } } },
      include: { genres: true },
    });

    if (relatedMovies.length >= 15)
      throw CustomError.badRequest(
        "This genre cannot be deleted because it is linked to too many movies"
      );

    if (relatedMovies.some((movie) => movie.genres.length === 1))
      throw CustomError.badRequest(
        "One or more movies only have this genre. Add more genres or remove the movies before deleting this genre"
      );

    await prisma.$transaction([
      prisma.movieGenre.deleteMany({ where: { genre_id } }),
      prisma.genre.delete({ where: { genre_id } }),
    ]);

    return true;
  }
}