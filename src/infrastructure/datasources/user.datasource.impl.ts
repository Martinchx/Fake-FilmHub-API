import { CustomError, UserEntity, UserDatasource, UsersData, UserWithReviews } from '../../domain';
import { CheckUserEmailDto, PaginationDto, UpdateUserDto, UserIdDto } from '../../application';
import { prisma, UserMapper } from '..';

export class UserDatasourceImpl implements UserDatasource {
  private static _instance: UserDatasourceImpl;

  private constructor() {}

  static get instance(): UserDatasourceImpl {
    if (!this._instance) this._instance = new UserDatasourceImpl();

    return this._instance;
  }

  async getUsers(paginationDto: PaginationDto): Promise<UsersData> {
    const { page, limit } = paginationDto;

    const [total, users] = await prisma.$transaction([
      prisma.userModel.count(),
      prisma.userModel.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      total,
      users: users.map(UserMapper.userEntityFromObject),
    };
  }

  async getUserById(userIdDto: UserIdDto): Promise<UserEntity> {
    const user = await prisma.userModel.findUnique({ where: { user_id: userIdDto.user_id } });

    if (!user) throw CustomError.notFound('User not found');

    return UserMapper.userEntityFromObject(user);
  }

  async getUserByEmail(checkUserEmailDto: CheckUserEmailDto): Promise<UserEntity | null> {
    const user = await prisma.userModel.findFirst({
      where: { email: { equals: checkUserEmailDto.email, mode: 'insensitive' } },
    });

    return user ? UserMapper.userEntityFromObject(user) : null;
  }

  async getReviewsByUser(userIdDto: UserIdDto, paginationDto: PaginationDto): Promise<UserWithReviews> {
    const { user_id } = userIdDto;
    const { page, limit } = paginationDto;

    const [totalReviews, userWithReviews] = await prisma.$transaction([
      prisma.reviewModel.count({ where: { user_id } }),
      prisma.userModel.findUnique({
        where: { user_id },
        include: {
          reviews: {
            include: { movie: { select: { title: true, release_year: true, director: true, poster_image_url: true } } },
            skip: (page - 1) * limit,
            take: limit,
          },
        },
      }),
    ]);

    if (!userWithReviews) throw CustomError.notFound('User not found');

    return {
      totalReviews,
      user: UserMapper.userEntityFromObject(userWithReviews),
    };
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const { user_id, ...updateUserDtoData } = updateUserDto;
    const userFromDB = await this.getUserById({ user_id });

    if (updateUserDto.email && updateUserDto.email.toLowerCase() !== userFromDB.email.toLowerCase()) {
      const isEmailTaken = await prisma.userModel.findFirst({ where: { email: updateUserDto.email } });
      if (isEmailTaken) throw CustomError.badRequest('This email is already registered');
    }

    const updatedUser = await prisma.userModel.update({ where: { user_id }, data: updateUserDtoData });

    return UserMapper.userEntityFromObject(updatedUser);
  }
}
