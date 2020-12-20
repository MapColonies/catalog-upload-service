import { ImageMetadata } from '@map-colonies/mc-model-types';

export interface UpdateUploadRequest {
  additionalData: ImageMetadata;
  file: unknown[];
  additionalFiles: unknown[];
}
