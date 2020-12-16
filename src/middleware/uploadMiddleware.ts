import { Request, Response, NextFunction } from 'express';
import multer, { Field } from 'multer';
import { IFileFilter } from '../multer/filters/iFileFilter';

function getMiddleware(fields: Field[], filter?: IFileFilter) {
  return function uploadMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const reqType = req.is('multipart');
    if (reqType === null || reqType === false) {
      next();
      return;
    }
    const upload = multer({
      fileFilter: filter?.filter,
      storage: undefined, //TODO: replace with storage engine
    }).fields(fields);
    upload(req, res, (err: unknown) => {
      if (err != undefined) {
        //TODO: handle upload error
        next(err);
      } else {
        next();
      }
    });
  };
}

export default getMiddleware;
