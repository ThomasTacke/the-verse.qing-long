import { FastifyReply, FastifyRequest, RouteSchema } from 'fastify'
import { Controller, ControllerType, GET, PUT, POST, DELETE, AbstractController } from 'fastify-decorators';
import { IncomingMessage, ServerResponse } from 'http'
import { MqttComponentType } from '../models/sqlite.models';
import S from 'fluent-schema';

const tag = 'MQTT Component Type';

export const mqttComponentTypeSchema = S.object()
  .id('#mqttcomponenttype')
  .prop('id', S.number())
  .prop('type', S.string());

export const mqttComponentTypesSchema = S.object()
  .id('#mqttcomponenttypes')
  .prop('mqttComponentTypes', S.array().ref('#mqttcomponenttype'));

const mqttComponentTypeBodySchema = S.object()
  .prop('type', S.string()).required()

const idParam = S.object()
  .prop('id', S.number());

const getMqttComponentTypesSchema: RouteSchema = {
  tags: [tag],
  description: 'Get MQTT Component Types',
  response: { 200: mqttComponentTypesSchema }
};

const getMqttComponentTypeSchema: RouteSchema = {
  tags: [tag],
  description: 'Get Specific MQTT Component Type',
  params: idParam,
  response: { 200: mqttComponentTypeSchema }
};

const putMqttComponentTypeSchema: RouteSchema = {
  tags: [tag],
  description: 'Update MQTT Component Type',
  params: idParam,
  body: mqttComponentTypeBodySchema,
  response: { 200: mqttComponentTypeSchema }
};

const postMqttComponentTypeSchema: RouteSchema = {
  tags: [tag],
  description: 'Create MQTT Component Type',
  body: mqttComponentTypeBodySchema,
  response: { 201: mqttComponentTypeSchema }
};

const deleteMqttComponentTypeSchema: RouteSchema = {
  tags: [tag],
  description: 'Delete MQTT Component Type',
  params: idParam,
  response: { 204: { type: 'null' } }
};

@Controller({
  route: 'mqttcomponenttype',
  type: ControllerType.SINGLETON
}) export default class DeviceTypeController extends AbstractController {
  @GET({ url: '/', options: { schema: getMqttComponentTypesSchema } }) async getMqttComponentTypes(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
    const mqttComponentTypeRepository = this.instance.orm.getRepository(MqttComponentType);
    const mqttComponentTypes = await mqttComponentTypeRepository.find();
    return reply.code(200).send(JSON.stringify({ mqttComponentTypes: mqttComponentTypes }));
  }

  @GET({ url: '/:id', options: { schema: getMqttComponentTypeSchema } }) async getOneMqttcomponentType(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
    const mqttComponentTypeRepository = this.instance.orm.getRepository(MqttComponentType);
    const mqttComponentType = await mqttComponentTypeRepository.findOne(request.params.id);
    return reply.code(200).send(JSON.stringify(mqttComponentType));
  }

  @PUT({ url: '/:id', options: { schema: putMqttComponentTypeSchema } }) async updateMqttComponentType(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
    const mqttComponentTypeRepository = this.instance.orm.getRepository(MqttComponentType);
    const mqttComponentType = await mqttComponentTypeRepository.findOne(request.params.id);
    mqttComponentType.type = request.body.type;
    await mqttComponentTypeRepository.save(mqttComponentType);
    return reply.code(200).send(mqttComponentType);
  }

  @POST({ url: '/', options: { schema: postMqttComponentTypeSchema } }) async createMqttComponentType(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
    const mqttComponentTypeRepository = this.instance.orm.getRepository(MqttComponentType);
    let mqttComponentType = new MqttComponentType();
    mqttComponentType.type = request.body.type;
    mqttComponentType = await mqttComponentTypeRepository.save(mqttComponentType);
    return reply.code(200).send(mqttComponentType);
  }

  @DELETE({ url: '/:id', options: { schema: deleteMqttComponentTypeSchema } }) async deleteMqttComponentType(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
    const mqttComponentTypeRepository = this.instance.orm.getRepository(MqttComponentType);
    const mqttComponentType = await mqttComponentTypeRepository.findOne(request.params.id);
    await mqttComponentTypeRepository.remove(mqttComponentType);
    return reply.code(204).send();
  }
}
