import { ImageMetadata } from '@map-colonies/mc-model-types';
import { delay, inject, injectable } from 'tsyringe';
import config from 'config';
import axios from 'axios';
import { MCLogger } from '@map-colonies/mc-logger';
import { joinUrl } from '../utils/HttpUtils';
import { WorkflowAction } from '../models/workFlowAction';

@injectable()
export class WorkflowHttpClient {
  private readonly baseUrl: string;

  public constructor(@inject(delay(() => MCLogger)) private readonly logger: MCLogger) {
    this.baseUrl = config.get('dependentServices.workflowBaseUrl');
  }

  public async ingest(
    imageMetadata: ImageMetadata,
    action: WorkflowAction
  ): Promise<void> {
    const url = joinUrl(this.baseUrl, 'ingest');
    const data = {
      imageMetaData: imageMetadata,
      action: action.toString(),
    };
    this.logger.debug(
      'sending http post request to: %s \n body: %s',
      url,
      JSON.stringify(data)
    );
    try{
      await axios.post(url, data);
    }
    catch(err){
      const error = err as Error;
      this.logger.error(`failed to trigger workflow: ${error.message}`);
      throw err;
    }
    return Promise.resolve();
  }
}
