import { normalize, join } from 'upath';
import * as multer from 'multer';
import { mkdirs } from 'fs-extra';
import { MCLogger } from '@map-colonies/mc-logger';
import { ImageMetadata } from '@map-colonies/mc-model-types';
import { Request } from 'express';
import config from 'config';

declare type Callback = (error: Error | null, destination: string) => void;

export class FileSystemStorageBuilder {
  public constructor(private readonly logger: MCLogger) {}

  public createStorage(): multer.StorageEngine {
    return multer.diskStorage({
      destination: this.createUploadFolder.bind(this),
      filename: (req: Request, file: Express.Multer.File, cb: Callback) => {
        cb(null, file.originalname);
      },
    });
  }
  private createUploadFolder(
    req: Request,
    file: Express.Multer.File,
    cb: Callback
  ): void {
    const root = config.get<string>('storage.FS.uploadRoot');
    if (root || root == '') {
      this.logger.error(
        `FileSystemStorageBuilder - createUploadFolder - Failed to resolve file upload folder due to root directory configuration issue`
      );
      cb(
        new Error(
          'Failed to resolve file upload folder due to root directory configuration issue'
        ),
        ''
      );
      return;
    }
    const body = req.body as { additionalData: string; uploadDir: string }; //TODO: replace with proper request type
    const metadata = JSON.parse(body.additionalData) as ImageMetadata;
    const fileId = metadata.id as string;
    const productDir = `${fileId}`;
    const uploadDir = normalize(join(normalize(root), normalize(productDir)));
    this.logger.info(
      `FileSystemStorageBuilder - createUplandFolder - Uploading file to path: ${uploadDir}/${file.originalname}`
    );
    body.uploadDir = uploadDir;
    mkdirs(uploadDir, (err) => {
      if (err) {
        this.logger.error(
          `FileSystemStorageBuilder - createUplandFolder - Failed to create upload folder : ${uploadDir} with error : ${err.message}`
        );
        cb(
          `Failed to create upload folder: ${uploadDir} with error : ${err.message}`,
          ''
        );
      } else {
        cb(null, uploadDir);
      }
    });
  }
}
