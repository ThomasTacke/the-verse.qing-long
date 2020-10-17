import { FastifyInstance, FastifyReply, FastifyRequest, RawServerBase } from 'fastify'
import { Controller, ControllerType, GET, PUT, POST, DELETE, Inject, FastifyInstanceToken } from 'fastify-decorators';
import { MqttComponent, MqttComponentValue } from '../models/sqlite.models';
import S from 'fluent-schema';

const tag = 'MQTT Component Value';

export const mqttComponentValueSchema = S.object()
  .id('#mqttcomponentvalue')
  .prop('value', S.string())
  .prop('mqttComponentId', S.number())
  .prop('type', S.string());

export const mqttComponentValuesSchema = S.object()
  .id('#mqttcomponentvalues')
  .prop('mqttComponentValues', S.array().ref('#mqttcomponentvalue'));

const idParam = S.object()
  .prop('id', S.number());

const getMqttComponentValuesSchema = {
  tags: [tag],
  description: 'Get MQTT Component Values',
  response: { 200: mqttComponentValuesSchema }
};

const getMqttComponentValueSchema = {
  tags: [tag],
  description: 'Get Specific MQTT Component Value',
  params: idParam,
  response: { 200: mqttComponentValueSchema }
};

const putMqttComponentValueSchema = {
  tags: [tag],
  description: 'Update MQTT Component Value',
  params: idParam,
  body: mqttComponentValueSchema,
  response: { 200: mqttComponentValueSchema }
};

const postMqttComponentValueSchema = {
  tags: [tag],
  description: 'Create MQTT Component Value',
  body: mqttComponentValueSchema,
  response: { 201: mqttComponentValueSchema }
};

const deleteMqttComponentValueSchema = {
  tags: [tag],
  description: 'Delete MQTT Component Type',
  params: idParam,
  response: { 204: { type: 'null' } }
};

@Controller({
  route: 'mqttcomponentvalue',
  type: ControllerType.SINGLETON
}) export default class MqttcomponentValueController {
  @Inject(FastifyInstanceToken) private instance!: FastifyInstance;

  @GET({ url: '/', options: { schema: getMqttComponentValuesSchema } }) async getRooms(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const mqttComponentValueRepository = this.instance.orm.getRepository(MqttComponentValue);
    const mqttComponentValues = await mqttComponentValueRepository.find();
    return reply.code(200).send(JSON.stringify({ mqttComponentValues: mqttComponentValues }));
  }

  @GET({ url: '/:id', options: { schema: getMqttComponentValueSchema } }) async getOneDevice(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const mqttComponentValueRepository = this.instance.orm.getRepository(MqttComponentValue);
    const mqttComponentValue = await mqttComponentValueRepository.findOne(request.params.id, { relations: ['mqttComponent',] });
    return reply.code(200).send(JSON.stringify(mqttComponentValue));
  }

  @PUT({ url: '/:id', options: { schema: putMqttComponentValueSchema } }) async updateDevice(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const mqttComponentValueRepository = this.instance.orm.getRepository(MqttComponentValue);
    const mqttComponentValue = await mqttComponentValueRepository.findOne(request.params.id);
    mqttComponentValue.value = request.body.value;
    await mqttComponentValueRepository.save(mqttComponentValue);
    return reply.code(200).send(mqttComponentValue);
  }

  @POST({ url: '/', options: { schema: postMqttComponentValueSchema } }) async createDevice(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const mqttComponentValueRepository = this.instance.orm.getRepository(MqttComponentValue);
    let mqttComponentValue = new MqttComponentValue();
    mqttComponentValue.value = request.body.value;
    mqttComponentValue.mqttComponent = request.body.mqttComponentId;
    mqttComponentValue.type = request.body.type;
    mqttComponentValue = await mqttComponentValueRepository.save(mqttComponentValue);
    return reply.code(200).send(mqttComponentValue);
  }

  @DELETE({ url: '/:id', options: { schema: deleteMqttComponentValueSchema } }) async deleteDevice(request: FastifyRequest<any>, reply: FastifyReply<RawServerBase>) {
    const mqttComponentValueRepository = this.instance.orm.getRepository(MqttComponentValue);
    const mqttComponentValue = await mqttComponentValueRepository.findOne(request.params.id);
    await mqttComponentValueRepository.remove(mqttComponentValue);
    return reply.code(204).send();
  }
}