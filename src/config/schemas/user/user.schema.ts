import { z } from 'zod';

import { UserEntity, UserRole } from '../../../domain';

export const userSchema: z.ZodType<UserEntity> = z.object({
  user_id: z.number().positive().int(),
  fullname: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  avatar: z.string().url(),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
});
