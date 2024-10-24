import {
  PaginationDto,
  UpdateUserDto,
  UserDatasource,
  UserEntity,
  UserIdDto,
  UserRepository,
  UsersData,
  UserWithReviews,
} from '../../domain';

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly userDatasource: UserDatasource) {}

  getUsers(paginationDto: PaginationDto): Promise<UsersData> {
    return this.userDatasource.getUsers(paginationDto);
  }

  getUserById(userIdDto: UserIdDto): Promise<UserEntity> {
    return this.userDatasource.getUserById(userIdDto);
  }

  getReviewsByUser(userIdDto: UserIdDto, paginationDto: PaginationDto): Promise<UserWithReviews> {
    return this.userDatasource.getReviewsByUser(userIdDto, paginationDto);
  }

  updateUser(updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.userDatasource.updateUser(updateUserDto);
  }
}
