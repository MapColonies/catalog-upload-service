import multer from 'multer';
import { injectable } from 'tsyringe';
import { Request } from 'express';
import { get } from 'lodash';
import { ImageMetadata } from '@map-colonies/mc-model-types'
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
    const metadataString = get(req,'body.additionalData') as string;
    const metadata = JSON.parse(metadataString) as ImageMetadata;
    const id = metadata.id as string;
    this.catalogService
      .exists(id)
      .then((exists: boolean) => cb(null, !exists))
      .catch((err: Error) => cb(err));
  }
}
