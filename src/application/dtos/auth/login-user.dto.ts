import { ValidationResult } from '../../../domain';
import { loginUserSchema, ZodAdapter } from '../../../infrastructure';

export class LoginUserDto {
  private constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}

  static create(props: Record<string, any>): ValidationResult<LoginUserDto> {
    const { errors, validatedData } = ZodAdapter.validate(loginUserSchema, props);

    return errors ? { errors } : { validatedData };
  }
}
