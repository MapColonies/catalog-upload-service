import { validate } from 'openapi-validator-middleware';
import { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { delay, inject, injectable } from 'tsyringe';
import { MCLogger } from '@map-colonies/mc-logger';
import { get, set} from 'lodash';
import { IFileFilter } from './iFileFilter';

@injectable()
export class MetadataValidatorFilter implements IFileFilter {
  public constructor(@inject(delay(() => MCLogger)) private readonly logger: MCLogger) {}

  public filter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ): void {
    try{
      const rawMetadata = get(req,'body.additionalData') as unknown;
      if (typeof rawMetadata === 'string'){
        const metaData = JSON.parse(rawMetadata) as unknown;
        set(req,'body.additionalData',metaData);
      }
      validate(req, {}, (err?: Error) => {
        if (err) {
          cb(err);
        } else {
          cb(null, true);
        }
      });
    } catch (err){
      cb(err);
    }
  }
}
