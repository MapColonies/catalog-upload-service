//this import must be called before the first import of tsyring
import 'reflect-metadata';
import { ImageMetadata } from '@map-colonies/mc-model-types';
import { MCLogger } from '@map-colonies/mc-logger';
import { UploadService } from '../../services/uploadService';
import { UploadedFiles } from '../../models/uploadedFiles'
import { CatalogDbService } from '../../services/catalogDbService';
import { WorkflowHttpClient } from '../../services/WorkFlowHttpClient';
import { CreateUploadRequest } from '../../models/createUploadRequest';
import { UpdateUploadRequest } from '../../models/updateUploadRequest';

describe('UploadService', () => {
    let service: UploadService;
    const loggerMock = {
        log: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        debug: jest.fn()
    } as unknown as MCLogger;
    const existsMock = jest.fn();
    const catalogServiceMock = { exists: existsMock } as unknown as CatalogDbService;
    const ingestMock = jest.fn();
    const workflowMock = {ingest: ingestMock} as unknown as WorkflowHttpClient

    const metadata: ImageMetadata = {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      creationTime: new Date('2020-07-13T06:53:16.202Z'),
      imagingTime: new Date('2020-07-13T05:53:16.202Z'),
      resolution: 3.5,
      footprint: {
        type: 'Polygon',
        coordinates: [
          [
            [100, 0],
            [101, 0],
            [101, 1],
            [100, 1],
            [100, 0],
          ],
        ],
      },
      imageSection: 'north',
      height: 300,
      width: 500,
      sensorType: 'RGB',
      imageColorType: 'BW',
      imageBitPerPixel: 24,
      imageFormat: 'tiff',
      isBitSigned: true,
      imageSource: "layer's creator",
      cloudCoverPercentage: 93,
      geographicReferenceSystem: 4326,
    };
    const uploadedFiles: UploadedFiles = {
      file: [
        {
          path: 'testImage',
          fieldname: 'testImage',
          originalname: 'testImage',
          size: 0
        },
      ] as unknown as Express.MulterS3.File[],
      additionalFiles: [],
    };
    const expectedMetaDate: ImageMetadata = {
      ...metadata,
      additionalFilesUri: [],
      imageUri: 'testImage',
    };
  
    beforeEach(() => {
        ingestMock.mockReset();
        ingestMock.mockReturnValue(Promise.resolve());
      
        service = new UploadService(catalogServiceMock,loggerMock,workflowMock);
    });
  
    it('create should trigger workflow', async () => {
      const req: CreateUploadRequest = {
        additionalData: { ...metadata },
        file: [],
        additionalFiles: [],
      };
      await service.create(req, uploadedFiles);
  
      expect(ingestMock).toHaveBeenCalledWith(expectedMetaDate, 'create');
    });
  
    it('update should trigger workflow', async () => {
      const req: UpdateUploadRequest = {
        additionalData: { ...metadata },
        file: [],
        additionalFiles: [],
      };
      await service.update(req, uploadedFiles);
  
      expect(ingestMock).toHaveBeenCalledWith(expectedMetaDate, 'update');
    });
  });
  