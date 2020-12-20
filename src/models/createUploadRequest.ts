import { ImageMetadata } from '@map-colonies/mc-model-types';

export interface CreateUploadRequest {
  additionalData: ImageMetadata;
  file: unknown[];
  additionalFiles: unknown[];
}
