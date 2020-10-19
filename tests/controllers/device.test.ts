import { FastifyInstance } from 'fastify';
import { createServer } from '../../src/server';

describe('Controller: DeviceController', () => {
  const route = '/device';
  let instance: FastifyInstance;

  beforeAll(async () => {
    instance = await createServer().ready();
  });

  it(`GET Devices`, async () => {
    const result = await instance.inject({
      method: 'GET',
      url: `${route}`
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`GET Device`, async () => {
    const result = await instance.inject({
      method: 'GET',
      url: `${route}/1`
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`POST Device`, async () => {
    const result = await instance.inject({
      method: 'POST',
      url: `${route}`,
      payload: {
        name: 'Testloore01',
        displayName: 'Test',
        deviceTypeId: 1,
        roomId: 1,
        mqttComponentIds: [
          1, 2
        ]
      }
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`PUT Device`, async () => {
    const result = await instance.inject({
      method: 'PUT',
      url: `${route}/1`,
      payload: {
        name: 'motherloore01',
        displayName: 'NodeMCU Kitchen',
        deviceTypeId: 1,
        roomId: 1,
        mqttComponentIds: [
          1, 2
        ]
      }
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`DELETE Device`, async () => {
    const result = await instance.inject({
      method: 'DELETE',
      url: `${route}/2`
    });
    expect(result.statusCode).toEqual(204);
  });

});