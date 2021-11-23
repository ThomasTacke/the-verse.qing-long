import { FastifyInstance } from 'fastify';
import { createServer } from '../../src/server';

describe('Controller: MqttComponentTypeController', () => {
  const route = '/mqttcomponenttype';
  let instance: FastifyInstance;

  beforeAll(async () => {
    instance = await createServer().ready();
  });

  it(`GET MqttComponentTypes`, async () => {
    const result = await instance.inject({
      method: 'GET',
      url: `${route}`
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`GET MqttComponentType`, async () => {
    const result = await instance.inject({
      method: 'GET',
      url: `${route}/1`
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`POST MqttComponentType`, async () => {
    const result = await instance.inject({
      method: 'POST',
      url: `${route}`,
      payload: {
        type: 'actuator'
      }
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`PUT MqttComponentType`, async () => {
    const result = await instance.inject({
      method: 'PUT',
      url: `${route}/1`,
      payload: {
        type: 'sensor'
      }
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`DELETE MqttComponentType`, async () => {
    const result = await instance.inject({
      method: 'DELETE',
      url: `${route}/2`
    });
    expect(result.statusCode).toEqual(204);
  });

});