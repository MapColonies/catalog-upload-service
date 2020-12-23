import swaggerUi from 'swagger-ui-express';
import { get } from 'config';
import { MCLogger } from '@map-colonies/mc-logger';
import { Request, Response, RequestHandler, NextFunction } from 'express';
import { load } from 'yamljs';
import { delay, inject, injectable } from 'tsyringe';
import { config as initDotEnv } from 'dotenv';
import { resolveRefs } from 'json-refs';
import httpStatus from 'http-status-codes';

interface SwaggerServer {
  [key: string]: unknown;
  url: string;
}

@injectable()
export class SwaggerController {
  public uiMiddleware: RequestHandler[];

  private swaggerDoc?: swaggerUi.JsonObject;
  private uiHandler?: RequestHandler;

  private readonly swaggerConfig: {
    jsonPath: string;
    uiPath: string;
  };

  public constructor(
    @inject(delay(() => MCLogger)) private readonly logger: MCLogger
  ) {
    this.swaggerConfig = get('swagger');
    // load swagger object from file
    this.uiMiddleware = swaggerUi.serve;
    this.init().catch((err) => {
      throw err;
    });
  }

  public serveUi(req: Request, res: Response, next: NextFunction): void {
    if (this.uiHandler) {
      this.uiHandler(req, res, next);
    } else {
      res.sendStatus(httpStatus.SERVICE_UNAVAILABLE);
    }
  }

  public serveJson(req: Request, res: Response): void {
    res.json(this.swaggerDoc);
  }

  private async init(): Promise<void> {
    //this.swaggerDoc = load('./docs/openapi3.yaml') as swaggerUi.JsonObject;
    this.swaggerDoc = (await this.multiFileSwagger(
      load('./docs/openapi3.yaml')
    ).catch((err) => {
      throw err;
    })) as swaggerUi.JsonObject;
    this.setSwaggerHost();
    this.uiHandler = swaggerUi.setup(this.swaggerDoc, {
      swaggerOptions: { basePath: './Schema' },
    });
  }

  private setSwaggerHost(): void {
    initDotEnv();
    const host: string = process.env.HOST ?? 'http://localhost';
    const port: string = process.env.SERVER_PORT ?? '80';
    const doc = this.swaggerDoc as swaggerUi.JsonObject;
    const servers = doc.servers as SwaggerServer[];
    servers[0].url = `${host}:${port}`;
  }

  private async multiFileSwagger(
    root: Record<string, unknown>
  ): Promise<void | Record<string, unknown>> {
    const options = {
      filter: ['relative', 'remote'],
      location: './docs/openapi3.yaml', //'./Schema/root.json',
      loaderOptions: {
        processContent: function (
          res: { text: string },
          callback: unknown
        ): void {
          const cb = callback as (a: null, b: unknown) => void;
          cb(null, JSON.parse(res.text));
        },
      },
    };

    const logger = this.logger;
    return resolveRefs(root, options).then(
      function (results) {
        return results.resolved as Record<string, unknown>;
      },
      function (err: Error) {
        logger.warn(`failed to load swagger reference: ${err.message}.`);
        console.log(err.stack);
      }
    );
  }
}
