import { Router } from 'express';

import { AuthRoutes, GenreRoutes, MovieRoutes, ReviewRoutes, UserRoutes } from '.';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/users', UserRoutes.routes);
    router.use('/api/movies', MovieRoutes.routes);
    router.use('/api/genres', GenreRoutes.routes);
    router.use('/api/reviews', ReviewRoutes.routes);

    return router;
  }
}
