import { ApiHttpResponse, ImageMetadata } from '@map-colonies/mc-model-types';
import { MCLogger } from '@map-colonies/mc-logger';
import { delay, inject, injectable } from 'tsyringe';
import { WorkflowAction } from '../models/workFlowAction';
import { CreateUploadRequest } from '../models/createUploadRequest';
import { UploadedFiles } from '../models/uploadedFiles';
import { UpdateUploadRequest } from '../models/updateUploadRequest';
import { InternalServerError } from '../exceptions/internalServerError'
import { BadRequestError } from '../exceptions/badRequestError'
import { CatalogDbService } from './catalogDbService';
import { WorkflowHttpClient } from './WorkFlowHttpClient';

@injectable()
export class UploadService {
  public constructor(
    private readonly catalog: CatalogDbService,
    @inject(delay(() => MCLogger)) private readonly logger: MCLogger,
    private readonly workflow: WorkflowHttpClient
  ) {}

  public async create(
    request: CreateUploadRequest,
    files: UploadedFiles
  ): Promise<ApiHttpResponse> {
    const metadata = request.additionalData;
    this.setFilesUris(files, metadata);
    await this.workflow.ingest(metadata, WorkflowAction.CREATE);
    return this.createResponse(metadata);
  }

  public async update(
    request: UpdateUploadRequest,
    files: UploadedFiles
  ): Promise<ApiHttpResponse> {
    const metadata = request.additionalData;
    this.setFilesUris(files, metadata);
    await this.workflow.ingest(metadata, WorkflowAction.UPDATE);
    return this.createResponse();
  }

  public async find(id: string): Promise<ApiHttpResponse> {
    const metaDate = await this.catalog.getById(id);
    return this.createResponse(metaDate);
  }

  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  public async delete(id: string): Promise<ApiHttpResponse> {
    throw new InternalServerError('not implemented');
    return this.createResponse();
  }

  private createResponse(data?: ImageMetadata): ApiHttpResponse {
    //error are handled in the global error middleware
    const response: ApiHttpResponse = {
      success: true,
      data: data,
    };
    return response;
  }

  private setFilesUris(
    files: UploadedFiles,
    metadata: ImageMetadata,
    requireMainFile = true
  ): void {
    if (!files.file) {
      if (requireMainFile) {
        throw new BadRequestError('file is missing');
      }
    } else {
      if (files.file.length > 0) {
        metadata.imageUri = files.file[0].path || files.file[0].location;
      }
    }
    metadata.additionalFilesUri = files.additionalFiles?.map(
      (file) => file.path || file.location
    );
  }
}
