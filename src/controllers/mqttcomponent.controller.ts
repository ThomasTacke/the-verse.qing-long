import { FastifyReply, FastifyRequest } from 'fastify'
import { Controller, ControllerType, GET, PUT, POST, DELETE, Hook, AbstractController } from 'fastify-decorators';
import { IncomingMessage, ServerResponse } from 'http'
import { MqttComponent } from '../models/sqlite.models';

@Controller({
  route: '/mqttcomponent',
  type: ControllerType.SINGLETON
}) export default class DeviceController extends AbstractController {

  @GET({ url: '/:id' }) async getHandle(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
    const mqttComponentRepository = this.instance.orm.getRepository(MqttComponent);
    this.instance.log.info('GET called');
    const mqttComponents = await mqttComponentRepository.findOne(request.params.id, { relations: ['values', 'type'] });
    this.instance.log.info(mqttComponents);
    return reply.code(200).send(mqttComponents);
  }

  @POST({url: '/'}) async postHandle(request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) {
    const mqttComponentRepository = this.instance.orm.getRepository(MqttComponent);
    this.instance.log.info('POST called');
    const mqttcomponent = new MqttComponent();
    mqttcomponent.topic = request.body.topic;
    mqttcomponent.type.type = request.body.type;
    const res = await mqttComponentRepository.save(mqttcomponent);
    this.instance.log.info(res);
    return res;
  }
}
