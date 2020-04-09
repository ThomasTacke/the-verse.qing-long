import { RouteSchema } from 'fastify';

export const DeviceGetSchema: RouteSchema = {
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        name: { type: 'string' },
        room: {
          type: 'object', properties: {
            name: { type: 'string' },
            shortname: { type: 'string' },
            id: { type: 'number' }
          }
        },
        type: {
          type: 'object', properties: {
            name: { type: 'string' },
            id: { type: 'number' }
          }
        },
        id: { type: 'number' },
        mqttComponents: {
          type: 'array', items: {
            type: 'object', properties: {
              topic: { type: 'string' },
              id: { type: 'number' }
            }
          }
        }
      },
      example: {
        name: 'NodeMCU Living Room',
        room: { name: 'Living Room', shortname: 'lr', id: 1 },
        type: { name: 'NodeMCU', id: 1 },
        id: 1,
        mqttComponents: [{ id: 1, topic: 'the-verse/living-room/humidity' }]
      }
    }
  }
}