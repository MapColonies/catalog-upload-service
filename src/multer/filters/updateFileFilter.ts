import multer from 'multer';
import { Request } from 'express';
import { injectable } from 'tsyringe';
import { CatalogDbService } from '../../services/catalogDbService';
import { IFileFilter } from './iFileFilter';

@injectable()
export class UpdateFileFilter implements IFileFilter {
  public constructor(private readonly catalog: CatalogDbService) {}

  public filter(
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ): void {
    const id = JSON.parse(req.body.additionalData).id;
    this.catalog
      .exists(id)
      .then((exists: boolean) => cb(null, exists))
      .catch((err: Error) => cb(err));
  }
}
