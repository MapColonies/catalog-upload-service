import multer from 'multer';
import { injectable } from 'tsyringe';
import { Request } from 'express';
import { IFileFilter } from './iFileFilter';
//import { ImageIndexerHttpClient } from '../../service-clients/ImageIndexer/ImageIndexerHttpClient';

@injectable()
export class CreateFileFilter implements IFileFilter {
  //TODO: add private indexer: ImageIndexerHttpClient when created
  public constructor() {}

  public filter(
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ): void {
    const id = JSON.parse(req.body.additionalData).id;
    this.indexer
      .exists(id)
      .then((exists: boolean) => cb(null, !exists))
      .catch((err: Error) => cb(err));
  }
}
