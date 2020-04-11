// Require the framework
import Fastify from 'fastify';
import { ServerResponse } from 'http';
import Swagger from 'fastify-swagger';
import { bootstrap } from 'fastify-decorators';
import { join } from 'path';
import dotenv from "dotenv";
import { Room, DeviceType, Device, MqttComponent, MqttComponentType, MqttComponentValue } from './models/sqlite.models';
import fastifyTypeorm = require('fastify-typeorm');
import { roomSchema, roomsSchema } from './controllers/room.controller';
import { deviceTypeSchema, deviceTypesSchema } from './controllers/deviceType.controller';
import { mqttComponentTypeSchema, mqttComponentTypesSchema } from './controllers/mqttComponentType.controller';
import { mqttComponentValueSchema, mqttComponentValuesSchema } from './controllers/mqttComponentValue.controller';
import { mqttComponentSchema, mqttComponentsSchema } from './controllers/mqttcomponent.controller';
import { deviceResponseSchema, devicesResponseSchema } from './controllers/device.controller';

dotenv.config();

const fastifyOpts = process.env.NODE_ENV !== 'test' ? {
  logger: true,
  pluginTimeout: 10000
} : {}

const swaggerSchema: Swagger.FastifyDynamicSwaggerOptions = {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Qing Long - Blue Dragon API',
      description: 'testing the fastify swagger api',
      version: '0.0.1',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  exposeRoute: true
}

const createServer = () => {

  // Instantiate Fastify with some config
  const fastify: Fastify.FastifyInstance = Fastify(fastifyOpts);

  // Register Swagger
  fastify.register(Swagger, swaggerSchema);

  // Register MongoDB Plugin
  fastify.register(fastifyTypeorm, {
    type: 'sqlite',
    database: './db.sqlite3',
    entities: [
      Room, DeviceType, MqttComponentType, MqttComponentValue, MqttComponent, Device
    ],
    synchronize: true,
    logging: false
  });

  // Add Schemas to fastify instance
  fastify.addSchema(roomSchema);
  fastify.addSchema(roomsSchema);
  fastify.addSchema(deviceTypeSchema);
  fastify.addSchema(deviceTypesSchema);
  fastify.addSchema(mqttComponentTypeSchema);
  fastify.addSchema(mqttComponentTypesSchema);
  fastify.addSchema(mqttComponentValueSchema);
  fastify.addSchema(mqttComponentValuesSchema);
  fastify.addSchema(mqttComponentSchema);
  fastify.addSchema(mqttComponentsSchema);
  fastify.addSchema(deviceResponseSchema);
  fastify.addSchema(devicesResponseSchema);

  // Register routes here
  fastify.register(bootstrap, {
    controllersDirectory: join(__dirname, 'controllers'),
    controllersMask: /\.controller\./
  });

  // Register own Plugins here

  fastify.setErrorHandler((error: any, request: Fastify.FastifyRequest, reply: Fastify.FastifyReply<ServerResponse>) => {
    request.log.error(error.toString());
    reply.code(500).send(JSON.stringify(error));
  });

  fastify.ready();
  return fastify;
}

export default createServer;