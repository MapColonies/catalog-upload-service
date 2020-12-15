import { FileFilterCallback } from 'multer';
import { Request } from 'express';

export interface IFileFilter {
  filter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => void;
}
