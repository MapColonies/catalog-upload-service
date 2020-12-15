import { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { IFileFilter } from './iFileFilter';

export class MultiFilter implements IFileFilter {
  public constructor(private readonly filters: IFileFilter[]) {}

  public filter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ): void {
    let passed = true;
    let err: Error | null = null;
    const callback = (error: null | Error, acceptFile?: boolean): void => {
      if (error !== null) {
        passed = false;
        err = error;
        return;
      }
      if (acceptFile !== undefined) {
        passed = acceptFile;
      }
    };

    this.filters.forEach((filter) => {
      filter.filter(req, file, callback);
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions,@typescript-eslint/no-unnecessary-condition
      if (!passed) {
        if (err) {
          cb(err);
        } else {
          cb(err, passed);
        }
        return;
      }
    });
  }
}
