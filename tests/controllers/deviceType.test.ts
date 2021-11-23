import { FastifyInstance } from 'fastify';
import { createServer } from '../../src/server';

describe('Controller: DeviceTypeController', () => {
  const route = '/devicetype';
  let instance: FastifyInstance;

  beforeAll(async () => {
    instance = await createServer().ready();
  });

  it(`GET DevieTypes`, async () => {
    const result = await instance.inject({
      method: 'GET',
      url: `${route}`
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`GET DevieType`, async () => {
    const result = await instance.inject({
      method: 'GET',
      url: `${route}/1`
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`POST DevieType`, async () => {
    const result = await instance.inject({
      method: 'POST',
      url: `${route}`,
      payload: {
        name: 'Test'
      }
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`PUT DevieType`, async () => {
    const result = await instance.inject({
      method: 'PUT',
      url: `${route}/1`,
      payload: {
        name: 'NodeMCU'
      }
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`DELETE DevieType`, async () => {
    const result = await instance.inject({
      method: 'DELETE',
      url: `${route}/2`,
    });
    expect(result.statusCode).toEqual(204);
  });
  
});