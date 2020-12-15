import { validate } from 'openapi-validator-middleware';
import { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { injectable } from 'tsyringe';
import { MCLogger } from '@map-colonies/mc-logger';
import { IFileFilter } from './iFileFilter';

@injectable()
export class MetadataValidatorFilter implements IFileFilter {
  public constructor(private readonly logger: MCLogger) {}

  public filter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ): void {
    validate(req, {}, (err?: Error) => {
      if (err) {
        cb(err);
      } else {
        cb(null, true);
      }
    });
  }
}
