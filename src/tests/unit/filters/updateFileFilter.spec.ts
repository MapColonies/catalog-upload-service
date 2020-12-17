//this import must be called before the first import of tsyring
import 'reflect-metadata';
import { Request } from 'express';
import { CatalogDbService } from '../../../services/catalogDbService';
import { UpdateFileFilter } from '../../../multer/filters/updateFileFilter';


describe('UpdateFileFilter', () => {
  let filter: UpdateFileFilter;
  let done: Promise<void>;
  const existsMock = jest.fn();
  const catalogServiceMock = { exists: existsMock };
  const callback = jest.fn();
  const imageId = 'testId';
  const requestMock = {
    body: {
      additionalData: {id: imageId },
    },
  } as unknown as Request;
  const fileMock = {} as unknown as Express.Multer.File;

  beforeEach( () => {
    filter = new UpdateFileFilter(catalogServiceMock as unknown as CatalogDbService)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    done = new Promise<void>((resolve,reject)=>{
        callback.mockImplementation(()=>{resolve()});
    })
  });

  afterEach(() => {
    existsMock.mockReset();
    callback.mockReset();
  });

  it('Should allow upload when exists', async () => {
    expect.assertions(4);
    existsMock.mockResolvedValue(true);

    filter.filter(requestMock, fileMock, callback);
    await done; 

    expect(existsMock).toHaveBeenCalledTimes(1);
    expect(existsMock).toHaveBeenCalledWith(imageId);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it('Should block upload when not exists', async () => {
    expect.assertions(4);
    existsMock.mockResolvedValue(false);

    filter.filter(requestMock, fileMock, callback);
    await done;

    expect(existsMock).toHaveBeenCalledTimes(1);
    expect(existsMock).toHaveBeenCalledWith(imageId);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(null, false);
  });
});
