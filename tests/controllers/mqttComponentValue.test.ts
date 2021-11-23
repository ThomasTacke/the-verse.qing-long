import { FastifyInstance } from 'fastify';
import { createServer } from '../../src/server';

describe('Controller: MqttComponentValueController', () => {
  const route = '/mqttcomponentvalue';
  let instance: FastifyInstance;

  beforeAll(async () => {
    instance = await createServer().ready();
  });

  it(`GET MqttComponentValues`, async () => {
    const result = await instance.inject({
      method: 'GET',
      url: `${route}`
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`GET MqttComponentValue`, async () => {
    const result = await instance.inject({
      method: 'GET',
      url: `${route}/1`
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`POST MqttComponentValue`, async () => {
    const result = await instance.inject({
      method: 'POST',
      url: `${route}`,
      payload: {
        value: '33',
        type: '°C',
        mqttComponentId: 1
      }
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`PUT MqttComponentValue`, async () => {
    const result = await instance.inject({
      method: 'PUT',
      url: `${route}/1`,
      payload: {
        value: '31',
        type: '°C',
        mqttComponentId: 1
      }
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`DELETE MqttComponentValue`, async () => {
    const result = await instance.inject({
      method: 'DELETE',
      url: `${route}/5`
    });
    expect(result.statusCode).toEqual(204);
  });

});