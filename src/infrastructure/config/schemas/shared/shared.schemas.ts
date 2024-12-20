import { z } from 'zod';

import { PaginationDto } from '../../../../application';

export const paginationSchema: z.ZodType<PaginationDto> = z.object({
  page: z.number().positive().int(),
  limit: z.number().positive().int(),
});

export const idSchema = z.number().positive().int();
