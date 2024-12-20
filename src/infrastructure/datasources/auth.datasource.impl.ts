import { AuthDatasource, CustomError, UserEntity, UserRole } from '../../domain';
import { LoginUserDto, RegisterUserDto } from '../../application';
import { prisma, UserMapper } from '..';

export class AuthDatasourceImpl implements AuthDatasource {
  private static _instance: AuthDatasourceImpl;

  private constructor() {}

  static get instance(): AuthDatasourceImpl {
    if (!this._instance) this._instance = new AuthDatasourceImpl();

    return this._instance;
  }

  async registerUser(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const isEmailTaken = await prisma.userModel.findFirst({ where: { email: registerUserDto.email } });
    if (isEmailTaken) throw CustomError.badRequest('This email is already registered');

    const newUser = await prisma.userModel.create({ data: { ...registerUserDto, role: UserRole.USER } });
    return UserMapper.userEntityFromObject(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginUserDto;

    const user = await prisma.userModel.findFirst({ where: { email } });
    if (!user || user.password !== password) throw CustomError.badRequest('Invalid credentials');

    return UserMapper.userEntityFromObject(user);
  }
}
