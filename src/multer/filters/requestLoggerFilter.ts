import multer from 'multer';
import { delay, inject, injectable } from 'tsyringe';
import { Request } from 'express';
import { MCLogger } from '@map-colonies/mc-logger';
import { IFileFilter } from './iFileFilter';

@injectable()
export class RequestLoggerFilter implements IFileFilter {
  public constructor(@inject(delay(() => MCLogger)) private readonly logger: MCLogger) {}

  public filter(
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ): void {
    const body: string = req.body !== undefined ? JSON.stringify(req.body) : '';
    this.logger.debug(`received ${req.method} request on ${req.originalUrl} \nbody: ${body}`);
    cb(null,true);
  } 
}
