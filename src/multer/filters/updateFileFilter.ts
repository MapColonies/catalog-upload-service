import multer from 'multer';
import { Request } from 'express';
import { injectable } from 'tsyringe';
import { IFileFilter } from './iFileFilter';

@injectable()
export class UpdateFileFilter implements IFileFilter {
  //TODO: add private indexer: ImageIndexerHttpClient
  public constructor() {}

  public filter(
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ): void {
    const id = JSON.parse(req.body.additionalData).id;
    this.indexer
      .exists(id)
      .then((exists: boolean) => cb(null, exists))
      .catch((err: Error) => cb(err));
  }
}
