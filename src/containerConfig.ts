import { readFileSync } from 'fs';
import { container } from 'tsyringe';
import { get } from 'config';
import { Probe } from '@map-colonies/mc-probe';
import {
  MCLogger,
  ILoggerConfig,
  IServiceConfig,
} from '@map-colonies/mc-logger';
import { StorageEngine } from 'multer'
import { FileSystemStorageBuilder } from './multer/storage/fileStstemStorageBuilder';
import { S3StorageBuilder } from './multer/storage/s3StrorageBuilder';

function registerExternalValues(): void {
  const loggerConfig = get<ILoggerConfig>('logger');
  const packageContent = readFileSync('./package.json', 'utf8');
  const service = JSON.parse(packageContent) as IServiceConfig;
  const logger = new MCLogger(loggerConfig, service);

  container.register<MCLogger>(MCLogger, { useValue: logger });
  container.register<Probe>(Probe, { useValue: new Probe(logger, {}) });

  registerStorageEngine(logger);
}

function registerStorageEngine(logger: MCLogger): void{
  const storageEngine = get<string>('storage.engine');
  let storage: StorageEngine;
  switch (storageEngine.toUpperCase()) {
    case 'FS':
      storage = new FileSystemStorageBuilder(logger).createStorage();
      break;
    case 'S3':
      storage = new S3StorageBuilder(logger).createStorage();
      break;
    default:
      logger.error(`invalid storage engine selected: ${storageEngine}.`);
      process.exit(1);
  }
  container.register<StorageEngine>('StorageEngine', { useValue: storage });
}

export { registerExternalValues };
