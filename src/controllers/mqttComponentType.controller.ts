import { FastifyInstance, FastifyReply, FastifyRequest, RawServerBase } from 'fastify'
import { Controller, ControllerType, GET, PUT, POST, DELETE, Inject, FastifyInstanceToken } from 'fastify-decorators';
import { MqttComponentType } from '../models/sqlite.models';
import S from 'fluent-json-schema';

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

const getMqttComponentTypesSchema = {
  tags: [tag],
  description: 'Get MQTT Component Types',
  response: { 200: mqttComponentTypesSchema }
};

const getMqttComponentTypeSchema = {
  tags: [tag],
  description: 'Get Specific MQTT Component Type',
  params: idParam,
  response: { 200: mqttComponentTypeSchema }
};

const putMqttComponentTypeSchema = {
  tags: [tag],
  description: 'Update MQTT Component Type',
  params: idParam,
  body: mqttComponentTypeBodySchema,
  response: { 200: mqttComponentTypeSchema }
};

const postMqttComponentTypeSchema = {
  tags: [tag],
  description: 'Create MQTT Component Type',
  body: mqttComponentTypeBodySchema,
  response: { 201: mqttComponentTypeSchema }
};

const deleteMqttComponentTypeSchema = {
  tags: [tag],
  description: 'Delete MQTT Component Type',
  params: idParam,
  response: { 204: { type: 'null' } }
};

@Controller({
  route: 'mqttcomponenttype',
  type: ControllerType.SINGLETON
}) export default class DeviceTypeController {
  @Inject(FastifyInstanceToken) private instance!: FastifyInstance;

  @GET({ url: '/', options: { schema: getMqttComponentTypesSchema } }) async getMqttComponentTypes(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const mqttComponentTypeRepository = this.instance.orm.getRepository(MqttComponentType);
    const mqttComponentTypes = await mqttComponentTypeRepository.find();
    return reply.code(200).send(JSON.stringify({ mqttComponentTypes: mqttComponentTypes }));
  }

  @GET({ url: '/:id', options: { schema: getMqttComponentTypeSchema } }) async getOneMqttcomponentType(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const mqttComponentTypeRepository = this.instance.orm.getRepository(MqttComponentType);
    const mqttComponentType = await mqttComponentTypeRepository.findOne(request.params.id);
    return reply.code(200).send(JSON.stringify(mqttComponentType));
  }

  @PUT({ url: '/:id', options: { schema: putMqttComponentTypeSchema } }) async updateMqttComponentType(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const mqttComponentTypeRepository = this.instance.orm.getRepository(MqttComponentType);
    const mqttComponentType = await mqttComponentTypeRepository.findOne(request.params.id);
    mqttComponentType.type = request.body.type;
    await mqttComponentTypeRepository.save(mqttComponentType);
    return reply.code(200).send(mqttComponentType);
  }

  @POST({ url: '/', options: { schema: postMqttComponentTypeSchema } }) async createMqttComponentType(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const mqttComponentTypeRepository = this.instance.orm.getRepository(MqttComponentType);
    let mqttComponentType = new MqttComponentType();
    mqttComponentType.type = request.body.type;
    mqttComponentType = await mqttComponentTypeRepository.save(mqttComponentType);
    return reply.code(200).send(mqttComponentType);
  }

  @DELETE({ url: '/:id', options: { schema: deleteMqttComponentTypeSchema } }) async deleteMqttComponentType(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const mqttComponentTypeRepository = this.instance.orm.getRepository(MqttComponentType);
    const mqttComponentType = await mqttComponentTypeRepository.findOne(request.params.id);
    await mqttComponentTypeRepository.remove(mqttComponentType);
    return reply.code(204).send();
  }
}
