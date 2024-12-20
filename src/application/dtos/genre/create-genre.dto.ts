import { ValidationResult } from '../../../domain';
import { createGenreSchema, ZodAdapter } from '../../../infrastructure';

export class CreateGenreDto {
  private constructor(
    public readonly name: string,
    public readonly image: string,
  ) {}

  static create(props: Record<string, any>): ValidationResult<CreateGenreDto> {
    const { errors, validatedData } = ZodAdapter.validate(createGenreSchema, props);

    return errors ? { errors } : { validatedData };
  }
}
