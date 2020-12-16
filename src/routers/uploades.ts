import { RequestHandler, Router } from 'express';
import { container } from 'tsyringe';
import { validate } from 'openapi-validator-middleware';
import { UploadsController } from '../controllers/uploads';
import UploadMiddlware from '../middleware/uploadMiddleware'
import { MetadataValidatorFilter } from '../multer/filters/metadataValidatorFilter';
import { CreateFileFilter } from '../multer/filters/createFileFilter';
import { MultiFilter } from '../multer/filters/multiFilter';
import { IFileFilter } from '../multer/filters/iFileFilter';
import { UpdateFileFilter } from '../multer/filters/updateFileFilter';

const uploadsRouter = Router();
const controller = container.resolve(UploadsController);

uploadsRouter.post('/', getCreateUploadMiddleware(), controller.findFile.bind(controller));
uploadsRouter.put('/', getUpdateUploadMiddleware(), controller.findFile.bind(controller));
uploadsRouter.get('/:id', validate, controller.findFile.bind(controller));
uploadsRouter.delete('/:id', validate, controller.deleteFile.bind(controller));

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
    const uploadFilter = new MultiFilter(validationFilter, filter);
    const middleware = UploadMiddlware([{ name: 'file' }, { name: 'additionalFiles' }], uploadFilter);
    return middleware;
}

export { uploadsRouter };
