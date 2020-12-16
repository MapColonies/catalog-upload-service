import { Router } from 'express';
import { uploadsRouter } from './uploades';
import { swaggerRouter } from './swagger';

const globalRouter = Router();
globalRouter.use(swaggerRouter);
globalRouter.use('/upload', uploadsRouter);

export { globalRouter };
