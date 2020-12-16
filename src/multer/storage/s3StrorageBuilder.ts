import { S3 } from 'aws-sdk';
import { findIndex } from 'lodash';
import { StorageEngine, Multer } from 'multer';
import  multerS3 from 'multer-s3';
import { MCLogger } from '@map-colonies/mc-logger';
import config from 'config';
import { Request } from 'express';
import { CreateUploadRequest } from '../../models/createUploadRequest';
import { UpdateUploadRequest } from '../../models/updateUploadRequest';

declare type Callback = (error: Error | null, destination: string) => void;

export class S3StorageBuilder {
  private readonly s3Client: S3;
  private readonly bucket: string;

  public constructor(private readonly logger: MCLogger) {
    this.s3Client = this.createS3Client();
    this.bucket = config.get('storage.S3.bucket');
  }

  public createStorage(): StorageEngine {
    this.s3Client
      .listBuckets()
      .promise()
      .then((data) => {
        this.createBucketIfNotExists(data, this.bucket);
      })
      .catch((err) => {
        const error = err as Error;
        this.logger.error(
          'S3StorageBuilder - CreateStorage - failed to get buckets list from object storage: %s',
          error.message
        );
        process.exit(1);
      });

    const storage = multerS3({
      s3: this.s3Client,
      bucket: (req: Express.Request, file: Express.Multer.File, cb: Callback) => { 
        return cb(null, this.bucket);
      },
      key: (req: Request, file: Express.Multer.File, cb: Callback) => {
        this.createUploadKey(req, file, cb);
      },
    });
    return storage;
  }

  private createS3Client(): S3 {
    return new S3({
      endpoint: config.get('storage.S3.endpoint'),
      accessKeyId: config.get('storage.S3.accessKeyId'),
      secretAccessKey: config.get('storage.S3.secretAccessKey'),
      region: config.get('storage.S3.region'),
      sslEnabled: config.get<boolean>('storage.S3.sslEnabled'),
      s3ForcePathStyle: true,
      apiVersion: config.get('storage.S3.apiVersion'),
      signatureVersion: config.get('storage.S3.signatureVersion'),
    });
  }

  private createBucketIfNotExists(
    data: S3.ListBucketsOutput,
    bucket: string
  ): void {
    const notFoundIndex = -1;
    if (
      findIndex(data.Buckets, (b: S3.Bucket) => {
        return b.Name === bucket;
      }) === notFoundIndex
    ) {
      this.logger.info(
        `S3StorageBuilder - CreateBucketIfNotExists - bucket '${bucket}' does not exist in object storage`
      );
      this.s3Client
        // eslint-disable-next-line @typescript-eslint/naming-convention
        .createBucket({ Bucket: bucket })
        .promise()
        .then(() => {
          this.logger.info(
            `S3StorageBuilder - CreateBucketIfNotExists - created new bucket:  ${bucket}`
          );
        })
        .catch((err) => {
          let message = '';
          if (typeof err === 'string'){
            message = err;
          }
          else if (err instanceof Error){
            message = err.message;
          }
          this.logger.error(
            `S3StorageBuilder - CreateBucketIfNotExists - can't create bucket, failed with error: ${message}`
          );
          process.exit(1);
        });
    }
  }

  private createUploadKey(req: Request, file: Express.Multer.File, cb: Callback): void {
    const data = req.body as CreateUploadRequest | UpdateUploadRequest;
    const metadata = data.additionalData; //TODO: check if parsed or string
    const fileId = metadata.id as string;
    const productDir = `${fileId}`;
    //TODO: check if nessary
    //req.body.uploadDir = 's3://' + this.bucket + '/' + productDir;
    const key = productDir + '/' + file.originalname;
    const path = `s3://${this.bucket}/${key}`
    this.logger.info(
      `S3StorageBuilder - CreateUploadKey - Uploading file to path: ${path}`
    );

    cb(null, key);
  }
}
