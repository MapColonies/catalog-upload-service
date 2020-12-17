import { ImageMetadata, ApiHttpResponse } from '@map-colonies/mc-model-types';
import { delay, inject, injectable } from 'tsyringe';
import config from 'config';
import axios from 'axios';
import { MCLogger } from '@map-colonies/mc-logger';
import { joinUrl } from '../utils/HttpUtils';

@injectable()
export class CatalogDbService {
  private readonly baseUrl: string;

  public constructor(@inject(delay(() => MCLogger)) private readonly logger: MCLogger) {
    this.baseUrl = config.get('dependentServices.imageIndexerBaseUrl');
  }

  public async exists(id: string): Promise<boolean> {
    const url = joinUrl(this.baseUrl, 'exists', id);
    this.logger.debug('sending http get request to: %s', url);
    const res = await axios.get<ApiHttpResponse>(url).catch((err)=>{
      const error = err as Error;
      this.logger.error(`exsists request to ${url} failed: ${error.message}`);
      this.logger.debug(`trace: ${error.stack as string}`);
      throw(err);
    });
    const data = res.data.data as { exists: boolean };
    return data.exists;
  }

  public async getById(id: string): Promise<ImageMetadata> {
    const url = joinUrl(this.baseUrl, id);
    this.logger.debug('sending http get request to: %s', url);
    const res = await axios.get<ApiHttpResponse>(url).catch((err)=>{
      const error = err as Error;
      this.logger.error(`getById request to ${url} failed: ${error.message}`);
      this.logger.debug(`trace: ${error.stack as string}`);
      throw(err);
    });;
    return res.data.data as ImageMetadata;
  }
}
