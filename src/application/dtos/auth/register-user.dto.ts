import { ValidationResult } from '../../../domain';
import { registerUserSchema, ZodAdapter } from '../../../infrastructure';

export class RegisterUserDto {
  private constructor(
    public readonly fullname: string,
    public readonly email: string,
    public readonly password: string,
    public readonly avatar: string,
  ) {}

  static create(props: Record<string, any>): ValidationResult<RegisterUserDto> {
    const { errors, validatedData } = ZodAdapter.validate(registerUserSchema, props);

    return errors ? { errors } : { validatedData };
  }
}
