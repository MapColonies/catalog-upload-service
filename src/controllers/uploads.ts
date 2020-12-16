import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { injectable } from 'tsyringe';
import { UploadService } from '../services/uploadService';
import { UploadedFiles } from '../models/uploadedFiles';
import { CreateUploadRequest } from '../models/createUploadRequest';
import { UpdateUploadRequest } from '../models/updateUploadRequest';

@injectable()
export class UploadsController {

  public constructor(private readonly uploadService: UploadService) {}

  public async uploadFile(
    req: Request, res: Response, next: NextFunction
  ): Promise<void> {
    try{
      const files = this.extractFiles(req);
      const data = req.body as CreateUploadRequest;
      const rawRes = await this.uploadService.create(data, files);
      res.status(httpStatus.OK).json(rawRes);
    }
    catch (err){
      next(err)
    }
  }

  public async findFile(
    req: Request, res: Response, next: NextFunction
  ): Promise<void> {
    try{
      const id = req.params['id'];
      const rawRes = await this.uploadService.find(id);
      res.status(httpStatus.OK).json(rawRes);
    }
    catch (err){
      next(err)
    }
  }

  public async updateFile(
    req: Request, res: Response, next: NextFunction
  ): Promise<void> {
    try{
    const files = this.extractFiles(req);
    const data = req.body as UpdateUploadRequest;
    const rawRes = await this.uploadService.update(data, files);
    res.status(httpStatus.OK).json(rawRes);
    }
    catch (err){
      next(err)
    }
  }

  public async deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const id = req.params['id'];
      const rawRes = await this.uploadService.delete(id);
      res.status(httpStatus.OK).json(rawRes);
    }
    catch (err){
      next(err)
    }
  }

  private extractFiles(req: Request): UploadedFiles {
    const filedRequest = req as unknown as { files: UploadedFiles; };
    return filedRequest.files;
  }
}
