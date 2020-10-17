// Require the framework
import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
// import Swagger, { FastifyDynamicSwaggerOptions } from 'fastify-swagger';
import oas from 'fastify-oas';
import { bootstrap } from 'fastify-decorators';
import { resolve } from 'path';
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

const fastifyOpts: FastifyServerOptions = process.env.NODE_ENV !== 'test' ? {
  logger: {
    level: process.env.DEBUG === 'true' ? 'debug' : 'info'
  },
  pluginTimeout: 10000,
} : {}

const swaggerSchema = {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Qing Long - Blue Dragon API',
      description: 'testing the fastify swagger api',
      version: '0.1.0',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    host: 'localhost:3000',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
  exposeRoute: true
}

const createServer = () => {

  // Instantiate Fastify with some config
  const instance: FastifyInstance = Fastify(fastifyOpts);

  // Register Swagger
  instance.register(oas, swaggerSchema);

  // Register DB Plugin
  instance.register(fastifyTypeorm, {
    type: 'sqlite',
    database: process.env.DB_FILENAME || './db.sqlite3',
    entities: [
      Room, DeviceType, MqttComponentType, MqttComponentValue, MqttComponent, Device
    ],
    synchronize: true,
    logging: false
  });

  // Add Schemas to fastify instance
  instance.addSchema(roomSchema);
  instance.addSchema(roomsSchema);
  instance.addSchema(deviceTypeSchema);
  instance.addSchema(deviceTypesSchema);
  instance.addSchema(mqttComponentTypeSchema);
  instance.addSchema(mqttComponentTypesSchema);
  instance.addSchema(mqttComponentValueSchema);
  instance.addSchema(mqttComponentValuesSchema);
  instance.addSchema(mqttComponentSchema);
  instance.addSchema(mqttComponentsSchema);
  instance.addSchema(deviceResponseSchema);
  instance.addSchema(devicesResponseSchema);

  // Register routes here
  instance.register(bootstrap, {
    directory: resolve(__dirname, `controllers`),
    // prefix: '/qing-long/v1',
    mask: /\.controller\./
  });

  instance.ready();

  return instance;

}

export { createServer };
