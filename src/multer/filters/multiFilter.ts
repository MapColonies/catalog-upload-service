import { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { IFileFilter } from './iFileFilter';

export class MultiFilter implements IFileFilter {

private readonly filters: IFileFilter[];

  public constructor(...filters: IFileFilter[]) {
    this.filters = filters;
    this.filter = this.filter.bind(this);
  }

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

    try{
      for(let i=0;i< this.filters.length;i++){
        this.filters[i].filter(req,file,callback);
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions,@typescript-eslint/no-unnecessary-condition
        if (!passed) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if ( err !== null) {
            cb(err);
          } else {
            cb(null, false);
          }
          return;
        }
      }
      cb(null,true);
    }catch (err){
      cb(err);
    }
  }
}
