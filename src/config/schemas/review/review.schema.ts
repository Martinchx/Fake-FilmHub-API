import { z } from 'zod';

import { idSchema, partialMovieSchema, partialUserSchema } from '../..';
import { PartialReviewEntity, ReviewEntity } from '../../../domain';

const baseReviewSchema = z.object({
  user_id: z.lazy(() => idSchema),
  movie_id: z.lazy(() => idSchema),
  rating: z.number().min(1).max(5).int().nullable(),
  comment: z.string().min(5).nullable(),
  user: z.lazy(() => partialUserSchema).optional(),
  movie: z.lazy(() => partialMovieSchema).optional(),
});

export const reviewSchema: z.ZodType<ReviewEntity> = baseReviewSchema;

export const partialReviewSchema: z.ZodType<PartialReviewEntity> = baseReviewSchema.partial();