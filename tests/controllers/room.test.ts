import { FastifyInstance } from 'fastify';
import { createServer } from '../../src/server';

describe('Controller: RoomController', () => {
  const route = '/room';
  let instance: FastifyInstance;

  beforeAll(async () => {
    instance = await createServer().ready();
  });

  it(`GET Rooms`, async () => {
    const result = await instance.inject({
      method: 'GET',
      url: `${route}`
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`GET Room`, async () => {
    const result = await instance.inject({
      method: 'GET',
      url: `${route}/1`
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`POST Room`, async () => {
    const result = await instance.inject({
      method: 'POST',
      url: `${route}`,
      payload: {
        name: 'Bathroom',
        shortname: 'br'
      }
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`PUT Room`, async () => {
    const result = await instance.inject({
      method: 'PUT',
      url: `${route}/1`,
      payload: {
        name: 'Kitchen',
        shortname: 'kitchen'
      }
    });
    expect(result.statusCode).toEqual(200);
  });

  it(`DELETE Room`, async () => {
    const result = await instance.inject({
      method: 'DELETE',
      url: `${route}/2`
    });
    expect(result.statusCode).toEqual(204);
  });

});