import multer from 'multer';
import { injectable } from 'tsyringe';
import { Request } from 'express';
import { CatalogDbService } from '../../services/catalogDbService';
import { IFileFilter } from './iFileFilter';

@injectable()
export class CreateFileFilter implements IFileFilter {
  public constructor(private readonly catalogService: CatalogDbService) {}

  public filter(
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ): void {
    const id = JSON.parse(req.body.additionalData).id;
    this.catalogService
      .exists(id)
      .then((exists: boolean) => cb(null, !exists))
      .catch((err: Error) => cb(err));
  }
}
