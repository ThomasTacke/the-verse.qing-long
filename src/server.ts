// Require the framework
import * as Fastify from 'fastify';
import { ServerResponse } from 'http';
import * as Swagger from 'fastify-swagger';
import { bootstrap } from 'fastify-decorators';
import { join } from 'path';
import * as dotenv from "dotenv";
import { Room, DeviceType, Device, MqttComponent, MqttComponentType, MqttComponentValue } from './models/sqlite.models';
import { createConnection, ConnectionOptions } from 'typeorm';
import fastifyTypeorm = require('fastify-typeorm');

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



  // console.log('Connected to db');
  // const room = new Room('Living Room', 'lr');
  // const resRoom = await dbConnection.manager.save(room);
  // console.log(resRoom);
  // const deviceType = new DeviceType('NodeMCU');
  // const resDeviceType = await dbConnection.manager.save(deviceType);
  // console.log(resDeviceType);
  // const device = new Device('NodeMCU Living Room', room, deviceType);
  // const resDevice = await dbConnection.manager.save(device);
  // console.log(resDevice);

  // const deviceRepostiroy = dbConnection.getRepository(Device);
  // const device = await deviceRepostiroy.findOne(1, { relations: ['room', 'type'] });
  // console.log(device);

  // const mqttComponentType = new MqttComponentType();
  // mqttComponentType.type = 'NodeMCU';
  // const resMqttComponentType = await dbConnection.manager.save(mqttComponentType);
  // const mqttComponent = new MqttComponent();
  // mqttComponent.topic = 'the-verse/living-room/humidity';
  // mqttComponent.type = resMqttComponentType;
  // const resMqttComponent = await dbConnection.manager.save(mqttComponent);
  // console.log(resMqttComponent);

  // console.log(resMqttComponent);
  // const mqttComponentValueRepository = dbConnection.getRepository(MqttComponentValue);
  // const someVal = new MqttComponentValue();
  // someVal.value = '22.3';
  // someVal.mqttComponent =resMqttComponent;
  // const someOtherVal = new MqttComponentValue();
  // someOtherVal.value = '23.0';
  // someOtherVal.mqttComponent =resMqttComponent;
  // const someOtherRes = await Promise.all([
  //   mqttComponentValueRepository.save(someVal),
  //   mqttComponentValueRepository.save(someOtherVal)]);
  // console.log(someOtherRes);

  // resMqttComponent.values = [someOtherRes[0], someOtherRes[1]];
  // console.log(resMqttComponent);
  // const someRes = await mqttComponentRepository.save(resMqttComponent);
  // console.log(someRes);
  // device.mqttComponents = [someRes];
  // deviceRepostiroy.save(device);

  // console.log(device);

  // device.mqttComponents = [resMqttComponent];
  // deviceRepostiroy.save(device);

  // const deviceTwo = await deviceRepostiroy.findOne(1, { relations: ['room', 'type', 'mqttComponents'] });
  // console.log(deviceTwo);
  // const mqttComponentRepository = dbConnection.getRepository(MqttComponent);
  // const resMqttComponent = await mqttComponentRepository.findOne(deviceTwo.mqttComponents[0].id, { relations: ['values', 'type'] });
  // console.log(resMqttComponent);

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