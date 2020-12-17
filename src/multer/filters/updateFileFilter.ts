import multer from 'multer';
import { Request } from 'express';
import { injectable } from 'tsyringe';
import { get } from 'lodash'
import { ImageMetadata } from '@map-colonies/mc-model-types';
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
    try{
    const metadata = get(req,'body.additionalData') as ImageMetadata;
    const id = metadata.id as string;
    this.catalog
      .exists(id)
      .then((exists: boolean) => cb(null, exists))
      .catch((err: Error) => cb(err));
  } catch(err){
    cb(err);
  }
}
}
