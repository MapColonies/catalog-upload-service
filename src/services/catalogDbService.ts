import { ImageMetadata, ApiHttpResponse } from '@map-colonies/mc-model-types';
import { injectable } from 'tsyringe';
import config from 'config';
import axios from 'axios';
import { MCLogger } from '@map-colonies/mc-logger';
import { joinUrl } from '../utils/HttpUtils';

@injectable()
export class CatalogDbService {
  private readonly baseUrl: string;

  public constructor(private readonly logger: MCLogger) {
    this.baseUrl = config.get('dependentServices.workflowBaseUrl');
  }

  public async exists(id: string): Promise<boolean> {
    const url = joinUrl(this.baseUrl, 'exists', id);
    this.logger.debug('sending http get request to: %s', url);
    //TODO: add error handling if needed.
    const res = await axios.get<ApiHttpResponse>(url);
    const data = res.data.data as { exists: boolean };
    return data.exists;
  }

  public async getById(id: string): Promise<ImageMetadata> {
    const url = joinUrl(this.baseUrl, id);
    this.logger.debug('sending http get request to: %s', url);
    //TODO: add error handling if needed.
    const res = await axios.get<ApiHttpResponse>(url);
    return res.data.data as ImageMetadata;
  }
}
