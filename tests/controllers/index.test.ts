import { FastifyInstance } from 'fastify';
import { createServer } from '../../src/server';

describe('Controller: IndexController', () => {
  const route = '/';
  let instance: FastifyInstance;

  beforeAll(async () => {
    instance = await createServer().ready();
  });

  it(`GET Index`, async () => {
    const result = await instance.inject({
      method: 'GET',
      url: `${route}`,
    });

    expect(result.statusCode).toEqual(200);
  });
});