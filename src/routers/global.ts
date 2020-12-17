import { Router } from 'express';
import bodyParser from 'body-parser';
import { uploadsRouter } from './uploades';
import { swaggerRouter } from './swagger';

const globalRouter = Router();
globalRouter.use(bodyParser.json(),swaggerRouter);
globalRouter.use('/upload', uploadsRouter);

export { globalRouter };
