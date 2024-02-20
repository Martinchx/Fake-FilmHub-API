import { UserRole } from "@prisma/client";
import { prisma } from "../../data/postgres";
import {
  CreateUserDto,
  UpdateUserDto,
  UserIdDto,
  CheckUserEmailDto,
  CustomError,
} from "../../domain";

export class UserService {
  constructor() {}

  async getUsers() {
    const users = await prisma.user.findMany();
    return users;
  }

  async getUserById(userIdDto: UserIdDto) {
    const userFound = await this.validateUserExistence(userIdDto.user_id);
    return userFound;
  }

  async createUser(createUserDto: CreateUserDto) {
    const isAvailable = await this.validateEmailExistence(createUserDto.email);

    if (!isAvailable)
      throw CustomError.badRequest("This email is already registered");

    try {
      const newUser = await prisma.user.create({
        data: {
          ...createUserDto,
          role: UserRole.user,
        },
      });

      return newUser;
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`${error}`);
    }
  }

  async validateEmail(checkUserEmailDto: CheckUserEmailDto) {
    const isAvailable = await this.validateEmailExistence(
      checkUserEmailDto.email
    );

    return { isAvailable };
  }

  async updateUser(updateUserDto: UpdateUserDto) {
    const { user_id, ...updateUserDtoData } = updateUserDto;

    await this.validateUserExistence(user_id);

    if (updateUserDto.email) {
      const isAvailable = await this.validateEmailExistence(
        updateUserDto.email
      );

      if (!isAvailable)
        throw CustomError.badRequest("This email is already registered");
    }

    try {
      const updatedUser = await prisma.user.update({
        where: {
          user_id: user_id,
        },
        data: updateUserDtoData,
      });

      return updatedUser;
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteUser(userIdDto: UserIdDto) {
    await this.validateUserExistence(userIdDto.user_id);

    try {
      await prisma.user.delete({
        where: { user_id: userIdDto.user_id },
      });

      return true;
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(`${error}`);
    }
  }

  private async validateUserExistence(user_id: number) {
    const userExists = await prisma.user.findFirst({
      where: {
        user_id: user_id,
      },
    });

    if (!userExists) throw CustomError.notFound("User not found");

    return userExists;
  }

  private async validateEmailExistence(user_email: string) {
    const userExists = await prisma.user.findFirst({
      where: {
        email: {
          equals: user_email,
          mode: "insensitive",
        },
      },
    });

    if (userExists) return false;

    return true;
  }
}
