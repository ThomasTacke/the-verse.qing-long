import { FastifyInstance } from 'fastify';
import { createServer } from '../../src/server';

describe('Controller: MqttComponentController', () => {
  const route = '/mqttcomponent';
  let instance: FastifyInstance;

  beforeAll(async () => {
    instance = await createServer().ready();
  });

  it(`GET MqttComponents`, async () => {
    const result = await instance.inject({
      method: 'GET',
      url: `${route}`
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`GET MqttComponent`, async () => {
    const result = await instance.inject({
      method: 'GET',
      url: `${route}/1`
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`POST MqttComponent`, async () => {
    const result = await instance.inject({
      method: 'POST',
      url: `${route}`,
      payload: {
        topic: 'the-verse/bathroom/temperature',
        mqttComponentTypeId: 1,
        deviceId: 1
      }
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`PUT MqttComponent`, async () => {
    const result = await instance.inject({
      method: 'PUT',
      url: `${route}/1`,
      payload: {
        topic: 'the-verse/kitchen/temperature',
        mqttComponentTypeId: 1,
        deviceId: 1
      }
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`DELETE MqttComponent`, async () => {
    const result = await instance.inject({
      method: 'DELETE',
      url: `${route}/3`
    });
    expect(result.statusCode).toEqual(204);
  });

});