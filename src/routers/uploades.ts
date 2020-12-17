import { RequestHandler, Router } from 'express';
import { container } from 'tsyringe';
import { validate } from 'openapi-validator-middleware';
import bodyParser from 'body-parser';
import { UploadsController } from '../controllers/uploads';
import UploadMiddlware from '../middleware/uploadMiddleware'
import { MetadataValidatorFilter } from '../multer/filters/metadataValidatorFilter';
import { CreateFileFilter } from '../multer/filters/createFileFilter';
import { MultiFilter } from '../multer/filters/multiFilter';
import { IFileFilter } from '../multer/filters/iFileFilter';
import { UpdateFileFilter } from '../multer/filters/updateFileFilter';
import { RequestLoggerFilter } from '../multer/filters/requestLoggerFilter';
import { RequestLogger } from '../middleware/RequestLogger';

const uploadsRouter = Router();
const controller = container.resolve(UploadsController);
const requestLoggerMiddleWare = container.resolve(RequestLogger).getLoggerMiddleware();

uploadsRouter.post('/', getCreateUploadMiddleware(), controller.uploadFile.bind(controller));
uploadsRouter.put('/', getUpdateUploadMiddleware(), controller.updateFile.bind(controller));
uploadsRouter.get('/:id', bodyParser.json(), requestLoggerMiddleWare, validate, controller.findFile.bind(controller));
uploadsRouter.delete('/:id', bodyParser.json(), requestLoggerMiddleWare, validate, controller.deleteFile.bind(controller));

function getCreateUploadMiddleware() : RequestHandler{
    const createFilter = container.resolve(CreateFileFilter);
    return getFilteredMiddleware(createFilter);
}

function getUpdateUploadMiddleware() : RequestHandler{
    const createFilter = container.resolve(UpdateFileFilter);
    return getFilteredMiddleware(createFilter);
}

function getFilteredMiddleware(filter: IFileFilter): RequestHandler {
    const validationFilter = container.resolve(MetadataValidatorFilter);
    const loggerFilter = container.resolve(RequestLoggerFilter);
    const uploadFilter = new MultiFilter(loggerFilter,validationFilter, filter);
    //uploadFilter.filter = 
    const middleware = UploadMiddlware([{ name: 'file' }, { name: 'additionalFiles' }], uploadFilter);
    return middleware;
}

export { uploadsRouter };
