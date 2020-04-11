import { FastifyReply, FastifyRequest, RouteSchema } from 'fastify'
import { Controller, ControllerType, GET, PUT, POST, DELETE, AbstractController } from 'fastify-decorators';
import { IncomingMessage, ServerResponse } from 'http'
import { MqttComponent, MqttComponentType, Device } from '../models/sqlite.models';
import S from 'fluent-schema';

const tag = 'MQTT Component';

export const mqttComponentSchema = S.object()
  .id('#mqttcomponent')
  .prop('id', S.number())
  .prop('topic', S.string())
  .prop('mqttcomponentvalues', S.array().ref('#mqttcomponentvalue'))
  .prop('mqttcomponenttype', S.ref('#mqttcomponenttype'));

export const mqttComponentsSchema = S.object()
  .id('#mqttcomponents')
  .prop('mqttComponents', S.array().ref('#mqttcomponent'));

const mqttComponentBodySchema = S.object()
  .prop('topic', S.string()).required()
  .prop('mqttComponentTypeId', S.number()).required()
  .prop('deviceId', S.number());

const idParam = S.object()
  .prop('id', S.number());

const getMqttComponentsSchema: RouteSchema = {
  tags: [tag],
  description: 'Get MQTT Components',
  response: { 200: mqttComponentsSchema }
};

const getMqttComponentSchema: RouteSchema = {
  tags: [tag],
  description: 'Get Specific MQTT Component',
  params: idParam,
  response: { 200: mqttComponentSchema }
};

const putMqttComponentSchema: RouteSchema = {
  tags: [tag],
  description: 'Update MQTT Component',
  params: idParam,
  body: mqttComponentBodySchema,
  response: { 200: mqttComponentSchema }
};

const postMqttComponentSchema: RouteSchema = {
  tags: [tag],
  description: 'Create MQTT Component',
  body: mqttComponentBodySchema,
  response: { 201: mqttComponentSchema }
};

const deleteMqttComponentSchema: RouteSchema = {
  tags: [tag],
  description: 'Delete MQTT Component',
  params: idParam,
  response: { 204: { type: 'null' } }
};

@Controller({
  route: 'mqttcomponent',
  type: ControllerType.SINGLETON
}) export default class MqttComponentController extends AbstractController {
  @GET({ url: '/', options: { schema: getMqttComponentsSchema } }) async getMqttComponents(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
    const mqttComponentRepository = this.instance.orm.getRepository(MqttComponent);
    const mqttComponents = await mqttComponentRepository.find();
    return reply.code(200).send(JSON.stringify({ mqttComponents: mqttComponents }));
  }

  @GET({ url: '/:id', options: { schema: getMqttComponentSchema } }) async getOneMqttComponent(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
    const mqttComponentRepository = this.instance.orm.getRepository(MqttComponent);
    const mqttComponent = await mqttComponentRepository.findOne(request.params.id);
    return reply.code(200).send(JSON.stringify(mqttComponent));
  }

  @PUT({ url: '/:id', options: { schema: putMqttComponentSchema } }) async updateMqttComponent(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
    const mqttComponentRepository = this.instance.orm.getRepository(MqttComponent);
    const mqttComponent = await mqttComponentRepository.findOne(request.params.id);
    mqttComponent.topic = request.body.topic;
    await mqttComponentRepository.save(mqttComponent);
    return reply.code(200).send(mqttComponent);
  }

  @POST({ url: '/', options: { schema: postMqttComponentSchema } }) async createMqttComponent(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
    const mqttComponentRepository = this.instance.orm.getRepository(MqttComponent);
    const mqttComponentTypeRepository = this.instance.orm.getRepository(MqttComponentType);
    const deviceRepository = this.instance.orm.getRepository(Device);
    const mqttComponentType = await mqttComponentTypeRepository.findOne(request.body.mqttComponentTypeId);
    let mqttComponent = new MqttComponent();
    mqttComponent.topic = request.body.topic;
    mqttComponent.type = mqttComponentType;
    if (request.body.deviceId) {
      mqttComponent.device = await deviceRepository.findOne(request.body.deviceId);
    }
    mqttComponent = await mqttComponentRepository.save(mqttComponent);
    return reply.code(200).send(mqttComponent);
  }

  @DELETE({ url: '/:id', options: { schema: deleteMqttComponentSchema } }) async deleteMqttComponent(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
    const mqttComponentRepository = this.instance.orm.getRepository(MqttComponent);
    const mqttComponent = await mqttComponentRepository.findOne(request.params.id);
    await mqttComponentRepository.remove(mqttComponent);
    return reply.code(204).send();
  }
}
