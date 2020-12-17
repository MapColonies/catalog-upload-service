//this import must be called before the first import of tsyring
import 'reflect-metadata';
import { Request } from 'express';
import { CreateFileFilter } from "../../../multer/filters/createFileFilter";
import { CatalogDbService } from '../../../services/catalogDbService';


describe('CreateFileFilter', () => {
  let filter: CreateFileFilter;
  let done: Promise<void>;
  const existsMock = jest.fn();
  const catalogServiceMock = { exists: existsMock } as unknown as CatalogDbService;
  const callback = jest.fn();
  const imageId = 'testId';
  const requestMock = {
    body: {
      additionalData: {id: imageId },
    },
  } as unknown as Request;
  const fileMock = {} as unknown as Express.Multer.File;

  beforeEach( () => {
    filter = new CreateFileFilter(catalogServiceMock)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    done = new Promise<void>((resolve,reject)=>{
        callback.mockImplementation(()=>{resolve()});
    })
  });

  afterEach(() => {
    existsMock.mockReset();
    callback.mockReset();
  });

  it('Should block upload when exists', async () => {
    expect.assertions(4);
    existsMock.mockResolvedValue(true);


    filter.filter(requestMock, fileMock, callback);
    await done;

    expect(existsMock).toHaveBeenCalledTimes(1);
    expect(existsMock).toHaveBeenCalledWith(imageId);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(null, false);
  });

  it('Should allow upload when not exists', async () => {
    expect.assertions(4);
    existsMock.mockResolvedValue(false);

    filter.filter(requestMock, fileMock, callback);
    await done; 

    expect(existsMock).toHaveBeenCalledTimes(1);
    expect(existsMock).toHaveBeenCalledWith(imageId);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(null, true);
  });
});
