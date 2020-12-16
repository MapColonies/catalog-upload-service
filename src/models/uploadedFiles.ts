type File = Express.MulterS3.File;

export interface UploadedFiles {
  file?: File[];
  additionalFiles?: File[];
}
